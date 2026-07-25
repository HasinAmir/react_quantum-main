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

// Map to hold active BlochSphereAnimator instances per canvas
const animators = new WeakMap();

class BlochSphereAnimator {
  constructor(ctx, cx, cy, radius, theta, phi, options) {
    this.ctx = ctx;
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.options = { ...options };

    this.currentTheta = theta;
    this.currentPhi = phi;
    this.targetTheta = theta;
    this.targetPhi = phi;
    this.startTheta = theta;
    this.startPhi = phi;

    this.animStartTime = performance.now();
    this.animDuration = 350; // 350ms ease-out tween

    this.trail = []; // Tip 3D positions array for path trail (max 15)
    this.animFrameId = null;

    this.loop = this.loop.bind(this);
    this.start();
  }

  updateTarget(cx, cy, radius, theta, phi, options) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
    this.options = { ...this.options, ...options };

    // Shortest-path angle unwrap for phi
    let deltaPhi = phi - (this.currentPhi % (2 * Math.PI));
    while (deltaPhi > Math.PI) deltaPhi -= 2 * Math.PI;
    while (deltaPhi < -Math.PI) deltaPhi += 2 * Math.PI;
    const targetPhiUnwrapped = this.currentPhi + deltaPhi;

    // Trigger 350ms tween animation if target theta/phi change
    if (Math.abs(this.targetTheta - theta) > 0.001 || Math.abs(this.targetPhi - targetPhiUnwrapped) > 0.001) {
      this.startTheta = this.currentTheta;
      this.startPhi = this.currentPhi;
      this.targetTheta = theta;
      this.targetPhi = targetPhiUnwrapped;
      this.animStartTime = performance.now();
    }
  }

  start() {
    if (!this.animFrameId) {
      this.animFrameId = requestAnimationFrame(this.loop);
    }
  }

  stop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  loop(now) {
    if (!document.body.contains(this.ctx.canvas)) {
      this.stop();
      return;
    }

    // 1. 350ms Ease-Out Cubic Tween
    const elapsed = now - this.animStartTime;
    const progress = Math.min(1, Math.max(0, elapsed / this.animDuration));
    const easeOut = 1 - Math.pow(1 - progress, 3);

    this.currentTheta = this.startTheta + (this.targetTheta - this.startTheta) * easeOut;
    this.currentPhi = this.startPhi + (this.targetPhi - this.startPhi) * easeOut;

    // 2. Slow continuous ambient rotation at rest
    const baseRotY = this.options.rotY !== undefined ? this.options.rotY : -0.4;
    const baseRotX = this.options.rotX !== undefined ? this.options.rotX : 0.3;
    const ambientRotY = baseRotY + (now * 0.0003); // Smooth ambient spin

    // 3. Compute 3D tip position
    const sx = Math.sin(this.currentTheta) * Math.cos(this.currentPhi);
    const sy = Math.cos(this.currentTheta);
    const sz = Math.sin(this.currentTheta) * Math.sin(this.currentPhi);

    // Record trail position (keep last 15 points)
    const lastTrail = this.trail[this.trail.length - 1];
    if (!lastTrail || Math.hypot(lastTrail.x - sx, lastTrail.y - sy, lastTrail.z - sz) > 0.002) {
      this.trail.push({ x: sx, y: sy, z: sz });
      if (this.trail.length > 15) {
        this.trail.shift();
      }
    }

    // Callback for real-time state UI sync
    if (typeof this.options.onFrame === 'function') {
      this.options.onFrame(this.currentTheta, this.currentPhi);
    }

    // Render frame
    this.renderFrame(now, ambientRotY, baseRotX, sx, sy, sz);

    this.animFrameId = requestAnimationFrame(this.loop);
  }

  renderFrame(now, rotY, rotX, sx, sy, sz) {
    const ctx = this.ctx;
    const cx = this.cx;
    const cy = this.cy;
    const radius = this.radius;
    const { showLabels = true, glowColor = '#00f0ff' } = this.options;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background radial glow
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

    // Draw short fading arc trail behind vector tip (last ~15 positions)
    if (this.trail.length > 1) {
      ctx.save();
      for (let i = 0; i < this.trail.length - 1; i++) {
        const p1 = project3D(this.trail[i].x, this.trail[i].y, this.trail[i].z, cx, cy, radius, rotY, rotX);
        const p2 = project3D(this.trail[i + 1].x, this.trail[i + 1].y, this.trail[i + 1].z, cx, cy, radius, rotY, rotX);
        const norm = (i + 1) / this.trail.length; // 0 (oldest) to 1 (newest)

        ctx.beginPath();
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = norm * 2.5 + 0.5;
        ctx.globalAlpha = norm * 0.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw state vector arrow
    const tip = project3D(sx, sy, sz, cx, cy, radius, rotY, rotX);
    const origin = project3D(0, 0, 0, cx, cy, radius, rotY, rotX);

    // Arrow shaft
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.stroke();

    // Arrow tip solid dot
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pulsing outer glow ring on tip (~1s period sine wave)
    const pulsePhase = (now % 1000) / 1000 * Math.PI * 2; // ~1.0s period
    const pulseVal = (Math.sin(pulsePhase) + 1) / 2; // 0 to 1
    const ringRadius = 8 + pulseVal * 5; // 8px to 13px
    const ringAlpha = 0.3 + pulseVal * 0.45; // 0.30 to 0.75
    const ringBlur = 14 + pulseVal * 12; // 14px to 26px

    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = ringBlur;
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = ringAlpha;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

// Export main drawBlochSphere function
export function drawBlochSphere(ctx, cx, cy, radius, theta, phi, options = {}) {
  let animator = animators.get(ctx.canvas);
  if (!animator) {
    animator = new BlochSphereAnimator(ctx, cx, cy, radius, theta, phi, options);
    animators.set(ctx.canvas, animator);
  } else {
    animator.updateTarget(cx, cy, radius, theta, phi, options);
  }
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

  // State dot with pulsing energy glow (~1s period sine wave)
  const dx = Math.sin(theta) * Math.cos(phi) * radius * 0.8;
  const dy = -Math.cos(theta) * radius * 0.8;
  const dotX = cx + dx;
  const dotY = cy + dy;

  const now = performance.now();
  const pulsePhase = (now % 1000) / 1000 * Math.PI * 2;
  const pulseVal = (Math.sin(pulsePhase) + 1) / 2; // 0 to 1
  const dotBlur = 10 + pulseVal * 12; // 10px to 22px shadowBlur
  const ringRadius = 7 + pulseVal * 4; // 7px to 11px ring radius
  const ringAlpha = 0.3 + pulseVal * 0.45; // 0.30 to 0.75 alpha

  // Core state dot
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = dotBlur;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outer energy glow ring
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = dotBlur;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = ringAlpha;
  ctx.beginPath();
  ctx.arc(dotX, dotY, ringRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
