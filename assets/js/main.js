// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList) {
	navToggle.addEventListener('click', () => {
		const expanded = navToggle.getAttribute('aria-expanded') === 'true';
		navToggle.setAttribute('aria-expanded', String(!expanded));
		navList.classList.toggle('open');
	});
}

// Smooth scroll for internal links
const internalLinks = document.querySelectorAll('a[href^="#"]');
internalLinks.forEach((link) => {
	link.addEventListener('click', (e) => {
		const targetId = link.getAttribute('href');
		if (!targetId || targetId === '#') return;
		const target = document.querySelector(targetId);
		if (target) {
			e.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			navList?.classList.remove('open');
			navToggle?.setAttribute('aria-expanded', 'false');
		}
	});
});

// Motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal on scroll (IntersectionObserver)
const revealObserver = new IntersectionObserver((entries, obs) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
			obs.unobserve(entry.target);
		}
	});
}, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Animated counters
function animateCounter(el) {
	const isFloat = el.dataset.target?.includes('.');
	const target = parseFloat(el.dataset.target || '0');
	const durationMs = prefersReducedMotion ? 300 : 1400;
	const start = performance.now();

	function tick(now) {
		const progress = Math.min((now - start) / durationMs, 1);
		const value = target * progress;
		el.textContent = isFloat ? value.toFixed(1) : Math.round(value).toString();
		if (progress < 1) requestAnimationFrame(tick);
	}
	requestAnimationFrame(tick);
}

document.querySelectorAll('.counter').forEach((el) => {
	const parent = el.closest('.stats') || el;
	const obs = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				animateCounter(el);
				obs.unobserve(entry.target);
			}
		});
	}, { threshold: 0.6 });
	obs.observe(parent);
});

// Dynamic year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Scroll progress bar + header shadow
const progressEl = document.getElementById('scroll-progress');
const headerEl = document.querySelector('.site-header');
function updateProgressAndHeader() {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
	if (progressEl) progressEl.style.width = progress + '%';
	if (headerEl) headerEl.classList.toggle('scrolled', scrollTop > 6);
}
window.addEventListener('scroll', updateProgressAndHeader, { passive: true });
window.addEventListener('resize', updateProgressAndHeader);
requestAnimationFrame(updateProgressAndHeader);

// Nav scrollspy
const sections = [
	{ id: '#sobre', el: document.getElementById('sobre') },
	{ id: '#como-funciona', el: document.getElementById('como-funciona') },
	{ id: '#planos', el: document.getElementById('planos') },
	{ id: '#contato', el: document.getElementById('contato') }
].filter(s => s.el);

const spyObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		const sec = sections.find(s => s.el === entry.target);
		if (!sec) return;
		const link = document.querySelector(`.nav-list a[href='${sec.id}']`);
		if (!link) return;
		if (entry.isIntersecting) link.classList.add('active');
		else link.classList.remove('active');
	});
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

sections.forEach(s => spyObserver.observe(s.el));

// Removed parallax and tilt for minimalism

// Pricing toggle
const toggleBtns = document.querySelectorAll('.toggle-btn');
if (toggleBtns.length) {
	toggleBtns.forEach(btn => btn.addEventListener('click', () => {
		const billing = btn.getAttribute('data-billing');
		toggleBtns.forEach(b => b.classList.toggle('active', b === btn));
		document.querySelectorAll('.pricing .price').forEach(priceEl => {
			const value = priceEl.getAttribute(`data-${billing}`) || '';
			priceEl.textContent = value;
		});
	}));
}
