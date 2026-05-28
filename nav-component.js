/**
 * Kusumira · Shared Navigation Component
 * Injects a consistent sticky header + animated sidebar across all pages.
 * Usage: <script src="nav-component.js"></script>  (place just before </body>)
 *        Set window.KU_ACTIVE_PAGE = 'home'|'shop'|'about'|'contact'|'signup'
 *        before loading this script, or add data-page attr on <body>.
 */
  (function () {
  "use strict";

  // ✅ Stop nav from running on auth routes
  if (window.location.pathname.startsWith("/auth/")) return;

  /* ── Determine active page ───────────────────────────────────── */
  const activePage =
    window.KU_ACTIVE_PAGE ||
    document.body.dataset.page ||
    (() => {
      const p = location.pathname.split("/").pop().replace(".html", "").toLowerCase();
      if (!p || p === "index") return "home";
      if (p === "contect" || p === "contact") return "contact";
      return p;
    })();

  /* ── Cart state (shared via localStorage) ───────────────────── */
  function getCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem("ku_cart") || "[]");
      return cart.reduce((s, i) => s + (i.qty || 1), 0);
    } catch { return 0; }
  }
// ======================================================
// CART PAGE REDIRECTION
// ======================================================

function openCartPage() {

  // Create cart if not existing
  let cart = JSON.parse(localStorage.getItem("ku_cart"));

  if (!cart) {
    localStorage.setItem("ku_cart", JSON.stringify([]));
  }

  // Redirect to cart page
  window.location.href = "cart.html";
}

