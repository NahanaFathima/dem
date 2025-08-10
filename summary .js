const order = JSON.parse(localStorage.getItem('order') || '[]');
const summary = document.getElementById('order-summary');
if (order.length === 0) {
  summary.innerHTML = '<p>No items ordered.</p>';
} else {
  summary.innerHTML = '<ul>' + order.map(item =>
    `<li>${item.name} - Qty: ${item.qty}</li>`
  ).join('') + '</ul>';
}
