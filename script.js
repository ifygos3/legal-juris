(() => {
'use strict';

/* =====================================================================
   CONFIG
   ===================================================================== */
const WHATSAPP_NUMBER = '2348112280603';
const EMAIL = 'legaljuris124@gmail.com';
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =====================================================================
   TOAST NOTIFICATIONS
   ===================================================================== */
function toast(msg, ms = 4500, linkUrl, linkLabel) {
  const root = $('#toastRoot');
  if (!root) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  if (linkUrl) {
    t.appendChild(document.createTextNode(' '));
    const a = document.createElement('a');
    a.href = linkUrl; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = linkLabel || 'Open WhatsApp';
    a.style.cssText = 'color:var(--gold);font-weight:700;text-decoration:underline;';
    t.appendChild(a);
    ms = Math.max(ms, 9000);
  }
  root.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

function toastCopy(msg, email, ms = 9000) {
  const root = $('#toastRoot');
  if (!root) return;
  const t = document.createElement('div');
  t.className = 'toast';
  t.appendChild(document.createTextNode(msg + ' '));
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = `Copy ${email}`;
  btn.style.cssText = 'color:var(--gold);font-weight:700;text-decoration:underline;background:none;border:0;padding:0;font:inherit;cursor:pointer;';
  btn.addEventListener('click', () => {
    const done = () => { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = `Copy ${email}`; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done, done);
    else done();
  });
  t.appendChild(btn);
  root.appendChild(t);
  setTimeout(() => t.remove(), ms);
}

/* =====================================================================
   GLOBAL CLICK DELEGATION
   ===================================================================== */
document.addEventListener('click', (e) => {
  const tst = e.target.closest('[data-toast]');
  if (tst) { e.preventDefault(); toast(tst.dataset.toast); }

  const mail = e.target.closest('a[href^="mailto:"]');
  if (mail) {
    const address = mail.getAttribute('href').replace(/^mailto:/, '').split('?')[0];
    toastCopy('Opening your email app…', decodeURIComponent(address));
  }
});

function openExternal(url) {
  const a = document.createElement('a');
  a.href = url; a.target = '_blank'; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
}

/* =====================================================================
   HEADER: sticky state + scroll progress + back-to-top
   ===================================================================== */
const header = $('#siteHeader');
const progress = $('#progress');
const toTop = $('#toTop');

let headerScrolled = false;
function onScroll() {
  if (header) {
    const sy = window.scrollY;
    if (sy > 36 && !headerScrolled) {
      header.classList.add('scrolled');
      headerScrolled = true;
    } else if (sy < 16 && headerScrolled) {
      header.classList.remove('scrolled');
      headerScrolled = false;
    }
  }
  if (progress) {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

/* Skip link */
const skipLink = $('#skipLink');
if (skipLink) {
  skipLink.addEventListener('focus', function () { this.style.top = '12px'; });
  skipLink.addEventListener('blur', function () { this.style.top = '-60px'; });
}

/* Active nav highlighting */
const navLinks = $$('.primary-nav a');
const sections = ['home', 'about', 'practice-areas', 'property-management', 'real-estate', 'insights', 'contact']
  .map(id => document.getElementById(id)).filter(Boolean);

const PAGE_TO_HREF = {
  home: 'index',
  about: 'about',
  'practice-areas': 'legal-services',
  'property-management': 'property-management',
  'real-estate': 'real-estate',
  insights: 'insights',
  contact: 'contact'
};
const hrefToPage = {};
Object.entries(PAGE_TO_HREF).forEach(([page, hrefBase]) => {
  hrefToPage[`${hrefBase}.html`] = page;
  hrefToPage[hrefBase] = page;
});

const mnavLinks = $$('.mnav-link', $('#mobileNav') || document);

function markActiveNav(page) {
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === page));
  mnavLinks.forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].replace(/\.html$/, '').trim();
    a.classList.toggle('active', a.dataset.nav === page || hrefToPage[href] === page);
  });
}
markActiveNav(document.body.dataset.page);