// Attach event to cart button
document.addEventListener("DOMContentLoaded", function () {

  const cartBtn = document.getElementById("kuCartBtn");

  if (cartBtn) {

    cartBtn.addEventListener("click", function (e) {

      e.preventDefault();

      openCartPage();

    });

  }

});
  /* ── Inject styles ───────────────────────────────────────────── */
  const STYLE = `
  /* ── KU NAV COMPONENT ───────────────────────────────────────── */
  .ku-header {
    background: url('logo.JPG') center/cover no-repeat;
    background-color: rgba(44, 28, 10, 0.82);
    background-blend-mode: overlay;
    padding: 0.85rem 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 4px 18px rgba(40,20,5,0.22);
    font-family: 'DM Sans', 'Inter', 'Segoe UI', Arial, sans-serif;
  }

  .ku-header-inner {
    max-width: 1280px;
    margin: auto;
    padding: 0 1.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .ku-logo {
    font-family: 'Satisfy', cursive;
    font-size: 1.9rem;
    color: #e79b38;
    text-decoration: none;
    flex-shrink: 0;
    letter-spacing: 0.04em;
    transition: opacity 0.2s;
  }
  .ku-logo:hover { opacity: 0.85; }

  /* ── Desktop nav ─────────────────────────────────────────────── */
  .ku-nav {
    display: flex;
    align-items: center;
    gap: 0.2rem;
  }
  .ku-nav a {
    text-decoration: none;
    color: rgba(255,255,255,0.82);
    font-weight: 500;
    font-size: 0.95rem;
    padding: 0.45rem 0.9rem;
    border-radius: 50px;
    transition: all 0.2s;
    position: relative;
  }
  .ku-nav a:hover { color: #e79b38; background: rgba(255,255,255,0.07); }
  .ku-nav a.active {
    color: #e79b38;
    background: rgba(231,155,56,0.13);
    border: 1px solid rgba(231,155,56,0.3);
  }

  /* ── Right actions ───────────────────────────────────────────── */
  .ku-actions { display: flex; align-items: center; gap: 0.6rem; }

  .ku-search-wrap { position: relative; }
  .ku-search-bar {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.09);
    border: 1.5px solid rgba(255,255,255,0.18);
    border-radius: 50px;
    padding: 0.42rem 0.8rem 0.42rem 1rem;
    transition: all 0.2s;
    width: 230px;
  }
  .ku-search-bar:focus-within {
    background: rgba(255,255,255,0.16);
    border-color: #e79b38;
    box-shadow: 0 0 0 3px rgba(231,155,56,0.18);
    width: 270px;
  }
  .ku-search-bar input {
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    font-size: 0.9rem;
    width: 100%;
    font-family: inherit;
  }
  .ku-search-bar input::placeholder { color: rgba(255,255,255,0.45); }
  .ku-search-bar button {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.55);
    cursor: pointer;
    font-size: 0.9rem;
    flex-shrink: 0;
    transition: color 0.2s;
    padding: 0;
  }
  .ku-search-bar button:hover { color: #e79b38; }

  .ku-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    border: none;
    border-radius: 50px;
    padding: 0.48rem 1.05rem;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.88rem;
    font-family: inherit;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .ku-btn-ghost {
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.3);
    color: rgba(255,255,255,0.88);
  }
  .ku-btn-ghost:hover { border-color: #e79b38; color: #e79b38; background: rgba(231,155,56,0.08); }
  .ku-btn-cart {
    background: #c77e23;
    color: white;
    position: relative;
  }
  .ku-btn-cart:hover { background: #a86318; }
  .ku-cart-badge {
    position: absolute;
    top: -6px; right: -6px;
    background: #e74c3c;
    color: white;
    font-size: 0.68rem;
    font-weight: 700;
    border-radius: 50%;
    width: 18px; height: 18px;
    display: flex; align-items: center; justify-content: center;
    line-height: 1;
    pointer-events: none;
  }

  /* ── Hamburger ───────────────────────────────────────────────── */
  .ku-hamburger {
    display: none;
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.3);
    border-radius: 10px;
    width: 40px; height: 40px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    cursor: pointer;
    transition: border-color 0.2s;
    padding: 0;
  }
  .ku-hamburger:hover { border-color: #e79b38; }
  .ku-hamburger span {
    display: block;
    width: 20px; height: 2px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s;
  }
  .ku-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .ku-hamburger.open span:nth-child(2) { opacity: 0; }
  .ku-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* ── Sidebar ─────────────────────────────────────────────────── */
  .ku-sidebar-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(10, 5, 0, 0.55);
    backdrop-filter: blur(4px);
    z-index: 1998;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ku-sidebar-backdrop.open { display: block; opacity: 1; }

  .ku-sidebar {
    position: fixed;
    top: 0; right: 0;
    width: 300px;
    height: 100%;
    background: #fdf9f3;
    z-index: 1999;
    transform: translateX(100%);
    transition: transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: -12px 0 40px rgba(40,20,5,0.18);
    overflow-y: auto;
    border-left: 4px solid #e79b38;
    display: flex;
    flex-direction: column;
  }
  .ku-sidebar.open { transform: translateX(0); }

  .ku-sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.6rem 1.2rem;
    border-bottom: 1px solid #ede0cc;
  }
  .ku-sidebar-logo {
    font-family: 'Satisfy', cursive;
    font-size: 1.6rem;
    color: #e79b38;
  }
  .ku-sidebar-close {
    background: #f5ece2;
    border: none;
    width: 34px; height: 34px;
    border-radius: 50%;
    cursor: pointer;
    color: #6b4e30;
    font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s, transform 0.2s;
  }
  .ku-sidebar-close:hover { background: #e79b38; color: white; transform: rotate(90deg); }

  .ku-sidebar-nav {
    padding: 1.2rem 0;
    flex: 1;
  }
  .ku-sidebar-nav a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.9rem 1.6rem;
    color: #4a3728;
    text-decoration: none;
    font-weight: 500;
    font-size: 1rem;
    border-bottom: 1px solid #f0e6d8;
    transition: all 0.2s;
    font-family: inherit;
  }
  .ku-sidebar-nav a i {
    width: 20px;
    text-align: center;
    color: #c07030;
  }
  .ku-sidebar-nav a:hover {
    background: #fef5e9;
    color: #c07030;
    padding-left: 2rem;
  }
  .ku-sidebar-nav a.active {
    background: #fef5e9;
    color: #c07030;
    border-left: 3px solid #e79b38;
  }

  .ku-sidebar-actions {
    padding: 1.4rem 1.6rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid #ede0cc;
  }
  .ku-sidebar-actions .ku-btn {
    justify-content: center;
    padding: 0.7rem;
    font-size: 0.92rem;
  }
  .ku-sidebar-actions .ku-btn-ghost {
    border-color: #c07030;
    color: #c07030;
  }
  .ku-sidebar-actions .ku-btn-ghost:hover { background: #c07030; color: white; }
  .ku-sidebar-actions .ku-btn-cart { background: #c07030; }
  .ku-sidebar-actions .ku-btn-cart:hover { background: #8f4a1e; }

  .ku-sidebar-search {
    padding: 1rem 1.6rem;
    border-bottom: 1px solid #f0e6d8;
  }
  .ku-sidebar-search-bar {
    display: flex;
    align-items: center;
    background: #fff8f0;
    border: 1.5px solid #ddc9ae;
    border-radius: 50px;
    padding: 0.55rem 1rem;
    transition: border-color 0.2s;
  }
  .ku-sidebar-search-bar:focus-within { border-color: #e79b38; }
  .ku-sidebar-search-bar input {
    background: transparent;
    border: none;
    outline: none;
    color: #3a2e24;
    font-size: 0.9rem;
    width: 100%;
    font-family: inherit;
  }
  .ku-sidebar-search-bar button {
    background: transparent;
    border: none;
    color: #c07030;
    cursor: pointer;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  /* ── Toast (shared) ─────────────────────────────────────────── */
  .ku-nav-toast {
    position: fixed;
    bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(12px);
    background: #1a1208;
    color: #fff;
    padding: 0.75rem 1.8rem;
    border-radius: 50px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    opacity: 0;
    pointer-events: none;
    z-index: 9999;
    white-space: nowrap;
    font-family: inherit;
    transition: opacity 0.25s, transform 0.25s;
  }
  .ku-nav-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

  /* ── Responsive ─────────────────────────────────────────────── */
  @media (max-width: 900px) {
    .ku-nav, .ku-search-wrap { display: none; }
    .ku-hamburger { display: flex; }
  }
  @media (max-width: 500px) {
    .ku-btn-ghost { display: none; }
    .ku-sidebar { width: 100%; }
  }
  `;

  const styleEl = document.createElement("style");
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  /* ── Build header HTML ───────────────────────────────────────── */
  const links = [
    { page: "home",    label: "Home",    icon: "fa-house",          href: "index.html" },
    { page: "shop",    label: "Shop",    icon: "fa-bag-shopping",   href: "shop.html" },
    { page: "about",   label: "About",   icon: "fa-circle-info",    href: "about.html" },
    { page: "contact", label: "Contact", icon: "fa-envelope",       href: "contect.html" },
  ];

  function navLinks(type) {
    return links.map(l => {
      const cls = l.page === activePage ? " class=\"active\"" : "";
      if (type === "desktop") return `<a href="${l.href}"${cls}>${l.label}</a>`;
      return `<a href="${l.href}"${cls}><i class="fas ${l.icon}"></i>${l.label}</a>`;
    }).join("\n");
  }

  const cartCount = getCartCount();
  const badgeHtml = cartCount > 0
    ? `<span class="ku-cart-badge">${cartCount}</span>`
    : "";

  const headerHtml = `
  <header class="ku-header" id="kuHeader">
    <div class="ku-header-inner container">
      <a class="ku-logo" href="index.html">Kusumira</a>

      <nav class="ku-nav">${navLinks("desktop")}</nav>

      <div class="ku-actions">
        <div class="ku-search-wrap">
          <div class="ku-search-bar">
            <input type="text" id="kuSearchInput" placeholder="Search crochet…" autocomplete="off">
            <button id="kuSearchBtn" aria-label="Search"><i class="fas fa-magnifying-glass"></i></button>
          </div>
        </div>

        <button class="ku-btn ku-btn-ghost" id="kuLoginBtn">
          <i class="fas fa-user"></i>
          <span id="kuLoginLabel">Sign In</span>
        </button>

        <button class="ku-btn ku-btn-cart" id="kuCartBtn" onclick="window.location.href='shop.html'">
          <i class="fas fa-bag-shopping"></i>
          Cart
          ${badgeHtml}
        </button>

        <button class="ku-hamburger" id="kuHamburger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Sidebar backdrop -->
  <div class="ku-sidebar-backdrop" id="kuBackdrop"></div>

  <!-- Sidebar panel -->
  <aside class="ku-sidebar" id="kuSidebar">
    <div class="ku-sidebar-head">
      <span class="ku-sidebar-logo">Kusumira</span>
      <button class="ku-sidebar-close" id="kuSidebarClose"><i class="fas fa-xmark"></i></button>
    </div>

    <div class="ku-sidebar-search">
      <div class="ku-sidebar-search-bar">
        <input type="text" id="kuSidebarSearch" placeholder="Search crochet…">
        <button><i class="fas fa-magnifying-glass"></i></button>
      </div>
    </div>

    <nav class="ku-sidebar-nav">${navLinks("sidebar")}</nav>

    <div class="ku-sidebar-actions">
      <button class="ku-btn ku-btn-ghost" id="kuSidebarLoginBtn">
        <i class="fas fa-user"></i>
        <span id="kuSidebarLoginLabel">Sign In</span>
      </button>
      <button class="ku-btn ku-btn-cart" onclick="window.location.href='shop.html'">
        <i class="fas fa-bag-shopping"></i>
        View Cart
        ${badgeHtml ? badgeHtml : ""}
      </button>
      <button class="ku-btn" style="background:#f0e6d8;color:#7a5030;justify-content:center;" onclick="window.location.href='signup.html'">
        <i class="fas fa-user-plus"></i>
        Create Account
      </button>
    </div>
  </aside>

  <!-- Shared toast -->
  <div class="ku-nav-toast" id="kuNavToast"></div>
  `;

  /* ── Inject before existing content ─────────────────────────── */
  const existing = document.body.firstChild;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = headerHtml.trim();
  document.body.insertBefore(wrapper, existing);

  /* ── Logic ───────────────────────────────────────────────────── */
  const hamburger   = document.getElementById("kuHamburger");
  const sidebar     = document.getElementById("kuSidebar");
  const backdrop    = document.getElementById("kuBackdrop");
  const sidebarClose= document.getElementById("kuSidebarClose");
  const toast       = document.getElementById("kuNavToast");

  function showToast(msg, ms = 2500) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), ms);
  }
  window.kuShowToast = showToast; // expose globally

  function openSidebar() {
    sidebar.classList.add("open");
    backdrop.classList.add("open");
    hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    sidebar.classList.remove("open");
    backdrop.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
  });
  sidebarClose.addEventListener("click", closeSidebar);
  backdrop.addEventListener("click", closeSidebar);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSidebar(); });

  /* ── Login state ─────────────────────────────────────────────── */
  let loggedIn = false;

