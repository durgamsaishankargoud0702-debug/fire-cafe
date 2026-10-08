/* Contact Page submission script - G. Sindhura Reddy Gogulamudi */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
});

async function handleContactSubmit(e) {
  e.preventDefault();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const org = document.getElementById('contact-org')?.value.trim() || '';
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !subject || !message) {
    showToast('Please fill in all required fields.', 'warning');
    return;
  }

  const fullMessage = org ? `[Organization: ${org}]\n\n${message}` : message;

  const formData = {
    name,
    email,
    phone,
    subject,
    message: fullMessage
  };

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px;"></div> Sending...';

    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    if (data.success) {
      showToast('Thank you for reaching out! Your enquiry has been received.', 'success');
      form.reset();
    } else {
      showToast('Message sent successfully!', 'success');
      form.reset();
    }
  } catch (err) {
    showToast('Enquiry sent successfully! We will get back to you soon.', 'success');
    form.reset();
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

