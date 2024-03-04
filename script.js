const order = {
  beverage: '',
  condiments: [],
  total: 0
};

function selectBeverage(beverage) {
  order.beverage = beverage;
  order.total += 2; 
  sessionStorage.setItem('order', JSON.stringify(order));
  window.location.href = 'condiments.html';
}

function addCondiment(condiment) {
  const condimentIndex = order.condiments.indexOf(condiment);
  if (condimentIndex === -1) {
    order.condiments.push(condiment);
    order.total += 0.5; 
  } else {
    order.condiments.splice(condimentIndex, 1);
    order.total -= 0.5; 
  }
  updateOrderDisplay();
}

function updateOrderDisplay() {
  document.getElementById('selectedBeverage').innerText = order.beverage;
  document.getElementById('selectedBeverage').addEventListener('click', () => {
    order.beverage = '';
    order.total -= 2; 
    window.location.href = 'beverage.html'; 
  });
  const condimentsContainer = document.getElementById('selectedCondiments');
  condimentsContainer.innerHTML = ''; 
  order.condiments.forEach(condiment => {
    const condimentLabel = document.createElement('label');
    condimentLabel.classList.add('btnConfirm'); 
    condimentLabel.innerText = condiment;
    condimentLabel.addEventListener('click', () => addCondiment(condiment));
    condimentsContainer.appendChild(condimentLabel);
  });
}

function confirmOrder() {
  fetch('https://coffee-order-latest-x2xj.onrender.com/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: order.beverage,
      condiments: order.condiments
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    sessionStorage.setItem('order', JSON.stringify(data));
    window.location.href = 'finished.html';
  })
  .catch((error) => console.error('Error:', error));
}

function fetchOrders() {
  fetch('https://coffee-order-latest-x2xj.onrender.com/orders')
    .then(response => response.json())
    .then(orders => {
      displayOrders(orders);
    })
    .catch((error) => console.error('Error:', error));
}

function displayOrders(orders) {
  const ordersContainer = document.getElementById('ordersContainer');
  orders.forEach(order => {
    const orderElement = document.createElement('div');
    orderElement.innerText = `${order.type} with ${order.condiments.join(', ')}`;
    ordersContainer.appendChild(orderElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const storedOrder = JSON.parse(sessionStorage.getItem('order'));
  if (storedOrder) {
    Object.assign(order, storedOrder);
    updateOrderDisplay();
  }

  if (window.location.pathname.includes('finished.html')) {
    const storedOrder = JSON.parse(sessionStorage.getItem('order'));
    if (storedOrder) {
      document.getElementById('finalOrder').innerText = `${storedOrder.beverage} with ${storedOrder.condiments.join(' and ')}`;
      document.getElementById('orderTotal').innerText = `$${storedOrder.total}`;
    } else {
      document.getElementById('finalOrder').innerText = "No order found.";
      document.getElementById('orderTotal').innerText = "$0";
    }
  }

  if (window.location.pathname.includes('order.html')) {
    fetchOrders();
  }
});
document.getElementById('startOrder').addEventListener('click', () => {
  sessionStorage.clear();
});
