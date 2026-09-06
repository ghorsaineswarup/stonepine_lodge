function renderChrome() {
  const headerRoot = document.getElementById('header-root');
  const footerRoot = document.getElementById('footer-root');
  const page = document.body.dataset.page || '';

  const navLink = (href, label, key) =>
    `<a href="${href}" class="${page === key ? 'active' : ''}">${label}</a>`;

  if (headerRoot) {
    headerRoot.innerHTML = `
    <header class="site">
      <div class="wrap nav">
        <a href="/index.html" class="brand">Stonepine Lodge</a>
        <nav class="navlinks">
          ${navLink('/index.html', 'Home', 'home')}
          ${navLink('/rooms.html', 'Rooms', 'rooms')}
          ${navLink('/experiences.html', 'Experiences', 'experiences')}
          ${navLink('/gallery.html', 'Gallery', 'gallery')}
          ${navLink('/contact.html', 'Contact', 'contact')}
        </nav>
        <div class="navcta">
          <a href="/login.html" class="btn btn-ghost">Log in</a>
          <a href="/rooms.html" class="btn btn-primary">Book now</a>
        </div>
      </div>
    </header>`;
  }

  if (footerRoot) {
    footerRoot.innerHTML = `
    <footer class="site">
      <div class="wrap">
        <div class="foot-grid">
          <div>
            <div class="brand" style="color:#F8F4EC;margin-bottom:12px;">Stonepine Lodge</div>
            <p>412 Elkhorn Pass Road<br>Larkfield, CO 80439</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="/rooms.html">Rooms</a>
            <a href="/experiences.html">Experiences</a>
            <a href="/gallery.html">Gallery</a>
          </div>
          <div>
            <h4>Guest</h4>
            <a href="/login.html">Log in</a>
            <a href="/register.html">Create account</a>
            <a href="/contact.html">Contact us</a>
          </div>
          <div>
            <h4>Reach us</h4>
            <p>stay@stonepinelodge.example</p>
            <p>(970) 555-0142</p>
          </div>
        </div>
        <div class="foot-bottom">
          <span>&copy; 2026 Stonepine Lodge.</span>
          <span>Built for Elkhorn Pass, Colorado</span>
        </div>
      </div>
    </footer>`;
  }
}
function showToast(msg, ms = 2800) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

document.addEventListener('DOMContentLoaded', renderChrome);