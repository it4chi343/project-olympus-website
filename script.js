const yearEl = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const orderForm = document.getElementById('orderForm');
const formSubmitEndpoint = 'https://formsubmit.co/ajax/ryan@olympus-online.com';

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const productImageTriggers = document.querySelectorAll('.product-image-trigger');

if (productImageTriggers.length > 0) {
  const imageDialog = document.createElement('dialog');
  const enlargedImage = document.createElement('img');
  const closeButton = document.createElement('button');

  imageDialog.className = 'product-image-dialog';
  closeButton.className = 'product-image-dialog-close';
  closeButton.type = 'button';
  closeButton.textContent = 'Close';
  closeButton.setAttribute('aria-label', 'Close enlarged image');

  imageDialog.append(enlargedImage, closeButton);
  document.body.append(imageDialog);

  productImageTriggers.forEach((trigger) => {
    const image = trigger.querySelector('img');

    if (!image) {
      return;
    }

    trigger.addEventListener('click', () => {
      enlargedImage.src = image.currentSrc || image.src;
      enlargedImage.alt = image.alt;
      imageDialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('click', (event) => {
    if (event.target === imageDialog) {
      imageDialog.close();
    }
  });
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

    await submitForm(contactForm, statusText, `Project Olympus coaching inquiry from ${name}`, {
      name,
      email,
      goals: goals || 'No details provided.',
    });
  });
}

if (orderForm) {
  const statusText = orderForm.querySelector('.form-status');

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(orderForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const size = (formData.get('size') || '').toString().trim();
    const address = (formData.get('address') || '').toString().trim();
    const notes = (formData.get('notes') || '').toString().trim();
    const product = orderForm.dataset.product || 'Project Olympus product';
    const price = orderForm.dataset.price || 'Price not set';

    await submitForm(orderForm, statusText, `Project Olympus order: ${product}`, {
      name,
      email,
      product,
      price,
      size,
      address,
      notes: notes || 'No notes provided.',
      payment: 'PayPal payment to be completed after order submission.',
    });
  });
}