// ✅ Check session from server instead of localStorage
fetch("/get-user")
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      loggedIn = true;
      const firstName = data.name.split(" ")[0];
      document.getElementById("kuLoginLabel").textContent = "Hi, " + firstName;
      document.getElementById("kuSidebarLoginLabel").textContent = "Hi, " + firstName;
      localStorage.setItem("ku_user_name", firstName);
    } else {
      loggedIn = false;
      localStorage.removeItem("ku_user_name");
    }
  });
  function handleLoginClick() {
    if (loggedIn) {
      showToast("✅ You're already signed in!");
    } else {
      window.location.href = "signup.html";
    }
  }

  document.getElementById("kuLoginBtn").addEventListener("click", handleLoginClick);
  document.getElementById("kuSidebarLoginBtn").addEventListener("click", handleLoginClick);

  /* ── Search ─────────────────────────────────────────────────── */
  function doSearch(val) {
    if (val.trim()) {
      showToast(`🔍 Searching for "${val.trim()}"…`);
      setTimeout(() => { window.location.href = `shop.html?q=${encodeURIComponent(val.trim())}`; }, 600);
    }
  }
  document.getElementById("kuSearchBtn").addEventListener("click", () => {
    doSearch(document.getElementById("kuSearchInput").value);
  });
  document.getElementById("kuSearchInput").addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch(e.target.value);
  });
  document.getElementById("kuSidebarSearch").addEventListener("keydown", e => {
    if (e.key === "Enter") { doSearch(e.target.value); closeSidebar(); }
  });

  /* ── Header scroll effect ────────────────────────────────────── */
  window.addEventListener("scroll", () => {
    const header = document.getElementById("kuHeader");
    if (!header) return;
    if (window.scrollY > 60) {
      header.style.boxShadow = "0 4px 24px rgba(40,20,5,0.32)";
    } else {
      header.style.boxShadow = "0 4px 18px rgba(40,20,5,0.22)";
    }
  }, { passive: true });

})();
