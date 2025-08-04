document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const responseMessage = document.getElementById('responseMessage');

  // Send data to backend
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });

    if (response.ok) {
      responseMessage.innerHTML = `<p style="color: green;">Your message has been sent. Thank you for contacting us!</p>`;
      document.getElementById('contactForm').reset();
    } else {
      responseMessage.innerHTML = `<p style="color: red;">There was an error sending your message. Please try again later.</p>`;
    }
  } catch (error) {
    responseMessage.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
});