if ('IntersectionObserver' in window && sections.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === en.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
}

/* =====================================================================
   MOBILE NAV
   ===================================================================== */
const mobileNav = $('#mobileNav'), scrim = $('#scrim'), menuBtn = $('#menuBtn');
function openMobileNav() {
  if (!mobileNav || !scrim || !menuBtn) return;
  mobileNav.classList.add('open'); scrim.classList.add('show');
  mobileNav.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  if (!mobileNav || !scrim || !menuBtn) return;
  mobileNav.classList.remove('open'); scrim.classList.remove('show');
  mobileNav.setAttribute('aria-hidden', 'true'); menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}
if (menuBtn) menuBtn.addEventListener('click', openMobileNav);
const mCloseBtn = $('#mCloseBtn');
if (mCloseBtn) mCloseBtn.addEventListener('click', closeMobileNav);
if (scrim) scrim.addEventListener('click', closeMobileNav);
mnavLinks.forEach(a => a.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

/* =====================================================================
   TRUST STRIP
   ===================================================================== */
const TRUST_ITEMS = [
  ['shield', 'Professional Legal Counsel'],
  ['scale', 'Strategic Representation'],
  ['user', 'Client-Focused Service'],
  ['lock', 'Confidential & Discreet'],
  ['check', 'Practical Legal Solutions']
];
const TRUST_ICONS = {
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  scale: '<path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  check: '<path d="M20 6L9 17l-5-5"/>'
};
const svgIcon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${TRUST_ICONS[name]}</svg>`;
const trustWrap = $('.trust .wrap');
if (trustWrap) {
  trustWrap.innerHTML = TRUST_ITEMS.map(([icon, label]) => `
    <div class="trust-item">${svgIcon(icon)}<span>${label}</span></div>
  `).join('');
}

/* =====================================================================
   PRACTICE AREAS
   ===================================================================== */
const PRACTICE_AREAS = [
  ['briefcase', 'Corporate & Commercial Law', 'Legal guidance for businesses, commercial transactions, contracts, and corporate matters.'],
  ['gavel', 'Civil Litigation', 'Representation and legal support in civil disputes and proceedings.'],
  ['shield', 'Criminal Law', 'Legal representation and advice relating to criminal matters.'],
  ['home', 'Property & Real Estate Law', 'Legal assistance concerning property transactions, ownership, leases, and related disputes.'],
  ['users', 'Family & Matrimonial Matters', 'Professional legal assistance concerning family and matrimonial matters.'],
  ['doc', 'Contract & Commercial Agreements', 'Drafting, reviewing, and advising on contractual arrangements.'],
  ['work', 'Employment & Labour Matters', 'Legal guidance concerning employment relationships and workplace disputes.'],
  ['compass', 'Legal Advisory & Consultation', 'Professional legal advice tailored to individual and organizational needs.']
];
const PRACTICE_ICONS = {
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  gavel: '<path d="M14 13l6.5 6.5M17.5 9.5l-9 9M13 7l4 4M2 22l6-6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  work: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M2 13h20"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>'
};
const practiceList = $('#practiceList');
if (practiceList) {
  practiceList.innerHTML = PRACTICE_AREAS.map(([icon, title, desc], i) => `
    <div class="practice-item" data-idx="${i}">
      <button class="practice-trigger" aria-expanded="false" aria-controls="practice-panel-${i}">
        <svg class="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PRACTICE_ICONS[icon]}</svg>
        <span class="ptxt"><h3>${title}</h3><p class="pdesc">${desc}</p></span>
        <svg class="icon chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="practice-panel" id="practice-panel-${i}">
        <div class="practice-panel-in">
          <p>Discuss the specifics of your ${title.toLowerCase()} matter with the chambers. Every enquiry is reviewed before any formal engagement begins.</p>
          <div class="practice-actions">
            <a href="${waLink('Hello Legal Juris, I would like to discuss a legal matter regarding ' + title + '.')}" target="_blank" rel="noopener" class="btn btn-navy btn-sm">Discuss on WhatsApp</a>
            <a href="mailto:${EMAIL}?subject=${encodeURIComponent('Enquiry: ' + title)}" class="btn btn-line-dark btn-sm">Email About This</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  $$('.practice-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.practice-item');
      const panel = $('.practice-panel', item);
      const isOpen = item.classList.contains('open');
      $$('.practice-item.open').forEach(o => {
        if (o !== item) { o.classList.remove('open'); $('.practice-trigger', o).setAttribute('aria-expanded', 'false'); $('.practice-panel', o).style.maxHeight = null; }
      });
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });
}

