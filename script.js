// Cart array to store items
let cart = [];

// DOM elements for cart
const cartButton = document.getElementById("cartButton");
const cartModal = document.getElementById("cartModal");
const closeCartModal = document.getElementById("closeCartModal");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const buyNowCartButton = document.getElementById("buyNowCart");
const cartBadge = document.querySelector(".cart-badge");

// DOM elements for QR code
const qrModal = document.getElementById("qrModal");
const closeQrModal = document.getElementById("closeQrModal");
const orderDetails = document.getElementById("orderDetails");
const qrCodeContainer = document.getElementById("qrcode");

// DOM elements for about and sizing
const menuIcon = document.getElementById("menuIcon");
const aboutModal = document.getElementById("aboutModal");
const closeAboutModal = document.getElementById("closeAboutModal");
const sizingModal = document.getElementById("sizingModal");
const closeSizingModal = document.getElementById("closeSizingModal");
const sizingContent = document.getElementById("sizingContent");
const showSizingButtons = document.querySelectorAll(".show-sizing");

// DOM elements for login, greeting, and logout
const loginForm = document.getElementById("loginForm");
const userGreeting = document.getElementById("userGreeting");
const logoutButton = document.getElementById("logoutButton");

// Error handling for critical DOM elements
if (!cartButton || !cartModal || !closeCartModal || !cartItemsContainer || !cartTotal || !cartBadge) {
    console.error("Required cart elements not found!");
}

// Display user greeting and logout button if logged in
function updateUserGreeting() {
    if (userGreeting && logoutButton) {
        const userId = localStorage.getItem("userId");
        if (userId) {
            userGreeting.textContent = `Hello, ${userId}`;
            userGreeting.style.display = "inline-block";
            logoutButton.style.display = "inline-block";
        } else {
            userGreeting.style.display = "none";
            logoutButton.style.display = "none";
        }
    }
}

// Handle logout
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("userId");
        updateUserGreeting();
        window.location.href = "./index.html" // Use root-relative path
    });
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const idNumber = document.getElementById("idNumber").value.trim();

        // Basic validation: Check if ID Number is not empty
        if (idNumber === "") {
            alert("Please enter your ID Number.");
            return;
        }

        // Simulate a successful login
        localStorage.setItem("userId", idNumber);

        // Redirect to the main page using a relative path
        window.location.href = "./home.html"; // Relative to the current directory
    });
}

// Toggle about modal with animation
if (menuIcon) {
    menuIcon.addEventListener("click", () => {
        aboutModal.classList.add("active");
        aboutModal.classList.remove("hidden");
    });
}

if (closeAboutModal) {
    closeAboutModal.addEventListener("click", () => {
        aboutModal.classList.add("hidden");
        setTimeout(() => aboutModal.classList.remove("active"), 300);
    });
}

// Toggle sizing modal with animation and dynamic content
if (showSizingButtons.length > 0) {
    showSizingButtons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");
            sizingContent.innerHTML = ""; // Clear previous content

            if (type === "uniform") {
                sizingContent.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Selected Size</th>
                                <th>Fits</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>STD (Standard)</td>
                                <td>XS, S, M, L</td>
                            </tr>
                            <tr>
                                <td>XL (Extra Large)</td>
                                <td>XL, XXL, XXXL</td>
                            </tr>
                        </tbody>
                    </table>
                `;
            } else if (type === "shorts") {
                sizingContent.innerHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Selected Size</th>
                                <th>Waist</th>
                                <th>Inseam</th>
                                <th>Thigh</th>
                                <th>Hip</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>S (Small)</td>
                                <td>28-30</td>
                                <td>7</td>
                                <td>21-22</td>
                                <td>34-36</td>
                            </tr>
                            <tr>
                                <td>M (Medium)</td>
                                <td>32-34</td>
                                <td>7.5</td>
                                <td>23-24</td>
                                <td>38-40</td>
                            </tr>
                            <tr>
                                <td>L (Large)</td>
                                <td>36-38</td>
                                <td>8</td>
                                <td>25-26</td>
                                <td>42-44</td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 1rem; text-align: center;">* Measurements are in inches.</p>
                `;
            }

            sizingModal.classList.add("active");
            sizingModal.classList.remove("hidden");
        });
    });
}

if (closeSizingModal) {
    closeSizingModal.addEventListener("click", () => {
        sizingModal.classList.add("hidden");
        setTimeout(() => sizingModal.classList.remove("active"), 300);
        sizingContent.innerHTML = ""; // Clear content
    });
}

