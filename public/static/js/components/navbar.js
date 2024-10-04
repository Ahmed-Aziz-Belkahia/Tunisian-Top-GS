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

/*     const notificationSocket = new WebSocket(
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
    }; */

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
                       <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
<g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2,2)"><path d="M12.81,46.31c0.24,0.06 0.49,0.09 0.73,0.09c1.34,0 2.57,-0.91 2.91,-2.27c2.78,-11.12 9.4,-20.97 18.63,-27.71c1.34,-0.98 1.63,-2.85 0.65,-4.19c-0.98,-1.34 -2.85,-1.63 -4.19,-0.65c-10.36,7.57 -17.79,18.61 -20.91,31.1c-0.41,1.6 0.57,3.23 2.18,3.63zM92.93,16.42c9.23,6.74 15.84,16.58 18.63,27.71c0.34,1.36 1.56,2.27 2.91,2.27c0.24,0 0.49,-0.03 0.73,-0.09c1.61,-0.4 2.58,-2.03 2.18,-3.64c-3.12,-12.48 -10.55,-23.53 -20.91,-31.1c-1.34,-0.98 -3.21,-0.69 -4.19,0.65c-0.98,1.35 -0.69,3.22 0.65,4.2zM19.2,90.85c-0.98,3.91 -0.12,7.98 2.37,11.15c2.48,3.18 6.22,5 10.25,5h14.46c1.43,8.5 8.83,15 17.73,15c8.9,0 16.29,-6.5 17.73,-15h14.46c4.03,0 7.77,-1.82 10.25,-5c2.48,-3.18 3.34,-7.24 2.37,-11.15l-10.85,-43.32c-3.9,-15.62 -17.87,-26.53 -33.97,-26.53c-16.1,0 -30.07,10.91 -33.97,26.53zM64,116c-5.58,0 -10.27,-3.83 -11.61,-9h23.21c-1.33,5.17 -6.02,9 -11.6,9zM64,27c13.34,0 24.92,9.04 28.15,21.98l10.83,43.32c0.53,2.11 0.06,4.29 -1.27,6.01c-1.34,1.71 -3.35,2.69 -5.52,2.69h-64.38c-2.17,0 -4.18,-0.98 -5.52,-2.69c-1.34,-1.71 -1.8,-3.9 -1.27,-6.01l10.83,-43.32c3.23,-12.94 14.81,-21.98 28.15,-21.98z"></path></g></g>
</svg>
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
                       <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256">
<g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(2,2)"><path d="M12.81,46.31c0.24,0.06 0.49,0.09 0.73,0.09c1.34,0 2.57,-0.91 2.91,-2.27c2.78,-11.12 9.4,-20.97 18.63,-27.71c1.34,-0.98 1.63,-2.85 0.65,-4.19c-0.98,-1.34 -2.85,-1.63 -4.19,-0.65c-10.36,7.57 -17.79,18.61 -20.91,31.1c-0.41,1.6 0.57,3.23 2.18,3.63zM92.93,16.42c9.23,6.74 15.84,16.58 18.63,27.71c0.34,1.36 1.56,2.27 2.91,2.27c0.24,0 0.49,-0.03 0.73,-0.09c1.61,-0.4 2.58,-2.03 2.18,-3.64c-3.12,-12.48 -10.55,-23.53 -20.91,-31.1c-1.34,-0.98 -3.21,-0.69 -4.19,0.65c-0.98,1.35 -0.69,3.22 0.65,4.2zM19.2,90.85c-0.98,3.91 -0.12,7.98 2.37,11.15c2.48,3.18 6.22,5 10.25,5h14.46c1.43,8.5 8.83,15 17.73,15c8.9,0 16.29,-6.5 17.73,-15h14.46c4.03,0 7.77,-1.82 10.25,-5c2.48,-3.18 3.34,-7.24 2.37,-11.15l-10.85,-43.32c-3.9,-15.62 -17.87,-26.53 -33.97,-26.53c-16.1,0 -30.07,10.91 -33.97,26.53zM64,116c-5.58,0 -10.27,-3.83 -11.61,-9h23.21c-1.33,5.17 -6.02,9 -11.6,9zM64,27c13.34,0 24.92,9.04 28.15,21.98l10.83,43.32c0.53,2.11 0.06,4.29 -1.27,6.01c-1.34,1.71 -3.35,2.69 -5.52,2.69h-64.38c-2.17,0 -4.18,-0.98 -5.52,-2.69c-1.34,-1.71 -1.8,-3.9 -1.27,-6.01l10.83,-43.32c3.23,-12.94 14.81,-21.98 28.15,-21.98z"></path></g></g>
</svg>
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