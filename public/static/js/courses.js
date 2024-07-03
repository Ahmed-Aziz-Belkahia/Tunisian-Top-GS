document.addEventListener('DOMContentLoaded', function () {
    var chevronDownIcon = document.getElementById('chevron-down-icon');
    var ProfileDropDown = document.getElementById('profile-dropdown');
    var containerProfile = document.querySelector('.container-profile');

    ProfileDropDown.addEventListener('click', function () {
        chevronDownIcon.classList.toggle('rotate');
        containerProfile.style.display = containerProfile.style.display === 'flex' ? 'none' : 'flex';
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdownMenu = document.getElementById("dropDownMenu");
    const navLinks = document.querySelectorAll(".menu-item");
    const hamburgerLines = document.querySelector(".hamburger-lines");
    const navToggle = document.getElementById("navToggle");
  
    navToggle.addEventListener("change", function () {
      if (this.checked) {
        hamburgerLines.classList.add("checked"); 
        dropdownMenu.style.transform = "translate(0)";
        dropdownMenu.style.zIndex = "1";
  
      } else {
        hamburgerLines.classList.remove("checked");
        dropdownMenu.style.transform = "translate(-150%)";
      }
    });
    // Close the menu when a menu item is clicked
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        dropdownMenu.style.transform = "translate(-150%)";
        hamburgerLines.classList.remove("checked");
      });
    });
  });

  
  document.addEventListener('DOMContentLoaded', function () {
    var notification = document.querySelector('.notification');
    var notificationMenu = document.querySelector('.notification > .menu');
    var messages = document.querySelector('.messages');
    var messagesMenu = document.querySelector('.messages > .menu');
    var body = document.querySelector('body');

    if (notification && notificationMenu) {
        notification.addEventListener('click', function (e) {
            e.stopPropagation();
            closeMenu(messages);
            toggleMenu(notification);
        });

        notificationMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    } else {
        console.error("Notification or NotificationMenu not found.");
    }

    if (messages && messagesMenu) {
        messages.addEventListener('click', function (e) {
            e.stopPropagation();
            closeMenu(notification);
            toggleMenu(messages);
        });

        messagesMenu.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    } else {
        console.error("Messages or MessagesMenu not found.");
    }

    body.addEventListener('click', function () {
        closeAllMenu();
    });

    function toggleMenu(displayTarget) {
        var navigationList = [displayTarget.classList.item(0)];

        navigationList.forEach(function (item) {
            var element = document.querySelector(`.${item}`);
            if (element) {
                element.classList.toggle('--active');
            } else {
                console.error(`Element with class ${item} not found.`);
            }
        });
    }

    function closeAllMenu() {
        var navigationList = ['notification', 'messages'];

        navigationList.forEach(function (item) {
            var element = document.querySelector(`.${item}`);
            if (element && element.classList.contains('--active')) {
                element.classList.remove('--active');
            }
        });
    }

    function closeMenu(menuToClose) {
        var element = document.querySelector(`.${menuToClose.classList.item(0)}`);
        if (element && element.classList.contains('--active')) {
            element.classList.remove('--active');
        }
    }
});