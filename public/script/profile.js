 // Fetch user info from backend or localStorage
  async function loadUserInfo() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to view your profile.');
      window.location.href = 'login.html';  // Redirect to login if no userId
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user data');

      const userData = await response.json();
      document.getElementById('userName').textContent = userData.full_name || 'N/A';
      document.getElementById('userEmail').textContent = userData.email || 'N/A';
      document.getElementById('userPhone').textContent = userData.phone || 'N/A';
      document.getElementById('userRole').textContent = userData.role || 'N/A';

    } catch (error) {
      console.error('Error loading user data:', error);
      alert('Failed to load user data. Please try again later.');
    }
  }

  // Log out user by clearing session
  function logout() {
    localStorage.removeItem('userId');  // Remove user session data
    window.location.href = 'index.html';  // Redirect to login page
  }

  // Go back to the previous page
  function goBack() {
    window.history.back();
  }

  // Attach logout functionality to the button
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Load user info when the page is ready
  window.addEventListener('DOMContentLoaded', loadUserInfo);