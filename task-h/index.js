document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contactForm');
    const fields = ['name', 'email'].map(id => document.getElementById(id));

    // Utility to show/hide custom error text + style field
    function setError(input, message = '') {
      const errorId = input.getAttribute('data-error-target');
      const errorEl = errorId ? document.getElementById(errorId) : null;

      // Set browser's internal message (used by reportValidity)
      input.setCustomValidity(message);

      // Toggle inline error
      if (errorEl) {
        if (message) {
          errorEl.textContent = message;
          errorEl.classList.remove('hidden');
          // Add red ring/border via Tailwind utilities
          input.classList.add('ring-2', 'ring-red-500', 'border-red-500');
        } else {
          errorEl.textContent = '';
          errorEl.classList.add('hidden');
          input.classList.remove('ring-2', 'ring-red-500', 'border-red-500');
        }
      }
    }

    // Field-specific validators
    function validateName() {
      const input = document.getElementById('name');
      const value = input.value.trim();

      if (!value) return setError(input, 'Please enter your name.');
      if (value.length < 2) return setError(input, 'Name must be at least 2 characters.');
      // Pattern matches letters/spaces/hyphens/apostrophes; tweak to your locale as needed
      const re = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;
      if (!re.test(value)) return setError(input, 'Only letters, spaces, hyphens, and apostrophes are allowed.');

      return setError(input, ''); // clear
    }

    function validateEmail() {
      const input = document.getElementById('email');
      const value = input.value.trim();
      setError(input, '');

      if (!value) return setError(input, 'Please enter your email address.');
      // type="email" already checks format; this gives a friendlier message
      if (!input.checkValidity()) return setError(input, 'Please provide a valid email, e.g., name@example.com.');

      return setError(input, '');
    }

    // Wire up live validation
    document.getElementById('name').addEventListener('input', validateName);
    document.getElementById('name').addEventListener('blur', validateName);

    document.getElementById('email').addEventListener('input', validateEmail);
    document.getElementById('email').addEventListener('blur', validateEmail);

    // On submit: validate all, focus first invalid, block submission if any invalid
    form.addEventListener('submit', (e) => {
      const validators = [validateName, validateEmail];
      validators.forEach(fn => fn());

      // If any field is invalid, prevent submission and show built-in bubble near the field
      const firstInvalid = fields.find(f => !f.checkValidity());
      if (firstInvalid) {
        e.preventDefault();
        firstInvalid.reportValidity();    // shows native tooltip near the field
        firstInvalid.focus({ preventScroll: false });
        return;
      }

      // Simulate success (since action="#" and we’re not posting anywhere)
      e.preventDefault();
      const ok = document.getElementById('formSuccess');
      ok.textContent = 'Thanks! Your message was validated and would be submitted now.';
      ok.classList.remove('hidden');
      form.reset();
      // Optional: remove error styles after reset
      fields.forEach(f => setError(f, ''));
    });
});