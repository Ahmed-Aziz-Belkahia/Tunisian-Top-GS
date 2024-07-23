document.addEventListener('DOMContentLoaded', function () {
    const elements = {
        chevronDownIcon: document.getElementById('chevron-down-icon'),
        profileDropDown: document.getElementById('profile-dropdown'),
        containerProfile: document.querySelector('.container-profile'),
        dropdownMenu: document.getElementById("dropDownMenu"),
        navLinks: document.querySelectorAll(".menu-item"),
        hamburgerLines: document.querySelector(".hamburger-lines"),
        navToggle: document.getElementById("navToggle"),
        navContainer: document.getElementById("navContainer"),
        notification: document.querySelector('.notification'),
        notificationMenu: document.querySelector('.notification > .menu'),
        messages: document.querySelector('.messages'),
        messagesMenu: document.querySelector('.messages > .menu'),
        body: document.querySelector('body'),
        contentArea: document.getElementById('content-area')
    };

    elements.profileDropDown.addEventListener('click', () => {
        elements.chevronDownIcon.classList.toggle('rotate');
        elements.containerProfile.style.display = elements.containerProfile.style.display === 'flex' ? 'none' : 'flex';
    });

    elements.navToggle.addEventListener("change", () => {
        const isChecked = elements.navToggle.checked;
        elements.hamburgerLines.classList.toggle("checked", isChecked);
        elements.dropdownMenu.style.transform = isChecked ? "translate(0)" : "translate(-150%)";
        elements.dropdownMenu.style.display = isChecked ? "block" : "none";
        elements.navContainer.style.position = isChecked ? "fixed" : "relative";
        elements.navContainer.style.zIndex = isChecked ? "120" : "100";
    });

    elements.navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            loadContent(this.href);
        });
    });

    function loadContent(url) {
        fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(data, 'text/html');
                elements.contentArea.innerHTML = htmlDoc.getElementById('content-area').innerHTML;
                window.history.pushState({ path: url }, '', url);
                highlightCurrentPage();
                scrollToTop();
                initializeDynamicContent();
            })
            .catch(error => console.error('Error loading content:', error));
    }

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
        return Object.keys(pageMappings).find(path => window.location.pathname.includes(path)) || pathArray.pop() || 'home';
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function initializeDynamicContent() {
        document.querySelectorAll('.tab-link').forEach(tabLink => {
            tabLink.addEventListener('click', function () {
                document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('current'));
                this.classList.add('current');
                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-content').forEach(tabContent => tabContent.classList.remove('current'));
                document.getElementById(tabId).classList.add('current');
            });
        });

        const form = document.getElementById('sessionForm');
        form && form.addEventListener('submit', function (event) {
            event.preventDefault();
            // Handle form submission with AJAX if needed
        });
    }

    initializeDynamicContent();

    if (elements.notification && elements.notificationMenu) setupMenuInteraction(elements.notification, elements.messages);
    if (elements.messages && elements.messagesMenu) setupMenuInteraction(elements.messages, elements.notification);

    elements.body.addEventListener('click', closeAllMenus);

    function setupMenuInteraction(menu, otherMenu) {
        menu.addEventListener('click', function (e) {
            e.stopPropagation();
            otherMenu.classList.remove('--active');
            menu.classList.toggle('--active');
        });
        menu.querySelector('.menu').addEventListener('click', e => e.stopPropagation());
    }

    function closeAllMenus() {
        [elements.notification, elements.messages].forEach(menu => menu && menu.classList.remove('--active'));
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

function countItems(selector, counterSelector, maxCount = 9) {
    const countElement = document.querySelector(counterSelector);
    const itemList = document.querySelector(selector);
    const itemCount = itemList ? itemList.children.length : 0;
    countElement.innerHTML = itemCount === 0 ? '0' : itemCount > maxCount ? `${maxCount}+` : itemCount;
}

document.addEventListener('DOMContentLoaded', function () {
    countItems('.notifications-list', '.counter-noti-messd');
    countItems('.notifications-list', '.counter-noti-messd-mobile');
    countItems('.messages-list', '.messages-counter');
});
