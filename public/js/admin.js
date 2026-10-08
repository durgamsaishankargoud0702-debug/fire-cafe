/* Admin Dashboard Controller: Auth, Tabs & CRUD Operations */

let adminToken = localStorage.getItem('adminToken') || null;
let currentTab = 'overview';
let adminProducts = [];
let adminSeminars = [];
let adminWorkshops = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();

  // Tab click listeners
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Login form handler
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }

  // Logout button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logoutAdmin);
  }

  // Admin Search
  const adminSearch = document.getElementById('admin-search-input');
  if (adminSearch) {
    adminSearch.addEventListener('input', handleAdminSearch);
  }
});

function getAuthHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };
}

async function checkAdminAuth() {
  const loginModal = document.getElementById('admin-login-modal');
  const dashboardArea = document.getElementById('admin-dashboard-area');

  if (!adminToken) {
    if (loginModal) loginModal.classList.add('active');
    if (dashboardArea) dashboardArea.style.display = 'none';
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    const data = await res.json();
    if (data.success) {
      if (loginModal) loginModal.classList.remove('active');
      if (dashboardArea) dashboardArea.style.display = 'grid';
      const adminNameEl = document.getElementById('admin-user-name');
      if (adminNameEl) adminNameEl.textContent = data.admin.name || 'Admin';
      loadDashboardTab(currentTab);
    } else {
      logoutAdmin();
    }
  } catch (err) {
    console.error('Auth verification error:', err);
    logoutAdmin();
  }
}

async function handleAdminLogin(e) {
  e.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showToast('Enter email and password', 'warning');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.success) {
      adminToken = data.token;
      localStorage.setItem('adminToken', adminToken);
      showToast('Admin authentication successful!', 'success');
      checkAdminAuth();
    } else {
      showToast(data.message || 'Login failed', 'danger');
    }
  } catch (err) {
    showToast('Network error logging in', 'danger');
  }
}

function logoutAdmin() {
  adminToken = null;
  localStorage.removeItem('adminToken');
  const loginModal = document.getElementById('admin-login-modal');
  const dashboardArea = document.getElementById('admin-dashboard-area');
  if (loginModal) loginModal.classList.add('active');
  if (dashboardArea) dashboardArea.style.display = 'none';
  showToast('Logged out of admin dashboard', 'info');
}

function switchTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.sidebar-item').forEach(i => {
    i.classList.toggle('active', i.getAttribute('data-tab') === tabName);
  });
  loadDashboardTab(tabName);
}

function loadDashboardTab(tab) {
  const contentArea = document.getElementById('tab-content');
  if (!contentArea) return;

  if (tab === 'overview') loadOverviewTab(contentArea);
  else if (tab === 'products') loadProductsTab(contentArea);
  else if (tab === 'seminars') loadSeminarsTab(contentArea);
  else if (tab === 'workshops') loadWorkshopsTab(contentArea);
  else if (tab === 'registrations') loadRegistrationsTab(contentArea);
  else if (tab === 'consultancies') loadConsultanciesTab(contentArea);
  else if (tab === 'voluntary') loadVoluntaryTab(contentArea);
  else if (tab === 'contacts') loadContactsTab(contentArea);
}

