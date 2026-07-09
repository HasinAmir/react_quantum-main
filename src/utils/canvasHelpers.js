/**
 * Canvas helper utilities for drawing Bloch sphere and other visuals
 */

// ===== 3D to 2D Projection =====
export function project3D(x, y, z, cx, cy, scale, rotY = 0, rotX = 0) {
  // Rotate around Y axis
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  let x1 = x * cosY + z * sinY;
  let z1 = -x * sinY + z * cosY;
  // Rotate around X axis
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  let y1 = y * cosX - z1 * sinX;
  let z2 = y * sinX + z1 * cosX;
  // Simple perspective
  const perspective = 1 + z2 * 0.15;
  return {
    x: cx + x1 * scale / perspective,
    y: cy - y1 * scale / perspective,
    z: z2,
    scale: 1 / perspective
  };
}

// ===== Draw Bloch Sphere =====
export function drawBlochSphere(ctx, cx, cy, radius, theta, phi, options = {}) {
  const { rotY = -0.4, rotX = 0.3, showLabels = true, glowColor = '#00f0ff' } = options;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background glow
  const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.8);
  bgGrad.addColorStop(0, 'rgba(0,240,255,0.03)');
  bgGrad.addColorStop(0.5, 'rgba(139,92,246,0.02)');
  bgGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Draw sphere wireframe
  drawSphereWireframe(ctx, cx, cy, radius, rotY, rotX);

  // Draw axes
  drawAxes(ctx, cx, cy, radius, rotY, rotX, showLabels);

  // Draw state vector arrow
  const sx = Math.sin(theta) * Math.cos(phi);
  const sy = Math.cos(theta);
  const sz = Math.sin(theta) * Math.sin(phi);
  const tip = project3D(sx, sy, sz, cx, cy, radius, rotY, rotX);
  const origin = project3D(0, 0, 0, cx, cy, radius, rotY, rotX);

  // Arrow glow
  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 15;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(tip.x, tip.y);
  ctx.stroke();

  // Arrow tip dot
  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.arc(tip.x, tip.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outer glow ring on tip
  ctx.save();
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 20;
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(tip.x, tip.y, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawSphereWireframe(ctx, cx, cy, radius, rotY, rotX) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;

  // Latitude circles
  for (let lat = -60; lat <= 60; lat += 30) {
    const r = Math.cos(lat * Math.PI / 180);
    const y = Math.sin(lat * Math.PI / 180);
    ctx.beginPath();
    for (let lon = 0; lon <= 360; lon += 5) {
      const lrad = lon * Math.PI / 180;
      const px = r * Math.cos(lrad);
      const pz = r * Math.sin(lrad);
      const p = project3D(px, y, pz, cx, cy, radius, rotY, rotX);
      lon === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  // Longitude circles
  for (let lon = 0; lon < 180; lon += 30) {
    const lrad = lon * Math.PI / 180;
    ctx.beginPath();
    for (let lat = 0; lat <= 360; lat += 5) {
      const latRad = lat * Math.PI / 180;
      const px = Math.cos(latRad) * Math.cos(lrad);
      const py = Math.sin(latRad);
      const pz = Math.cos(latRad) * Math.sin(lrad);
      const p = project3D(px, py, pz, cx, cy, radius, rotY, rotX);
      lat === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  // Equator highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let lon = 0; lon <= 360; lon += 3) {
    const lrad = lon * Math.PI / 180;
    const p = project3D(Math.cos(lrad), 0, Math.sin(lrad), cx, cy, radius, rotY, rotX);
    lon === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();

  ctx.restore();
}

function drawAxes(ctx, cx, cy, radius, rotY, rotX, showLabels) {
  const axes = [
    { dir: [1, 0, 0], label: 'X', color: 'rgba(236,72,153,0.6)' },
    { dir: [0, 1, 0], label: '|0⟩', color: 'rgba(0,240,255,0.7)' },
    { dir: [0, -1, 0], label: '|1⟩', color: 'rgba(139,92,246,0.7)' },
    { dir: [0, 0, 1], label: 'Y', color: 'rgba(245,158,11,0.6)' },
  ];

  for (const axis of axes) {
    const [ax, ay, az] = axis.dir;
    const start = project3D(0, 0, 0, cx, cy, radius, rotY, rotX);
    const end = project3D(ax * 1.2, ay * 1.2, az * 1.2, cx, cy, radius, rotY, rotX);

    ctx.save();
    ctx.strokeStyle = axis.color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.restore();

    if (showLabels) {
      const lp = project3D(ax * 1.35, ay * 1.35, az * 1.35, cx, cy, radius, rotY, rotX);
      ctx.save();
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.fillStyle = axis.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(axis.label, lp.x, lp.y);
      ctx.restore();
    }
  }
}

// ===== Draw Mini Sphere (for entanglement) =====
export function drawMiniSphere(ctx, cx, cy, radius, theta, phi, color = '#00f0ff') {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Glow
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, color + '15');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Circle
  ctx.strokeStyle = color + '40';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Cross
  ctx.strokeStyle = color + '20';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
  ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
  ctx.stroke();

  // State dot
  const dx = Math.sin(theta) * Math.cos(phi) * radius * 0.8;
  const dy = -Math.cos(theta) * radius * 0.8;

  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx + dx, cy + dy, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
