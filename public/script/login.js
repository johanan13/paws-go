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
      localStorage.setItem('userRole', data.user.role);

      showToast('Login successful! Redirecting...');

      setTimeout(() => {
        if (data.user.role === 'admin') {
          window.location.href = 'admin-booking-history.html';
        } else {
          window.location.href = 'my-pets.html';
        }
      }, 3000);
    } else {
      alert(data.error || 'Invalid email or password.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Server error. Please try again later.');
  }
});

// ✅ Toast function – only called on success
function showToast(message) {
  let toast = document.getElementById('toastMessage');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMessage';
    toast.className = 'position-fixed bottom-0 start-50 translate-middle-x bg-success text-white px-4 py-2 rounded shadow';
    toast.style.zIndex = '1055';
    toast.style.transition = 'opacity 0.3s ease-in-out';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = 'block';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 200);
  }, 2000);
}
