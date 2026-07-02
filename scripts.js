// ── Section router ───────────────────────────────────────────────────────────
const SECTIONS = [
  '01-colors', '02-typography', '03-spacing', '04-icons',
  '05-buttons', '06-inputs', '07-chips', '08-cards', '09-badges',
  '10-progress', '11-tabs', '12-navigation', '13-session',
  '14-exercise-layouts', '15-feedback', '16-sheets', '17-missing',
  '19-toast', '20-skeleton', '21-tooltip', '22-numerals',
];

// Map hash id → section filename (e.g. 'colors' → '01-colors')
const SECTION_MAP = {};
SECTIONS.forEach(name => {
  SECTION_MAP[name.replace(/^\d+-/, '')] = name;
});

const root = document.getElementById('sections-root');

async function loadSection(sectionName) {
  root.innerHTML = '<div style="padding:60px 0;color:var(--muted);text-align:center;font-size:14px;">Carregando…</div>';
  try {
    const html = await fetch(`sections/${sectionName}.html`).then(r => r.text());
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const section = wrapper.firstElementChild;
    root.innerHTML = '';
    if (section) root.appendChild(section);
  } catch {
    root.innerHTML = `<p style="color:var(--err);padding:40px;">Erro ao carregar: ${sectionName}</p>`;
  }
  window.scrollTo(0, 0);
}

function setActiveLink(hash) {
  document.querySelectorAll('#sidebar nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === hash);
  });
}

function navigate(hash) {
  const id = hash.replace('#', '');
  const section = SECTION_MAP[id] || SECTIONS[0];
  history.pushState(null, '', hash);
  setActiveLink(hash);
  loadSection(section);
}

document.addEventListener('DOMContentLoaded', () => {
  // Intercept sidebar nav clicks
  document.querySelectorAll('#sidebar nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      navigate(a.getAttribute('href'));
    });
  });

  // Load initial page
  const hash = window.location.hash || '#colors';
  setActiveLink(hash);
  const id = hash.replace('#', '');
  loadSection(SECTION_MAP[id] || SECTIONS[0]);
});

window.addEventListener('popstate', () => {
  const hash = window.location.hash || '#colors';
  setActiveLink(hash);
  const id = hash.replace('#', '');
  loadSection(SECTION_MAP[id] || SECTIONS[0]);
});

// ── Original DS scripts ─────────────────────────────────────────────────────
function toggleCat(btn) {
  btn.closest('.icon-cat').classList.toggle('open');
}

function ddToggle(id) {
  const wrap = document.getElementById(id);
  const menu = document.getElementById(id + '-menu');
  const chevron = wrap.querySelector('.dd-chevron');
  const trigger = wrap.querySelector('.dd-trigger, .dd-icon-trigger');
  const isOpen = menu.style.display !== 'none';
  document.querySelectorAll('.dd-menu').forEach(m => m.style.display = 'none');
  document.querySelectorAll('.dd-chevron').forEach(c => c.style.transform = 'rotate(0deg)');
  document.querySelectorAll('.dd-trigger, .dd-icon-trigger').forEach(t => t.classList.remove('dd-open'));
  if (!isOpen) {
    menu.style.display = 'block';
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    if (trigger) trigger.classList.add('dd-open');
  }
}

function ddSelect(optEl, id) {
  const wrap = document.getElementById(id);
  wrap.querySelectorAll('.dd-opt').forEach(o => o.classList.remove('selected'));
  optEl.classList.add('selected');
  document.getElementById(id + '-val').textContent = optEl.dataset.val;
  document.getElementById(id + '-val').style.color = 'var(--text)';
  setTimeout(() => {
    document.getElementById(id + '-menu').style.display = 'none';
    wrap.querySelector('.dd-chevron').style.transform = 'rotate(0deg)';
    wrap.querySelector('.dd-trigger').classList.remove('dd-open');
  }, 120);
}

function ddMultiSelect(optEl, id) {
  optEl.classList.toggle('selected');
  const selected = document.querySelectorAll('#' + id + ' .dd-opt.selected');
  const count = selected.length;
  const countEl = document.getElementById(id + '-count');
  if (countEl) countEl.textContent = count + ' selecionado' + (count !== 1 ? 's' : '');
  const val = document.getElementById(id + '-val');
  if (count === 0) { val.textContent = 'Selecione os modos'; val.style.color = 'var(--muted)'; }
  else if (count === 1) { val.textContent = selected[0].querySelector('.dd-opt-text').textContent; val.style.color = 'var(--text)'; }
  else { val.textContent = count + ' selecionados'; val.style.color = 'var(--text)'; }
}

function ddIconSelect(optEl, id) {
  document.querySelectorAll('#' + id + ' .dd-opt').forEach(o => o.classList.remove('selected'));
  optEl.classList.add('selected');
  setTimeout(() => {
    document.getElementById(id + '-menu').style.display = 'none';
    const trigger = document.getElementById(id).querySelector('.dd-icon-trigger');
    if (trigger) trigger.classList.remove('dd-open');
  }, 120);
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.dd-wrap')) {
    document.querySelectorAll('.dd-menu').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.dd-chevron').forEach(c => c.style.transform = 'rotate(0deg)');
    document.querySelectorAll('.dd-trigger, .dd-icon-trigger').forEach(t => t.classList.remove('dd-open'));
  }
});

function togglePassword(iconEl) {
  const wrap = iconEl.closest('.input-wrap');
  const input = wrap.querySelector('input');
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  iconEl.style.color = isHidden ? 'var(--pri)' : 'var(--muted)';
}

function switchTab(tabEl) {
  const parent = tabEl.closest('.tabs');
  parent.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');
}

function showInputTab(id, el) {
  document.querySelectorAll('[id^="inputtab-"]').forEach(c => c.classList.remove('active'));
  el.closest('.btn-variant-tabs').querySelectorAll('.btn-variant-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('inputtab-' + id).classList.add('active');
  el.classList.add('active');
}

function showBtnTab(id, el) {
  document.querySelectorAll('.btn-variant-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.btn-variant-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('btntab-' + id).classList.add('active');
  el.classList.add('active');
}

// ── Sidebar scroll spy (initialized after sections load) ───────────────────
function initObserver() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('#sidebar a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`#sidebar a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}