// 1. OVERVIEW TAB
async function loadOverviewTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;

  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
    const data = await res.json();

    if (data.success) {
      const s = data.stats;
      container.innerHTML = `
        <h2 style="font-family: var(--font-heading); margin-bottom: 1.5rem;">Dashboard Overview</h2>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div>
              <div class="stat-number">${s.totalProducts}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">Total Products</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💼</div>
            <div>
              <div class="stat-number">${s.totalConsultancy}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">Consultancy Requests</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎤</div>
            <div>
              <div class="stat-number">${s.totalSeminars}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">Active Seminars</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🛠️</div>
            <div>
              <div class="stat-number">${s.totalWorkshops}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">Active Workshops</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div>
              <div class="stat-number">${s.totalRegistrations}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">Event Registrations</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🤝</div>
            <div>
              <div class="stat-number">${s.totalVoluntary}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">Volunteers</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📬</div>
            <div>
              <div class="stat-number">${s.totalContacts}</div>
              <div style="font-size:0.85rem; color:var(--text-secondary);">Contact Messages</div>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2.5rem;">
          <div class="card">
            <h3 class="card-title" style="margin-bottom: 1rem;">Recent Consultancies</h3>
            ${data.recent.consultancies.length > 0 ? data.recent.consultancies.map(c => `
              <div style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-glass);">
                <div style="display:flex; justify-content:space-between; font-weight:600;">
                  <span>${c.name} (${c.service})</span>
                  <span class="badge ${c.status === 'Completed' ? 'badge-success' : 'badge-warning'}">${c.status}</span>
                </div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">${c.email} • ${c.phone}</div>
              </div>
            `).join('') : '<p style="color:var(--text-secondary);">No recent consultancy requests.</p>'}
          </div>

          <div class="card">
            <h3 class="card-title" style="margin-bottom: 1rem;">Recent Contact Enquiries</h3>
            ${data.recent.contacts.length > 0 ? data.recent.contacts.map(m => `
              <div style="padding: 0.75rem 0; border-bottom: 1px solid var(--border-glass);">
                <div style="font-weight:600;">${m.name} - ${m.subject}</div>
                <div style="font-size:0.85rem; color:var(--text-secondary);">${m.email}</div>
              </div>
            `).join('') : '<p style="color:var(--text-secondary);">No recent messages.</p>'}
          </div>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading dashboard overview stats.</p>`;
  }
}