/* =====================================================================
   WHY CHOOSE US — principles
   ===================================================================== */
const PRINCIPLES = [
  ['01', 'Integrity', 'Professional conduct and honest communication.'],
  ['02', 'Confidentiality', 'Respect for the sensitive nature of client information.'],
  ['03', 'Strategic Thinking', 'Careful analysis before recommending a legal course of action.'],
  ['04', 'Client Focus', 'Understanding each client\u2019s objectives and circumstances.'],
  ['05', 'Professional Communication', 'Clear communication throughout the legal process.'],
  ['06', 'Practical Solutions', 'Focusing on legally sound and practical outcomes.']
];
const principlesList = $('#principlesList');
if (principlesList) {
  principlesList.innerHTML = PRINCIPLES.map(([n, t, d]) => `
    <div class="principle"><span class="pnum">${n}</span><h3>${t}</h3><p>${d}</p></div>
  `).join('');
}

/* =====================================================================
   OUR APPROACH
   ===================================================================== */
const APPROACH = [
  ['01', 'Initial Consultation', 'Understand the client\u2019s legal concern.'],
  ['02', 'Legal Assessment', 'Review the relevant facts and legal considerations.'],
  ['03', 'Strategy', 'Develop an appropriate legal approach.'],
  ['04', 'Representation & Follow-Through', 'Provide professional legal support throughout the engagement.']
];
const approachRow = $('#approachRow');
if (approachRow) {
  approachRow.innerHTML = APPROACH.map(([n, t, d], i) => `
    <div class="approach-step" style="transition-delay:${reduceMotion ? 0 : i * 110}ms">
      <p class="num">${n}</p><h3>${t}</h3><p>${d}</p>
    </div>
  `).join('');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const ioApproach = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); ioApproach.unobserve(en.target); }
    }), { threshold: 0.25 });
    $$('#approachRow .approach-step').forEach(el => ioApproach.observe(el));
  } else {
    $$('#approachRow .approach-step').forEach(el => el.classList.add('in'));
  }
}

/* =====================================================================
   PROPERTY MANAGEMENT
   ===================================================================== */
const PM_SERVICES = [
  ['home', 'Residential Property Management', 'Professional oversight of residential properties, apartments, houses and rental units.'],
  ['briefcase', 'Commercial Property Management', 'Management support for offices, shops, commercial buildings and other investment properties.'],
  ['users', 'Landlord & Tenant Management', 'Support with tenancy administration, documentation, rent matters, notices and landlord-tenant relationships.'],
  ['doc', 'Rent & Tenancy Administration', 'Assist property owners with tenancy records, rent schedules, renewals and related administrative processes.'],
  ['gavel', 'Property Documentation', 'Assistance with leases, tenancy agreements, deeds, assignments and other property-related documentation.'],
  ['compass', 'Property Inspection & Oversight', 'Routine property inspection, condition monitoring and reporting to property owners.'],
  ['shield', 'Property Acquisition Support', 'Legal and professional support for clients acquiring land, houses, apartments and other real estate.'],
  ['work', 'Property Due Diligence', 'Review of property documentation and appropriate legal checks before transactions.'],
  ['scale', 'Property Dispute Resolution', 'Legal assistance relating to tenancy disputes, possession, ownership claims, and breaches of agreements.'],
  ['home', 'Property Sale & Lease Support', 'Legal support throughout property sales, leases, assignments and related transactions.']
];
const PM_ICONS = {
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  gavel: '<path d="M14 13l6.5 6.5M17.5 9.5l-9 9M13 7l4 4M2 22l6-6"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  work: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M2 13h20"/>',
  scale: '<path d="M12 3v18M5 21h14M4 7h16M6 7l-3 7a3 3 0 0 0 6 0zM18 7l-3 7a3 3 0 0 0 6 0z"/>',
  check: '<path d="M20 6L9 17l-5-5"/>'
};

