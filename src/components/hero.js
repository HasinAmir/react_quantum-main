/**
 * Hero section — particle background animation
 */

export function initHero() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let connections = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    particles = Array.from({ length: Math.min(count, 120) }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() > 0.5 ? 180 : 270, // cyan or purple
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      const glow = 0.5 + 0.5 * Math.sin(p.pulse);
      const color = p.hue === 180
        ? `rgba(0, 240, 255, ${p.opacity * glow})`
        : `rgba(139, 92, 246, ${p.opacity * glow})`;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.radius * (0.8 + glow * 0.4), 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
}
