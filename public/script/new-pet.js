  const form = document.getElementById('pet-profile-form');
  const loggedInUserId = localStorage.getItem('userId'); // user ID from login

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!loggedInUserId) {
      alert('You must be logged in to add a pet.');
      return;
    }

    const allergyInputs = [...document.querySelectorAll('input[name="allergies_desc[]"]')];
    const allergies = allergyInputs.map(input => input.value.trim()).filter(v => v);

    const medDates = [...document.querySelectorAll('input[name="meds_history_date[]"]')];
    const medDescs = [...document.querySelectorAll('textarea[name="meds_history_desc[]"]')];
    const medicalHistory = medDates.map((input, i) => ({
      date: input.value,
      description: medDescs[i]?.value || '',
    })).filter(entry => entry.date && entry.description);

    const formData = new FormData();

const petId = `PET-${new Date().getTime()}`; // You can generate this based on your own logic or unique format

formData.append('petId', petId); // Append petId to the form data
formData.append('ownerId', loggedInUserId); // loggedInUserId retrieved from localStorage
formData.append('name', document.getElementById('name').value.trim());
formData.append('species', document.getElementById('species').value);
formData.append('breed', document.getElementById('breed').value.trim());
formData.append('birthdate', document.getElementById('birthdate').value);
formData.append('gender', document.getElementById('gender').value);
formData.append('weight', document.getElementById('weight').value.trim());
formData.append('vaccinationStatus', document.getElementById('vs').value);
formData.append('allergies', JSON.stringify(allergies));
formData.append('medicalHistory', JSON.stringify(medicalHistory));

    const petPhotoInput = document.getElementById('petPhotoInput');
    if (petPhotoInput.files.length > 0) {
      formData.append('petPhoto', petPhotoInput.files[0]);
    }

    // Basic validation
    if (!formData.get('name') || !formData.get('species')) {
      alert('Please fill in at least pet name and species.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/pets', {
        method: 'POST',
        body: formData, // multipart/form-data
      });

      const result = await response.json();

      if (response.ok) {
        alert('Pet profile submitted successfully!');
        window.location.href = 'my-pets.html';
      } else {
        alert(result.error || 'Failed to submit pet profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please try again later.');
    }
  });
