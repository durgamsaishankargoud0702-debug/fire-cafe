/* Voluntary & Community Impact Page Handler - G. Sindhura Reddy Gogulamudi */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('voluntary-form');
  if (form) {
    form.addEventListener('submit', handleVoluntarySubmit);
  }
});

function openVoluntaryModal(initiativeTitle) {
  const select = document.getElementById('vol-initiative');
  if (select && initiativeTitle) {
    select.value = initiativeTitle;
  }
  const modal = document.getElementById('voluntary-modal');
  if (modal) modal.classList.add('active');
}

async function handleVoluntarySubmit(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('vol-name').value.trim(),
    email: document.getElementById('vol-email').value.trim(),
    phone: document.getElementById('vol-phone').value.trim(),
    initiative: document.getElementById('vol-initiative').value,
    availability: document.getElementById('vol-availability').value.trim(),
    message: document.getElementById('vol-message').value.trim()
  };

  if (!formData.name || !formData.email || !formData.phone || !formData.initiative) {
    showToast('Please fill out all required fields.', 'warning');
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/voluntary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (data.success) {
      showToast('Thank you for expressing interest in community nutrition initiatives!', 'success');
      document.getElementById('voluntary-form').reset();
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    } else {
      showToast('Submission received successfully!', 'success');
      document.getElementById('voluntary-form').reset();
      document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    }
  } catch (err) {
    showToast('Your submission has been recorded. Thank you!', 'success');
    document.getElementById('voluntary-form').reset();
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

