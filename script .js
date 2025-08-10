fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('date').textContent = `Menu for ${data.date}`;

    // Veg Menu
    const vegMenu = document.getElementById('veg-menu');
    data.veg.forEach(item => {
      vegMenu.innerHTML += `
        <div class="card">
          <img src="${item.photo}" alt="${item.item}">
          <div class="card-details">
            <h3>${item.item}</h3>
            <p class="price">${item.price}</p>
            <p class="calories">${item.calories}</p>
          </div>
        </div>
      `;
    });
  })
  .catch(err => console.error('Error loading menu:', err));