const pmServicesGrid = $('#pmServicesGrid');
if (pmServicesGrid) {
  pmServicesGrid.innerHTML = PM_SERVICES.map(([icon, title, desc]) => `
    <div class="pm-card">
      <svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PM_ICONS[icon]}</svg>
      <h3>${title}</h3>
      <p>${desc}</p>
    </div>
  `).join('');
}

const PM_FEATURES = ['Professional oversight', 'Transparent administration', 'Legal documentation', 'Tenant coordination', 'Property inspections', 'Compliance support', 'Dispute management', 'Owner reporting'];
const pmFeatures = $('#pmFeatures');
if (pmFeatures) {
  pmFeatures.innerHTML = PM_FEATURES.map(f => `
    <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">${PM_ICONS.check}</svg><span>${f}</span></div>
  `).join('');
}

const PM_PROCESS = [
  ['01', 'Tell Us About Your Property', 'Provide basic information about your property, its location, type, number of units and the management support you require.'],
  ['02', 'Property Assessment', 'Our team reviews your requirements and considers the nature of the property, tenancy arrangements and management needs.'],
  ['03', 'Management Plan', 'We identify the appropriate management services, responsibilities and reporting arrangements based on your requirements.'],
  ['04', 'Documentation & Onboarding', 'Relevant property records, tenancy information and other necessary documentation are organised to establish an effective management process.'],
  ['05', 'Ongoing Management', 'Our team provides agreed administrative and property-management support while maintaining appropriate communication and records.'],
  ['06', 'Reporting & Review', 'Property matters are monitored and reported according to the agreed management arrangement, with issues escalated where legal or specialist intervention is required.']
];
const pmProcessRow = $('#pmProcessRow');
if (pmProcessRow) {
  pmProcessRow.innerHTML = PM_PROCESS.map(([n, t, d], i) => `
    <div class="approach-step" style="transition-delay:${reduceMotion ? 0 : i * 90}ms">
      <p class="num">${n}</p><h3>${t}</h3><p>${d}</p>
    </div>
  `).join('');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const ioProcess = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); ioProcess.unobserve(en.target); }
    }), { threshold: 0.25 });
    $$('#pmProcessRow .approach-step').forEach(el => ioProcess.observe(el));
  } else {
    $$('#pmProcessRow .approach-step').forEach(el => el.classList.add('in'));
  }
}

const RE_SERVICES = ['Land acquisition', 'Property searches and due diligence', 'Deeds and assignments', 'Tenancy agreements', 'Lease agreements', 'Property sales', 'Property transfers', 'Landlord and tenant matters', 'Property documentation', 'Real estate negotiations', 'Property disputes', 'Recovery of possession', 'Commercial property transactions'];
const reServicesList = $('#reServicesList');
if (reServicesList) {
  reServicesList.innerHTML = RE_SERVICES.map(f => `
    <div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">${PM_ICONS.check}</svg><span>${f}</span></div>
  `).join('');
}

const PM_CATEGORIES = ['Residential Properties', 'Commercial Properties', 'Rental Properties', 'Development Properties', 'Land & Estates'];
const pmCategories = $('#pmCategories');
if (pmCategories) {
  pmCategories.innerHTML = PM_CATEGORIES.map(c => `<span>${c}</span>`).join('');
}

