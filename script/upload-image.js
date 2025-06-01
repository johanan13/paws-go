
  const photoInput = document.getElementById('petPhotoInput');
  const photoPreview = document.getElementById('photoPreview');

  // Clicking the circle triggers file input
  photoPreview.addEventListener('click', () => {
    photoInput.click();
  });

  // When an image is selected
  photoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.style.backgroundImage = `url('${e.target.result}')`;
        photoPreview.style.backgroundSize = 'cover';
        photoPreview.style.backgroundPosition = 'center';
        photoPreview.innerHTML = ''; // remove the plus icon
      };
      reader.readAsDataURL(file);
    }
  });

