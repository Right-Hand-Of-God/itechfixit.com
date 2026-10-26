const dashboard = document.getElementById('dashboard');
const loginPanel = document.getElementById('login-panel');
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
const recoveryForm = document.getElementById('recovery-form');
const recoveryMessage = document.getElementById('recovery-message');
const supabase = window.itechSupabase;
const logoutButton = document.getElementById('logout-button');
const itemForm = document.getElementById('item-form');
const listingList = document.getElementById('listing-list');
const formMessage = document.getElementById('form-message');
let editingId = null;

const categoryNames = {
  'phone-sales': 'Phone sales',
  'phone-repairs': 'Phone repairs',
  'laptop-sales': 'Laptop sales',
  'laptop-repairs': 'Laptop repairs',
  gadgets: 'Gadgets & accessories',
  'phone-parts': 'Phone spare parts',
  'home-showcase': 'Homepage highlights'
};

async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(path, { credentials: 'same-origin', ...options });
  } catch {
    throw new Error('The local server is unavailable. Start it with start-local.bat and try again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}

async function initialize() {
  dashboard.hidden = true;
  loginPanel.hidden = true;
  document.getElementById('server-retry').hidden = true;
  formMessage.textContent = '';
  const useSupabase = supabase.isConfigured();
  document.getElementById('show-recovery').hidden = !useSupabase;
  document.getElementById('admin-password-label').textContent =
    useSupabase ? 'Password' : 'Administrator password';
  document.getElementById('login-help').textContent = useSupabase
    ? 'Enter the administrator password to manage catalog listings.'
    : 'Sign in with the local administrator password to manage catalog listings.';
  if (window.location.protocol === 'file:' && !useSupabase) {
    loginPanel.hidden = false;
    loginForm.hidden = true;
    loginMessage.textContent =
      'The admin page was opened as a file, so it cannot reach the catalog. Start the local server with start-local.bat, then open http://127.0.0.1:8765/admin.';
    return;
  }
  if (!useSupabase && !['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    showLogin(
      'The online catalog is not configured. Add your Supabase project URL and anon key to supabase-config.js.'
    );
    loginForm.hidden = true;
    return;
  }
  if (useSupabase && !supabase.adminEmail()) {
    showLogin('The administrator email is not configured in supabase-config.js.');
    loginForm.hidden = true;
    return;
  }
  try {
    if (useSupabase) {
      const session = await supabase.currentSession();
      if (
        session?.user?.email?.toLowerCase() === supabase.adminEmail().toLowerCase()
        && await supabase.isAdmin()
      ) {
        await showDashboard();
      } else {
        if (session) await supabase.signOut();
        showLogin();
      }
      return;
    }
    const status = await api('/api/status');
    if (status.authenticated) {
      await showDashboard();
    } else {
      showLogin();
    }
  } catch (error) {
    showLogin(error.message);
    document.getElementById('server-retry').hidden = false;
  }
}

function showLogin(message = '') {
  loginPanel.hidden = false;
  loginForm.hidden = false;
  recoveryForm.hidden = true;
  loginMessage.textContent = message;
  dashboard.hidden = true;
  logoutButton.hidden = true;
}

async function showDashboard() {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  logoutButton.hidden = false;
  document.getElementById('editor-label').textContent =
    supabase.isConfigured() ? 'Supabase catalog' : 'Local editor';
  try {
    await refreshListings();
  } catch (error) {
    formMessage.textContent = `Listings could not be loaded: ${error.message}`;
    document.getElementById('server-retry').hidden = false;
  }
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginMessage.textContent = '';
  const submitButton = loginForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    if (supabase.isConfigured()) {
      const session = await supabase.signIn(document.getElementById('admin-password').value);
      if (
        session.user?.email?.toLowerCase() !== supabase.adminEmail().toLowerCase()
        || !await supabase.isAdmin()
      ) {
        await supabase.signOut();
        throw new Error('This account is not authorized to manage the catalog.');
      }
    } else {
      await api('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: document.getElementById('admin-password').value })
      });
    }
    loginForm.reset();
    await showDashboard();
  } catch (error) {
    loginMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

document.getElementById('show-recovery').addEventListener('click', () => {
  loginForm.hidden = true;
  recoveryForm.hidden = false;
  document.getElementById('recovery-email').value = supabase.adminEmail();
  recoveryMessage.textContent = '';
});

document.getElementById('back-to-login').addEventListener('click', () => {
  recoveryForm.reset();
  document.getElementById('recovery-code-fields').hidden = true;
  recoveryForm.hidden = true;
  loginForm.hidden = false;
});

document.getElementById('send-recovery-code').addEventListener('click', async event => {
  const button = event.currentTarget;
  const recoveryEmail = document.getElementById('recovery-email');
  if (!recoveryEmail.reportValidity()) return;
  recoveryMessage.textContent = '';
  button.disabled = true;
  try {
    await supabase.sendRecoveryOtp(recoveryEmail.value);
    document.getElementById('recovery-code-fields').hidden = false;
    recoveryMessage.textContent = 'If the address is authorized, an OTP has been sent. Check your inbox.';
  } catch (error) {
    recoveryMessage.textContent = error.message;
  } finally {
    button.disabled = false;
  }
});

recoveryForm.addEventListener('submit', async event => {
  event.preventDefault();
  recoveryMessage.textContent = '';
  const submitButton = document.getElementById('reset-password-button');
  const password = document.getElementById('recovery-password').value;
  if (password !== document.getElementById('recovery-password-confirm').value) {
    recoveryMessage.textContent = 'The passwords do not match.';
    return;
  }
  submitButton.disabled = true;
  try {
    await supabase.resetPasswordWithOtp(
      document.getElementById('recovery-email').value,
      document.getElementById('recovery-otp').value,
      password
    );
    recoveryForm.reset();
    document.getElementById('recovery-code-fields').hidden = true;
    recoveryForm.hidden = true;
    loginForm.hidden = false;
    document.getElementById('admin-password').value = '';
    loginMessage.textContent = 'Password reset. Sign in with your new password.';
  } catch (error) {
    recoveryMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    if (supabase.isConfigured()) await supabase.signOut();
    else await api('/api/logout', { method: 'POST' });
    showLogin('You have signed out.');
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

async function refreshListings() {
  const items = supabase.isConfigured()
    ? await supabase.fetchItems(true)
    : await api('/api/admin/items');
  listingList.replaceChildren();
  document.getElementById('dashboard-count').textContent =
    `${items.length} ${items.length === 1 ? 'listing' : 'listings'}`;
  if (!items.length) {
    const message = document.createElement('p');
    message.className = 'hint';
    if (supabase.isConfigured()) {
      message.textContent =
        'This Supabase catalog is empty. Existing local listings are not copied automatically. Follow the migration steps in SUPABASE-SETUP.md to import them.';
    } else {
      message.textContent =
        'No listings yet. Add one above to publish it to the matching storefront section.';
    }
    listingList.append(message);
    return;
  }

  for (const item of items) {
    const row = document.createElement('article');
    row.className = 'listing';
    const image = document.createElement('img');
    image.alt = '';
    image.src = item.image || '';
    image.hidden = !item.image;
    const details = document.createElement('div');
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = categoryNames[item.category] || item.category;
    const title = document.createElement('h3');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = [
      item.price,
      item.model,
      item.stock,
      item.visible ? '' : 'Hidden',
      item.description
    ].filter(Boolean).join(' · ');
    details.append(badge, title, description);
    const actions = document.createElement('div');
    actions.className = 'listing-actions';
    const edit = document.createElement('button');
    edit.className = 'secondary';
    edit.type = 'button';
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => editListing(item));
    const remove = document.createElement('button');
    remove.className = 'danger';
    remove.type = 'button';
    remove.textContent = 'Delete';
    remove.addEventListener('click', () => deleteListing(item));
    actions.append(edit, remove);
    row.append(image, details, actions);
    listingList.append(row);
  }
}

function editListing(item) {
  editingId = item.id;
  document.getElementById('editor-title').textContent = 'Edit listing';
  document.getElementById('category').value = item.category;
  document.getElementById('title').value = item.title;
  document.getElementById('description').value = item.description;
  document.getElementById('price').value = item.price;
  document.getElementById('model').value = item.model;
  document.getElementById('part-category').value = item.part_category;
  document.getElementById('target').value = item.target;
  document.getElementById('stock').value = item.stock;
  document.getElementById('visible').checked = Boolean(item.visible);
  document.getElementById('image-file').value = '';
  itemForm.dataset.image = item.image;
  syncEditorForCategory();
  document.getElementById('cancel-edit').hidden = false;
  document.getElementById('save-button').textContent = 'Update listing';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function syncEditorForCategory() {
  const section = document.getElementById('category').value;
  const partCategoryField = document.getElementById('part-category').closest('label');
  const targetField = document.getElementById('target').closest('label');
  const target = document.getElementById('target');

  if (section === 'phone-parts') {
    partCategoryField.hidden = false;
    target.value = 'phones';
  } else {
    partCategoryField.hidden = true;
    if (section === 'phone-sales') target.value = 'phones';
    else if (section === 'phone-repairs') target.value = 'repairs';
    else if (section === 'laptop-sales' || section === 'laptop-repairs') target.value = 'laptops';
    else if (section === 'gadgets') target.value = 'gadgets';
    else target.value = 'phones';
  }

  if (targetField) {
    targetField.hidden = section === 'home-showcase';
  }
}

function resetEditor() {
  editingId = null;
  itemForm.reset();
  itemForm.dataset.image = '';
  document.getElementById('visible').checked = true;
  document.getElementById('part-category').value = 'Accessories';
  document.getElementById('target').value = 'phones';
  syncEditorForCategory();
  document.getElementById('editor-title').textContent = 'Add a listing';
  document.getElementById('cancel-edit').hidden = true;
  document.getElementById('save-button').textContent = 'Save listing';
  formMessage.textContent = '';
  formMessage.className = '';
}

document.getElementById('category').addEventListener('change', syncEditorForCategory);

document.getElementById('server-retry').addEventListener('click', initialize);
async function uploadImage(file) {
  if (supabase.isConfigured()) return supabase.uploadImage(file);
  const upload = new FormData();
  upload.append('image', file);
  const result = await api('/api/upload', { method: 'POST', body: upload });
  return result.image;
}

itemForm.addEventListener('submit', async event => {
  event.preventDefault();
  formMessage.textContent = '';
  formMessage.className = '';
  const saveButton = document.getElementById('save-button');
  saveButton.disabled = true;
  try {
    let image = itemForm.dataset.image || '';
    const file = document.getElementById('image-file').files[0];
    if (file) {
      image = await uploadImage(file);
    }
    const listing = {
      category: document.getElementById('category').value,
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      price: document.getElementById('price').value,
      model: document.getElementById('model').value,
      part_category: document.getElementById('part-category').value,
      target: document.getElementById('target').value,
      stock: document.getElementById('stock').value,
      image,
      visible: document.getElementById('visible').checked
    };
    if (supabase.isConfigured()) {
      await supabase.saveItem(listing, editingId);
    } else {
      await api(editingId ? `/api/items/${editingId}` : '/api/items', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      });
    }
    resetEditor();
    formMessage.textContent = 'Listing saved. It is now available in its storefront section.';
    formMessage.className = 'success';
    await refreshListings();
  } catch (error) {
    formMessage.textContent = error.message;
  } finally {
    saveButton.disabled = false;
  }
});

document.getElementById('cancel-edit').addEventListener('click', resetEditor);

syncEditorForCategory();

async function deleteListing(item) {
  if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
  try {
    if (supabase.isConfigured()) await supabase.deleteItem(item.id);
    else await api(`/api/items/${item.id}`, { method: 'DELETE' });
    await refreshListings();
  } catch (error) {
    window.alert(error.message);
  }
}

initialize();
