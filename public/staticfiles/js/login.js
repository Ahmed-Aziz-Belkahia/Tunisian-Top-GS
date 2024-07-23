const signinSubmit = document.querySelector("#signinSubmit");

signinSubmit.addEventListener("click", (event) => {
    event.preventDefault();
    $.ajax({
    
        type: 'POST',
        url: "/loginf/",
        data: {
          username: $('#loginUsername').val(),
          password: $('#loginPassword').val()
        },  
    
        /* csrf */
        beforeSend: function(xhr, settings) {
          xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
        },  
    
        success: function(response) {
            if (response.success) {
                
                window.location.href = "../home";
            } else {
                
                // Display error in the error div
                const errorMessageDiv = document.getElementById("popupSpan");
                errorMessageDiv.textContent = "Invalid username or password";
                const errorMessageBody = document.getElementById("popupMessage");
                errorMessageBody.style.display = "flex";

                document.getElementById('popUpCloseButton').addEventListener('click', function() {
                    popupMessage.style.display = 'none';
                });
            }
        },
    
        error: function(error) {
            
            // Display error in the error div
            const errorMessageDiv = document.getElementById("popupSpan");
            errorMessageDiv.textContent = "An error occurred while processing your request.";
            const errorMessageBody = document.getElementById("popupMessage");
            errorMessageBody.style.display = "flex";

            document.getElementById('popUpCloseButton').addEventListener('click', function() {
                popupMessage.style.display = 'none';
            });
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