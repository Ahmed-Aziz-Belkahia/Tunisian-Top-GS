document.addEventListener('DOMContentLoaded', function() {
    const placeOrderButton = document.querySelector(".place-order-button");
    const placeOrderText = document.getElementById('placeOrderText');
    const loadingIndicator = document.getElementById('loadingIndicator');

    placeOrderButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default action of the anchor tag

        // Update button to show loading state
        placeOrderText.textContent = 'Processing...';
        loadingIndicator.style.display = 'inline-block';

        // Collect input values
        const firstName = document.getElementById("id_first_name").value;
        const lastName = document.getElementById("id_last_name").value;
        const address = document.getElementById("id_address").value;
        const city = document.getElementById("id_city").value;
        const state = document.getElementById("id_state").value;
        const zipCode = document.getElementById("id_zip_code").value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value; // Get selected payment method

        // AJAX request to create the order
        $.ajax({
            type: 'POST',
            url: '/create-order/',
            data: {
                "first_name": firstName,
                "last_name": lastName,
                "address": address,
                "city": city,
                "state": state,
                "zip_code": zipCode,
                "payment_method": paymentMethod,
            },
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
            },
            success: function(response) {
                setTimeout(function() {
                    // Redirect or take action only after 1.5 seconds of showing the loading indicator
                    window.location.href = response.url;
                }, 1500);
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                // Handle error by reverting button text
                placeOrderText.textContent = 'Place Order';
                loadingIndicator.style.display = 'none';
                showPopup('An error occurred. Please try again.');
            }
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function showPopup(message) {
        const popupMessage = document.getElementById('popupMessage');
        const popupSpan = document.getElementById('popupSpan');
        popupSpan.innerText = message;
        popupMessage.style.display = 'flex';
        setTimeout(function() {
            popupMessage.style.display = 'none';
        }, 3000);
    }
});
