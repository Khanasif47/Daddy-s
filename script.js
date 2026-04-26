/* ============================================
   DADDY'S BAKERY — script.js
   ============================================ */

/* ─── MENU DATA ───────────────────────── */
const WEB_MENU = [
  { id:1,  name:"Red Velvet Cake",    desc:"Classic cream cheese frosting", price:420, cat:"cakes",      icon:"🎂" },
  { id:2,  name:"Dark Choco Truffle", desc:"Imported Belgian cocoa",         price:380, cat:"cakes",      icon:"🍫" },
  { id:3,  name:"Opera Cake",         desc:"Coffee & chocolate layers",      price:460, cat:"cakes",      icon:"🍰" },
  { id:4,  name:"Mango Pastry",       desc:"Fresh mango cream",              price:120, cat:"pastries",   icon:"🥭" },
  { id:5,  name:"Butter Croissant",   desc:"Flaky French style",             price:80,  cat:"pastries",   icon:"🥐" },
  { id:6,  name:"Strawberry Tart",    desc:"Fresh berry coulis",             price:140, cat:"pastries",   icon:"🍓" },
  { id:7,  name:"Cinnamon Roll",      desc:"Brown sugar glaze",              price:95,  cat:"pastries",   icon:"🌀" },
  { id:8,  name:"Sourdough Loaf",     desc:"24-hour fermented",              price:180, cat:"breads",     icon:"🍞" },
  { id:9,  name:"Garlic Focaccia",    desc:"Herbs & olive oil",              price:150, cat:"breads",     icon:"🫓" },
  { id:10, name:"Multigrain Bread",   desc:"Seeds & ancient grains",         price:160, cat:"breads",     icon:"🌾" },
  { id:11, name:"Truffle Box (6pc)",  desc:"Assorted Belgian truffles",      price:350, cat:"chocolates", icon:"🍬" },
  { id:12, name:"Praline Bar",        desc:"Hazelnut praline",               price:220, cat:"chocolates", icon:"🍫" },
  { id:13, name:"Cappuccino",         desc:"Double shot espresso",           price:90,  cat:"beverages",  icon:"☕" },
  { id:14, name:"Cold Brew",          desc:"12-hour cold brewed",            price:110, cat:"beverages",  icon:"🧊" },
  { id:15, name:"Hot Chocolate",      desc:"Rich & velvety",                 price:100, cat:"beverages",  icon:"🍵" },
];

let webCart = {};

/* ─── RENDER MENU GRID ────────────────── */
function renderWebMenu(items) {
  const g = document.getElementById('web-menu-grid');
  g.innerHTML = items.map(it => `
    <div class="menu-item" onclick="addWebItem(${it.id})">
      <div class="mi-icon">${it.icon}</div>
      <div class="mi-info">
        <div class="mi-name">${it.name}</div>
        <div class="mi-desc">${it.desc}</div>
      </div>
      <div class="mi-price">₹${it.price}</div>
      <button class="add-to-cart-web" onclick="event.stopPropagation();addWebItem(${it.id})">+</button>
    </div>
  `).join('');
}

/* ─── RENDER QUICK MENU ───────────────── */
function renderQuickMenu() {
  const g = document.getElementById('quick-menu');
  g.innerHTML = WEB_MENU.slice(0, 8).map(it => `
    <div
      onclick="addWebItem(${it.id})"
      style="display:flex;align-items:center;gap:8px;padding:8px 10px;
             border:1px solid rgba(139,0,0,0.1);border-radius:4px;cursor:pointer;
             background:var(--cream-light);transition:background .15s;"
      onmouseover="this.style.background='var(--cream)'"
      onmouseout="this.style.background='var(--cream-light)'"
    >
      <span style="font-size:18px;">${it.icon}</span>
      <span style="font-size:12px;flex:1;color:var(--text-dark);">${it.name}</span>
      <span style="font-size:12px;font-weight:700;color:var(--garnet);">₹${it.price}</span>
      <span style="font-size:14px;color:var(--garnet);font-weight:700;">+</span>
    </div>
  `).join('');
}

