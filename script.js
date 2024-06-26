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
  const selectedBeverageElement = document.getElementById('selectedBeverage');
  if (selectedBeverageElement) {
    selectedBeverageElement.innerText = order.beverage;
    selectedBeverageElement.addEventListener('click', () => {
      order.beverage = '';
      order.total -= 2; 
      window.location.href = 'beverage.html'; 
    });
  }
  const condimentsContainer = document.getElementById('selectedCondiments');
  if (condimentsContainer) {
    condimentsContainer.innerHTML = ''; 
    order.condiments.forEach(condiment => {
      const condimentLabel = document.createElement('label');
      condimentLabel.classList.add('btnConfirm'); 
      condimentLabel.innerText = condiment;
      condimentLabel.addEventListener('click', () => addCondiment(condiment));
      condimentsContainer.appendChild(condimentLabel);
    });
  }
}

function confirmOrder() {
  fetchWithAuth('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      beverage: order.beverage,
      condiments: order.condiments
    }),
  })
  .then(data => {
    console.log('Order confirmed:', data);
    sessionStorage.setItem('order', JSON.stringify(data));
    window.location.href = 'finished.html';
  })
  .catch((error) => console.error('Error:', error));
}

function fetchOrders() {
  fetchWithAuth('/orders')
    .then(orders => {
      console.log('Fetched orders:', orders);
      displayOrders(orders);
    })
    .catch((error) => console.error('Error:', error));
}

function displayOrders(orders) {
  const ordersContainer = document.getElementById('ordersContainer');
  orders.forEach(order => {
    const orderElement = document.createElement('div');
    orderElement.innerText = `Drink with ${order.condiments.join(', ')}`;
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
      document.getElementById('finalOrder').innerText = storedOrder.description;
      document.getElementById('orderTotal').innerText = `$${storedOrder.cost}`;
      document.getElementById('orderId').innerText = `Order id: ${storedOrder.id}`;
    } else {
      document.getElementById('finalOrder').innerText = "No order found.";
      document.getElementById('orderTotal').innerText = "$0";
      document.getElementById('orderId').innerText = "Order id: Not available";
    }
  }

  if (window.location.pathname.includes('order.html')) {
    fetchOrders();
  }
});
if(document.getElementById('startOrder')) {
  document.getElementById('startOrder').addEventListener('click', () => {
    sessionStorage.clear();
  });
}

