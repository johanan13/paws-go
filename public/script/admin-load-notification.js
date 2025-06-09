 async function loadNotifications() {
    try {
      // Fetch all notifications (no ownerId filter)
      const response = await fetch('http://localhost:5000/api/admin/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const notifications = await response.json();
      const container = document.getElementById('notificationList');
      container.innerHTML = ''; // Clear existing notifications

      if (notifications.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No notifications available.</p>';
        return;
      }

      notifications.forEach(notif => {
        const notifCard = document.createElement('div');
        notifCard.className = 'card border rounded-4 p-3 d-flex flex-row align-items-start gap-3';

        notifCard.innerHTML = `
          <i class="bi bi-bell fs-2 text-secondary mt-1" aria-hidden="true"></i>
          <div>
            <p class="fw-semibold mb-1">${notif.message}</p>
            <p class="text-muted mb-0 small">${new Date(notif.createdAt).toLocaleString()}</p>
          </div>
        `;

        container.appendChild(notifCard);
      });
    } catch (error) {
      console.error(error);
      alert('Failed to load notifications. Please try again later.');
    }
  }

  window.addEventListener('DOMContentLoaded', loadNotifications);