// 2. PRODUCTS TAB (CRUD)
async function loadProductsTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;

  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await res.json();
    if (data.success) {
      adminProducts = data.products;
      renderAdminProductsTable(container);
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading products table.</p>`;
  }
}

function renderAdminProductsTable(container) {
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
      <h2 style="font-family: var(--font-heading);">Product Management</h2>
      <button onclick="openProductCrudModal()" class="btn btn-primary btn-sm">+ Add New Product</button>
    </div>

    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${adminProducts.map(p => `
            <tr>
              <td><img src="${p.image}" alt="${p.name}" style="width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm);" /></td>
              <td style="font-weight: 600;">${p.name}</td>
              <td><span class="badge-tag" style="margin:0;">${p.category}</span></td>
              <td style="font-weight:700;">${formatCurrency(p.price)}</td>
              <td>${p.quantity}</td>
              <td><span class="badge ${p.available ? 'badge-success' : 'badge-danger'}">${p.available ? 'Available' : 'Unavailable'}</span></td>
              <td>
                <div style="display:flex; gap:0.5rem;">
                  <button onclick="openProductCrudModal('${p._id}')" class="btn btn-secondary btn-sm">Edit</button>
                  <button onclick="deleteProduct('${p._id}')" class="btn btn-danger btn-sm">Delete</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openProductCrudModal(productId = null) {
  const modal = document.getElementById('admin-crud-modal');
  const modalTitle = document.getElementById('crud-modal-title');
  const modalBody = document.getElementById('crud-modal-body');

  const product = productId ? adminProducts.find(p => p._id === productId) : null;

  modalTitle.textContent = product ? 'Edit Product' : 'Add New Product';

  modalBody.innerHTML = `
    <form id="product-crud-form" enctype="multipart/form-data">
      <input type="hidden" id="crud-prod-id" value="${product ? product._id : ''}">
      <div class="form-group">
        <label class="form-label">Product Name</label>
        <input type="text" id="crud-prod-name" class="form-control" value="${product ? product.name : ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <input type="text" id="crud-prod-category" class="form-control" value="${product ? product.category : 'General'}" required placeholder="e.g. Software, Hardware, Books">
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div class="form-group">
          <label class="form-label">Price ($ USD)</label>
          <input type="number" step="0.01" id="crud-prod-price" class="form-control" value="${product ? product.price : '0.00'}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity</label>
          <input type="number" id="crud-prod-quantity" class="form-control" value="${product ? product.quantity : 10}" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Image URL (Optional if uploading file)</label>
        <input type="text" id="crud-prod-image" class="form-control" value="${product ? product.image : ''}" placeholder="https://example.com/photo.jpg">
      </div>
      <div class="form-group">
        <label class="form-label">Or Upload Image File</label>
        <input type="file" id="crud-prod-file" class="form-control" accept="image/*">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea id="crud-prod-desc" class="form-control" required>${product ? product.description : ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Availability Status</label>
        <select id="crud-prod-available" class="form-select">
          <option value="true" ${!product || product.available ? 'selected' : ''}>Available / In Stock</option>
          <option value="false" ${product && !product.available ? 'selected' : ''}>Unavailable / Out of Stock</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 1rem;">${product ? 'Update Product' : 'Create Product'}</button>
    </form>
  `;

  document.getElementById('product-crud-form').addEventListener('submit', saveProduct);
  modal.classList.add('active');
}

async function saveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('crud-prod-id').value;
  const name = document.getElementById('crud-prod-name').value;
  const category = document.getElementById('crud-prod-category').value;
  const price = document.getElementById('crud-prod-price').value;
  const quantity = document.getElementById('crud-prod-quantity').value;
  const image = document.getElementById('crud-prod-image').value;
  const description = document.getElementById('crud-prod-desc').value;
  const available = document.getElementById('crud-prod-available').value;
  const fileInput = document.getElementById('crud-prod-file');

  const formData = new FormData();
  formData.append('name', name);
  formData.append('category', category);
  formData.append('price', price);
  formData.append('quantity', quantity);
  formData.append('description', description);
  formData.append('available', available);
  if (image) formData.append('image', image);
  if (fileInput.files[0]) formData.append('imageFile', fileInput.files[0]);

  const url = id ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      loadProductsTab(document.getElementById('tab-content'));
    } else {
      showToast(data.message || 'Error saving product', 'danger');
    }
  } catch (err) {
    showToast('Network error saving product', 'danger');
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadProductsTab(document.getElementById('tab-content'));
    } else {
      showToast(data.message, 'danger');
    }
  } catch (err) {
    showToast('Error deleting product', 'danger');
  }
}

