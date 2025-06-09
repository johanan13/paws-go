 const form = document.getElementById('register-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather values from inputs
    const email = document.getElementById('email').value.trim();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Simple validation
    if (!email || !name || !phone || !password) {
      alert('Please fill out all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Prepare data to send
    const userData = { email, full_name: name, phone, password };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful! You can now login.');
        window.location.href = 'login.html'; // redirect to login page
      } else {
        alert(result.error || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error, please try again later.');
    }
  });