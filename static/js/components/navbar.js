document.addEventListener('DOMContentLoaded', function () {
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

    profileDropDown.addEventListener('click', (event) => {
        const isProfileOpen = containerProfile.style.display === 'flex';
        if (!isProfileOpen) {
            closeNotificationMenu();
        }
        chevronDownIcon.classList.toggle('rotate');
        containerProfile.style.display = isProfileOpen ? 'none' : 'flex';
        event.stopPropagation();
    });

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

    notiToggleMobileClose.addEventListener("click", () => {
        closeNotificationMenu();
    });

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

    navToggle.addEventListener("change", () => {
        const isChecked = navToggle.checked;
        hamburgerLines.classList.toggle("checked", isChecked);
        dropdownMenu.style.transform = isChecked ? "translate(0)" : "translate(-150%)";
        dropdownMenu.style.display = isChecked ? "block" : "none";
        navContainer.style.position = isChecked ? "fixed" : "relative";
        navContainer.style.zIndex = isChecked ? "120" : "100";
        mobilenotificon.style.zIndex = isChecked ? "0" : "2";
    });

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
        chevronDownIcon.classList.remove('rotate');
        containerProfile.style.display = 'none';
    }

    function closeNotificationMenu() {
        NotificationMobileMenu.style.display = 'none';
        NotificationMobileMenu.style.transform = 'translate(-150%)';
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
    countElement.innerHTML = itemCount === 0 ? '0' : itemCount > maxCount ? `${maxCount}+` : itemCount;
}

document.addEventListener('DOMContentLoaded', function () {
    countItems('.notifications-list', '.counter-noti-messd');
});

document.addEventListener("DOMContentLoaded", function() {
    const notificationSound = document.getElementById('notificationSound');
    const staticIcon = document.querySelector('.static-icon');
    const animatedIcon = document.querySelector('.animated-icon');
    const notificationContainer = document.getElementById('notification-container');
    const staticIconUrl = notificationContainer.getAttribute('data-static-icon');
    const animatedIconUrl = notificationContainer.getAttribute('data-animated-icon');
    let userInteracted = false;
    let favicon = document.querySelector('link[rel="icon"]');

    document.body.addEventListener('click', () => {
        userInteracted = true;
    });

    const notificationSocket = new WebSocket(
        `ws://${window.location.host}/ws/notifications/`
    );

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

        const notificationElement = document.createElement('li');
        notificationElement.classList.add('--unread', 'notification-pop');

        const timestamp = new Date(notificationFields.timestamp).toLocaleString();

        if (notificationFields.link) {
            notificationElement.innerHTML = `
                <a href="${notificationFields.link}" target="_blank" class="notification-content">
                    <div class="notif">
                        <img src="/media/${notificationFields.icon}" alt="Notification Icon">
                        <div class="wrap-date-time">
                            <span class='notification-text'>${notificationFields.content}</span>
                            <span class='notification-text-date'>${timestamp}</span>
                        </div>
                    </div>
                </a>
            `;
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
        }

        const notificationsList = document.querySelector('.notifications-list');
        notificationsList.insertBefore(notificationElement, notificationsList.firstChild);

        updateNotificationCounter();
    }

    function updateNotificationCounter() {
        const counterElement = document.querySelector('.counter-noti-messd');
        const notificationsList = document.querySelector('.notifications-list');
        const unreadCount = notificationsList.querySelectorAll('.--unread').length;
        counterElement.textContent = unreadCount > 9 ? '9+' : unreadCount;
        counterElement.classList.add('counter-pop');
        updateFaviconNotificationCounter(unreadCount);
    }

    function showAnimatedIcon() {
        if (staticIcon && animatedIcon) {
            staticIcon.classList.add('hidden');
            animatedIcon.classList.add('active');
            setTimeout(() => {
                animatedIcon.classList.remove('active');
                staticIcon.classList.remove('hidden');
            }, 2000); // Duration of the animation in milliseconds
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
});
