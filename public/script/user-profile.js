async function loadUserProfile() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    // Not logged in, redirect or do nothing
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/users/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');

    const user = await res.json();

    // Get initials from full name (e.g. "Alex Bautista" → "AB")
    const initials = (user.full_name || '')
      .split(' ')
      .map(namePart => namePart[0].toUpperCase())
      .join('')
      .substring(0, 2);

    // Update modal and navbar initials
    document.getElementById('userInitial').textContent = initials;
    document.getElementById('navbarInitials').textContent = initials;

    // Update modal user info
    document.getElementById('userName').textContent = user.full_name || 'N/A';
    document.getElementById('userEmail').textContent = user.email || 'N/A';
    document.getElementById('userPhone').textContent = user.phone || 'N/A';

    // Update navbar dropdown user info
    document.getElementById('dropdownUserName').textContent = user.full_name || 'N/A';
    document.getElementById('dropdownUserEmail').textContent = user.email || 'N/A';
    document.getElementById('dropdownUserPhone').textContent = user.phone || 'N/A';

  } catch (error) {
    console.error('Error loading user profile:', error);
  }
}

// Call this when the page loads
window.addEventListener('DOMContentLoaded', loadUserProfile);