// 3. SEMINARS TAB (CRUD)
async function loadSeminarsTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;

  try {
    const res = await fetch(`${API_BASE_URL}/seminars`);
    const data = await res.json();
    if (data.success) {
      adminSeminars = data.seminars;
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
          <h2 style="font-family: var(--font-heading);">Seminars Management</h2>
          <button onclick="openSeminarCrudModal()" class="btn btn-primary btn-sm">+ Add New Seminar</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date & Time</th>
                <th>Speaker</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${adminSeminars.map(s => `
                <tr>
                  <td style="font-weight:600;">${s.title}</td>
                  <td>${s.date} <br><span style="font-size:0.8rem; color:var(--text-muted);">${s.time}</span></td>
                  <td>${s.speaker}</td>
                  <td>${s.location}</td>
                  <td>
                    <button onclick="openSeminarCrudModal('${s._id}')" class="btn btn-secondary btn-sm">Edit</button>
                    <button onclick="deleteSeminar('${s._id}')" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading seminars.</p>`;
  }
}

function openSeminarCrudModal(seminarId = null) {
  const modal = document.getElementById('admin-crud-modal');
  const modalTitle = document.getElementById('crud-modal-title');
  const modalBody = document.getElementById('crud-modal-body');

  const seminar = seminarId ? adminSeminars.find(s => s._id === seminarId) : null;
  modalTitle.textContent = seminar ? 'Edit Seminar' : 'Add New Seminar';

  modalBody.innerHTML = `
    <form id="seminar-crud-form">
      <input type="hidden" id="crud-sem-id" value="${seminar ? seminar._id : ''}">
      <div class="form-group">
        <label class="form-label">Seminar Title</label>
        <input type="text" id="crud-sem-title" class="form-control" value="${seminar ? seminar.title : ''}" required>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="text" id="crud-sem-date" class="form-control" value="${seminar ? seminar.date : ''}" required placeholder="YYYY-MM-DD">
        </div>
        <div class="form-group">
          <label class="form-label">Time</label>
          <input type="text" id="crud-sem-time" class="form-control" value="${seminar ? seminar.time : ''}" required placeholder="10:00 AM EST">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Keynote Speaker</label>
        <input type="text" id="crud-sem-speaker" class="form-control" value="${seminar ? seminar.speaker : ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Location / Platform</label>
        <input type="text" id="crud-sem-location" class="form-control" value="${seminar ? seminar.location : ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Image URL</label>
        <input type="text" id="crud-sem-image" class="form-control" value="${seminar ? seminar.image : ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea id="crud-sem-desc" class="form-control" required>${seminar ? seminar.description : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">${seminar ? 'Update Seminar' : 'Create Seminar'}</button>
    </form>
  `;

  document.getElementById('seminar-crud-form').addEventListener('submit', saveSeminar);
  modal.classList.add('active');
}

async function saveSeminar(e) {
  e.preventDefault();

  const id = document.getElementById('crud-sem-id').value;
  const payload = {
    title: document.getElementById('crud-sem-title').value,
    date: document.getElementById('crud-sem-date').value,
    time: document.getElementById('crud-sem-time').value,
    speaker: document.getElementById('crud-sem-speaker').value,
    location: document.getElementById('crud-sem-location').value,
    image: document.getElementById('crud-sem-image').value,
    description: document.getElementById('crud-sem-desc').value
  };

  const url = id ? `${API_BASE_URL}/seminars/${id}` : `${API_BASE_URL}/seminars`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      loadSeminarsTab(document.getElementById('tab-content'));
    } else {
      showToast(data.message || 'Error saving seminar', 'danger');
    }
  } catch (err) {
    showToast('Network error saving seminar', 'danger');
  }
}

async function deleteSeminar(id) {
  if (!confirm('Are you sure you want to delete this seminar?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/seminars/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadSeminarsTab(document.getElementById('tab-content'));
    }
  } catch (err) {
    showToast('Error deleting seminar', 'danger');
  }
}

