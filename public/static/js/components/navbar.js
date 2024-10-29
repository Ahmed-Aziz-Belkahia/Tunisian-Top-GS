/* document.addEventListener('DOMContentLoaded', function () {
    const chevronDownIcon = document.getElementById('chevron-down-icon');
    const profileDropDown = document.getElementById('profile-dropdown');
    const containerProfile = document.querySelector('.container-profile');
    const dropdownMenu = document.getElementById("dropDownMenu");
    const navLinks = document.querySelectorAll(".menu-item");
    const hamburgerLines = document.querySelector(".hamburger-lines");
    const navToggle = document.getElementById("navToggle");
    const navContainer = document.getElementById("navContainer");
    const notification = document.querySelector('.notification');
    const notificationMenu = document.querySelector('.notification > .menu');
    const messages = document.querySelector('.messages');
    const messagesMenu = document.querySelector('.messages > .menu');
    const body = document.querySelector('body');

    const NotificationMobileToggle = document.getElementById("notiToggleMobile");
    const NotificationMobileMenu = document.querySelector(".menu-notifications-mobile");
    const notiToggleMobileClose = document.getElementById("notiToggleMobileClose");
    const mobilenotificon = document.querySelector(".mobile-notif-icon");

    if (profileDropDown) {
        profileDropDown.addEventListener('click', (event) => {
            const isProfileOpen = containerProfile.style.display === 'flex';
            if (!isProfileOpen) {
                closeNotificationMenu();
            }
            chevronDownIcon.classList.toggle('rotate');
            containerProfile.style.display = isProfileOpen ? 'none' : 'flex';
            event.stopPropagation();
        });
    }

    if (NotificationMobileToggle) {
        NotificationMobileToggle.addEventListener("click", (event) => {
            const isNotificationOpen = NotificationMobileMenu.style.display === 'block';
            if (!isNotificationOpen) {
                closeProfileDropDown();
            }
            NotificationMobileMenu.style.display = isNotificationOpen ? 'none' : 'block';
            NotificationMobileMenu.style.transform = isNotificationOpen ? 'translate(-150%)' : 'translate(0)';
            navToggle.checked = false;
            hamburgerLines.classList.remove("checked");
            navToggle.style.zIndex = navToggle.style.zIndex === '5' ? '5' : '0';
            event.stopPropagation();
        });
    }

    if (notiToggleMobileClose) {
        notiToggleMobileClose.addEventListener("click", () => {
            closeNotificationMenu();
        });
    }

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#profile-dropdown') && !event.target.closest('.container-profile')) {
            closeProfileDropDown();
        }
        if (!event.target.closest('.notification') && !event.target.closest('.menu-notifications-mobile')) {
            closeNotificationMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeProfileDropDown();
            closeNotificationMenu();
        }
    });

    if (navToggle) {
        navToggle.addEventListener("change", () => {
            const isChecked = navToggle.checked;
            hamburgerLines.classList.toggle("checked", isChecked);
            dropdownMenu.style.transform = isChecked ? "translate(0)" : "translate(-150%)";
            dropdownMenu.style.display = isChecked ? "flex" : "none";
            navContainer.style.position = isChecked ? "fixed" : "relative";
            navContainer.style.zIndex = isChecked ? "120" : "100";
            mobilenotificon.style.zIndex = isChecked ? "0" : "2";
        });
    }

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll('.nav-slipe').forEach(n => n.classList.remove('active-nav'));
            link.querySelector('.nav-slipe').classList.add('active-nav');
        });
    });

    if (notification && notificationMenu) setupMenuInteraction(notification, messages);
    if (messages && messagesMenu) setupMenuInteraction(messages, notification);

    body.addEventListener('click', closeAllMenus);

    highlightCurrentPage();

    function setupMenuInteraction(menu, otherMenu) {
        menu.addEventListener('click', function (e) {
            e.stopPropagation();
            otherMenu.classList.remove('--active');
            menu.classList.toggle('--active');
        });

        menu.querySelector('.menu').addEventListener('click', e => e.stopPropagation());
    }

    function closeProfileDropDown() {
        if (chevronDownIcon && containerProfile) {
            chevronDownIcon.classList.remove('rotate');
            containerProfile.style.display = 'none';
        }
    }

    function closeNotificationMenu() {
        if (NotificationMobileMenu) {
            NotificationMobileMenu.style.display = 'none';
            NotificationMobileMenu.style.transform = 'translate(-150%)';
        }
        
    }

    function closeAllMenus() {
        closeProfileDropDown();
        closeNotificationMenu();
        [notification, messages].forEach(menu => menu && menu.classList.remove('--active'));
    }
});

function highlightCurrentPage() {
    const currentPage = getCurrentPage();
    const currentLink = document.querySelector(`a[id="${currentPage}"] > .nav-slipe`) || document.querySelector(`a[id="home"] .nav-slipe`);
    currentLink && currentLink.classList.add('active-nav');
}

function getCurrentPage() {
    const pathArray = window.location.pathname.split('/');
    const pageMappings = {
        '/levels': 'courses',
        '/video-course': 'courses',
        '/private-session': 'private-session',
        '/shop': 'shop',
        '/product': 'shop',
        '/cart': 'shop',
        '/checkout': 'shop',
        '/courses': 'courses',
        '/dashboard': 'dashboard',
        '/profile': 'home',
        '/course-detail': 'courses',
        'server-chat/badges/': 'serverChat',
        'server-chat/': 'serverChat'
    };
    
    for (const path in pageMappings) {
        if (window.location.pathname.includes(path)) return pageMappings[path];
    }

    return pathArray.pop() || pathArray.pop() || 'home';
}

function countItems(selector, counterSelector, maxCount = 9) {
    const countElement = document.querySelector(counterSelector);
    const itemList = document.querySelector(selector);
    const itemCount = itemList ? itemList.children.length : 0;
    if (countElement) {
        countElement.innerHTML = itemCount === 0 ? '0' : itemCount > maxCount ? `${maxCount}+` : itemCount;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    countItems('.notifications-list', '.counter-noti-messd');
    countItems('.notifications-list', '.counter-noti-messd-mobile');
});

document.addEventListener("DOMContentLoaded", function() {
    const notificationSound = document.getElementById('notificationSound');
    const staticIcon = document.querySelector('.static-icon');
    const animatedIcon = document.querySelector('.animated-icon');
    const notificationContainer = document.getElementById('notification-container');
    if (notificationContainer) {
        const staticIconUrl = notificationContainer.getAttribute('data-static-icon');
        const animatedIconUrl = notificationContainer.getAttribute('data-animated-icon');
    }
    let userInteracted = false;
    let favicon = document.querySelector('link[rel="icon"]');

    document.body.addEventListener('click', () => {
        userInteracted = true;
    });

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const notificationSocket = new WebSocket(`${protocol}://${window.location.host}/ws/notifications/`);

    notificationSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.notification) {
            displayNotification(data.notification);
            console.log('Notification received:', data);
            if (userInteracted) {
                playNotificationSound();
            }
            showAnimatedIcon();
            showBrowserNotification(data.notification);
            updateFaviconNotificationCounter();
        }
    };

    notificationSocket.onclose = (e) => {
        console.error('Notification socket closed unexpectedly');
    };

    function playNotificationSound() {
        notificationSound.play().catch((error) => {
            console.error('Failed to play sound:', error);
        });
    }

    function displayNotification(notificationData) {
        const notification = JSON.parse(notificationData)[0];
        const notificationFields = notification.fields;
        console.log(notification.fields)
        const notificationElement = document.createElement('li');
        notificationElement.classList.add('--unread', 'notification-pop');

        const timestamp = new Date(notificationFields.timestamp).toLocaleString();

        if (notificationFields.link) {
            notificationElement.innerHTML = `
                <a href="${notificationFields.link}" target="_blank" class="notification-content">
                    <div class="notif">
                        <i class="fa-solid fa-book"></i>
                        <div class="wrap-date-time">
                            <span class='notification-text'>${notificationFields.content}</span>
                            <span class='notification-text-date'>${timestamp}</span>
                        </div>      
                    </div>
                </a>
            `;
            addNotification(notificationFields.content, notificationFields.timestamp, notificationFields.link, notificationFields.icon)

        } else {
            notificationElement.innerHTML = `
                <div class="notification-content">
                    <div class="notif">
                        <img src="/media/${notificationFields.icon}" alt="Notification Icon">
                        <div class="wrap-date-time">
                            <span class='notification-text'>${notificationFields.content}</span>
                            <span class='notification-text-date'>${timestamp}</span>
                        </div>
                    </div>
                </div>
            `;
            addNotification(notificationFields.content, notificationFields.timestamp, "", notificationFields.icon)
        }


        const notificationsList = document.querySelector('.notifications-list');
        notificationsList.insertBefore(notificationElement, notificationsList.firstChild);

        updateNotificationCounter();
    }

    function updateNotificationCounter() {
        const counterElement = document.querySelector('.counter-noti-messd');
        const counterElementMobile = document.querySelector('.counter-noti-messd-mobile');
        const notificationsList = document.querySelector('.notifications-list');
        const unreadCount = notificationsList.querySelectorAll('.--unread').length;
        counterElement.textContent = unreadCount > 9 ? '9+' : unreadCount;
        counterElement.classList.add('counter-pop');
        counterElementMobile.textContent = unreadCount > 9 ? '9+' : unreadCount;
        counterElementMobile.classList.add('counter-pop');
        updateFaviconNotificationCounter(unreadCount);
    }

    function showAnimatedIcon() {
        if (staticIcon && animatedIcon) {
            staticIcon.classList.add('hidden');
            animatedIcon.classList.add('active');
            setTimeout(() => {
                animatedIcon.classList.remove('active');
                staticIcon.classList.remove('hidden');
            }, 200000); // Duration of the animation in milliseconds
        } else {
            console.error('Static or animated icon not found in the DOM');
        }
    }

    function showBrowserNotification(notificationData) {
        const notification = JSON.parse(notificationData)[0];
        const notificationFields = notification.fields;

        if (Notification.permission === 'granted') {
            new Notification('New Notification', {
                body: notificationFields.content,
                icon: `/media/${notificationFields.icon}`
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('New Notification', {
                        body: notificationFields.content,
                        icon: `/media/${notificationFields.icon}`
                    });
                }
            });
        }
    }

    function updateFaviconNotificationCounter(count) {
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }

        if (!count || count <= 0) {
            favicon.href = staticIconUrl;
        } else {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = canvas.height = 32;

            const img = new Image();
            img.src = animatedIconUrl;
            img.onload = () => {
                context.drawImage(img, 0, 0, 32, 32);
                context.fillStyle = '#F00';
                context.beginPath();
                context.arc(24, 8, 8, 0, 2 * Math.PI);
                context.fill();
                context.fillStyle = '#FFF';
                context.font = 'bold 12px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(count > 9 ? '9+' : count, 24, 8);

                favicon.href = canvas.toDataURL('image/png');
            };
        }
    }


    const notc = document.querySelector('.notc');

    function addNotification(text, timestamp, link, ico) {
        // Check if there is already an active notification
        const existingNotification = document.querySelector('.not-not');
    

        timestamp = new Date(timestamp).toLocaleString();
    
        const notification = document.createElement('div');
        notification.classList.add('not-not', '--unread');

        if (link && link !== "") {
            notification.innerHTML = `
                <div class="notification-header">
                    <a href="${link}" class="notification-content">
                        <div class="notci">
                            <i class="fa-solid ${ico}"></i>
                            <div class="notci-wrap-date-time">
                                <span class='not-c-notification-text'>${text}</span>
                                <span class='not-c-notification-text-date'>${timestamp}</span>
                            </div>
                        </div>
                    </a>
                    <button class="close-btn">&times;</button>
                </div>`;
        } else {
            notification.innerHTML = `
                <div class="notification-header">
                    <a class="notification-content">
                        <div class="notci">
                            <i class="fa-solid ${ico}"></i>
                            <div class="notci-wrap-date-time">
                                <span class='not-c-notification-text'>${text}</span>
                                <span class='not-c-notification-text-date'>${timestamp}</span>
                            </div>
                        </div>
                    </a>
                    <button class="close-btn">&times;</button>
                </div>`;
        }
    
        // Insert the new notification at the top
        notc.insertBefore(notification, notc.firstChild);
    
        // Set up event listener for close button
        const closeButton = notification.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            removeNotificationWithAnimation(notification);
        });
    
        // Set the notification to disappear after 5 seconds
        setTimeout(() => {
            removeNotificationWithAnimation(notification);
        }, 2000);
    }
    
    function removeNotificationWithAnimation(notification) {
        // Add the animation class
        notification.classList.add('disappear');
    
        // Remove the element after the animation completes (0.5s in this case)
        setTimeout(() => {
            notification.remove();
        }, 500);
    }
    
}); */











































































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
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
            notificationsDropdown.classList.remove('active'); // Close notifications dropdown if open
        });
    }

    // Close dropdowns when clicking outside of them
    window.addEventListener('click', function (e) {
        if (!notificationsDropdown.contains(e.target) && !notificationBell.contains(e.target)) {
            notificationsDropdown.classList.remove('active');
        }
        if (!profileDropdown.contains(e.target) && !profileIcon.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    // Close dropdowns when Escape key is pressed
    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
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
    
});





