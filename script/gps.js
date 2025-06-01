
  function initAutocomplete() {
    const input = document.getElementById('locationInput');
    const options = {
      componentRestrictions: { country: 'ph' }, // 🇵🇭 Only in the Philippines
      fields: ['place_id', 'geometry', 'name'],
      types: ['geocode'], // You can use 'address' if you want stricter filtering
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();
      console.log('Selected place:', place);
      // You can also extract coordinates here if needed:
      // const lat = place.geometry.location.lat();
      // const lng = place.geometry.location.lng();
    });
  }

