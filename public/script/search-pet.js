// Simple client-side search filtering on displayed pet cards

const petSearchInput = document.getElementById('petSearchInput');
const btnPetSearch = document.getElementById('btnPetSearch');
const petCardContainer = document.getElementById('petCardContainer');

// Filter pet cards by pet name
function filterPets() {
  const searchTerm = petSearchInput.value.toLowerCase().trim();

  // Get all pet cards inside container
  const petCards = petCardContainer.querySelectorAll('.col-md-6.col-lg-4');

  petCards.forEach(card => {
    // pet name is inside h2 with fw-bold and fs-5 class inside the card
    const petNameElem = card.querySelector('h2.fw-bold.fs-5');
    if (!petNameElem) return;

    const petName = petNameElem.textContent.toLowerCase();

    if (petName.includes(searchTerm)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Search on input change (as you type)
petSearchInput.addEventListener('input', filterPets);

// Search on button click
btnPetSearch.addEventListener('click', filterPets);
