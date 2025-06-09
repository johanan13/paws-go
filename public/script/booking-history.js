async function loadBookings() {
  const ownerId = localStorage.getItem('userId');
  if (!ownerId) {
    alert('Please login to view your bookings.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/bookings/${ownerId}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');

    const bookings = await res.json();
    const tableBody = document.getElementById('bookingTable');

    tableBody.innerHTML = '';

    if (bookings.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">No bookings found.</td></tr>`;
      return;
    }

    bookings.forEach((booking) => {
      const bookingId = booking.bookingId || 'N/A';
      const petName = booking.petName || (booking.petId?.name) || 'Unknown';
      const serviceType = booking.serviceType || 'N/A';

      const bookingDate = new Date(booking.date);
      const dateStr = bookingDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = booking.time || '';

      const location = booking.location || '';
      const notes = booking.notes || '';
      const paymentMethod = booking.paymentMethod || '';

      let statusBadge = '';
      switch ((booking.status || '').toLowerCase()) {
        case 'submitted':
          statusBadge = `<span class="badge bg-warning text-dark">Submitted</span>`;
          break;
        case 'accepted':
          statusBadge = `<span class="badge bg-info text-dark">Accepted</span>`;
          break;
        case 'on the way':
          statusBadge = `<span class="badge bg-primary">On The Way</span>`;
          break;
        case 'completed':
          statusBadge = `<span class="badge bg-success">Completed</span>`;
          break;
        case 'cancelled':
          statusBadge = `<span class="badge bg-danger">Cancelled</span>`;
          break;
        default:
          statusBadge = `<span class="badge bg-secondary">${booking.status || 'Unknown'}</span>`;
      }

      tableBody.innerHTML += `
        <tr>
          <td>${bookingId}</td>
          <td>${petName}</td>
          <td>${serviceType}</td>
          <td>${dateStr}</td>
          <td>${timeStr}</td>
          <td>${location}</td>
          <td>${notes}</td>
          <td>${paymentMethod}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error(error);
    alert('Failed to load booking history. Please try again later.');
  }
}

window.addEventListener('DOMContentLoaded', loadBookings);