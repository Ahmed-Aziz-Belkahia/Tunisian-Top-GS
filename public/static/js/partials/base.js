function ajaxRequest(method, url, data, successFunction, errorFunction, doLog, name="ajaxRequest", beforeFunction) {
    if (beforeFunction != null) {
        beforeFunction()
    }
    
    if (doLog) {
        console.log(name + "...")

    }

    $.ajax({

        type: method,
        url: url,
        data: data,  

        /* csrf */
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
        },  

        success: function(response) {
            if (doLog) {
                
            }
            if (typeof successFunction === 'function') {
                successFunction(response)
            }

        },

        error: function(error) {
            if (doLog) {
                
            }

            if (typeof errorFunction === 'function') {
                errorFunction(error);
            }
        }
    }); 
}

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