const PM_TRUST = [
  ['01', 'Legal Expertise', 'Property management backed by legal knowledge and professional documentation.'],
  ['02', 'Professional Administration', 'Structured handling of agreed property-management responsibilities.'],
  ['03', 'Protection of Interests', 'A focus on protecting the legitimate interests of property owners and clients.'],
  ['04', 'Clear Communication', 'Professional communication and appropriate reporting.'],
  ['05', 'Dispute Support', 'Access to legal assistance when property-related disputes arise.'],
  ['06', 'Confidentiality', 'Professional handling of sensitive client and property information.']
];
const pmTrustList = $('#pmTrustList');
if (pmTrustList) {
  pmTrustList.innerHTML = PM_TRUST.map(([n, t, d]) => `
    <div class="principle"><span class="pnum">${n}</span><h3>${t}</h3><p>${d}</p></div>
  `).join('');
}

const PM_FAQS = [
  ['What types of properties can Legal Juris manage?', 'Residential, commercial and other properties depending on the agreed scope of engagement.'],
  ['Do you manage rental properties?', 'Yes, property-management services can include agreed tenancy and rental administration responsibilities.'],
  ['Can you help me verify a property before purchasing?', 'Legal Juris can provide appropriate property due-diligence and legal services subject to the scope of engagement.'],
  ['Can you handle landlord and tenant matters?', 'Yes, the firm can provide legal and administrative support relating to landlord-tenant matters.'],
  ['Can you manage commercial properties?', 'Yes, commercial property-management support can be offered depending on the property and agreed requirements.'],
  ['Can I request property management through WhatsApp?', 'Yes. Use the WhatsApp CTAs on this page, or the floating WhatsApp icon, to reach the property team directly.']
];
const pmFaqList = $('#pmFaqList');
if (pmFaqList) {
  pmFaqList.innerHTML = PM_FAQS.map(([q, a], i) => `
    <div class="faq-item" data-idx="pm-${i}">
      <button class="faq-q" aria-expanded="false" aria-controls="pm-faq-a-${i}"><span>${q}</span><span class="plus" aria-hidden="true"></span></button>
      <div class="faq-a" id="pm-faq-a-${i}"><div class="faq-a-in">${a}</div></div>
    </div>
  `).join('');
}

/* PM form */
const pmForm = $('#pmForm');
if (pmForm) {
  pmForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const required = ['name', 'phone', 'email', 'property_type', 'location', 'requirement'];
    required.forEach(name => {
      const input = pmForm.elements[name];
      const field = input.closest('.field');
      let ok = input.value.trim().length > 0;
      if (name === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      field.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });
    if (!valid) { toast('Please complete the required fields before submitting.'); return; }

    const data = Object.fromEntries(new FormData(pmForm).entries());
    const lines = [
      `*Name:* ${data.name}`,
      `*Phone:* ${data.phone}`,
      `*Email:* ${data.email}`,
      `*Property Type:* ${data.property_type}`,
      `*Property Location:* ${data.location}`,
      data.units ? `*Number of Units:* ${data.units}` : null,
      `*Service Required:* ${data.requirement}`,
      data.info ? `*Additional Information:* ${data.info}` : null
    ].filter(Boolean);
    const msg = `PROPERTY MANAGEMENT INQUIRY\n\n${lines.join('\n')}`;
    const url = waLink(msg);
    openExternal(url);
    toast('Property management request ready.', 9000, url, 'Tap here if WhatsApp did not open');
  });
  pmForm.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('error');
  });
}

/* =====================================================================
   INSIGHTS
   ===================================================================== */
const INSIGHTS = [
  ['Client Guidance', 'Understanding Your Legal Rights', 'A general overview of how to think about your legal rights before entering any dispute or agreement.'],
  ['Client Guidance', 'Why Professional Legal Advice Matters', 'Why early legal counsel often prevents larger complications later on.'],
  ['Client Guidance', 'What to Consider Before Signing a Contract', 'Key questions to ask yourself before signing any binding agreement.']
];
const insightsGrid = $('#insightsGrid');
if (insightsGrid) {
  insightsGrid.innerHTML = INSIGHTS.map(([kicker, title, desc]) => `
    <article class="insight-card">
      <span class="kicker">${kicker}</span>
      <h3>${title}</h3>
      <p>${desc}</p>
      <button type="button" class="read" data-toast="This article is coming soon.">Read Article →</button>
    </article>
  `).join('');
}