// 4. WORKSHOPS TAB (CRUD)
async function loadWorkshopsTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;

  try {
    const res = await fetch(`${API_BASE_URL}/workshops`);
    const data = await res.json();
    if (data.success) {
      adminWorkshops = data.workshops;
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 1.5rem;">
          <h2 style="font-family: var(--font-heading);">Workshops Management</h2>
          <button onclick="openWorkshopCrudModal()" class="btn btn-primary btn-sm">+ Add New Workshop</button>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date / Duration</th>
                <th>Instructor</th>
                <th>Seats Left</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${adminWorkshops.map(w => `
                <tr>
                  <td style="font-weight:600;">${w.title}</td>
                  <td>${w.date} <br><span style="font-size:0.8rem; color:var(--text-muted);">${w.duration}</span></td>
                  <td>${w.instructor}</td>
                  <td><span class="badge ${w.seats > 0 ? 'badge-success' : 'badge-warning'}">${w.seats}</span></td>
                  <td>${w.location}</td>
                  <td>
                    <button onclick="openWorkshopCrudModal('${w._id}')" class="btn btn-secondary btn-sm">Edit</button>
                    <button onclick="deleteWorkshop('${w._id}')" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading workshops.</p>`;
  }
}

function openWorkshopCrudModal(workshopId = null) {
  const modal = document.getElementById('admin-crud-modal');
  const modalTitle = document.getElementById('crud-modal-title');
  const modalBody = document.getElementById('crud-modal-body');

  const ws = workshopId ? adminWorkshops.find(w => w._id === workshopId) : null;
  modalTitle.textContent = ws ? 'Edit Workshop' : 'Add New Workshop';

  modalBody.innerHTML = `
    <form id="workshop-crud-form">
      <input type="hidden" id="crud-ws-id" value="${ws ? ws._id : ''}">
      <div class="form-group">
        <label class="form-label">Workshop Title</label>
        <input type="text" id="crud-ws-title" class="form-control" value="${ws ? ws.title : ''}" required>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
        <div class="form-group">
          <label class="form-label">Date</label>
          <input type="text" id="crud-ws-date" class="form-control" value="${ws ? ws.date : ''}" required placeholder="YYYY-MM-DD">
        </div>
        <div class="form-group">
          <label class="form-label">Duration</label>
          <input type="text" id="crud-ws-duration" class="form-control" value="${ws ? ws.duration : ''}" required placeholder="e.g. 1 Full Day">
        </div>
      </div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem;">
        <div class="form-group">
          <label class="form-label">Instructor</label>
          <input type="text" id="crud-ws-instructor" class="form-control" value="${ws ? ws.instructor : ''}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Available Seats</label>
          <input type="number" id="crud-ws-seats" class="form-control" value="${ws ? ws.seats : 20}" required>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" id="crud-ws-location" class="form-control" value="${ws ? ws.location : ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea id="crud-ws-desc" class="form-control" required>${ws ? ws.description : ''}</textarea>
      </div>
      <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">${ws ? 'Update Workshop' : 'Create Workshop'}</button>
    </form>
  `;

  document.getElementById('workshop-crud-form').addEventListener('submit', saveWorkshop);
  modal.classList.add('active');
}

async function saveWorkshop(e) {
  e.preventDefault();

  const id = document.getElementById('crud-ws-id').value;
  const payload = {
    title: document.getElementById('crud-ws-title').value,
    date: document.getElementById('crud-ws-date').value,
    duration: document.getElementById('crud-ws-duration').value,
    instructor: document.getElementById('crud-ws-instructor').value,
    seats: Number(document.getElementById('crud-ws-seats').value),
    location: document.getElementById('crud-ws-location').value,
    description: document.getElementById('crud-ws-desc').value
  };

  const url = id ? `${API_BASE_URL}/workshops/${id}` : `${API_BASE_URL}/workshops`;
  const method = id ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      loadWorkshopsTab(document.getElementById('tab-content'));
    }
  } catch (err) {
    showToast('Error saving workshop', 'danger');
  }
}

async function deleteWorkshop(id) {
  if (!confirm('Are you sure you want to delete this workshop?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/workshops/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadWorkshopsTab(document.getElementById('tab-content'));
    }
  } catch (err) {
    showToast('Error deleting workshop', 'danger');
  }
}

// 5. REGISTRATIONS TAB
async function loadRegistrationsTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API_BASE_URL}/registrations`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      container.innerHTML = `
        <h2 style="font-family: var(--font-heading); margin-bottom: 1.5rem;">Event Registrations</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Attendee Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event Title</th>
                <th>Type</th>
                <th>Date Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.registrations.map(r => `
                <tr>
                  <td style="font-weight:600;">${r.name}</td>
                  <td>${r.email}</td>
                  <td>${r.phone}</td>
                  <td>${r.eventTitle}</td>
                  <td><span class="badge ${r.type === 'workshop' ? 'badge-info' : 'badge-success'}">${r.type}</span></td>
                  <td>${formatDate(r.createdAt)}</td>
                  <td>
                    <button onclick="deleteRegistration('${r._id}')" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading registrations.</p>`;
  }
}

async function deleteRegistration(id) {
  if (!confirm('Delete this registration entry?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/registrations/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadRegistrationsTab(document.getElementById('tab-content'));
    }
  } catch (err) {
    showToast('Error deleting registration', 'danger');
  }
}

