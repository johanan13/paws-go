const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('userRole', data.user.role); // save role too

      alert('Login successful! Redirecting...');

      // Redirect based on role
      if (data.user.role === 'admin') {
        window.location.href = 'admin-booking-history.html';
      } else {
        // default to user dashboard
        window.location.href = 'my-pets.html';
      }
    } else {
      alert(data.error || 'Invalid email or password.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error. Please try again later.');
  }
});