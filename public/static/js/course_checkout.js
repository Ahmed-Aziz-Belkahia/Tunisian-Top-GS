document.addEventListener('DOMContentLoaded', function() {
    const placeOrderButton = document.querySelector(".place-order-button");
    const placeOrderText = document.getElementById('placeOrderText');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Function to validate inputs
    function validateInputs() {
        const firstName = document.getElementById("id_first_name").value.trim();
        const lastName = document.getElementById("id_last_name").value.trim();
        const age = document.getElementById("id_age").value.trim();
        const phone = document.getElementById("id_phone").value.trim();
        const email = document.getElementById("id_email").value.trim();
        const country = document.getElementById("id_country").value.trim();
        const state = document.getElementById("id_state").value.trim();
        const type = document.getElementById("id_type").value.trim();
        
        // Validate all required fields
        if (!firstName || !lastName || !age || !phone || !email || !country || !state || !type) {
            return false; // Invalid if any field is empty
        }
        return true; // All validations passed
    }

    placeOrderButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default action of the anchor tag

        // Validate inputs before proceeding
        if (!validateInputs()) {
            alert('Please fill in all fields correctly.'); // Alert the user
            return; // Stop further execution if validation fails
        }

        // Update button to show loading state
        placeOrderText.textContent = 'Processing...';
        loadingIndicator.style.display = 'inline-block';

        // Collect input values manually
        const firstName = document.getElementById("id_first_name").value;
        const lastName = document.getElementById("id_last_name").value;
        const age = document.getElementById("id_age").value;
        const phone = document.getElementById("id_phone").value;
        const email = document.getElementById("id_email").value;
        const country = document.getElementById("id_country").value;
        const state = document.getElementById("id_state").value;
        const type = document.getElementById("id_type").value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

        // Prepare data object
        const orderData = {
            first_name: firstName,
            last_name: lastName,
            age: age,
            phone: phone,
            email: email,
            country: country,
            state: state,
            type: type,
            payment_method: paymentMethod
        };

        // Perform AJAX request
        ajaxRequest("POST", "/course-checkout/" + courseUrlTitle + "/", orderData, (response) => {
            window.location.href = "/course_order_complete/";
        }, (response) => {
            window.location.href = "/course_order_failed/";
        }, false, "send course order", null);
    });
});
