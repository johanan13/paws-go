function showPetDetailModal(pet) {
  const container = document.getElementById('petDetailModalContainer');

  container.innerHTML = `
    <div class="modal fade" id="petDetailModal" tabindex="-1" aria-labelledby="petDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 bg-transparent">
          <div class="card rounded-4 border-primary border-2 p-4">
            <div class="d-flex align-items-start">
              <img src="${pet.photoUrl || './assets/pets/default-pet.png'}" alt="${pet.name}" class="rounded-3 me-4" width="250" height="250" style="object-fit: cover;">
              <div>
                <h5 class="fw-bold mb-2" id="petDetailModalLabel">${pet.name}</h5>
                <span class="badge bg-info text-dark me-2">${pet.species}</span>
                <span class="badge bg-success-subtle text-dark border">${pet.breed || 'Unknown Breed'}</span>
                <div class="mt-3">
                  <p class="mb-1"><strong>Birthdate:</strong> ${pet.birthdate ? new Date(pet.birthdate).toLocaleDateString() : 'N/A'}</p>
                  <p class="mb-1"><strong>Gender:</strong> ${pet.gender || 'N/A'}</p>
                  <p class="mb-1"><strong>Weight:</strong> ${pet.weight || 'N/A'}</p>
                  <p class="mb-1"><strong>Vaccination Status:</strong> ${pet.vaccinationStatus || 'N/A'}</p>
                  <p class="mb-1"><strong>Allergies/Existing Conditions:</strong> ${pet.allergies?.length ? pet.allergies.join(', ') : 'None'}</p>
                  <p class="mb-0"><strong>Medical History:</strong><br>${pet.medicalHistory?.length ? pet.medicalHistory.map(mh => `${new Date(mh.date).toLocaleDateString()}: ${mh.description}`).join('<br>') : 'None'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const petModal = new bootstrap.Modal(document.getElementById('petDetailModal'));
  petModal.show();
}
