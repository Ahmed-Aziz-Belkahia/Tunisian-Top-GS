document.addEventListener('DOMContentLoaded', function() {
    const placeOrderButton = document.querySelector(".place-order-button");
    const placeOrderText = document.getElementById('placeOrderText');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const courseUrlTitle = "{{course.url_title}}";

    placeOrderButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default action of the anchor tag
        
        // Update button to show loading state
        placeOrderText.textContent = 'Processing...';
        loadingIndicator.style.display = 'inline-block';

        // Collect input values
        const formData = new FormData(document.getElementById("orderForm"));
        formData.append("payment_method", document.querySelector('input[name="payment_method"]:checked').value);

        // AJAX request to create the order
        fetch(`/course-checkout/${courseUrlTitle}/`, {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie("csrftoken")
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = "/course_order_complete/";
            } else {
                window.location.href = "/course_order_failed/";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = "/course_order_failed/";
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
});
