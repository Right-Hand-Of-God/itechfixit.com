const catalogSections = {
  'home-showcase': ['#home-showcase-grid', 'showcase'],
  'phone-sales': ['#page-phones .phone-shop-section > .grid', 'product'],
  'phone-repairs': ['#page-repairs .repair-service-grid', 'service'],
  'laptop-sales': ['#page-laptops .section-spacing > .grid.grid-3:not(#laptop-repair-options)', 'product'],
  'laptop-repairs': ['#laptop-repair-options', 'service'],
  gadgets: ['#page-gadgets .container.section-spacing > .grid.grid-3', 'product'],
  'phone-parts': [null, 'part']
};

function catalogElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeCatalogCard(item, kind) {
  if (kind === 'showcase') {
    const card = catalogElement('article', 'showcase-card');
    const visual = catalogElement('div', 'showcase-image');
    const link = document.createElement('a');
    link.href = `#${item.target}`;
    link.setAttribute('aria-label', `${item.title} — view listings`);
    link.addEventListener('click', event => {
      event.preventDefault();
      if (item.target === 'laptops' && /repair/i.test(item.title)) {
        showPageAndScroll('laptops', 'laptop-repair-options');
      } else {
        showPage(item.target);
      }
    });
    if (item.image) {
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.title;
      image.loading = 'lazy';
      link.append(image);
    }
    visual.append(link);
    card.append(visual, catalogElement('h3', '', item.title), catalogElement('p', '', item.description));
    return card;
  }

  const className = kind === 'service'
    ? `service-card${item.category === 'phone-repairs' ? ' phone-service' : ''}`
    : `product-card${item.category === 'gadgets' ? ' gadget-item' : ''}`;
  const card = catalogElement('article', className);
  if (item.category === 'phone-repairs') {
    card.dataset.cat = /software|network|unlock/i.test(item.title) ? 'software' : 'hardware';
  }
  if (item.category === 'gadgets') {
    card.dataset.cat = item.part_category === 'Tools'
      ? 'tools'
      : /ps5|gaming|controller|headset/i.test(item.title)
        ? 'gaming'
        : /charger|cable/i.test(item.title)
          ? 'chargers'
          : /service|renewal/i.test(item.title)
            ? 'service'
            : 'parts';
  }
  if (item.image) {
    const visual = catalogElement('div', kind === 'service' ? 'service-visual' : 'product-visual');
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.title;
    image.loading = 'lazy';
    visual.append(image);
    card.append(visual);
  }

  if (kind === 'service') {
    const head = catalogElement('div', 'service-head');
    head.append(
      catalogElement('span', 'service-icon', item.category.startsWith('laptop') ? '💻' : '📱'),
      catalogElement('span', 'service-price', item.price || 'Ask for a quote')
    );
    card.append(head, catalogElement('h3', '', item.title), catalogElement('p', '', item.description));
  } else {
    card.append(
      catalogElement('div', 'product-tag', item.model || 'Available to order'),
      catalogElement('h3', '', item.title),
      catalogElement('p', 'product-desc', item.description)
    );
    if (item.stock) card.append(catalogElement('p', 'product-desc', `Availability: ${item.stock}`));
  }

  const footer = catalogElement('div', 'product-foot');
  footer.append(catalogElement('span', 'price', item.price || 'Ask for current price'));
  const button = catalogElement('button', 'btn btn-sm btn-primary', kind === 'service' ? 'Enquire / Book' : 'Order via WhatsApp');
  button.type = 'button';
  button.addEventListener('click', () => {
    const details = [item.title, item.model && `Model: ${item.model}`, item.description].filter(Boolean).join(' — ');
    handlePurchase(details);
  });
  footer.append(button);
  card.append(footer);
  return card;
}

async function loadEditableCatalog() {
  try {
    let items;
    if (window.itechSupabase?.isConfigured()) {
      items = await window.itechSupabase.fetchItems();
    } else {
      const response = await fetch('/api/items', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Catalog request failed (${response.status}).`);
      items = await response.json();
    }
    if (!Array.isArray(items)) throw new Error('Catalog response has an invalid format.');

    for (const [category, [selector, kind]] of Object.entries(catalogSections)) {
      const matchingItems = items.filter(item => item.category === category);
      if (!matchingItems.length) continue;
      if (kind === 'part') {
        window.managedCatalogParts = matchingItems;
        for (const item of matchingItems) {
          products.push({
            id: `managed-${item.id}`,
            name: item.title,
            model: item.model || 'Universal',
            category: item.part_category,
            price: Number(String(item.price || '').replace(/[^\d.]/g, '')) || 0,
            stock: item.stock || 'Check stock',
            image: item.image || '',
            alt: item.title
          });
        }
        const modelFilter = document.getElementById('model-filter');
        const models = [...new Set(matchingItems.map(item => item.model).filter(Boolean))];
        for (const model of models) {
          if ([...modelFilter.options].some(option => option.value === model)) continue;
          const option = document.createElement('option');
          option.value = model;
          option.textContent = model;
          modelFilter.append(option);
        }
        renderProducts();
        renderCart();
        continue;
      }
      const container = document.querySelector(selector);
      if (!container) continue;
      container.replaceChildren(...matchingItems.map(item => makeCatalogCard(item, kind)));
      if (category === 'phone-repairs') {
        const phonePageGrid = document.querySelector('#page-phones > .container.section-spacing > .grid.grid-3');
        if (phonePageGrid) {
          phonePageGrid.replaceChildren(...matchingItems.map(item => makeCatalogCard(item, kind)));
        }
      }
    }
  } catch (error) {
    console.error('Could not load editable catalog content:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadEditableCatalog);
