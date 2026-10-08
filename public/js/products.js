/* Products Page scripts: Food Product Development Showcase */
let allProducts = [];

const defaultFoodCategories = [
  'All',
  'Millet-Based Foods',
  'Functional Foods',
  'High-Protein Foods',
  'Bakery Products',
  'Extruded Products',
  'Processed Foods',
  'Nutrition-Focused Products'
];

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();

  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');

  if (searchInput) searchInput.addEventListener('input', filterAndRenderProducts);
  if (categoryFilter) categoryFilter.addEventListener('change', filterAndRenderProducts);
});

async function fetchProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await res.json();

    if (data.success && data.products.length > 0) {
      allProducts = data.products;
      populateCategories(data.categories || []);
      filterAndRenderProducts();
    } else {
      // Fallback static data if backend returns empty
      allProducts = getFallbackFoodProducts();
      populateCategories(defaultFoodCategories);
      filterAndRenderProducts();
    }
  } catch (err) {
    console.error('Fetch products error:', err);
    allProducts = getFallbackFoodProducts();
    populateCategories(defaultFoodCategories);
    filterAndRenderProducts();
  }
}

function getFallbackFoodProducts() {
  return [
    {
      _id: 'p1',
      name: 'Multigrain High-Protein Biscuits',
      category: 'High-Protein Foods',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
      description: 'Development of multigrain biscuits enriched with pulses, millets, and plant-based protein isolates to combat malnutrition.',
      focus: 'High-protein and nutrition-rich food development.',
      objective: 'Formulate a shelf-stable, protein-fortified snack accessible for nutrition initiatives.',
      processing: 'Blended pulse flour dough kneading, temperature-controlled baking, non-thermal preservation.',
      quality: 'Physico-chemical analysis, moisture retention testing, texture profile analysis (TPA).',
      nutrition: 'Rich in dietary protein (18%+), complex carbohydrates, and micro-nutrients.'
    },
    {
      _id: 'p2',
      name: 'Nutrition-Rich Indian Flat Bread',
      category: 'Bakery Products',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80',
      description: 'Multigrain and millet-fortified flatbread (chapati/roti) mix engineered for high dietary fiber and enhanced bioavailability.',
      focus: 'Multigrain and nutrition-focused product development.',
      objective: 'Enhance staple Indian flatbread with finger millet and chickpea flour fortificants.',
      processing: 'Controlled milling, composite grain ratio optimization, sensory dough rheology.',
      quality: 'Puffing quality index, water absorption capacity, sensory panel acceptance score.',
      nutrition: 'High dietary fiber, essential amino acids, low glycemic response.'
    },
    {
      _id: 'p3',
      name: 'Instant Ragi Meal & Breakfast Mix',
      category: 'Millet-Based Foods',
      image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=800&auto=format&fit=crop&q=80',
      description: 'Instantized finger millet breakfast mix with high calcium retention, fast reconstitution, and natural prebiotic fiber.',
      focus: 'Millet-based food innovation.',
      objective: 'Formulate convenient instant ragi porridge requiring under 2 minutes hot water reconstitution.',
      processing: 'Pre-gelatinization, steam conditioning, vacuum drying, particle size classification.',
      quality: 'Solubility index, dispersion time, microbial stability, organoleptic scoring.',
      nutrition: 'Rich in elemental calcium (344mg/100g), natural dietary fiber, antioxidant polyphenols.'
    },
    {
      _id: 'p4',
      name: 'Nutritional Fruit & Pulse Beverages',
      category: 'Processed Foods',
      image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?w=800&auto=format&fit=crop&q=80',
      description: 'Functional beverages blending fruit juices with pulse extracts and plant protein isolates for refreshing nutrition.',
      focus: 'Nutrition-focused beverage development.',
      objective: 'Develop shelf-stable plant-based functional beverages without artificial preservers.',
      processing: 'Ultrasonic pasteurization, enzymatic clarification, aseptic bottling.',
      quality: 'Brix evaluation, acidity control, sedimentation index, accelerated shelf-life studies.',
      nutrition: 'High vitamin C, polyphenol antioxidants, plant bioactives.'
    },
    {
      _id: 'p5',
      name: 'Extruded Finger Millet Shells',
      category: 'Extruded Products',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
      description: 'Cereal-millet-pulse extruded snack shells enriched with protein and carotenoids evaluated for crispness and sorption.',
      focus: 'Protein and carotenoid enrichment.',
      objective: 'Optimize twin-screw extrusion parameters for finger millet and pulse formulations.',
      processing: 'High-shear twin-screw extrusion, die geometry control, moisture sorption monitoring.',
      quality: 'Expansion ratio, bulk density, crispness Index, carotenoid retention testing.',
      nutrition: 'Fortified with natural carotenoids, protein, and micro-minerals.'
    },
    {
      _id: 'p6',
      name: 'Solar Dried Organic Fruit Bars',
      category: 'Functional Foods',
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
      description: 'Organic fruit bars developed using eco-friendly solar drying technology and non-thermal pretreatments.',
      focus: 'Solar drying technology and product development.',
      objective: 'Convert seasonal fruit gluts into value-added nutrient-dense fruit bars.',
      processing: 'Solar cabinet drying, ascorbic acid dipping pretreatment, hygienic compaction.',
      quality: 'Water activity (aw < 0.6), microbial load testing, browning index determination.',
      nutrition: 'Concentrated natural fruit sugars, dietary fiber, beta-carotene.'
    }
  ];
}