/* =====================================================================
   FAQ
   ===================================================================== */
const FAQS = [
  ['How can I book a consultation?', 'Use the "Book a Consultation" button to go to the consultation request form, or contact the chambers directly by WhatsApp or email to arrange a time.'],
  ['How can I contact Legal Juris?', 'You can reach the chambers by WhatsApp, email, or by visiting the Enugu or Port Harcourt office. Contact details are available in the Contact section and footer.'],
  ['Does submitting an online enquiry create a lawyer-client relationship?', 'No. Submitting an enquiry or consultation request does not by itself create a lawyer-client relationship. This is only established through a formal professional engagement.'],
  ['Can I contact the chambers through WhatsApp?', 'Yes. WhatsApp is one of the chambers\u2019 primary channels for enquiries and scheduling. Look for the WhatsApp buttons throughout the site or the floating WhatsApp icon.'],
  ['Where are your offices located?', 'The chambers maintains offices in Enugu (No. 173 Zik Avenue, Uwani, Enugu State) and Port Harcourt (No. 40 Free Town Street, Rivers State). Details are in the Contact section.'],
  ['What information should I provide during an initial enquiry?', 'A brief description of your matter, your preferred contact method, and your contact details are usually enough for the chambers to respond and advise on next steps.']
];
const faqList = $('#faqList');
if (faqList) {
  faqList.innerHTML = FAQS.map(([q, a], i) => `
    <div class="faq-item" data-idx="${i}">
      <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}"><span>${q}</span><span class="plus" aria-hidden="true"></span></button>
      <div class="faq-a" id="faq-a-${i}"><div class="faq-a-in">${a}</div></div>
    </div>
  `).join('');
}

/* FAQ accordion (works on both #faqList and #pmFaqList) */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const panel = $('.faq-a', item);
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
    panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
  });
});

/* =====================================================================
   OFFICES
   ===================================================================== */
const OFFICES = [
  { name: 'Enugu Office', lines: ['No. 173 Zik Avenue', 'Uwani, Enugu, Enugu State, Nigeria'], query: 'No. 173 Zik Avenue, Uwani, Enugu, Enugu State, Nigeria' },
  { name: 'Port Harcourt Office', lines: ['No. 40 Free Town Street', 'Port Harcourt, Rivers State, Nigeria'], query: 'No. 40 Free Town Street, Port Harcourt, Rivers State, Nigeria' }
];
const officesGrid = $('#officesGrid');
if (officesGrid) {
  officesGrid.innerHTML = OFFICES.map(o => `
    <div class="office-card">
      <span class="oicon"><svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
      <h3>${o.name}</h3>
      <address>${o.lines.join('<br>')}</address>
      <div class="actions">
        <a href="${waLink('Hello Legal Juris, I would like to make a legal enquiry regarding the ' + o.name + '.')}" target="_blank" rel="noopener" class="btn btn-navy btn-sm">Contact ${o.name}</a>
        <a href="mailto:${EMAIL}" class="btn btn-line-dark btn-sm">Email</a>
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.query)}" target="_blank" rel="noopener" class="btn btn-line-dark btn-sm">Get Directions</a>
      </div>
    </div>
  `).join('');
}

/* =====================================================================
   CONSULTATION FORM
   ===================================================================== */
