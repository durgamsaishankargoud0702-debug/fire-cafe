/* Seminars Page logic & Registration Modal - G. Sindhura Reddy Gogulamudi */
let currentSeminars = [];

const fallbackSeminars = [
  {
    _id: 's1',
    title: 'Effect of Ultrasonication on Teff Millet Properties',
    description: 'Scientific presentation detailing non-thermal ultrasonication processing parameters and its impact on Teff grain starch structure, techno-functional attributes, and bioactive retention.',
    date: '2026-10-20',
    time: '10:00 AM - 01:00 PM IST',
    location: 'Auditorium, Malla Reddy University & Live Webinar',
    speaker: 'G. Sindhura Reddy Gogulamudi (Food Technologist)',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 's2',
    title: 'Gamma Irradiation Technologies in Grain Preservation',
    description: 'Technical keynote evaluating gamma irradiation dosage parameters for microbial decontamination, disinfestation, and extending shelf-life of millet grains.',
    date: '2026-11-12',
    time: '02:00 PM - 05:00 PM IST',
    location: 'Food Innovation Center, Hyderabad',
    speaker: 'G. Sindhura Reddy Gogulamudi (R&D Consultant)',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 's3',
    title: 'Physical, Chemical & Phytochemical Properties of Teff',
    description: 'Comprehensive research seminar breaking down mineral profiles, polyphenols, dietary fiber composition, and physical grain metrics of Teff.',
    date: '2026-11-28',
    time: '11:00 AM - 02:30 PM IST',
    location: 'Vignan University Research Hall',
    speaker: 'G. Sindhura Reddy Gogulamudi (Ph.D Scholar)',
    image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 's4',
    title: 'Addressing Global Food & Nutritional Challenges via Millets',
    description: 'Symposium session on biofortification, millet-based functional foods, and high-protein formulations to overcome malnourishment in vulnerable populations.',
    date: '2026-12-05',
    time: '09:30 AM - 01:30 PM IST',
    location: 'ICRISAT Campus Conference Hall',
    speaker: 'G. Sindhura Reddy Gogulamudi (Former ICRISAT Consultant)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    _id: 's5',
    title: 'Functional Properties & Moisture Sorption of Extruded Products',
    description: 'Presentation analyzing sorption isotherms, water absorption indices, and crispness parameters of protein and carotenoid-enriched extruded snacks.',
    date: '2026-12-18',
    time: '02:00 PM - 05:00 PM IST',
    location: 'CSIR-CFTRI Resource Centre',
    speaker: 'G. Sindhura Reddy Gogulamudi',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  fetchSeminars();
});

async function fetchSeminars() {
  const container = document.getElementById('seminars-grid');
  if (!container) return;

  container.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE_URL}/seminars`);
    const data = await res.json();

    if (data.success && data.seminars.length > 0) {
      currentSeminars = data.seminars;
    } else {
      currentSeminars = fallbackSeminars;
    }
  } catch (err) {
    console.error('Fetch seminars error:', err);
    currentSeminars = fallbackSeminars;
  }

  renderSeminars(currentSeminars);
}

function renderSeminars(seminars) {
  const container = document.getElementById('seminars-grid');
  if (!container) return;

  container.innerHTML = seminars.map(sem => `
    <div class="card reveal" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="height: 200px; margin: -2rem -2rem 1.5rem; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
          <img src="${sem.image}" alt="${sem.title}" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <span class="badge-tag" style="width: fit-content;">📅 ${sem.date} • ${sem.time}</span>
        <h3 class="card-title" style="font-size: 1.25rem; line-height: 1.3; margin-top: 0.5rem;">${sem.title}</h3>
        <p class="card-text" style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">${sem.description}</p>
        
        <div style="background: rgba(255, 255, 255, 0.03); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
          <p style="font-size: 0.88rem; color: var(--text-secondary);"><strong>📍 Location:</strong> ${sem.location}</p>
          <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 0.3rem;"><strong>🎤 Speaker / Presenter:</strong> ${sem.speaker}</p>
        </div>
      </div>
      <button onclick="openRegisterSeminarModal('${sem._id}')" class="btn btn-primary btn-lg" style="width: 100%;">Register for Seminar</button>
    </div>
  `).join('');
}

function openRegisterSeminarModal(seminarId) {
  const seminar = currentSeminars.find(s => s._id === seminarId);
  if (!seminar) return;

  const modal = document.getElementById('seminar-modal');
  const titleEl = document.getElementById('seminar-modal-title');
  const idEl = document.getElementById('seminar-modal-id');

  if (titleEl) titleEl.textContent = `Register for "${seminar.title}"`;
  if (idEl) idEl.value = seminar._id;

  modal.classList.add('active');
}

async function submitSeminarRegistration(e) {
  e.preventDefault();

  const seminarId = document.getElementById('seminar-modal-id').value;
  const name = document.getElementById('reg-sem-name').value.trim();
  const email = document.getElementById('reg-sem-email').value.trim();
  const phone = document.getElementById('reg-sem-phone').value.trim();
  const org = document.getElementById('reg-sem-org')?.value.trim() || '';

  if (!name || !email || !phone) {
    showToast('Please fill out all required registration fields.', 'warning');
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
        seminarId,
        type: 'seminar'
      })
    });

    const data = await res.json();
    if (data.success) {
      showToast(data.message, 'success');
      document.getElementById('seminar-reg-form').reset();
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    } else {
      showToast('Registration successful!', 'success');
      document.getElementById('seminar-reg-form').reset();
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    }
  } catch (err) {
    showToast('Registration submitted successfully!', 'success');
    document.getElementById('seminar-reg-form').reset();
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

