/**
 * Hero section — particle background animation with quantum energy nodes & spark pulses
 */

export function initHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let sparks = [];
  let animId;
  let lastSparkTime = 0;

  const mouse = {
    x: -1000,
    y: -1000,
    active: false,
  };

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }

  function handleMouseLeave() {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    // Cap total particles based on width alone (min 40, max 130)
    const count = Math.min(Math.max(Math.floor(canvas.width / 14), 40), 130);
    particles = Array.from({ length: count }, () => {
      const isEnergyNode = Math.random() < 0.15; // ~15% energy nodes
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        // Particle size varied 0.5–3px (energy nodes slightly larger 2.5–3.5px)
        radius: isEnergyNode ? Math.random() * 1.0 + 2.5 : Math.random() * 2.0 + 0.5,
        opacity: isEnergyNode ? Math.random() * 0.3 + 0.7 : Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.5 ? 180 : 270, // cyan or purple
        pulse: Math.random() * Math.PI * 2,
        isEnergyNode,
      };
    });
    sparks = [];
  }

  function spawnSparks(validPairs) {
    if (validPairs.length === 0) return;
    const numSparks = Math.min(validPairs.length, Math.floor(Math.random() * 2) + 1); // Pick 1-2 pairs
    for (let i = 0; i < numSparks; i++) {
      const pairIndex = Math.floor(Math.random() * validPairs.length);
      const [p1, p2] = validPairs[pairIndex];
      const fromP1 = Math.random() > 0.5;
      sparks.push({
        start: fromP1 ? p1 : p2,
        end: fromP1 ? p2 : p1,
        progress: 0,
        speed: 0.012 + Math.random() * 0.012, // Signal speed along line
        hue: p1.hue,
      });
    }
  }

  function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Update particle positions & subtle mouse-follow parallax
    for (const p of particles) {
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 40000 && distSq > 0) { // 200px radius
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 200) * 0.35;
          // Soft drift away/toward cursor
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    // 2. Connections up to 180px with non-linear eased alpha curve
    const validPairs = [];
    const maxConnDist = 180;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxConnDist) {
          validPairs.push([p1, p2]);

          // Eased falloff curve (squared ratio) so clusters feel denser
          const normDist = 1 - dist / maxConnDist;
          const alpha = Math.pow(normDist, 2.2) * 0.22;

          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = normDist * 0.8 + 0.2;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // 3. Occasional spark pulses (~every 2 seconds)
    if (!lastSparkTime) lastSparkTime = timestamp;
    if (timestamp - lastSparkTime > 2000) {
      spawnSparks(validPairs);
      lastSparkTime = timestamp;
    }

    // 4. Draw traveling sparks (qubit signals)
    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      spark.progress += spark.speed;

      if (spark.progress >= 1) {
        sparks.splice(i, 1);
        continue;
      }

      const sx = spark.start.x + (spark.end.x - spark.start.x) * spark.progress;
      const sy = spark.start.y + (spark.end.y - spark.start.y) * spark.progress;
      const sparkAlpha = Math.sin(spark.progress * Math.PI); // Fade in & out along trajectory

      ctx.beginPath();
      const sparkColor = spark.hue === 180
        ? `rgba(0, 240, 255, ${sparkAlpha * 0.95})`
        : `rgba(216, 180, 254, ${sparkAlpha * 0.95})`;

      ctx.fillStyle = sparkColor;
      ctx.shadowColor = spark.hue === 180 ? 'rgba(0, 240, 255, 1)' : 'rgba(192, 132, 252, 1)';
      ctx.shadowBlur = 12;
      ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 5. Draw particles (with ~15% bright energy nodes)
    for (const p of particles) {
      const glow = 0.5 + 0.5 * Math.sin(p.pulse);
      const alpha = p.opacity * (0.7 + glow * 0.3);

      const color = p.hue === 180
        ? `rgba(0, 240, 255, ${alpha})`
        : `rgba(168, 85, 247, ${alpha})`;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.shadowColor = p.hue === 180 ? 'rgba(0, 240, 255, 0.9)' : 'rgba(168, 85, 247, 0.9)';

      if (p.isEnergyNode) {
        // Stronger shadowBlur (16-20px) for energy nodes
        ctx.shadowBlur = 16 + glow * 4;
        const nodeRadius = p.radius * (1 + glow * 0.25);
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // White core highlight
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * glow})`;
        ctx.arc(p.x, p.y, nodeRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowBlur = 6 + glow * 2;
        ctx.arc(p.x, p.y, p.radius * (0.85 + glow * 0.3), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    }

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('resize', resize);

  resize();
  animId = requestAnimationFrame(animate);
}