// Add to Cart functionality with animation
if (document.querySelectorAll(".add-to-cart").length > 0) {
    document.querySelectorAll(".add-to-cart").forEach((button, index) => {
        button.addEventListener("click", () => {
            const productName = button.getAttribute("data-name");
            const productPrice = parseFloat(button.getAttribute("data-price"));
            const productImage = button.getAttribute("data-image");
            const sizeSelect = document.getElementById(`size${index + 1}`);
            const size = sizeSelect ? sizeSelect.value : "N/A";

            // Validate size selection
            if (sizeSelect && !size) {
                alert("Please select a size before adding to cart!");
                return;
            }

            // Check if item already exists in cart
            const existingItem = cart.find(item => item.name === productName && item.size === size);
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 0) + 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    size: size,
                    image: productImage,
                    quantity: 1
                });
            }

            updateCart();
            animateCartBadge();
        });
    });
}

// Update cart display with animation
function updateCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.style.animationDelay = `${index * 0.1}s`; // Staggered animation
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p>₱${item.price}</p>
                <div class="cart-item-quantity">
                    <button class="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase">+</button>
                </div>
            </div>
            <button class="cart-item-remove"><i class="ri-delete-bin-line"></i></button>
        `;

        // Quantity controls
        cartItem.querySelector(".decrease").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCart();
            }
        });

        cartItem.querySelector(".increase").addEventListener("click", () => {
            item.quantity++;
            updateCart();
        });

        // Remove item
        cartItem.querySelector(".cart-item-remove").addEventListener("click", () => {
            cart.splice(index, 1);
            updateCart();
        });

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = total.toFixed(2);

    // Update cart badge with total quantity of items
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalQuantity > 0 ? totalQuantity : 0;
}

// Open cart modal with animation
if (cartButton) {
    cartButton.addEventListener("click", (e) => {
        e.preventDefault();
        updateCart();
        cartModal.classList.add("active");
        cartModal.classList.remove("hidden");
    });
}

// Close cart modal with animation
if (closeCartModal) {
    closeCartModal.addEventListener("click", () => {
        cartModal.classList.add("hidden");
        setTimeout(() => cartModal.classList.remove("active"), 300);
    });
}

// Buy Now from cart
if (buyNowCartButton) {
    buyNowCartButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Prepare order details for display in QR modal
        let orderInfo = "";
        cart.forEach(item => {
            orderInfo += `Item: ${item.name}\nSize: ${item.size}\nQuantity: ${item.quantity}\nPrice: ₱${item.price}\n\n`;
        });
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        orderInfo += `Total: ₱${total.toFixed(2)}`;

        // Create URL with query parameters for QR code (use relative path)
        const itemsParam = encodeURIComponent(JSON.stringify(cart));
        const orderUrl = `./order-details.html?items=${itemsParam}`;

        // Clear the cart immediately after clicking "Buy Now"
        cart = [];
        updateCart();

        // Display order details in modal
        orderDetails.textContent = orderInfo;

        // Clear previous QR code
        qrCodeContainer.innerHTML = "";

        // Generate QR code with the URL
        try {
            QRCode.toCanvas(qrCodeContainer, orderUrl, { width: 200, height: 200 }, (error) => {
                if (error) {
                    console.error("QR Code generation failed:", error);
                    orderDetails.textContent += "\n[Error: QR Code could not be generated. Please note down your order details.]";
                } else {
                    console.log("QR Code generated successfully with URL:", orderUrl);
                }
            });
        } catch (e) {
            console.error("QR Code library error:", e);
            orderDetails.textContent += "\n[Error: QR Code library failed to load. Please note down your order details.]";
        }

        // Show QR modal and close cart modal with animation
        cartModal.classList.add("hidden");
        setTimeout(() => cartModal.classList.remove("active"), 300);
        qrModal.classList.add("active");
        qrModal.classList.remove("hidden");
    });
}

// Close QR modal with animation
if (closeQrModal) {
    closeQrModal.addEventListener("click", () => {
        qrModal.classList.add("hidden");
        setTimeout(() => qrModal.classList.remove("active"), 300);
        // Clear the cart after closing QR modal (redundant since cleared on "Buy Now", but kept for consistency)
        cart = [];
        updateCart();
    });
}

// Animate cart badge
function animateCartBadge() {
    if (!cartBadge) return;
    cartBadge.style.animation = "bounce 0.5s ease";
    setTimeout(() => {
        cartBadge.style.animation = "";
    }, 500);
}

// Initialize greeting on page load
document.addEventListener("DOMContentLoaded", updateUserGreeting);
