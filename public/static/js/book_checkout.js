// Get the quantity input field and the buttons
const quantityInput = document.getElementById('quantity');
const increaseButton = document.getElementById('increase-quantity');
const decreaseButton = document.getElementById('decrease-quantity');

// Set the price per book
const pricePerBook = 69; // Price in TND

// Function to update the total price
function updateTotal() {
    const quantity = parseInt(quantityInput.value);
    const totalPriceElement = document.querySelector('.total .tv');
    if (!isNaN(quantity)) {
        const totalPrice = (quantity * pricePerBook).toFixed(2); // Calculate total
        totalPriceElement.textContent = `${totalPrice} TND`; // Update total price display
    }
}

// Event listener for the increase button
increaseButton.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    if (!isNaN(currentValue)) {
        quantityInput.value = currentValue + 1; // Increment the quantity
        updateTotal(); // Update the total price
    }
});

// Event listener for the decrease button
decreaseButton.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    if (!isNaN(currentValue) && currentValue > 1) {
        quantityInput.value = currentValue - 1; // Decrement the quantity, ensuring it doesn't go below 1
        updateTotal(); // Update the total price
    }
});

// Update total when quantity input changes directly
quantityInput.addEventListener('change', function () {
    const quantity = parseInt(quantityInput.value);
    if (!isNaN(quantity) && quantity > 0) {
        updateTotal(); // Update total price if quantity is valid
    }
});

// Initialize total price on page load
updateTotal(); // Set initial total price

// Event listener for order placement
document.querySelector('.pob').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default action of the button

    // Select all input fields
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const name = document.getElementById('name');
    const address1 = document.getElementById('address1');
    const quantity = document.getElementById('quantity');
    const state = document.getElementById('state'); // Added state dropdown

    // Initialize an array to collect error messages
    let errors = [];

    // Validate each required field
    if (!email.value) {
        errors.push('Email is required.');
    }
    if (!phone.value) {
        errors.push('Phone number is required.');
    }
    if (!name.value) {
        errors.push('Name is required.');
    }
    if (!address1.value) {
        errors.push('Address Line 1 is required.');
    }
    if (!state.value) { // Validate the state selection
        errors.push('State is required.');
    }
    if (!quantity.value || parseInt(quantity.value) <= 0) {
        errors.push('Quantity must be a positive number.');
    }

    // Select the feedback area
    const feedbackArea = document.getElementById('validation-feedback');
    const errorMessage = document.getElementById('error-message'); // Ensure this exists

    // Clear previous messages
    feedbackArea.style.display = 'none'; // Hide the feedback area initially
    errorMessage.textContent = ''; // Clear the message

    // If there are errors, display the first one
    if (errors.length > 0) {
        errorMessage.textContent = errors[0]; // Show only the first error
        feedbackArea.style.display = 'block'; // Show the feedback area
    } else {
        // If all fields are valid, log the values
        console.log('Email:', email.value);
        console.log('Phone:', phone.value);
        console.log('Name:', name.value);
        console.log('Address Line 1:', address1.value);
        console.log('State:', state.value); // Log the selected state
        console.log('Quantity:', quantity.value);

        ajaxRequest("POST", "/book-checkout/", {
            email: email.value,
            phone: phone.value,
            name: name.value,
            address: address1.value,
            state: state.value, // Include state in the request
            quantity: quantity.value
        }, (response) => {
            if (response.success) {
                // Select the main content area where the message will be displayed
                const cont = document.querySelector(".main_cont");
                
                // Remove any existing confirmation messages (if any)
                const existingMessage = document.querySelector(".ck");
                if (existingMessage) {
                    existingMessage.remove();
                }
        
                // Create a new confirmation message element
                const new_cc = document.createElement("div");
                new_cc.classList.add("cc"); // Add class "ck" to identify it later
        
                // Create the tick icon
                const tick = document.createElement("i"); // Corrected to create an <i> element
                tick.classList.add("fa-solid", "fa-circle-check");
        
                // Append the icon and message text to the new confirmation message
                new_cc.append(tick);
                new_cc.append(" Order Placed, Thanks for your purchase");
        
                // Append the new confirmation message to the main content area
                cont.append(new_cc);

                setTimeout(() => {
                    window.location.href = '/home'; // Redirecting to /home
                }, 3000);
            } else {
                console.log("Failed");
            }
        }, null, false, "create book order", () => {});
    }
});
