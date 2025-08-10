fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('date').textContent = `Menu for ${data.date}`;
    const vegMenu = document.getElementById('veg-menu');

    data.veg.forEach((item, idx) => {
      vegMenu.insertAdjacentHTML('beforeend', `
        <div class="card">
          <img src="${item.photo}" alt="${item.item}" loading="lazy">
          <div class="card-details">
            <h3>${item.item}</h3>
            <p class="price">${item.price}</p>
            <p class="calories">${item.calories}</p>
            <label>
              Qty:
              <input type="number" min="1" max="10" value="1" id="qty${idx}">
            </label>
            <button class="order-btn" onclick="placeOrder('${item.item}', document.getElementById('qty${idx}').value, '${item.price}')">Place Order</button>
            <button class="order-btn" onclick="addToCart('${item.item}', document.getElementById('qty${idx}').value, '${item.price}')">Add to Cart</button>
          </div>
        </div>
      `);
    });

    updateCartCount(); // Show cart count on page load
  });

function addToCart(itemName, qty, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if item already exists
  const existing = cart.find(item => item.itemName === itemName);
  if (existing) {
    existing.qty += parseInt(qty);
  } else {
    cart.push({ itemName, qty: parseInt(qty), price });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${itemName} added to cart!`);
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

document.addEventListener("DOMContentLoaded", updateCartCount);

function goToCart() {
  window.location.href = 'cart.html';
}
