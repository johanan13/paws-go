const searchInput = document.getElementById('searchInput');
const bookingTable = document.getElementById('bookingTable');

searchInput.addEventListener('input', () => {
  const filter = searchInput.value.toLowerCase().trim();

  // If no filter, show all rows
  if (!filter) {
    Array.from(bookingTable.rows).forEach(row => (row.style.display = ''));
    return;
  }

  Array.from(bookingTable.rows).forEach(row => {
    // Get text content for booking ID, pet name, and service from this row's cells
    const bookingId = row.cells[0]?.textContent.toLowerCase() || '';
    const petName = row.cells[1]?.textContent.toLowerCase() || '';
    const service = row.cells[2]?.textContent.toLowerCase() || '';

    if (
      bookingId.includes(filter) ||
      petName.includes(filter) ||
      service.includes(filter)
    ) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});
