/* Home Page dynamic content loaders - G. Sindhura Reddy Gogulamudi */
document.addEventListener('DOMContentLoaded', () => {
  loadFeaturedProducts();
  loadFeaturedSeminars();
});

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/products?limit=3`);
    const data = await res.json();

    if (data.success && data.products.length > 0) {
      container.innerHTML = data.products.slice(0, 3).map(product => `
        <div class="card product-card reveal">
          <div class="product-img-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-img" />
            <span class="product-tag">${product.category}</span>
          </div>
          <div class="product-body">
            <h3 class="card-title" style="font-size: 1.25rem;">${product.name}</h3>
            <p class="card-text">${product.description.length > 100 ? product.description.substring(0, 100) + '...' : product.description}</p>
            <div class="product-meta">
              <span class="product-price" style="font-size: 0.9rem; color: #818cf8; font-weight: 600;">Formulation Prototype</span>
              <a href="products.html" class="btn btn-outline btn-sm">View Details</a>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="empty-state">No featured food product developments available at the moment.</p>';
    }
  } catch (err) {
    console.error('Error loading featured products:', err);
    container.innerHTML = '<p class="empty-state">Unable to load featured products.</p>';
  }
}

async function loadFeaturedSeminars() {
  const container = document.getElementById('home-seminars-container');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/seminars`);
    const data = await res.json();

    if (data.success && data.seminars.length > 0) {
      container.innerHTML = data.seminars.slice(0, 3).map(seminar => `
        <div class="card reveal">
          <div style="height: 180px; margin: -2rem -2rem 1.5rem; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
            <img src="${seminar.image}" alt="${seminar.title}" style="width:100%; height:100%; object-fit:cover;" />
          </div>
          <span class="badge-tag" style="width: fit-content;">📅 ${seminar.date}</span>
          <h3 class="card-title" style="font-size: 1.15rem; margin-top: 0.5rem;">${seminar.title}</h3>
          <p class="card-text" style="font-size: 0.9rem;">${seminar.description.length > 100 ? seminar.description.substring(0, 100) + '...' : seminar.description}</p>
          <div style="margin-top: 1rem; border-top: 1px solid var(--border-glass); padding-top: 1rem;">
            <p style="font-size: 0.85rem; color: var(--text-secondary);"><strong>Speaker:</strong> ${seminar.speaker}</p>
            <a href="seminars.html" class="btn btn-primary btn-sm" style="margin-top: 1rem; width: 100%;">View Seminar & Register</a>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p class="empty-state">No upcoming seminars scheduled.</p>';
    }
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Unable to load seminars.</p>';
  }
}

