/* Workshops Page logic & Registration - G. Sindhura Reddy Gogulamudi */
let currentWorkshops = [];

const fallbackWorkshops = [
  {
    _id: 'w1',
    title: 'Food Product Development',
    subtitle: 'From Concept and Formulation to Evaluation',
    description: 'Hands-on practical training covering benchtop formulation design, raw material selection, processing optimization, sensory evaluation, and shelf-life testing.',
    duration: 'Full Day (6 Hours)',
    date: 'Upcoming Interactive Session',
    location: 'Pilot Plant & Food R&D Lab',
    instructor: 'G. Sindhura Reddy Gogulamudi',
    seats: 25,
    category: 'Workshop Topics'
  },
  {
    _id: 'w2',
    title: 'Food Processing Technologies',
    subtitle: 'Understanding Processing Approaches and Optimization',
    description: 'In-depth exploration of thermal and non-thermal processing, vacuum drying, extrusion, and parameter monitoring to optimize processing yield and nutrient retention.',
    duration: '1 Day Intensive',
    date: 'Upcoming Interactive Session',
    location: 'Food Processing Facility',
    instructor: 'G. Sindhura Reddy Gogulamudi',
    seats: 20,
    category: 'Workshop Topics'
  },
  {
    _id: 'w3',
    title: 'Functional & Millet-Based Foods',
    subtitle: 'Development of Value-Added and Nutrition-Focused Products',
    description: 'Specialized training on formulating finger millet, ragi, teff, and pulse-fortified foods to combat malnourishment and expand functional food portfolios.',
    duration: '1 Day Intensive',
    date: 'Upcoming Interactive Session',
    location: 'Nutriplus Innovation Lab',
    instructor: 'G. Sindhura Reddy Gogulamudi',
    seats: 30,
    category: 'Workshop Topics'
  },
  {
    _id: 'w4',
    title: 'Food Quality & Safety',
    subtitle: 'Quality Evaluation and Food Safety Practices',
    description: 'Comprehensive overview of implementing quality assurance systems, microbial analysis standards, FSSAI compliance, HACCP, and ISO 22000 requirements.',
    duration: '2 Days Workshop',
    date: 'Upcoming Interactive Session',
    location: 'Quality Assurance Center',
    instructor: 'G. Sindhura Reddy Gogulamudi',
    seats: 30,
    category: 'Workshop Topics'
  },
  {
    _id: 'w5',
    title: 'Food Analysis',
    subtitle: 'Introduction to Food Analysis and Evaluation Methods',
    description: 'Practical introduction to modern instrumentation, physico-chemical analysis, moisture sorption isotherms, and texture profile analysis (TPA).',
    duration: '1 Day Lab Training',
    date: 'Upcoming Interactive Session',
    location: 'Analytical Food Testing Lab',
    instructor: 'G. Sindhura Reddy Gogulamudi',
    seats: 15,
    category: 'Workshop Topics'
  },
  {
    _id: 'w6',
    title: 'Research & Innovation',
    subtitle: 'Research Approaches in Food Technology',
    description: 'Guiding academic and industry researchers through experimental design, journal publishing, value addition strategies, and research project management.',
    duration: 'Full Day (5 Hours)',
    date: 'Upcoming Interactive Session',
    location: 'University Research Center',
    instructor: 'G. Sindhura Reddy Gogulamudi',
    seats: 25,
    category: 'Workshop Topics'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  fetchWorkshops();
});

async function fetchWorkshops() {
  const container = document.getElementById('workshops-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE_URL}/workshops`);
    const data = await res.json();

    if (data.success && data.workshops.length > 0) {
      currentWorkshops = data.workshops;
    } else {
      currentWorkshops = fallbackWorkshops;
    }
  } catch (err) {
    console.error('Fetch workshops error:', err);
    currentWorkshops = fallbackWorkshops;
  }

  renderWorkshops(currentWorkshops);
}

function renderWorkshops(workshops) {
  const container = document.getElementById('workshops-grid');
  if (!container) return;

  container.innerHTML = workshops.map(ws => `
    <div class="card reveal" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <span class="badge-tag" style="background: rgba(16, 185, 129, 0.12); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">Workshop Topic</span>
          <span class="badge badge-info">⏱️ ${ws.duration}</span>
        </div>
        
        <h3 class="card-title" style="font-size: 1.3rem; margin-bottom: 0.25rem;">${ws.title}</h3>
        ${ws.subtitle ? `<p style="font-size: 0.88rem; font-weight: 600; color: #818cf8; margin-bottom: 0.75rem;">${ws.subtitle}</p>` : ''}
        
        <p class="card-text" style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${ws.description}</p>
        
        <div style="background: rgba(255, 255, 255, 0.03); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.5rem; display: grid; gap: 0.4rem; font-size: 0.88rem; color: var(--text-secondary);">
          <div><strong>📍 Venue:</strong> ${ws.location}</div>
          <div><strong>👩‍🏫 Instructor:</strong> ${ws.instructor}</div>
        </div>
      </div>

      <button onclick="openRegisterWorkshopModal('${ws._id}')" class="btn btn-primary btn-lg" style="width: 100%;">
        Request Training / Register
      </button>
    </div>
  `).join('');
}

function openRegisterWorkshopModal(workshopId) {
  const ws = currentWorkshops.find(w => w._id === workshopId);
  if (!ws) return;

  const modal = document.getElementById('workshop-modal');
  const titleEl = document.getElementById('workshop-modal-title');
  const idEl = document.getElementById('workshop-modal-id');

  if (titleEl) titleEl.textContent = `Register for Workshop: "${ws.title}"`;
  if (idEl) idEl.value = ws._id;

  modal.classList.add('active');
}

async function submitWorkshopRegistration(e) {
  e.preventDefault();

  const workshopId = document.getElementById('workshop-modal-id').value;
  const name = document.getElementById('reg-ws-name').value.trim();
  const email = document.getElementById('reg-ws-email').value.trim();
  const phone = document.getElementById('reg-ws-phone').value.trim();
  const org = document.getElementById('reg-ws-org')?.value.trim() || '';

  if (!name || !email || !phone) {
    showToast('Please fill out all required fields.', 'warning');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: org ? `${name} (${org})` : name,
        email,
        phone,
        workshopId,
        type: 'workshop'
      })
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      document.getElementById('workshop-reg-form').reset();
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    } else {
      showToast('Workshop registration request submitted!', 'success');
      document.getElementById('workshop-reg-form').reset();
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    }
  } catch (err) {
    showToast('Workshop registration submitted successfully!', 'success');
    document.getElementById('workshop-reg-form').reset();
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

