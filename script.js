const products = [
  { id: 1, name: "Tie-Dye Lounge Set", price: 1500, img: "assets/photos/photo-1432149877166-f75d49000351.jpg" },
  { id: 2, name: "Sunburst Tracksuit", price: 1300, img: "assets/photos/photo-1515886657613-9f3515b0c78f.jpg" },
  { id: 3, name: "Retro Red Streetwear", price: 1400, img: "assets/photos/photo-1529139574466-a303027c1d8b.jpg" },
  { id: 4, name: "Urban Sportwear Combo", price: 1600, img: "assets/photos/photo-1588117260148-b47818741c74.jpg" },
  { id: 5, name: "Oversized Knit & Coat", price: 1700, img: "assets/photos/photo-1632149877166-f75d49000351.jpg" },
  { id: 6, name: "Chic Monochrome Blazer", price: 1550, img: "assets/photos/photo-1608748010899-18f300247112.jpg" },
];

let selected = [];

const productGrid = document.getElementById("productGrid");
const selectedList = document.getElementById("selectedList");
const progressCount = document.getElementById("progressCount");
const progressFill = document.getElementById("progressFill");
const discountAmount = document.getElementById("discountAmount");
const subtotal = document.getElementById("subtotal");
const bundleBtn = document.getElementById("bundleBtn");
const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartDiscount = document.getElementById("cartDiscount");
const cartTotal = document.getElementById("cartTotal");
const closeModal = document.getElementById("closeModal");

// Render product cards
products.forEach(p => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <img src="${p.img}" alt="${p.name}">
    <h3>${p.name}</h3>
    <p>₹${p.price}</p>
    <button data-id="${p.id}">
      <img class="icon plus" src="assets/icons/Plus.svg" alt="Add">
      <img class="icon check hidden" src="assets/icons/Check.svg" alt="Added">
      <span class="btn-text">Add to Bundle</span>
    </button>
  `;
  productGrid.appendChild(card);
});

// Toggle select
productGrid.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    const btn = e.target.closest("button");
    const id = +btn.dataset.id;
    const product = products.find(p => p.id === id);
    const index = selected.findIndex(p => p.id === id);

    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push({ ...product, quantity: 1 });
    }
    updateUI();
  }
});

// Update sidebar UI
function updateUI() {
  selectedList.innerHTML = "";
  document.querySelectorAll(".product-card button").forEach(btn => {
    const id = +btn.dataset.id;
    const isSelected = selected.find(p => p.id === id);
    btn.classList.toggle("selected", !!isSelected);
    btn.querySelector(".plus").classList.toggle("hidden", !!isSelected);
    btn.querySelector(".check").classList.toggle("hidden", !isSelected);
    btn.querySelector(".btn-text").textContent = isSelected ? "Added" : "Add to Bundle";
  });

  let totalQty = 0;
  let totalPrice = 0;
  selected.forEach(p => {
    totalQty += p.quantity;
    totalPrice += p.price * p.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <span>${p.name}<br>₹${p.price}</span>
      <div class="quantity">
        <button class="minus" data-id="${p.id}">-</button>
        <span>${p.quantity}</span>
        <button class="plus" data-id="${p.id}">+</button>
      </div>
      <button class="remove" data-id="${p.id}">🗑️</button>
    `;
    selectedList.appendChild(li);
  });

  const discount = totalQty >= 3 ? 0.3 : 0;
  const discountVal = Math.round(totalPrice * discount);
  const finalPrice = totalPrice - discountVal;

  progressCount.textContent = `${totalQty}/3 added`;
  progressFill.style.width = `${Math.min((totalQty / 3) * 100, 100)}%`;
  discountAmount.textContent = discountVal;
  subtotal.textContent = finalPrice;

  bundleBtn.disabled = totalQty < 3;
  bundleBtn.classList.toggle("active", totalQty >= 3);
}

// Quantity controls
selectedList.addEventListener("click", (e) => {
  const id = +e.target.dataset.id;
  const item = selected.find(i => i.id === id);

  if (e.target.classList.contains("minus") && item.quantity > 1) {
    item.quantity--;
  }
  if (e.target.classList.contains("plus")) {
    item.quantity++;
  }
  if (e.target.classList.contains("remove")) {
    selected = selected.filter(i => i.id !== id);
  }
  updateUI();
});

// Cart modal
bundleBtn.addEventListener("click", () => {
  cartItems.innerHTML = "";
  let totalQty = 0, totalPrice = 0;
  selected.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.quantity}x ${p.name} - ₹${p.price * p.quantity}`;
    cartItems.appendChild(li);
    totalQty += p.quantity;
    totalPrice += p.price * p.quantity;
  });
  const discount = totalQty >= 3 ? 0.3 : 0;
  const discountVal = Math.round(totalPrice * discount);
  const finalPrice = totalPrice - discountVal;

  cartDiscount.textContent = discountVal;
  cartTotal.textContent = finalPrice;

  cartModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
  cartModal.style.display = "none";
});

updateUI();
