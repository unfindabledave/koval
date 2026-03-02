const Cart = {
  get() { return JSON.parse(localStorage.getItem('ig_cart') || '[]'); },
  save(items) { localStorage.setItem('ig_cart', JSON.stringify(items)); },
  add(service) {
    const items = this.get();
    const existing = items.find(i => i.id === service.id);
    existing ? existing.qty++ : items.push({ ...service, qty: 1 });
    this.save(items);
    this.updateBadge(true);
  },
  remove(id) { this.save(this.get().filter(i => i.id !== id)); this.updateBadge(); },
  setQty(id, qty) {
    const items = this.get();
    const item = items.find(i => i.id === id);
    if (item) { item.qty = Math.max(1, qty); this.save(items); }
    this.updateBadge();
  },
  count() { return this.get().reduce((s, i) => s + i.qty, 0); },
  total() { return this.get().reduce((s, i) => s + i.price * i.qty, 0); },
  clear() { localStorage.removeItem('ig_cart'); this.updateBadge(); },
  updateBadge(pop) {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const n = this.count();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'flex' : 'none';
    if (pop && n > 0) {
      badge.classList.remove('pop');
      void badge.offsetWidth; // reflow
      badge.classList.add('pop');
    }
  }
};

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast'; t.className = 'toast';
    t.innerHTML = '<div class="toast-dot"></div><span id="toast-msg"></span>';
    document.body.appendChild(t);
  }
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2600);
}

function cartBtnFeedback(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Added!';
  btn.disabled = true;
  btn.style.opacity = '0.75';
  setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.opacity = ''; }, 1500);
}

// Run immediately — scripts are at bottom of body, DOM is ready
Cart.updateBadge();
