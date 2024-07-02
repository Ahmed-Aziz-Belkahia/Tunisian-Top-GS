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
    const contentArea = document.getElementById('content-area');

    profileDropDown.addEventListener('click', () => {
        chevronDownIcon.classList.toggle('rotate');
        containerProfile.style.display = containerProfile.style.display === 'flex' ? 'none' : 'flex';
    });

    navToggle.addEventListener("change", () => {
        const isChecked = navToggle.checked;
        hamburgerLines.classList.toggle("checked", isChecked);
        dropdownMenu.style.transform = isChecked ? "translate(0)" : "translate(-150%)";
        dropdownMenu.style.display = isChecked ? "block" : "none";
        navContainer.style.position = isChecked ? "fixed" : "relative";
        navContainer.style.zIndex = isChecked ? "120" : "100";
    });

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const url = this.href;

            fetch(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                const newContent = htmlDoc.getElementById('content-area').innerHTML;
                contentArea.innerHTML = newContent;
                window.history.pushState({ path: url }, '', url);
                highlightCurrentPage();
                scrollToTop();
                initializeDynamicContent();  // Reinitialize any dynamic content like event listeners
            })
            .catch(error => console.error('Error loading content:', error));
        });
    });

    function highlightCurrentPage() {
        const currentPage = getCurrentPage();
        document.querySelectorAll('.nav-slipe').forEach(n => n.classList.remove('active-nav'));
        const currentLink = document.querySelector(`a[id="${currentPage}-link"] > .nav-slipe`) || document.querySelector(`a[id="home-link"] .nav-slipe`);
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

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function initializeDynamicContent() {
        // Reinitialize any event listeners or dynamic content
        // Example: reinitialize the tab functionality
        document.querySelectorAll('.tab-link').forEach(tabLink => {
            tabLink.addEventListener('click', function () {
                document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('current'));
                this.classList.add('current');

                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-content').forEach(tabContent => tabContent.classList.remove('current'));
                document.getElementById(tabId).classList.add('current');
            });
        });

        // Reinitialize the form submission
        const form = document.getElementById('sessionForm');
        form && form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Handle form submission with AJAX if needed
        });

        // Add other reinitializations as needed
    }

    // Initial call to set up the dynamic content
    initializeDynamicContent();

    if (notification && notificationMenu) setupMenuInteraction(notification, messages);
    if (messages && messagesMenu) setupMenuInteraction(messages, notification);

    body.addEventListener('click', closeAllMenus);

    function setupMenuInteraction(menu, otherMenu) {
        menu.addEventListener('click', function (e) {
            e.stopPropagation();
            otherMenu.classList.remove('--active');
            menu.classList.toggle('--active');
        });

        menu.querySelector('.menu').addEventListener('click', e => e.stopPropagation());
    }

    function closeAllMenus() {
        [notification, messages].forEach(menu => menu && menu.classList.remove('--active'));
    }

    highlightCurrentPage();
    restoreNavbarState();

    function saveNavbarState() {
        const activeLink = document.querySelector('.nav-slipe.active-nav');
        if (activeLink) {
            localStorage.setItem('activeNavbarLink', activeLink.closest('a').id);
        }
    }

    function restoreNavbarState() {
        const savedActiveLinkId = localStorage.getItem('activeNavbarLink');
        if (savedActiveLinkId) {
            const savedActiveLink = document.getElementById(savedActiveLinkId);
            if (savedActiveLink) {
                document.querySelectorAll('.nav-slipe').forEach(n => n.classList.remove('active-nav'));
                savedActiveLink.querySelector('.nav-slipe').classList.add('active-nav');
            }
        }
    }
});

function highlightCurrentPage() {
    const currentPage = getCurrentPage();
    const currentLink = document.querySelector(`a[id="${currentPage}-link"] > .nav-slipe`) || document.querySelector(`a[id="home-link"] .nav-slipe`);
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
    countItems('.messages-list', '.messages-counter');
});
