/* Consultancy page form submission handler - G. Sindhura Reddy Gogulamudi */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('consultancy-form');
  if (form) {
    form.addEventListener('submit', handleConsultancySubmit);
  }
});

async function handleConsultancySubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  const name = document.getElementById('consult-name').value.trim();
  const email = document.getElementById('consult-email').value.trim();
  const phone = document.getElementById('consult-phone').value.trim();
  const organization = document.getElementById('consult-org')?.value.trim() || '';
  const service = document.getElementById('consult-service').value;
  const projectDescription = document.getElementById('consult-message').value.trim();

  if (!name || !email || !phone || !service || !projectDescription) {
    showToast('Please fill out all required fields in the request form.', 'warning');
    return;
  }

  const combinedMessage = organization 
    ? `[Organization: ${organization}]\n\n${projectDescription}`
    : projectDescription;

  const formData = {
    name,
    email,
    phone,
    service,
    message: combinedMessage
  };

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px;"></div> Submitting...';

    const res = await fetch(`${API_BASE_URL}/consultancy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (data.success) {
      showToast('Thank you! Your consultation request has been submitted successfully.', 'success');
      form.reset();
    } else {
      showToast(data.message || 'Failed to submit consultation request', 'danger');
    }
  } catch (err) {
    console.error('Consultancy submit error:', err);
    showToast('Network error while submitting request.', 'danger');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

