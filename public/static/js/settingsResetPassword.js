function goBack() {
    window.history.back();
    return false; // Prevent default link behavior
}

document.addEventListener("DOMContentLoaded", function() {
    const togglePasswordButtons = document.querySelectorAll(".toggle-password");
    const passwordChangeForm = document.getElementById("passwordChangeForm");
    const successPopupCloseButton = document.getElementById("successPopupCloseButton");
    const errorPopupCloseButton = document.getElementById("errorPopupCloseButton");

    togglePasswordButtons.forEach(button => {
        button.addEventListener("click", function() {
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
            const input = document.querySelector(this.getAttribute("toggle"));
            input.type = input.type === "password" ? "text" : "password";
        });
    });

    passwordChangeForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const oldPassword = document.getElementById("old-password-field").value;
        const newPassword = document.getElementById("password-field").value;
        const confirmPassword = document.getElementById("confirm-password-field").value;

        if (newPassword !== confirmPassword) {
            showErrorPopup("Passwords do not match.");
            return;
        }

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch("{% url 'settings_reset_password_action' %}", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrftoken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password1: newPassword,
                new_password2: confirmPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessPopup("Password changed successfully.");
            } else {
                showErrorPopup(parseErrors(data.errors));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showErrorPopup("An error occurred. Please try again.");
        });
    });

    successPopupCloseButton.addEventListener("click", () => {
        document.getElementById("successPopup").style.display = "none";
    });

    errorPopupCloseButton.addEventListener("click", () => {
        document.getElementById("errorPopup").style.display = "none";
    });

    function showSuccessPopup(message) {
        const successPopup = document.getElementById("successPopup");
        document.getElementById("successPopupMessage").innerText = message;
        successPopup.style.display = "block";
    }

    function showErrorPopup(message) {
        const errorPopup = document.getElementById("errorPopup");
        document.getElementById("errorPopupMessage").innerHTML = message;
        errorPopup.style.display = "block";
    }

    function parseErrors(errors) {
        const parsedErrors = [];
        try {
            const errorObj = JSON.parse(errors);
            for (const key in errorObj) {
                if (errorObj.hasOwnProperty(key)) {
                    errorObj[key].forEach(error => {
                        parsedErrors.push(truncateMessage(error.message));
                    });
                }
            }
        } catch (e) {
            parsedErrors.push("An error occurred. Please try again.");
        }
        return parsedErrors.join('<br>');
    }

    function truncateMessage(message) {
        const words = message.split(' ');
        return words.length > 9 ? words.slice(0, 9).join(' ') + '...' : message;
    }
});
