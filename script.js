const yearEl = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const formSubmitEndpoint = 'https://formsubmit.co/ajax/ryan@olympus-online.com';

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const submitForm = async (form, statusText, subject, payload) => {
  if (!statusText) {
    return;
  }

  statusText.textContent = 'Sending...';

  try {
    const response = await fetch(formSubmitEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        _subject: subject,
      }),
    });

    if (!response.ok) {
      throw new Error('Unable to send the message.');
    }

    form.reset();
    statusText.textContent = 'Your message has been sent.';
  } catch (error) {
    statusText.textContent = 'Something went wrong. Please try again or email ryan@olympus-online.com directly.';
  }
};

if (contactForm) {
  const statusText = contactForm.querySelector('.form-status');

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get('name') || 'Athlete').toString().trim() || 'Athlete';
    const email = (formData.get('email') || '').toString().trim();
    const goals = (formData.get('goals') || '').toString().trim();

    await submitForm(contactForm, statusText, `Project Olympus programming inquiry from ${name}`, {
      name,
      email,
      goals: goals || 'No details provided.',
    });
  });
}
