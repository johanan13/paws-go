async function loadUserPets() {
  const ownerId = localStorage.getItem('userId');
  if (!ownerId) {
    alert('Please login first.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/pets/${ownerId}`);
    if (!response.ok) throw new Error('Failed to load pets');
    const pets = await response.json();

    const petSelect = document.getElementById('petSelect');
    petSelect.innerHTML = '<option selected disabled>Select pet</option>';

    pets.forEach(pet => {
      const option = document.createElement('option');
      option.value = pet._id;
      option.textContent = pet.name;
      option.dataset.petname = pet.name; // Store pet name for submission
      petSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert('Error loading pets.');
  }
}

window.addEventListener('DOMContentLoaded', loadUserPets);



const bookingForm = document.getElementById('bookingForm');
 const bookButton = document.getElementById('bookButton');

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const ownerId = localStorage.getItem('userId');
  if (!ownerId) {
    alert('Please login first.');
    window.location.href = 'login.html';
    return;
  }

  const petSelect = document.getElementById('petSelect');
  const selectedPetId = petSelect.value;
  const selectedPetName = petSelect.options[petSelect.selectedIndex]?.dataset.petname;

  const serviceType = document.getElementById('serviceSelect').value;
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  const location = document.getElementById('locationInput').value.trim();
  const paymentMethod = document.getElementById('paymentSelect').value;
  const notes = document.getElementById('notesInput').value.trim();

  // Simple validation
  if (!selectedPetId || !serviceType || !date || !time || !location || !paymentMethod) {
    alert('Please fill all required fields.');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId,
        petId: selectedPetId,
        petName: selectedPetName,
        serviceType,
        date,
        time,
        location,
        paymentMethod,
        notes,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Booking submitted successfully! Your Booking ID: ${data.bookingId}`);
      // bookingForm.reset();
      window.location.href = 'booking-history.html';
    } else {
      alert(data.error || 'Failed to submit booking.');
    }
  } catch (error) {
    console.error(error);
    alert('Server error, please try again later.');
  }
});


      
