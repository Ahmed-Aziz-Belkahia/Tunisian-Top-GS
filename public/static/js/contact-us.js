document.addEventListener('DOMContentLoaded', function() {
    const showPopup = (message, isSuccess) => {
        const popup = document.getElementById('popupMessage');
        const popupSpan = document.getElementById('popupSpan');
        const popupImage = document.getElementById('popupImage');

        popupSpan.textContent = message;
        popupImage.src = isSuccess ? `${staticUrl}assets/success-icon.svg` : `${staticUrl}assets/error-icon.svg`;
        popup.style.display = 'block';
    };

    const hidePopup = () => {
        const popup = document.getElementById('popupMessage');
        popup.style.display = 'none';
    };

    document.getElementById('popUpCloseButton').addEventListener('click', hidePopup);

    document.getElementById('contactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch("{% url 'contact-us' %}", {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showPopup('Thanks for contacting us!', true);
                document.getElementById('contactForm').reset();
            } else {
                showPopup('There was an error submitting the form. Please try again.', false);
            }
        })
        .catch(() => {
            showPopup('There was an error submitting the form. Please try again.', false);
        });
    });
});