// 6. CONSULTANCIES TAB
async function loadConsultanciesTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API_BASE_URL}/consultancy`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      container.innerHTML = `
        <h2 style="font-family: var(--font-heading); margin-bottom: 1.5rem;">Consultancy Requests</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Contact Info</th>
                <th>Service Required</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.consultancies.map(c => `
                <tr>
                  <td style="font-weight:600;">${c.name}</td>
                  <td>${c.email}<br><span style="font-size:0.8rem; color:var(--text-muted);">${c.phone}</span></td>
                  <td>${c.service}</td>
                  <td style="max-width:250px; font-size:0.85rem;">${c.message}</td>
                  <td>
                    <select onchange="updateConsultancyStatus('${c._id}', this.value)" class="form-select" style="padding:0.3rem; font-size:0.8rem;">
                      <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
                      <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                      <option value="Completed" ${c.status === 'Completed' ? 'selected' : ''}>Completed</option>
                      <option value="Cancelled" ${c.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button onclick="deleteConsultancy('${c._id}')" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading consultancy requests.</p>`;
  }
}

async function updateConsultancyStatus(id, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/consultancy/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (data.success) showToast('Status updated successfully', 'success');
  } catch (err) {
    showToast('Error updating status', 'danger');
  }
}

async function deleteConsultancy(id) {
  if (!confirm('Delete this consultancy request?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/consultancy/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadConsultanciesTab(document.getElementById('tab-content'));
    }
  } catch (err) {
    showToast('Error deleting request', 'danger');
  }
}

// 7. VOLUNTARY TAB
async function loadVoluntaryTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API_BASE_URL}/voluntary`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      container.innerHTML = `
        <h2 style="font-family: var(--font-heading); margin-bottom: 1.5rem;">Community Volunteers</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Volunteer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Initiative</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.volunteers.map(v => `
                <tr>
                  <td style="font-weight:600;">${v.name}</td>
                  <td>${v.email}</td>
                  <td>${v.phone}</td>
                  <td>${v.initiative}</td>
                  <td>${v.availability}</td>
                  <td>
                    <button onclick="deleteVoluntary('${v._id}')" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading volunteers list.</p>`;
  }
}

async function deleteVoluntary(id) {
  if (!confirm('Delete volunteer sign-up?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/voluntary/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadVoluntaryTab(document.getElementById('tab-content'));
    }
  } catch (err) {
    showToast('Error deleting volunteer record', 'danger');
  }
}

// 8. CONTACTS TAB
async function loadContactsTab(container) {
  container.innerHTML = `<div class="spinner-container"><div class="spinner"></div></div>`;
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, { headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      container.innerHTML = `
        <h2 style="font-family: var(--font-heading); margin-bottom: 1.5rem;">Contact Form Messages</h2>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Contact info</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Received Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.contacts.map(c => `
                <tr>
                  <td style="font-weight:600;">${c.name}</td>
                  <td>${c.email}<br><span style="font-size:0.8rem; color:var(--text-muted);">${c.phone || 'N/A'}</span></td>
                  <td>${c.subject}</td>
                  <td style="max-width:300px; font-size:0.85rem;">${c.message}</td>
                  <td>${formatDate(c.createdAt)}</td>
                  <td>
                    <button onclick="deleteContact('${c._id}')" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  } catch (err) {
    container.innerHTML = `<p class="empty-state">Error loading contact messages.</p>`;
  }
}

async function deleteContact(id) {
  if (!confirm('Delete this message?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/contact/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      loadContactsTab(document.getElementById('tab-content'));
    }
  } catch (err) {
    showToast('Error deleting message', 'danger');
  }
}

function handleAdminSearch(e) {
  const term = e.target.value.toLowerCase().trim();
  const rows = document.querySelectorAll('.data-table tbody tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(term) ? '' : 'none';
  });
}
