const canvas = document.querySelector("#neural-bg");
const ctx = canvas.getContext("2d");
let particles = [];
let mouse = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(95, Math.floor((window.innerWidth * window.innerHeight) / 13500));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    radius: Math.random() * 1.9 + 0.8,
    hue: Math.random() > 0.52 ? 188 : Math.random() > 0.5 ? 329 : 44
  }));
}

function drawBackground() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = window.innerWidth + 20;
    if (particle.x > window.innerWidth + 20) particle.x = -20;
    if (particle.y < -20) particle.y = window.innerHeight + 20;
    if (particle.y > window.innerHeight + 20) particle.y = -20;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${particle.hue}, 92%, 68%, 0.82)`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();

    for (let j = index + 1; j < particles.length; j += 1) {
      const other = particles[j];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 138) {
        ctx.strokeStyle = `rgba(132, 223, 255, ${0.16 * (1 - distance / 138)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }

    if (mouse.active) {
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 180) {
        ctx.strokeStyle = `rgba(255, 209, 102, ${0.23 * (1 - distance / 180)})`;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawBackground);
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", event => {
  mouse = { x: event.clientX, y: event.clientY, active: true };
});
window.addEventListener("pointerleave", () => {
  mouse.active = false;
});

resizeCanvas();
drawBackground();
revealOnScroll();
