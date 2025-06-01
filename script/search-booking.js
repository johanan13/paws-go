
  const searchInput = document.getElementById("searchInput");
  const rows = document.querySelectorAll("#bookingTable tr");

  searchInput.addEventListener("input", () => {
    const search = searchInput.value.toLowerCase();

    rows.forEach(row => {
      const petName = row.getAttribute("data-pet");
      row.style.display = petName.includes(search) ? "" : "none";
    });
  });
