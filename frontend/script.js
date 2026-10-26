/**
 * ITECH Fix (Infinity Technology Fix) - Pure Standalone JavaScript
 * Simple, fast, and dependency-free
 */

const MANAGER_WHATSAPP = '2348120268491';
const MANAGER_WHATSAPP_URL = 'https://wa.me/' + MANAGER_WHATSAPP;
const NGN_RATE = 1500;
const ADSENSE_PUBLISHER_ID = '';
const products = [
  { id: 'a15-screen', name: 'Samsung A15 LCD Screen', model: 'Samsung A15', category: 'Displays', price: 34000, stock: 'Available', art: 'display', alt: 'Illustration of a replacement phone display' },
  { id: 'iphone11-battery', name: 'iPhone 11 Battery', model: 'iPhone 11', category: 'Batteries', price: 18500, stock: 'Available', art: 'battery', alt: 'Illustration of a replacement phone battery' },
  { id: 'redmi-port', name: 'Redmi Note 12 Charging Port', model: 'Redmi Note 12', category: 'Charging ports', price: 9500, stock: 'Check stock', art: 'port', alt: 'Illustration of a phone charging-port assembly' },
  { id: 'a15-flex', name: 'Samsung A15 Charging Flex', model: 'Samsung A15', category: 'Flex cables', price: 8500, stock: 'Available', art: 'flex', alt: 'Illustration of a phone charging flex cable' },
  { id: 'iphone11-camera', name: 'iPhone 11 Rear Camera', model: 'iPhone 11', category: 'Cameras', price: 22000, stock: 'Check stock', art: 'camera', alt: 'Illustration of a replacement phone camera' },
  { id: 'redmi-ic', name: 'Redmi Note 12 Charging IC', model: 'Redmi Note 12', category: 'Motherboards & ICs', price: 12500, stock: 'Check stock', art: 'ic', alt: 'Illustration of a mobile charging integrated circuit' },
  { id: 'a15-board', name: 'Samsung A15 Motherboard', model: 'Samsung A15', category: 'Motherboards & ICs', price: 52000, stock: 'Check stock', art: 'board', alt: 'Illustration of a phone motherboard' },
  { id: 'repair-tools', name: 'Precision Phone Repair Tool Set', model: 'Universal', category: 'Tools', price: 14500, stock: 'Available', art: 'tools', alt: 'Illustration of phone repair tools' },
  { id: 'phone-mic', name: 'Universal Speaker & Microphone Parts', model: 'Universal', category: 'Audio', price: 6500, stock: 'Check stock', art: 'audio', alt: 'Illustration of phone speaker and microphone parts' },
  { id: 'usb-cable', name: 'Braided USB-C Cable', model: 'Universal', category: 'Accessories', price: 4500, stock: 'Available', art: 'cable', alt: 'Illustration of a braided USB-C cable' }
];
const cart = new Map();
const productArtCache = new Map();