/* ─── CATEGORY FILTER ─────────────────── */
function filterWebCat(el, cat) {
  document.querySelectorAll('.mcat-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderWebMenu(cat === 'all' ? WEB_MENU : WEB_MENU.filter(i => i.cat === cat));
}

/* ─── ADD TO CART ─────────────────────── */
function addWebItem(id) {
  webCart[id] = (webCart[id] || 0) + 1;
  updateWebCart();
}

/* ─── CHANGE QTY ──────────────────────── */
function changeWebQty(id, delta) {
  webCart[id] = (webCart[id] || 0) + delta;
  if (webCart[id] <= 0) delete webCart[id];
  updateWebCart();
}

/* ─── UPDATE CART DISPLAY ─────────────── */
function updateWebCart() {
  const ids   = Object.keys(webCart);
  const count = ids.reduce((s, id) => s + webCart[id], 0);

  document.getElementById('web-cart-count').textContent =
    count + ' item' + (count !== 1 ? 's' : '');

  const disp = document.getElementById('web-cart-display');

  if (!ids.length) {
    disp.innerHTML = '<div class="web-cart-empty">No items selected yet</div>';
    document.getElementById('web-summary').style.display = 'none';
    return;
  }

  disp.innerHTML = ids.map(id => {
    const it = WEB_MENU.find(m => m.id == id);
    return `
      <div class="web-cart-item">
        <span style="font-size:16px;">${it.icon}</span>
        <span class="wci-name">${it.name}</span>
        <div class="wci-qty">
          <button class="wci-btn" onclick="changeWebQty(${id}, -1)">−</button>
          <span class="wci-num">${webCart[id]}</span>
          <button class="wci-btn" onclick="changeWebQty(${id}, 1)">+</button>
        </div>
        <span class="wci-price">₹${it.price * webCart[id]}</span>
      </div>
    `;
  }).join('');

  const sub = ids.reduce((s, id) => {
    const it = WEB_MENU.find(m => m.id == id);
    return s + it.price * webCart[id];
  }, 0);
  const gst = sub * 0.05;

  document.getElementById('ws-sub').textContent   = '₹' + sub.toFixed(0);
  document.getElementById('ws-gst').textContent   = '₹' + gst.toFixed(0);
  document.getElementById('ws-total').textContent = '₹' + (sub + gst).toFixed(0);
  document.getElementById('web-summary').style.display = 'block';
}

/* ─── PLACE ORDER ─────────────────────── */
function placeWebOrder() {
  const name  = document.getElementById('w-name').value.trim();
  const phone = document.getElementById('w-phone').value.trim();

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }
  if (!Object.keys(webCart).length) {
    alert('Please add at least one item to your order.');
    return;
  }

  document.getElementById('order-modal').classList.add('open');
  webCart = {};
  updateWebCart();
}

/* ─── ADDRESS FIELD TOGGLE ────────────── */
document.getElementById('w-type').addEventListener('change', function () {
  document.getElementById('address-field').style.display =
    this.value === 'Delivery' ? 'block' : 'none';
});

/* ─── MODAL CLOSE ─────────────────────── */
document.getElementById('modal-close').addEventListener('click', () => {
  document.getElementById('order-modal').classList.remove('open');
});

/* ─── HAMBURGER TOGGLE ────────────────── */
function toggleMenu() {
  const menu      = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  menu.classList.toggle('open');
  hamburger.classList.toggle('open');
}

/* ─── CLOSE MOBILE MENU ───────────────── */
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ─── CLOSE MENU ON OUTSIDE CLICK ─────── */
document.addEventListener('click', function (e) {
  const menu      = document.getElementById('mobileMenu');
  const hamburger = document.getElementById('hamburger');
  if (menu.classList.contains('open') &&
      !menu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    menu.classList.remove('open');
    hamburger.classList.remove('open');
  }
});

/* ─── INIT ────────────────────────────── */
renderWebMenu(WEB_MENU);
renderQuickMenu();
