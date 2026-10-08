/* Portfolio Page Interactive Scripts - G. Sindhura Reddy Gogulamudi */
const portfolioProjects = [
  {
    id: 1,
    title: 'Vacuum-Fried Food Product Development',
    category: 'Food Processing & R&D',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    description: 'Optimization of frying parameters, raw material evaluation, quality & sensory analysis, packaging validation, and shelf-life evaluation for vacuum-fried fruits, vegetables, and root crops.',
    tech: ['Vacuum Frying', 'Raw Material Evaluation', 'Sensory Testing', 'Shelf-Life Evaluation', 'Packaging Validation']
  },
  {
    id: 2,
    title: 'High-Protein & Nutrition-Rich Food Development',
    category: 'Functional Foods',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    description: 'Formulation and development of multigrain biscuits, Indian flatbread, instant ragi meals, cookies, beverages, and nutrition-focused products to combat malnutrition.',
    tech: ['Millet-Based Foods', 'High-Protein Formulations', 'Instant Ragi Meals', 'Nutri-Biscuits', 'Microbiology']
  },
  {
    id: 3,
    title: 'Cereal-Millet-Pulse Extruded Product',
    category: 'Extrusion & Enrichment',
    image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=800&auto=format&fit=crop&q=80',
    description: 'CSIR-CFTRI research project on developing finger millet and pulse-based extruded shells enriched with protein and carotenoids for improved nutritional impact.',
    tech: ['Extrusion Technology', 'Protein Enrichment', 'Carotenoid Fortification', 'Physico-Chemical Analysis']
  },
  {
    id: 4,
    title: 'Organic Fruit Bars Using Solar Drying',
    category: 'Food Innovation',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80',
    description: 'Development of organic fruit bars using solar drying technologies at SEED, including fruit and vegetable pretreatment, formulation, and quality analysis.',
    tech: ['Solar Drying Tech', 'Fruit Bar Formulation', 'Quality Analysis', 'Pretreatment Optimization']
  },
  {
    id: 5,
    title: 'Teff & Millet Research (Ph.D Research)',
    category: 'Research & Innovation',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
    description: 'Doctoral research investigating the "Influence of different processing technologies on Teff (Eragrostis tef) and its value addition", physical, chemical, and functional properties.',
    tech: ['Eragrostis Tef', 'Millet Processing', 'Ultrasonication', 'Gamma Irradiation', 'Sorption Studies']
  },
  {
    id: 6,
    title: 'Food Processing Plant Setup',
    category: 'Plant Setup & Engineering',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    description: 'Technical guidance and process setup for the groundnut processing plant in Wanaparthy under the Department of Tribal Development.',
    tech: ['Plant Setup', 'Groundnut Processing', 'Process Engineering', 'Tribal Development']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolioProjects();
});

function renderPortfolioProjects() {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  container.innerHTML = portfolioProjects.map(proj => `
    <div class="card reveal" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="height: 210px; margin: -2rem -2rem 1.5rem; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0; position: relative;">
          <img src="${proj.image}" alt="${proj.title}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'" />
          <span style="position: absolute; top: 1rem; left: 1rem; background: rgba(11, 15, 25, 0.85); backdrop-filter: blur(8px); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; color: #818cf8; border: 1px solid var(--border-glass);">${proj.category}</span>
        </div>
        <h3 class="card-title" style="font-size: 1.25rem; line-height: 1.3; margin-bottom: 0.75rem;">${proj.title}</h3>
        <p class="card-text" style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">${proj.description}</p>
      </div>
      <div>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-top: 0.5rem; padding-top: 1rem; border-top: 1px solid var(--border-glass);">
          ${proj.tech.map(t => `<span style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2); padding: 0.25rem 0.65rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 500; color: #a5b4fc;">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

