const signupSubmit = document.querySelector("#signupSubmit");

signupSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    $.ajax({
    
        type: 'POST',
        url:'/registerf/',
        data: {
            first_name: $('#registerFirstname').val(),
            last_name: $('#registerLastname').val(),
            username: $('#registerUsername').val(),
            email: $('#registerEmail').val(),
            password1: $('#registerPassword1').val(),
            password2: $('#registerPassword2').val(),
        },  
    
        beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
        },
    
        success: function(response) {
            if (response.success) {
                console.log(response);
                window.location.href = "account/verification/new-email-sent/"
            }
            else{
                const jsonArray = JSON.parse(response.errors);
                if(jsonArray.first_name){
                    const errorMessageDiv = document.getElementById("popupSpan");
                    errorMessageDiv.textContent = "First name is required.";
                    const errorMessageBody = document.getElementById("popupMessage");
                    errorMessageBody.style.display = "flex";
                    document.getElementById('popUpCloseButton').addEventListener('click', function() {
                        popupMessage.style.display = 'none';
                    });
                    return;
                }
                if(jsonArray.first_name){
                    const errorMessageDiv = document.getElementById("popupSpan");
                    errorMessageDiv.textContent = "First name is required.";
                    const errorMessageBody = document.getElementById("popupMessage");
                    errorMessageBody.style.display = "flex";
                    document.getElementById('popUpCloseButton').addEventListener('click', function() {
                        popupMessage.style.display = 'none';
                    });
                    return;
                }
                if(jsonArray.last_name){
                    const errorMessageDiv = document.getElementById("popupSpan");
                    errorMessageDiv.textContent = "Last name is required.";
                    const errorMessageBody = document.getElementById("popupMessage");
                    errorMessageBody.style.display = "flex";
                    document.getElementById('popUpCloseButton').addEventListener('click', function() {
                        popupMessage.style.display = 'none';
                    });
                    return;
                }
                if(jsonArray.email){
                    const errorMessageDiv = document.getElementById("popupSpan");
                    errorMessageDiv.textContent = "Email is required.";
                    const errorMessageBody = document.getElementById("popupMessage");
                    errorMessageBody.style.display = "flex";
                    document.getElementById('popUpCloseButton').addEventListener('click', function() {
                        popupMessage.style.display = 'none';
                    });
                    return;
                }
                if(jsonArray.username){
                    const errorMessageDiv = document.getElementById("popupSpan");
                    errorMessageDiv.textContent = "Username is required.";
                    const errorMessageBody = document.getElementById("popupMessage");
                    errorMessageBody.style.display = "flex";
                    document.getElementById('popUpCloseButton').addEventListener('click', function() {
                        popupMessage.style.display = 'none';
                    });
                    return;
                }
                if(jsonArray.password1){
                    const errorMessageDiv = document.getElementById("popupSpan");
                    errorMessageDiv.textContent = "Password is required.";
                    const errorMessageBody = document.getElementById("popupMessage");
                    errorMessageBody.style.display = "flex";
                    document.getElementById('popUpCloseButton').addEventListener('click', function() {
                        popupMessage.style.display = 'none';
                    });
                    return;
                }
                if(jsonArray.password2){
                    const errorMessageDiv = document.getElementById("popupSpan");
                    errorMessageDiv.textContent = "Repeat Password is required.";
                    const errorMessageBody = document.getElementById("popupMessage");
                    errorMessageBody.style.display = "flex";
                    document.getElementById('popUpCloseButton').addEventListener('click', function() {
                        popupMessage.style.display = 'none';
                    });
                    return;
                }
       

            }
        },
    
        error: function(error) {
          console.log(error);
        }
    });
})

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