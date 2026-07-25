// MOCK SUPABASE CLIENT
// Stores all data in localStorage to bypass the need for a real backend

const DB_KEY = 'quantum_forum_mock_db';

// Initialize mock DB
function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  const defaults = {
    users: [],
    posts: [],
    comments: [],
    votes: [],
    comment_reactions: []
  };
  if (raw) {
    const parsed = JSON.parse(raw);
    // Ensure all expected tables exist (handles schema evolution)
    const db = { ...defaults, ...parsed };
    return db;
  }
  localStorage.setItem(DB_KEY, JSON.stringify(defaults));
  return defaults;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Generate simple UUID
function uuid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Chainable mock client
class MockQuery {
  constructor(table) {
    this.table = table;
    this.db = getDB();
    this.results = [...this.db[table]];
    this.isSingle = false;
    this.action = 'select'; // select, insert, update, upsert, delete
    this.payload = null;
    this.conditions = [];
    this.relations = []; // For "*, users(*)"
    this.onConflict = null;
    this.orderConfig = [];
  }

  select(query = '*') {
    if (!['insert', 'update', 'upsert', 'delete'].includes(this.action)) {
      this.action = 'select';
    }
    if (query.includes('users')) this.relations.push('users');
    if (query.includes('comments')) this.relations.push('comments');
    return this;
  }

  insert(data) {
    this.action = 'insert';
    this.payload = data;
    return this;
  }

  update(data) {
    this.action = 'update';
    this.payload = data;
    return this;
  }

  upsert(data, config) {
    this.action = 'upsert';
    this.payload = data;
    if (config) this.onConflict = config.onConflict;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(column, value) {
    this.conditions.push({ column, value });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderConfig.push({ column, ascending });
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  // Execute the query
  async then(resolve) {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 100));

    let data = null;
    let error = null;

    try {
      if (this.action === 'select') {
        // Apply filters
        data = this.results.filter(item => {
          return this.conditions.every(c => item[c.column] === c.value);
        });

        // Apply relations
        if (this.relations.length > 0) {
          data = data.map(item => {
            const enriched = { ...item };
            if (this.relations.includes('users')) {
              enriched.users = this.db.users.find(u => u.id === item.user_id) || {};
            }
            if (this.relations.includes('comments') && this.table === 'posts') {
              enriched.comments = this.db.comments.filter(c => c.post_id === item.id);
            }
            return enriched;
          });
        }

        // Apply order
        if (this.orderConfig.length > 0) {
          data.sort((a, b) => {
            for (const config of this.orderConfig) {
              const valA = a[config.column];
              const valB = b[config.column];
              if (valA < valB) return config.ascending ? -1 : 1;
              if (valA > valB) return config.ascending ? 1 : -1;
            }
            return 0;
          });
        }

        if (this.isSingle) {
          if (data.length === 0) {
            error = { message: 'Row not found', code: 'PGRST116' };
            data = null;
          } else {
            data = data[0];
          }
        }
      } 
      else if (this.action === 'insert') {
        const record = {
          id: uuid(),
          created_at: new Date().toISOString(),
          ...this.payload
        };
        this.db[this.table].push(record);
        saveDB(this.db);
        data = this.isSingle ? record : [record];
      }
      else if (this.action === 'update') {
        let updatedCount = 0;
        this.db[this.table] = this.db[this.table].map(item => {
          const match = this.conditions.every(c => item[c.column] === c.value);
          if (match) {
            updatedCount++;
            return { ...item, ...this.payload };
          }
          return item;
        });
        saveDB(this.db);
        data = []; // Mock doesn't return full update set for simplicity
      }
      else if (this.action === 'upsert') {
        const record = {
          created_at: new Date().toISOString(),
          ...this.payload
        };
        const conflictKey = this.onConflict || 'id';
        const keys = conflictKey.split(',').map(k => k.trim());
        const existingIndex = this.db[this.table].findIndex(item => {
          return keys.every(key => item[key] !== undefined && item[key] === record[key]);
        });
        
        if (existingIndex >= 0) {
          this.db[this.table][existingIndex] = { ...this.db[this.table][existingIndex], ...record };
        } else {
          if (!record.id) record.id = uuid();
          this.db[this.table].push(record);
        }
        saveDB(this.db);
        data = this.isSingle ? record : [record];
      }
      else if (this.action === 'delete') {
        this.db[this.table] = this.db[this.table].filter(item => {
          const match = this.conditions.every(c => item[c.column] === c.value);
          return !match;
        });
        saveDB(this.db);
        data = null;
      }

    } catch (err) {
      error = { message: err.message };
    }

    resolve({ data, error });
  }
}

export const supabase = {
  from: (table) => new MockQuery(table)
};