const form = $('#consultForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const required = ['name', 'email', 'phone', 'contact_method', 'matter', 'description'];
    required.forEach(name => {
      const input = form.elements[name];
      const field = input.closest('.field');
      let ok = input.value.trim().length > 0;
      if (name === 'email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      field.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });
    if (!valid) { toast('Please complete the required fields before submitting.'); return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const lines = [
      `*Name:* ${data.name}`,
      `*Email:* ${data.email}`,
      `*Phone:* ${data.phone}`,
      `*Preferred Contact Method:* ${data.contact_method}`,
      `*Legal Matter / Service:* ${data.matter}`,
      `*Description:* ${data.description}`,
      data.date ? `*Preferred Consultation Date:* ${data.date}` : null,
      data.message ? `*Message:* ${data.message}` : null
    ].filter(Boolean);
    const msg = `Hello Legal Juris, I would like to request a consultation.\n\n${lines.join('\n')}`;
    const url = waLink(msg);
    openExternal(url);
    toast('Consultation request ready.', 9000, url, 'Tap here if WhatsApp did not open');
  });
  form.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('error');
  });
}

/* =====================================================================
   CONTACT FORM
   ===================================================================== */
const contactForm = $('#contactMsgForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    ['cm_name', 'cm_email', 'cm_message'].forEach(id => {
      const input = $('#' + id);
      const field = input.closest('.field');
      let ok = input.value.trim().length > 0;
      if (id === 'cm_email' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      field.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });
    if (!valid) { toast('Please complete the required fields before sending.'); return; }

    const name = $('#cm_name').value.trim();
    const email = $('#cm_email').value.trim();
    const phone = $('#cm_phone').value.trim();
    const message = $('#cm_message').value.trim();
    const lines = [
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      phone ? `*Phone:* ${phone}` : null,
      `*Message:* ${message}`
    ].filter(Boolean);
    const msg = `Hello Legal Juris, I would like to make an enquiry.\n\n${lines.join('\n')}`;
    const url = waLink(msg);
    openExternal(url);
    toast('Message ready.', 9000, url, 'Tap here if WhatsApp did not open');
    contactForm.reset();
  });
  contactForm.addEventListener('input', (e) => {
    const field = e.target.closest('.field');
    if (field) field.classList.remove('error');
  });
}

/* Footer year */
const yr = $('#yr');
if (yr) yr.textContent = new Date().getFullYear();

/* =====================================================================
   PAGE TRANSITION
   ===================================================================== */
(function () {
  const overlay = $('#pageTransition');
  if (!overlay) return;
  if (reduceMotion) return;

  const safe = { get: (k) => { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
                 set: (k, v) => { try { sessionStorage.setItem(k, v); } catch (_) {} },
                 del: (k) => { try { sessionStorage.removeItem(k); } catch (_) {} } };

  /* Arrival: start covered, then fade the overlay out */
  if (safe.get('legaljuris-leaving') === '1') {
    safe.del('legaljuris-leaving');
    overlay.style.transition = 'none';
    overlay.classList.add('show');
    window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.style.transition = '';
      overlay.classList.remove('show');
      document.body.classList.remove('is-animating-out');
    }));
  }

  /* Browser Back/Forward can restore the page from cache with the overlay still covering it */
  window.addEventListener('pageshow', (ev) => {
    if (ev.persisted) {
      overlay.classList.remove('show');
      document.body.classList.remove('is-animating-out');
    }
  });

  let transitioning = false;

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented) return;
    if (transitioning) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; /* keep "open in new tab" working */
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.charAt(0) === '#') return;
    if (/^(mailto:|tel:|https?:)/i.test(href)) return;
    if (a.target && a.target !== '_self') return;
    if (a.hasAttribute('download')) return;
    try {
      const u = new URL(href, location.origin);
      if (u.origin !== location.origin) return;
    } catch (_) { return; }

    /* Same-page link (e.g. contact.html#consultation on contact page):
       skip the page-transition overlay and let smooth scroll handle it */
    const targetURL = new URL(href, location.href);
    if (targetURL.pathname === location.pathname && targetURL.search === location.search) return;

    e.preventDefault();
    safe.set('legaljuris-leaving', '1');
    overlay.classList.add('show');
    document.body.classList.add('is-animating-out');
    transitioning = true;
    setTimeout(() => { location.href = href; }, 300);
  });
})();
})();