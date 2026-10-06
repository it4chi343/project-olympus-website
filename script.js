const yearEl = document.getElementById('year');
const form = document.getElementById('contactForm');
const statusText = document.querySelector('.form-status');
const formSubmitEndpoint = 'https://formsubmit.co/ajax/ryan@olympus-online.com';

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get('name') || 'Athlete').toString().trim() || 'Athlete';
    const email = (formData.get('email') || '').toString().trim();
    const goals = (formData.get('goals') || '').toString().trim();

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
          name,
          email,
          goals: goals || 'No details provided.',
          _subject: `Project Olympus coaching inquiry from ${name}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to send your inquiry.');
      }

      form.reset();
      statusText.textContent = 'Your inquiry has been sent.';
    } catch (error) {
      statusText.textContent = 'Something went wrong. Please try again or email ryan@olympus-online.com directly.';
    }
  });
}
