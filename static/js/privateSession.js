// document.addEventListener('DOMContentLoaded', function() {
//     var tabs = document.querySelectorAll('ul.tabs li');
//     var nextTabButtons = document.querySelectorAll('.next-tab-btn');
//     var prevTabButtons = document.querySelectorAll('.back-tab-btn');
//     var form = document.querySelector(".sessionForm");
//     var submitButton = document.querySelector(".DoneSubmit");
//     var popupMessage = document.getElementById('popupMessage');
//     var popupSpan = document.getElementById('popupSpan');
  
//     // Function to switch tabs
//     function switchTab(tabId) {
//         tabs.forEach(function(item) {
//             item.classList.remove('current');
//         });
//         var tabContents = document.querySelectorAll('.tab-content');
//         tabContents.forEach(function(content) {
//             content.classList.remove('current');
//         });
  
//         var selectedTab = document.querySelector('ul.tabs li[data-tab="' + tabId + '"]');
//         selectedTab.classList.add('current');
//         document.getElementById(tabId).classList.add('current');
//     }
  
//     // Event listener for tab clicks
//     tabs.forEach(function(tab) {
//         tab.addEventListener('click', function(event) {
//             event.preventDefault(); // Prevent the default action (switching tabs)
//         });
//     });
  
//     // Event listener for next tab buttons
//     nextTabButtons.forEach(function(button) {
//         button.addEventListener('click', function() {
//             var currentTab = document.querySelector('ul.tabs li.current');
//             var currentIndex = Array.from(tabs).indexOf(currentTab);
//             var nextIndex = (currentIndex + 1) % tabs.length;
//             var nextTabId = tabs[nextIndex].getAttribute('data-tab');
//             switchTab(nextTabId);
//         });
//     });
  
//     // Event listener for previous tab buttons
//     prevTabButtons.forEach(function(button) {
//         button.addEventListener('click', function() {
//             var currentTab = document.querySelector('ul.tabs li.current');
//             var currentIndex = Array.from(tabs).indexOf(currentTab);
//             var prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
//             var prevTabId = tabs[prevIndex].getAttribute('data-tab');
//             switchTab(prevTabId);
//         });
//     });
  
//     submitButton.addEventListener("click", function (event) {
//         event.preventDefault();
//         var formData = new FormData(form);
    
//         let isValid = true;
    
//         // Check if any required fields are empty
//         for (const input of form.querySelectorAll("input[required]")) {
//             if (!input.value.trim()) {
//                 isValid = false;
//                 input.classList.add("error");
//             } else {
//                 input.classList.remove("error");
//             }
//         }
    
//         // Check for empty values in formData
//         for (const entry of formData.entries()) {
//             if (entry[1].trim() === '') {
//                 isValid = false;
//                 break; // Exit the loop if any empty value found
//             }
//         }
    
//         if (!isValid) {
//             popupSpan.textContent = "Please fill in all fields!";
//             popupMessage.classList.add('popup-show');
//             // Close button functionality
//             document.getElementById('popUpCloseButton').addEventListener('click', function() {
//                 popupMessage.classList.remove('popup-show');
//             });
//             return;
//         }
    
//         $.ajax({
//             type: 'POST',
//             url: '/schedule_private_session/',
//             data: formData,
//             processData: false,
//             contentType: false,
//             beforeSend: function(xhr, settings) {
//                 xhr.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
//             },
//             success: function(response) {
//                 console.log(response);
//                 replaceScheduleBodyWithDoneContent();
//             },
//             error: function(error) {
//                 console.error('Error filtering products:', error);
//             }
//         });
//     });

//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }

//     function replaceScheduleBodyWithDoneContent() {
//         const scheduleBody = document.querySelector('.schedule-body');
//         if (scheduleBody) {
//             // Clear existing content
//             scheduleBody.innerHTML = '';
    
//             // Create the new content
//             const doneBody = document.createElement('div');
//             doneBody.classList.add('schedule-body', 'done-body');
    
//             const scheduleBodyLeft = document.createElement('div');
//             scheduleBodyLeft.classList.add('schedule-body-left');
//             const doneImg = document.createElement('img');
//             doneImg.src = "/static/assets/done.svg";
//             doneImg.width = "340px";
//             doneImg.height = "340px";
//             doneImg.alt = "Schedule Done";
//             doneImg.classList.add('jello-horizontal');
//             scheduleBodyLeft.appendChild(doneImg);
    
//             const scheduleBodyRight = document.createElement('div');
//             scheduleBodyRight.classList.add('schedule-body-right');
//             const doneContainer = document.createElement('div');
//             doneContainer.classList.add('done-container');
//             const span1 = document.createElement('span');
//             span1.textContent = "Thank you for expressing interest in a private session";
//             const span2 = document.createElement('span');
//             span2.textContent = "We're excited to connect with you! Expect a follow-up from us in 3 to 5 business days. Thanks for reaching out!";
//             const goBackLink = document.createElement('a');
//             goBackLink.href = "/home";
//             goBackLink.classList.add('next-tab-btn');
//             goBackLink.textContent = "Go Back";
//             doneContainer.appendChild(span1);
//             doneContainer.appendChild(span2);
//             doneContainer.appendChild(goBackLink);
//             scheduleBodyRight.appendChild(doneContainer);
    
//             doneBody.appendChild(scheduleBodyLeft);
//             doneBody.appendChild(scheduleBodyRight);
    
//             // Replace the schedule-body content with the new content
//             scheduleBody.appendChild(doneBody);
//         }
//     }
// });
