  async function fetchPets() {
    const ownerId = localStorage.getItem('userId');
    if (!ownerId) {
      alert('You must be logged in to view your pets.');
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/pets/${ownerId}`);
      if (!response.ok) throw new Error('Failed to fetch pets');

      const pets = await response.json();
      console.log('Fetched pet details:', pets);

      const container = document.getElementById('petCardContainer');
      container.innerHTML = ''; // Clear existing content

      if (pets.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No pets found. Add a new pet profile!</p>`;
        return;
      }

      pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.className = 'col-md-6 col-lg-4';
        petCard.innerHTML = `
          <a href="#" class="text-decoration-none" data-bs-toggle="modal" data-bs-target="#petModal${pet._id}">
            <div class="card shadow-sm rounded-4 p-0 d-flex flex-row align-items-stretch h-100 overflow-hidden">
              <img src="${pet.photoUrl || './assets/pets/default-pet.png'}" alt="Photo of ${pet.name}" style="width: 150px; object-fit: cover;">
              <div class="p-3">
                <h2 class="fw-bold text-dark fs-5">${pet.name}</h2>
                <span class="badge bg-info text-dark me-2">${pet.species}</span>
                <span class="badge bg-light text-dark border">${pet.breed || 'Unknown Breed'}</span>
                <p class="mb-0 mt-2 small"><strong>Birthdate:</strong> ${pet.birthdate ? new Date(pet.birthdate).toLocaleDateString() : 'N/A'}</p>
                <p class="mb-0 small"><strong>Gender:</strong> ${pet.gender || 'N/A'}</p>
              </div>
            </div>
          </a>
          <!-- Modal structure for details -->
          <div class="modal fade" id="petModal${pet._id}" tabindex="-1" aria-labelledby="petModalLabel${pet._id}" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
              <div class="modal-content border-0 bg-transparent">
                <div class="card rounded-4 border-primary border-2 p-4">
                  <div class="d-flex align-items-start">
                    <img src="${pet.photoUrl || './assets/pets/default-pet.png'}" alt="${pet.name}" class="rounded-3 me-4" width="250" height="250" style="object-fit: cover;">
                    <div>
                      <h5 class="fw-bold mb-2" id="petModalLabel${pet._id}">${pet.name}</h5>
                      <span class="badge bg-info text-dark me-2">${pet.species}</span>
                      <span class="badge bg-success-subtle text-dark border">${pet.breed || 'Unknown Breed'}</span>
                      <div class="mt-3">
                        <p class="mb-1"><strong>Birthdate:</strong> ${pet.birthdate ? new Date(pet.birthdate).toLocaleDateString() : 'N/A'}</p>
                        <p class="mb-1"><strong>Gender:</strong> ${pet.gender || 'N/A'}</p>
                        <p class="mb-1"><strong>Weight:</strong> ${pet.weight || 'N/A'}</p>
                        <p class="mb-1"><strong>Vaccination Status:</strong> ${pet.vaccinationStatus || 'N/A'}</p>
                        <p class="mb-1"><strong>Allergies/Existing Conditions:</strong> ${pet.allergies.length ? pet.allergies.join(', ') : 'None'}</p>
                        <p class="mb-0"><strong>Medical History:</strong><br>
                          ${pet.medicalHistory.length ? pet.medicalHistory.map(mh => `${new Date(mh.date).toLocaleDateString()}: ${mh.description}`).join('<br>') : 'None'}</p>
                      </div>
                    </div>
                  </div>
                  <!-- Edit and Delete Buttons -->
                  <div class="d-flex justify-content-end mt-3">
                   
                    <button class="btn btn-danger" data-bs-dismiss="modal" onclick="deletePet('${pet._id}')">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        container.appendChild(petCard);
      });

    } catch (error) {
      console.error(error);
      alert('Failed to load pets. Please try again later.');
    }
  }

  // Fetch pets on page load
  window.addEventListener('DOMContentLoaded', fetchPets);

  // Edit Pet functionality (redirect to an edit page or open a modal with editable fields)
// Edit Pet button inside your pet profile modal
// function editPet(petId) {
//   window.location.href = `edit-pet-profile.html?petId=${petId}`;
// }
 // <button class="btn btn-warning me-2" data-bs-dismiss="modal" onclick="editPet('${pet._id}')">
                    //   <i class="bi bi-pencil-square"></i> Edit
                    // </button>
                    

  // Delete Pet functionality
  async function deletePet(petId) {
    const confirmDelete = confirm("Are you sure you want to delete this pet?");
    if (confirmDelete) {
      try {
        const res = await fetch(`http://localhost:5000/api/pets/${petId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete pet');
        alert('Pet deleted successfully');
        fetchPets(); // Reload pets after deletion
      } catch (error) {
        console.error(error);
        alert('Failed to delete pet. Please try again later.');
      }
    }
  }