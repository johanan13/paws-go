
  const petSearchInput = document.getElementById('petSearchInput');
  const petCards = document.querySelectorAll('#petCardContainer > div[data-pet]');

  petSearchInput.addEventListener('input', () => {
    const search = petSearchInput.value.toLowerCase();

    petCards.forEach(card => {
      const petName = card.getAttribute('data-pet');
      card.style.display = petName.includes(search) ? '' : 'none';
    });
  });

