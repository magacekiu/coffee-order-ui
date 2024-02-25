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
  sessionStorage.setItem('order', JSON.stringify(order));
  window.location.href = 'finished.html'; 
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
});
document.getElementById('startOrder').addEventListener('click', () => {
  sessionStorage.clear();
});
