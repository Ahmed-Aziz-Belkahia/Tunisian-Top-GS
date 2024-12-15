document.addEventListener("DOMContentLoaded", function () {
    // Elements for mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.querySelector('.mobile_menu');
    const closeMenu = document.querySelector('.close_menu');

    // Elements for dropdowns
    const notificationBell = document.querySelector('.notification_bell');
    const profileIcon = document.querySelector('.pfp img');
    const notificationsDropdown = document.querySelector('.dropdown.notifications .dropdown_content');
    const profileDropdown = document.querySelector('.dropdown_profile .dropdown_content');

    
    // Mobile menu toggle functionality
    if (hamburger && mobileMenu && closeMenu) {
        hamburger.addEventListener('click', function () {
            mobileMenu.classList.toggle('active'); // Toggle 'active' class
            hamburger.classList.toggle('open'); // Optional: add class to animate hamburger
        });

        // Close the mobile menu when 'X' is clicked
        closeMenu.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('open'); // Reset hamburger state if needed
        });

        // Close menu if clicked outside of it
        window.addEventListener('click', function (e) {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('open');
            }
        });
    }

    // Toggle notifications dropdown
    if (notificationBell && notificationsDropdown) {
        notificationBell.addEventListener('click', function (e) {
            e.stopPropagation();
            notificationsDropdown.classList.toggle('active');
            profileDropdown.classList.remove('active'); // Close profile dropdown if open
        });
    }

    // Toggle profile dropdown
    if (profileIcon && profileDropdown && notificationsDropdown) {
        profileIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
            notificationsDropdown.classList.remove('active'); // Close notifications dropdown if open
        });
    }

    // Close dropdowns when clicking outside of them
    window.addEventListener('click', function (e) {
        if (profileIcon && profileDropdown && notificationsDropdown) {
            if (!notificationsDropdown.contains(e.target) && !notificationBell.contains(e.target)) {
                notificationsDropdown.classList.remove('active');
            }
            if (!profileDropdown.contains(e.target) && !profileIcon.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        }
    });

    // Close dropdowns when Escape key is pressed
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && notificationsDropdown) {
            notificationsDropdown.classList.remove('active');
            profileDropdown.classList.remove('active');
        }
    });

    // WebSocket for notifications
    const notificationSocket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/notifications/`);

    notificationSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.notification) {
            displayNotification(data.notification);
        }
    };

    notificationSocket.onclose = () => {
        console.error('Notification socket closed unexpectedly');
    };

    // Display notification in the notification list
    function displayNotification(notificationData) {
        const notification = JSON.parse(notificationData)[0];
        const notificationFields = notification.fields;

        const notificationElement = document.createElement('li');
        notificationElement.classList.add('--unread', 'notification-pop');

        const timestamp = new Date(notificationFields.timestamp).toLocaleString();
        notificationElement.innerHTML = notificationFields.link ? `
            <a href="${notificationFields.link}" target="_blank" class="notification-content">
                <div class="notif">
                    <i class="fa-solid fa-book"></i>
                    <div class="wrap-date-time">
                        <span class='notification-text'>${notificationFields.content}</span>
                        <span class='notification-text-date'>${timestamp}</span>
                    </div>
                </div>
            </a>` : `
            <div class="notification-content">
                <div class="notif">
                    <img src="/media/${notificationFields.icon}" alt="Notification Icon">
                    <div class="wrap-date-time">
                        <span class='notification-text'>${notificationFields.content}</span>
                        <span class='notification-text-date'>${timestamp}</span>
                    </div>
                </div>
            </div>`;
        
            addNotification(
                notificationFields.content, 
                timestamp, 
                notificationFields.link ? notificationFields.link : null, 
                notificationFields.icon
            );

        const notificationsList = document.querySelector('.notifications-list');
       console.log("no list", notificationsList)
       notificationsList.insertBefore(notificationElement, notificationsList.firstChild);

}

    // Add notification with close functionality and auto-dismissal
    function addNotification(text, timestamp, link, icon) {
        const notification = document.createElement('div');
        notification.classList.add('not-not', '--unread');
        timestamp = new Date(timestamp).toLocaleString();

        notification.innerHTML = link ? `
            <div class="notification-header">
                <a href="${link}" class="notification-content">
                    <div class="notci">
                        <i class="fa-solid ${icon}"></i>
                        <div class="notci-wrap-date-time">
                            <span class='not-c-notification-text'>${text}</span>
                            <span class='not-c-notification-text-date'>${timestamp}</span>
                        </div>
                    </div>
                </a>
                <button class="close-btn">&times;</button>
            </div>` : `
            <div class="notification-header">
                <div class="notification-content">
                    <div class="notci">
                        <i class="fa-solid ${icon}"></i>
                        <div class="notci-wrap-date-time">
                            <span class='not-c-notification-text'>${text}</span>
                            <span class='not-c-notification-text-date'>${timestamp}</span>
                        </div>
                    </div>
                </div>
                <button class="close-btn">&times;</button>
            </div>`;

        const notc = document.querySelector('.notc');
        notc.insertBefore(notification, notc.firstChild);

        // Close button functionality
        const closeButton = notification.querySelector('.close-btn');
        closeButton.addEventListener('click', () => removeNotificationWithAnimation(notification));

        // Auto-dismiss after 5 seconds
        setTimeout(() => removeNotificationWithAnimation(notification), 5000);
    }

    // Remove notification with animation
    function removeNotificationWithAnimation(notification) {
        notification.classList.add('disappear');
        setTimeout(() => notification.remove(), 500);
    }
    
    function highlightCurrentPage() {
        const navLinks = document.querySelectorAll('.browser a'); // Select all <a> tags in .browser class
        const currentPath = window.location.pathname;
    
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href'); // Get the href of each link
            if (currentPath === linkPath) {
                link.querySelector('.browser_el').classList.add('active-nav'); // Add the active class
            }
        });
    }
    
    // Call the highlight function
    highlightCurrentPage();
    
    document.querySelector('.npop i').addEventListener("click", () => {
        document.querySelector('.npop').remove();
    });
});