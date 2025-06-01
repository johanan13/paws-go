const messageSearchInput = document.getElementById('searchMessage');
const messageList = document.getElementById('messageList');

messageSearchInput.addEventListener('input', () => {
  const query = messageSearchInput.value.toLowerCase();
  const messageCards = messageList.querySelectorAll('.message-card');

  messageCards.forEach(card => {
    const name = card.getAttribute('data-name')?.toLowerCase() || '';
    card.style.display = name.includes(query) ? 'flex' : 'none';
  });
});