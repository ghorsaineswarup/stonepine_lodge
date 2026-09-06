document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window) || targets.length === 0) {
    targets.forEach((t) => t.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  targets.forEach((t) => io.observe(t));
});