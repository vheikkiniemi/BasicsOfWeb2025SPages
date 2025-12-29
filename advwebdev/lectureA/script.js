// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const feedback = `Thank you, ${name}! We have received your message.`;
  document.getElementById('formFeedback').innerText = feedback;

  // Clear form fields
  this.reset();
});