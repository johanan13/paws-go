
  // Sample data – Replace this with real values from your auth logic
  const user = {
    name: "Alex Bautista",
    email: "alexb@example.com",
    phone: "+63 912 345 6789"
  };

  document.getElementById("userName").textContent = user.name;
  document.getElementById("userEmail").textContent = user.email;
  document.getElementById("userPhone").textContent = user.phone;
  document.getElementById("userInitial").textContent = user.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  function signOut() {
    // Add your actual sign-out logic here
    alert("Signed out!");
    window.location.href = "login.html";
  }



// dropdown sccript
  const user1= {
    name: "Alex Bautista",
    email: "alexb@example.com",
    phone: "+63 912 345 6789"
  };

  const initials = user.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  document.getElementById("navbarInitials").textContent = initials;
  document.getElementById("dropdownUserName").textContent = user.name;
  document.getElementById("dropdownUserEmail").textContent = user.email;
  document.getElementById("dropdownUserPhone").textContent = user.phone;

  function signOut() {
    alert("Signed out!");
    window.location.href = "login.html";
  }