function createProductImage(product) {
  if (product.image) return product.image;
  if (productArtCache.has(product.id)) return productArtCache.get(product.id);
  const canvas = document.createElement('canvas');
  canvas.width = 720;
  canvas.height = 540;
  const context = canvas.getContext('2d');
  const roundedRect = (x, y, width, height, radius, fill, stroke) => {
    context.beginPath();
    context.roundRect(x, y, width, height, radius);
    context.fillStyle = fill;
    context.fill();
    if (stroke) {
      context.strokeStyle = stroke;
      context.lineWidth = 3;
      context.stroke();
    }
  };
  const metal = context.createLinearGradient(190, 100, 520, 430);
  metal.addColorStop(0, '#F8FBFC');
  metal.addColorStop(0.45, '#9EADB4');
  metal.addColorStop(0.75, '#E4EAEC');
  metal.addColorStop(1, '#75858D');
  const gold = '#D4A84F';
  const greenBoard = '#216B5D';

  const background = context.createLinearGradient(0, 0, 720, 540);
  background.addColorStop(0, '#F4F7F6');
  background.addColorStop(1, '#DDE6E4');
  context.fillStyle = background;
  context.fillRect(0, 0, 720, 540);
  context.fillStyle = 'rgba(255,255,255,0.62)';
  context.beginPath();
  context.arc(570, 95, 125, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = 'rgba(19,45,53,0.08)';
  context.beginPath();
  context.ellipse(360, 420, 205, 32, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#557078';
  context.font = '600 16px Arial';
  context.fillText('ITECH FIX  /  PARTS', 34, 42);
  context.fillStyle = '#7B8D91';
  context.font = '12px Arial';
  context.fillText('COMPONENT ILLUSTRATION', 34, 64);

  if (product.art === 'display') {
    context.save();
    context.translate(360, 265);
    context.rotate(-0.09);
    context.shadowColor = 'rgba(15,34,41,0.28)';
    context.shadowBlur = 24;
    context.shadowOffsetY = 18;
    roundedRect(-125, -190, 250, 365, 28, metal, '#73848B');
    context.shadowColor = 'transparent';
    roundedRect(-112, -177, 224, 337, 21, '#10171B', '#D5DDE0');
    context.fillStyle = '#253238';
    context.fillRect(-95, -145, 190, 272);
    const glass = context.createLinearGradient(-90, -140, 105, 125);
    glass.addColorStop(0, 'rgba(98,190,190,0.42)');
    glass.addColorStop(0.45, 'rgba(38,73,83,0.12)');
    glass.addColorStop(1, 'rgba(255,255,255,0.02)');
    context.fillStyle = glass;
    context.fillRect(-95, -145, 190, 272);
    context.fillStyle = '#10171B';
    context.fillRect(-42, 160, 84, 38);
    context.fillStyle = gold;
    for (let index = 0; index < 8; index += 1) context.fillRect(-37 + index * 10, 191, 5, 20);
    context.restore();
  } else if (product.art === 'battery') {
    context.save();
    context.translate(360, 265);
    context.rotate(0.07);
    context.shadowColor = 'rgba(15,34,41,0.24)';
    context.shadowBlur = 24;
    context.shadowOffsetY = 16;
    roundedRect(-155, -115, 310, 230, 20, metal, '#87969B');
    context.shadowColor = 'transparent';
    roundedRect(-126, -82, 252, 164, 12, '#E8ECEB', '#ABB7B8');
    roundedRect(-89, -45, 178, 90, 8, '#DCE2E1');
    context.fillStyle = '#9BA9A9';
    context.font = '700 18px Arial';
    context.fillText('Li-ion  /  3.8V', -76, 4);
    context.fillStyle = '#445459';
    context.fillRect(-30, -132, 60, 20);
    context.fillStyle = gold;
    for (let index = 0; index < 5; index += 1) context.fillRect(-24 + index * 12, -132, 7, 18);
    context.restore();
  } else if (product.art === 'port') {
    roundedRect(170, 205, 380, 126, 22, greenBoard, '#174B43');
    context.fillStyle = 'rgba(137,208,181,0.3)';
    context.fillRect(198, 222, 130, 90);
    context.shadowColor = 'rgba(15,34,41,0.28)';
    context.shadowBlur = 16;
    context.shadowOffsetY = 12;
    roundedRect(290, 170, 220, 195, 22, metal, '#74838A');
    context.shadowColor = 'transparent';
    roundedRect(322, 213, 157, 110, 32, '#252F34', '#D9DFE0');
    roundedRect(342, 240, 117, 55, 22, '#10171B');
    context.fillStyle = gold;
    for (let index = 0; index < 7; index += 1) context.fillRect(190 + index * 17, 327, 9, 32);
    context.strokeStyle = '#8CC7AE';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(206, 245); context.lineTo(265, 245); context.lineTo(294, 222);
    context.moveTo(212, 286); context.lineTo(268, 286); context.lineTo(296, 310);
    context.stroke();
  } else if (product.art === 'flex') {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = '#182427';
    context.lineWidth = 40;
    context.beginPath();
    context.moveTo(170, 365); context.bezierCurveTo(180, 240, 275, 320, 300, 215); context.bezierCurveTo(326, 112, 420, 180, 470, 122);
    context.stroke();
    context.strokeStyle = '#334346';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(175, 365); context.bezierCurveTo(185, 240, 279, 320, 304, 215); context.bezierCurveTo(330, 112, 424, 180, 474, 122);
    context.stroke();
    roundedRect(130, 340, 86, 58, 9, '#202A2D', '#859294');
    roundedRect(440, 94, 100, 64, 9, '#202A2D', '#859294');
    context.fillStyle = gold;
    for (let index = 0; index < 6; index += 1) {
      context.fillRect(144 + index * 12, 391, 6, 17);
      context.fillRect(453 + index * 13, 145, 6, 18);
    }
  } else if (product.art === 'camera') {
    context.save();
    context.translate(360, 265);
    context.rotate(-0.08);
    context.shadowColor = 'rgba(15,34,41,0.26)';
    context.shadowBlur = 22;
    context.shadowOffsetY = 14;
    roundedRect(-145, -145, 290, 290, 30, '#20292D', '#65757A');
    context.shadowColor = 'transparent';
    [[-65, -62], [65, -62], [0, 62]].forEach(([x, y]) => {
      context.fillStyle = '#0D1519';
      context.beginPath(); context.arc(x, y, 53, 0, Math.PI * 2); context.fill();
      context.strokeStyle = metal; context.lineWidth = 10;
      context.beginPath(); context.arc(x, y, 44, 0, Math.PI * 2); context.stroke();
      const lens = context.createRadialGradient(x - 12, y - 12, 4, x, y, 36);
      lens.addColorStop(0, '#88C8C6'); lens.addColorStop(0.45, '#245666'); lens.addColorStop(1, '#080E13');
      context.fillStyle = lens; context.beginPath(); context.arc(x, y, 34, 0, Math.PI * 2); context.fill();
      context.fillStyle = 'rgba(255,255,255,0.7)'; context.beginPath(); context.arc(x - 12, y - 14, 7, 0, Math.PI * 2); context.fill();
    });
    context.restore();
  } else if (product.art === 'ic') {
    roundedRect(215, 155, 290, 220, 18, greenBoard, '#174B43');
    context.strokeStyle = '#9CBFA6'; context.lineWidth = 5;
    for (let index = 0; index < 4; index += 1) {
      context.beginPath(); context.moveTo(235 + index * 23, 173); context.lineTo(235 + index * 23, 130); context.stroke();
      context.beginPath(); context.moveTo(245 + index * 23, 355); context.lineTo(245 + index * 23, 399); context.stroke();
    }
    context.shadowColor = 'rgba(15,34,41,0.28)'; context.shadowBlur = 18; context.shadowOffsetY = 12;
    roundedRect(285, 200, 150, 130, 12, '#20292D', '#66777A');
    context.shadowColor = 'transparent';
    context.fillStyle = '#49575A';
    for (let index = 0; index < 6; index += 1) {
      context.fillRect(270 + index * 29, 186, 12, 15); context.fillRect(270 + index * 29, 330, 12, 15);
      context.fillRect(270, 208 + index * 19, 15, 10); context.fillRect(435, 208 + index * 19, 15, 10);
    }
    context.fillStyle = '#B8C7C5'; context.font = '700 18px Arial'; context.fillText('IC', 343, 273);
  } else if (product.art === 'board') {
    roundedRect(158, 153, 404, 235, 20, greenBoard, '#174B43');
    context.strokeStyle = '#8BB89E'; context.lineWidth = 5;
    [[205, 190, 265, 190, 290, 218], [490, 180, 435, 180, 410, 210], [198, 340, 270, 340, 300, 310], [520, 340, 454, 340, 425, 310]].forEach(([x1, y1, x2, y2, x3, y3]) => { context.beginPath(); context.moveTo(x1, y1); context.lineTo(x2, y2); context.lineTo(x3, y3); context.stroke(); });
    roundedRect(280, 207, 150, 112, 10, '#232C30', '#66777A');
    roundedRect(184, 218, 70, 58, 7, '#293336', '#93A19F');
    roundedRect(462, 268, 62, 56, 7, '#293336', '#93A19F');
    context.fillStyle = gold;
    [[177, 175], [527, 184], [180, 356], [536, 356], [324, 176], [388, 352]].forEach(([x, y]) => { context.beginPath(); context.arc(x, y, 8, 0, Math.PI * 2); context.fill(); });
  } else if (product.art === 'tools') {
    context.shadowColor = 'rgba(15,34,41,0.2)'; context.shadowBlur = 18; context.shadowOffsetY = 12;
    roundedRect(205, 128, 310, 286, 18, '#263238', '#697A7D');
    context.shadowColor = 'transparent';
    const toolGradient = context.createLinearGradient(250, 0, 460, 0);
    toolGradient.addColorStop(0, '#BEC9C9'); toolGradient.addColorStop(0.5, '#F1F3F2'); toolGradient.addColorStop(1, '#7E8E91');
    for (let index = 0; index < 5; index += 1) {
      roundedRect(240 + index * 52, 170, 22, 162, 10, toolGradient, '#879395');
      roundedRect(230 + index * 52, 154, 42, 54, 12, ['#D39A62', '#577A82', '#BA6C4D', '#66886C', '#BC9B55'][index]);
      context.fillStyle = '#E2B95E';
      context.fillRect(246 + index * 52, 330, 9, 43);
    }
    context.fillStyle = '#C9D4D2';
    for (let index = 0; index < 4; index += 1) roundedRect(230 + index * 57, 366, 32, 18, 4, '#ADB9B8');
  } else if (product.art === 'audio') {
    roundedRect(180, 180, 360, 190, 24, greenBoard, '#174B43');
    const speaker = context.createRadialGradient(280, 264, 10, 280, 264, 84);
    speaker.addColorStop(0, '#151D20'); speaker.addColorStop(0.72, '#2E3A3E'); speaker.addColorStop(1, '#B3BDBD');
    context.fillStyle = speaker; context.beginPath(); context.arc(280, 264, 80, 0, Math.PI * 2); context.fill();
    context.strokeStyle = '#CAD1CF'; context.lineWidth = 5; context.beginPath(); context.arc(280, 264, 63, 0, Math.PI * 2); context.stroke();
    roundedRect(399, 215, 77, 130, 18, metal, '#78878A');
    roundedRect(419, 234, 37, 82, 17, '#263337');
    context.fillStyle = '#A9B9B4';
    for (let index = 0; index < 5; index += 1) context.fillRect(202 + index * 14, 355, 7, 27);
  } else if (product.art === 'cable') {
    context.lineCap = 'round';
    context.shadowColor = 'rgba(15,34,41,0.2)'; context.shadowBlur = 20; context.shadowOffsetY = 10;
    context.strokeStyle = '#263438'; context.lineWidth = 32;
    context.beginPath(); context.moveTo(230, 330); context.bezierCurveTo(120, 335, 185, 160, 340, 175); context.bezierCurveTo(510, 188, 550, 350, 416, 360); context.bezierCurveTo(310, 367, 310, 252, 420, 250); context.stroke();
    context.shadowColor = 'transparent';
    context.strokeStyle = '#526166'; context.lineWidth = 7;
    context.beginPath(); context.moveTo(230, 330); context.bezierCurveTo(120, 335, 185, 160, 340, 175); context.bezierCurveTo(510, 188, 550, 350, 416, 360); context.bezierCurveTo(310, 367, 310, 252, 420, 250); context.stroke();
    roundedRect(181, 305, 62, 48, 10, metal, '#6B7A7D');
    roundedRect(405, 225, 69, 50, 11, metal, '#6B7A7D');
    roundedRect(197, 316, 18, 27, 4, '#344247');
    roundedRect(428, 236, 27, 28, 5, '#344247');
  }

  const image = canvas.toDataURL('image/png');
  productArtCache.set(product.id, image);
  return image;
}

function openManagerWhatsApp(message) {
  const url = `${MANAGER_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

function formatNaira(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(amount);
}

function toNaira(amount) {
  return Math.round(amount * NGN_RATE);
}

function formatNairaRange(minUsd, maxUsd) {
  return `${formatNaira(toNaira(minUsd))} - ${formatNaira(toNaira(maxUsd))}`;
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getGlobalSearchMatch(query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return null;

  let bestMatch = null;
  let bestScore = 0;
  const entries = [
    ...products.map(product => ({
      page: 'parts',
      target: 'page-parts',
      anchor: '#product-grid',
      keywords: [product.name, product.model, product.category, product.alt].filter(Boolean)
    })),
    { page: 'home', target: 'page-home', anchor: '.hero', keywords: ['home', 'itech fix', 'phones', 'laptops', 'repair', 'gadget', 'device'] },
    { page: 'swap', target: 'page-swap', anchor: '#page-swap .page-header .container', keywords: ['buy phone', 'sell phone', 'swap phone', 'trade in', 'trade-in', 'scrap phone', 'sell laptop', 'swap laptop', 'buy gadget', 'sell gadget'] },
    { page: 'repairs', target: 'page-repairs', anchor: '#page-repairs .repair-service-grid', keywords: ['phone repair', 'screen replacement', 'charging port', 'battery replacement', 'software repair', 'water damage', 'network unlock', 'motherboard repair', 'ic repair'] },
    { page: 'laptops', target: 'page-laptops', anchor: '#laptop-repair-options', keywords: ['laptop repair', 'macbook', 'hp', 'dell', 'lenovo', 'gaming laptop', 'screen replacement', 'battery replacement', 'motherboard repair', 'fan cleaning', 'ssd', 'ram', 'keyboard repair'] },
    { page: 'gadgets', target: 'page-gadgets', anchor: '#page-gadgets .container.section-spacing > .grid.grid-3', keywords: ['gadget', 'accessory', 'ps5', 'controller', 'headset', 'charger', 'cable', 'tool', 'airpods', 'oled', 'game'] },
    { page: 'contact', target: 'page-contact', anchor: '#page-contact .contact-grid', keywords: ['contact', 'location', 'ile-ife', 'osun', 'whatsapp', 'visit', 'book a repair'] },
    { page: 'technicians', target: 'page-technicians', anchor: '#page-technicians .grid.grid-3', keywords: ['technician', 'parts supplier', 'service desk', 'tools', 'diagnostics', 'board repair'] }
  ];

  entries.forEach(entry => {
    (entry.keywords || []).forEach(keyword => {
      const normalizedKeyword = normalizeSearchText(keyword);
      if (!normalizedKeyword) return;

      let score = 0;
      if (normalizedQuery === normalizedKeyword) {
        score = 2000;
      } else if (normalizedQuery.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedQuery)) {
        score = 1000 + normalizedKeyword.length;
      } else if (normalizedQuery.split(' ').some(token => normalizedKeyword.includes(token))) {
        score = 250 + normalizedKeyword.length;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });
  });

  if (bestMatch && bestScore >= 200) {
    return bestMatch;
  }

  return null;
}

function performGlobalSearch() {
  const input = document.getElementById('global-search-input');
  const query = input ? input.value.trim() : '';

  if (!query) {
    input?.focus();
    return;
  }

  const match = getGlobalSearchMatch(query);
  if (!match) {
    window.alert('No matching product or repair service was found. Try a part name, model, or service keyword.');
    return;
  }

  showPage(match.page);

  requestAnimationFrame(() => {
    if (match.page === 'parts') {
      const searchInput = document.getElementById('product-search');
      if (searchInput) searchInput.value = query;

      const modelFilter = document.getElementById('model-filter');
      if (modelFilter) modelFilter.value = 'all';

      const categoryFilter = document.getElementById('category-filter');
      if (categoryFilter) categoryFilter.value = 'all';

      renderProducts();
      document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const anchor = match.anchor ? document.querySelector(match.anchor) : document.getElementById(match.target);
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    document.getElementById(match.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

const pageSearchState = {
  items: [],
  activeSuggestionIndex: -1,
  currentInput: null,
  open: false
};

function normalizeSearchTokens(value) {
  return normalizeSearchText(value).split(' ').filter(Boolean);
}

function getPageSearchEntries() {
  const pageMap = {
    home: 'page-home',
    repairs: 'page-repairs',
    parts: 'page-parts',
    phones: 'page-phones',
    laptops: 'page-laptops',
    gadgets: 'page-gadgets',
    technicians: 'page-technicians',
    contact: 'page-contact'
  };

  const entries = [];
  document.querySelectorAll('.product-card, .service-card, .showcase-card, .feature-card, .shop-product, .phone-service, .gadget-item').forEach(card => {
    const section = card.closest('.page-section');
    const title = card.querySelector('h3')?.textContent || card.querySelector('.showcase-title')?.textContent || card.textContent.trim().split(/\s+/).slice(0, 8).join(' ');
    if (!title) return;

    const pageId = section ? section.id.replace('page-', '') : 'home';
    entries.push({
      pageId,
      sectionId: section ? section.id : pageMap[pageId] || 'page-home',
      label: title,
      element: card,
      keywords: [title, card.textContent, section?.querySelector('h1')?.textContent || ''].filter(Boolean)
    });
  });

  return entries;
}

function refreshPageSearchIndex() {
  pageSearchState.items = getPageSearchEntries();
}

function createPageSearchWidget(container) {
  if (container.querySelector('.page-search-widget')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'page-search-widget';
  wrapper.innerHTML = `
    <div class="page-search-wrap">
      <input type="search" class="page-search-input" aria-label="Search products and services" placeholder="Search parts, repairs, gadgets..." />
      <button type="button" class="page-search-button">Search</button>
    </div>
    <div class="page-search-suggestions" aria-live="polite"></div>
  `;

  container.appendChild(wrapper);

  const input = wrapper.querySelector('.page-search-input');
  const suggestions = wrapper.querySelector('.page-search-suggestions');
  const button = wrapper.querySelector('.page-search-button');

  const updateSuggestions = () => {
    const query = normalizeSearchText(input.value);
    pageSearchState.activeSuggestionIndex = -1;
    if (!query) {
      suggestions.innerHTML = '';
      suggestions.classList.remove('visible');
      return;
    }

    const matches = pageSearchState.items
      .filter(item => {
        const haystack = normalizeSearchText([item.label, ...(item.keywords || [])].join(' '));
        const tokens = normalizeSearchTokens(query);
        return tokens.every(token => haystack.includes(token));
      })
      .slice(0, 6);

    if (!matches.length) {
      suggestions.innerHTML = '<div class="page-search-empty">No matching product or service found</div>';
      suggestions.classList.add('visible');
      return;
    }

    suggestions.innerHTML = matches.map((item, index) => `
      <button type="button" class="page-search-item" data-index="${index}" data-page="${item.pageId}">
        <span>${escapeHTML(item.label)}</span>
        <small>${escapeHTML(item.sectionId.replace('page-', ''))}</small>
      </button>
    `).join('');
    suggestions.classList.add('visible');

    suggestions.querySelectorAll('.page-search-item').forEach((itemButton) => {
      itemButton.addEventListener('click', () => {
        const selectedIndex = Number(itemButton.dataset.index);
        const picked = matches[selectedIndex];
        if (!picked) return;
        const section = document.getElementById(picked.sectionId);
        if (section) {
          showPage(picked.pageId);
          requestAnimationFrame(() => {
            picked.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
        input.value = picked.label;
        suggestions.classList.remove('visible');
      });
    });
  };

  input.addEventListener('input', updateSuggestions);
  input.addEventListener('focus', updateSuggestions);
  input.addEventListener('keydown', (event) => {
    const items = suggestions.querySelectorAll('.page-search-item');
    if (!items.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      pageSearchState.activeSuggestionIndex = Math.min(pageSearchState.activeSuggestionIndex + 1, items.length - 1);
      items[pageSearchState.activeSuggestionIndex]?.focus();
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      pageSearchState.activeSuggestionIndex = Math.max(pageSearchState.activeSuggestionIndex - 1, 0);
      items[pageSearchState.activeSuggestionIndex]?.focus();
    }

    if (event.key === 'Enter' && pageSearchState.activeSuggestionIndex >= 0) {
      event.preventDefault();
      items[pageSearchState.activeSuggestionIndex].click();
    }
  });

  button.addEventListener('click', () => {
    const query = normalizeSearchText(input.value);
    if (!query) {
      input.focus();
      return;
    }
    const match = pageSearchState.items.find(item => normalizeSearchText(item.label).includes(query)) || pageSearchState.items[0];
    if (!match) {
      window.alert('No matching product or repair service was found. Try a part name, model, or service keyword.');
      return;
    }

    showPage(match.pageId);
    requestAnimationFrame(() => {
      match.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  document.addEventListener('click', (event) => {
    if (!wrapper.contains(event.target)) {
      suggestions.classList.remove('visible');
    }
  });
}

function injectPageSearchBarForActivePage() {
  const activeSection = document.querySelector('.page-section.active');
  document.querySelectorAll('.page-search-widget').forEach(widget => widget.remove());

  if (!activeSection) return;

  const target =
    activeSection.querySelector('.page-header .container') ||
    activeSection.querySelector('.hero .container') ||
    activeSection.querySelector('.container');

  if (target) {
    createPageSearchWidget(target);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  refreshPageSearchIndex();
  injectPageSearchBarForActivePage();

  const form = document.getElementById('global-search-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    performGlobalSearch();
  });
});

// 1. Navigation Controller (Home, Phones, Laptops, Gadgets)
function toggleMenu() {
  const menu = document.getElementById('main-navigation');
  const toggle = document.getElementById('menu-toggle');
  const isOpen = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
}

function showPage(pageId) {
  const menu = document.getElementById('main-navigation');
  const toggle = document.getElementById('menu-toggle');
  menu.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation menu');

  // Hide all sections
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(sec => sec.classList.remove('active'));

  // Remove active from all nav buttons
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => btn.classList.remove('active'));

  // Show target section
  const targetSec = document.getElementById('page-' + pageId);
  if (targetSec) {
    targetSec.classList.add('active');
  }

  injectPageSearchBarForActivePage();

  // Set active nav button
  const targetNav = document.getElementById('nav-' + pageId);
  if (targetNav) {
    targetNav.classList.add('active');
  }

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showPageAndScroll(pageId, targetId) {
  showPage(pageId);
  requestAnimationFrame(() => {
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// 2. Homepage Instant Cost & Turnaround Estimator
function calculateEstimate() {
  const type = document.getElementById('estimator-type').value;
  const issue = document.getElementById('estimator-issue').value;
  const priceEl = document.getElementById('estimate-price');
  const timeEl = document.getElementById('estimate-time');

  if (type === 'phone') {
    if (issue === 'screen') {
      priceEl.textContent = formatNairaRange(49, 139);
      timeEl.textContent = '25 – 45 Minutes';
    } else if (issue === 'battery') {
      priceEl.textContent = formatNairaRange(35, 59);
      timeEl.textContent = '20 – 30 Minutes';
    } else if (issue === 'board') {
      priceEl.textContent = formatNairaRange(79, 149);
      timeEl.textContent = '1 – 2 Business Days';
    } else if (issue === 'water') {
      priceEl.textContent = formatNairaRange(45, 85);
      timeEl.textContent = '24 – 48 Hours';
    } else {
      priceEl.textContent = formatNairaRange(29, 49);
      timeEl.textContent = '30 – 60 Minutes';
    }
  } else {
    // Laptop
    if (issue === 'screen') {
      priceEl.textContent = formatNairaRange(89, 249);
      timeEl.textContent = '1 – 2 Business Days';
    } else if (issue === 'battery') {
      priceEl.textContent = formatNairaRange(59, 99);
      timeEl.textContent = '1 – 3 Hours';
    } else if (issue === 'board') {
      priceEl.textContent = formatNairaRange(99, 199);
      timeEl.textContent = '2 – 3 Business Days';
    } else if (issue === 'water') {
      priceEl.textContent = formatNairaRange(65, 120);
      timeEl.textContent = '24 – 48 Hours';
    } else {
      priceEl.textContent = formatNairaRange(39, 65);
      timeEl.textContent = '1 – 2 Hours';
    }
  }
}

// 3. Phones Page Filter
function filterPhoneServices(cat) {
  const btns = document.querySelectorAll('#page-phones .filter-btn');
  btns.forEach(b => b.classList.remove('active'));
  document.querySelector(`#page-phones .filter-btn[onclick="filterPhoneServices('${cat}')"]`)?.classList.add('active');

  const cards = document.querySelectorAll('.phone-service');
  cards.forEach(card => {
    if (cat === 'all' || card.getAttribute('data-cat') === cat) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// 4. Gadgets Page Filter
function filterGadgetProducts(cat) {
  const btns = document.querySelectorAll('#page-gadgets .filter-btn');
  btns.forEach(b => b.classList.remove('active'));
  document.querySelector(`#page-gadgets .filter-btn[onclick="filterGadgetProducts('${cat}')"]`)?.classList.add('active');

  const items = document.querySelectorAll('.gadget-item');
  items.forEach(item => {
    if (cat === 'all' || item.getAttribute('data-cat') === cat) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// 5. Modal Operations
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

// Close modal when clicking outside modal box
window.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});

// 6. Prefill and open booking modal
function bookSpecific(device, issue) {
  document.getElementById('book-device').value = device;
  const issueSelect = document.getElementById('book-issue');
  issueSelect.value = Array.from(issueSelect.options).some(option => option.value === issue) ? issue : 'Other specialized repair';
  openModal('book-modal');
}

// 7. Booking form submission
function submitBooking(e) {
  e.preventDefault();
  const ticketId = 'ITF-' + Math.floor(100000 + Math.random() * 900000);
  const name = document.getElementById('book-name').value;
  const device = document.getElementById('book-device').value;
  const issue = document.getElementById('book-issue').value;
  const phone = document.getElementById('book-phone').value;
  const method = document.getElementById('book-method').value;
  const date = document.getElementById('book-date').value;

  const message = `Hello ITECH Fix, I would like to book a phone repair.\n\nName: ${name}\nPhone/WhatsApp: ${phone}\nPhone model: ${device}\nProblem: ${issue}\nPreferred date: ${date}\nArea: ${method}\nTicket ID: ${ticketId}`;

  openManagerWhatsApp(message);
  closeModal('book-modal');
  e.target.reset();
}

function handlePurchase(productName) {
  const message = `Hello ITECH Fix, I would like to enquire about ${productName}.\n\nPlease confirm availability, final price, compatibility, and delivery or pickup options in Ile-Ife, Osun State.`;
  openManagerWhatsApp(message);
}

function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  const query = document.getElementById('product-search').value.trim().toLowerCase();
  const model = document.getElementById('model-filter').value;
  const category = document.getElementById('category-filter').value;
  const shopProducts = window.managedCatalogParts?.length
    ? products.filter(product => String(product.id).startsWith('managed-'))
    : products;
  const matches = shopProducts.filter(product => {
    const text = `${product.name} ${product.model} ${product.category}`.toLowerCase();
    return (!query || text.includes(query)) && (model === 'all' || product.model === model) && (category === 'all' || product.category === category);
  });
  document.getElementById('product-count').textContent = `${matches.length} ${matches.length === 1 ? 'part' : 'parts'}`;
  grid.innerHTML = matches.length ? matches.map(product => `
    <article class="product-card shop-product">
      <div class="product-photo"><img src="${escapeHTML(createProductImage(product))}" alt="${escapeHTML(product.alt)}" loading="lazy"></div>
      <div class="product-tag">${escapeHTML(product.category)}</div>
      <h3>${escapeHTML(product.name)}</h3>
      <p class="product-desc">Compatible with ${escapeHTML(product.model)}</p>
      <div class="shop-product-meta"><span class="stock-status ${product.stock === 'Available' ? 'in-stock' : 'check-stock'}">${escapeHTML(product.stock)}</span><span class="price">${formatNaira(product.price)}</span></div>
      <div class="shop-product-actions"><button class="btn btn-sm btn-outline" onclick='handlePurchase(${JSON.stringify(product.name).replace(/'/g, '&#39;')})'>WhatsApp</button><button class="btn btn-sm btn-primary" onclick='addToCart(${JSON.stringify(product.id).replace(/'/g, '&#39;')})'>Add to cart</button></div>
    </article>`).join('') : '<p class="no-products">No parts match those filters. Try another model or search term.</p>';
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function shopProducts() {
  return window.managedCatalogParts?.length
    ? products.filter(product => String(product.id).startsWith('managed-'))
    : products;
}

function addToCart(productId) {
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
}

function changeCartQuantity(productId, change) {
  const quantity = (cart.get(productId) || 0) + change;
  if (quantity < 1) cart.delete(productId);
  else cart.set(productId, quantity);
  renderCart();
}

function renderCart() {
  const items = document.getElementById('cart-items');
  if (!items) return;
  const count = Array.from(cart.values()).reduce((sum, quantity) => sum + quantity, 0);
  const total = shopProducts().reduce((sum, product) => sum + product.price * (cart.get(product.id) || 0), 0);
  document.getElementById('cart-count').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
  document.getElementById('cart-total').textContent = formatNaira(total);
  document.getElementById('checkout-button').disabled = count === 0;
  items.innerHTML = count ? shopProducts().filter(product => cart.has(product.id)).map(product => `
    <div class="cart-line"><div><strong>${escapeHTML(product.name)}</strong><span>${formatNaira(product.price)} each</span></div><div class="cart-quantity"><button aria-label="Remove one ${escapeHTML(product.name)}" onclick='changeCartQuantity(${JSON.stringify(product.id).replace(/'/g, '&#39;')}, -1)'>−</button><span>${cart.get(product.id)}</span><button aria-label="Add one ${escapeHTML(product.name)}" onclick='changeCartQuantity(${JSON.stringify(product.id).replace(/'/g, '&#39;')}, 1)'>+</button></div></div>`).join('') : '<p class="cart-empty">Your cart is empty.</p>';
}

function checkoutCart() {
  if (!cart.size) return;
  const orderLines = shopProducts().filter(product => cart.has(product.id)).map(product => `${cart.get(product.id)} × ${product.name} (${formatNaira(product.price)} each)`);
  const total = shopProducts().reduce((sum, product) => sum + product.price * (cart.get(product.id) || 0), 0);
  openManagerWhatsApp(`Hello ITECH Fix, I would like to order these parts:\n\n${orderLines.join('\n')}\n\nEstimated total: ${formatNaira(total)}\nPlease confirm stock, compatibility, final price, and delivery or pickup options.`);
}

// 8. Review Submission
function submitReview(e) {
  e.preventDefault();

  const name = document.getElementById('review-name').value.trim();
  const rating = Number(document.getElementById('review-rating').value);
  const message = document.getElementById('review-message').value.trim();

  if (!name || !message) return;

  const reviewGrid = document.getElementById('customer-reviews-grid');
  const newCard = document.createElement('div');
  newCard.className = 'review-card';

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  newCard.innerHTML = `
    <div class="stars">${stars}</div>
    <p>&ldquo;${message}&rdquo;</p>
    <div class="reviewer">— ${name}</div>
  `;

  reviewGrid.appendChild(newCard);
  e.target.reset();
}

// 9. Swap Calculator
function calculateSwapVal() {
  const baseVal = parseFloat(document.getElementById('swap-device-select').value);
  const condMult = parseFloat(document.getElementById('swap-cond-select').value);
  
  const cash = Math.round(baseVal * condMult * NGN_RATE);
  const credit = Math.round(cash * 1.15); // 15% trade in bonus

  document.getElementById('swap-cash').textContent = formatNaira(cash);
  document.getElementById('swap-credit').textContent = formatNaira(credit);
}

function initializeAdSense() {
  if (!/^ca-pub-\d{16}$/.test(ADSENSE_PUBLISHER_ID)) return;
  if (document.querySelector('script[data-adsense]')) return;

  const adsenseScript = document.createElement('script');
  adsenseScript.async = true;
  adsenseScript.crossOrigin = 'anonymous';
  adsenseScript.dataset.adsense = 'true';
  adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
  document.head.appendChild(adsenseScript);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initializeAdSense();
  calculateEstimate();
  calculateSwapVal();
  renderProducts();
  renderCart();
  document.getElementById('book-date').min = new Date().toISOString().split('T')[0];
});