function populateCategories(categories) {
  const select = document.getElementById('category-filter');
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = '';

  const mergedCategories = [...new Set([...defaultFoodCategories, ...categories.filter(Boolean)])];

  mergedCategories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat === 'All' ? 'All Categories' : cat;
    select.appendChild(opt);
  });

  if (mergedCategories.includes(currentVal)) {
    select.value = currentVal;
  }
}

function filterAndRenderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const searchVal = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
  const categoryVal = document.getElementById('category-filter')?.value || 'All';

  let filtered = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal) ||
                          p.description.toLowerCase().includes(searchVal) ||
                          (p.category && p.category.toLowerCase().includes(searchVal)) ||
                          (p.focus && p.focus.toLowerCase().includes(searchVal));
    const matchesCat = categoryVal === 'All' || (p.category && p.category.toLowerCase() === categoryVal.toLowerCase());
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon">🌾</div>
        <h3>No Formulations Found</h3>
        <p>Try adjusting your search criteria or category filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="card product-card reveal" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div class="product-img-wrapper">
          <img src="${p.image}" alt="${p.name}" class="product-img" />
          <span class="product-tag">${p.category || 'Food Technology'}</span>
        </div>
        <div class="product-body" style="padding: 1.5rem 1.5rem 1rem;">
          <h3 class="card-title" style="font-size: 1.25rem; line-height: 1.3;">${p.name}</h3>
          <p class="card-text" style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">${p.description}</p>
          
          <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); padding: 0.6rem 0.85rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
            <strong style="font-size: 0.8rem; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.2rem;">Key Focus:</strong>
            <span style="font-size: 0.88rem; color: var(--text-primary); font-weight: 500;">${p.focus || 'Nutrition-focused food product development.'}</span>
          </div>
        </div>
      </div>

      <div style="padding: 0 1.5rem 1.5rem; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-glass); padding-top: 1rem; margin-top: auto;">
        <span style="font-size: 0.82rem; font-weight: 600; color: #34d399; background: rgba(16, 185, 129, 0.12); padding: 0.25rem 0.65rem; border-radius: var(--radius-full); border: 1px solid rgba(16, 185, 129, 0.3);">
          Developed Prototype
        </span>
        <button onclick="openProductModal('${p._id}')" class="btn btn-primary btn-sm">View Details →</button>
      </div>
    </div>
  `).join('');
}

function openProductModal(productId) {
  const product = allProducts.find(p => p._id === productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('product-modal-body');
  if (!modal || !modalBody) return;

  const objective = product.objective || 'Formulate nutrient-dense, shelf-stable food products using optimized processing techniques.';
  const processing = product.processing || 'Processing optimization, thermal/non-thermal parameter control, pilot benchtop trials.';
  const quality = product.quality || 'Physico-chemical analysis, microbiological testing, sensory evaluation, and shelf-life assessment.';
  const nutrition = product.nutrition || 'Enriched with dietary fiber, natural proteins, and bioactive micronutrients.';

  modalBody.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 2rem; align-items: start;">
      <div>
        <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius: var(--radius-md); max-height: 320px; object-fit: cover; margin-bottom: 1rem; border: 1px solid var(--border-glass);" />
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.75rem 1rem; border-radius: var(--radius-md); text-align: center;">
          <span style="font-size: 0.85rem; font-weight: 700; color: #34d399; text-transform: uppercase;">Status: Product Development / R&D Prototype</span>
        </div>
      </div>
      <div>
        <span class="badge-tag">${product.category || 'Functional Foods'}</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.75rem; color: var(--text-primary); margin: 0.4rem 0 1rem; line-height: 1.2;">${product.name}</h2>
        
        <p style="color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 0.95rem; line-height: 1.6;">${product.description}</p>
        
        <div style="display: grid; gap: 0.85rem; margin-bottom: 1.5rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <strong style="font-size: 0.82rem; color: #818cf8; text-transform: uppercase;">Development Objective:</strong>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin-top: 0.25rem;">${objective}</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <strong style="font-size: 0.82rem; color: #06b6d4; text-transform: uppercase;">Processing Approach:</strong>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin-top: 0.25rem;">${processing}</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <strong style="font-size: 0.82rem; color: #10b981; text-transform: uppercase;">Quality & Sensory Evaluation:</strong>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin-top: 0.25rem;">${quality}</p>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <strong style="font-size: 0.82rem; color: #fbbf24; text-transform: uppercase;">Nutritional Focus:</strong>
            <p style="font-size: 0.9rem; color: var(--text-primary); margin-top: 0.25rem;">${nutrition}</p>
          </div>
        </div>

        <a href="consultancy.html" class="btn btn-primary btn-lg" style="width: 100%; text-align: center;">Inquire for R&D / Collaboration →</a>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeModal() {
  document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
}

