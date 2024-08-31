
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('ul.tabs li');
    const nextTabButtons = document.querySelectorAll('.next-tab-btn');
    const prevTabButtons = document.querySelectorAll('.back-tab-btn');

    function switchTab(tabId) {
        const error_message = document.getElementById("error_message");
        error_message.innerHTML = "";

        const fields = [
            { id: "id_first_name", regex: /^[A-Za-z\s]+$/, message: "First name should contain only letters." },
            { id: "id_last_name", regex: /^[A-Za-z\s]+$/, message: "Last name should contain only letters." },
            { id: "id_email", regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Email should be in proper format." },
            { id: "id_phone_number", regex: /^\d+$/, message: "Phone number should be only digits." }
        ];

        for (const field of fields) {
            const element = document.getElementById(field.id);
            if (!element.value.match(field.regex)) {
                element.focus();
                showPopup(field.message);
                return;
            }
        }

        if (!isAnyCheckboxChecked('cours', "Please select the course first.") ||
            !isAnyCheckboxChecked('duration', "Please select the duration time first.") ||
            !isAnyCheckboxChecked('session_mode', "Please select the private session mode first.") ||
            (tabId === "tab-3" && !isAnyCheckboxChecked('professor', "Please select the professor first."))) {
            return;
        }

        setActiveTab(tabId);
    }

    function showPopup(message) {
        const popupSpan = document.querySelector('.popup-message span');
        const popupMessage = document.querySelector('.popup-message');
        popupSpan.textContent = message;
        popupMessage.classList.add('popup-show');
        setTimeout(() => popupMessage.classList.remove('popup-show'), 2000);
        document.getElementById('popUpCloseButton').addEventListener('click', () => popupMessage.classList.remove('popup-show'));
    }

    function isAnyCheckboxChecked(name, message) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
        if (!Array.from(checkboxes).some(checkbox => checkbox.checked)) {
            showPopup(message);
            return false;
        }
        return true;
    }

    function setActiveTab(tabId) {
        tabs.forEach(item => item.classList.remove('current'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('current'));

        document.querySelector(`ul.tabs li[data-tab="${tabId}"]`).classList.add('current');
        document.getElementById(tabId).classList.add('current');
    }

    tabs.forEach(tab => tab.addEventListener('click', event => event.preventDefault()));
    nextTabButtons.forEach(button => button.addEventListener('click', () => navigateTab(1)));
    prevTabButtons.forEach(button => button.addEventListener('click', () => navigateTab(-1)));

    function navigateTab(direction) {
        const currentTab = document.querySelector('ul.tabs li.current');
        const currentIndex = Array.from(tabs).indexOf(currentTab);
        const newIndex = (currentIndex + direction + tabs.length) % tabs.length;
        const newTabId = tabs[newIndex].getAttribute('data-tab');
        switchTab(newTabId);
    }

    const form = document.querySelector(".sessionForm");
    const submitButton = document.querySelector(".DoneSubmit");

    submitButton.addEventListener("click", function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        let isValid = true;

        form.querySelectorAll("input[required]").forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add("error");
            } else {
                input.classList.remove("error");
            }
        });

        for (const entry of formData.entries()) {
            if (!entry[1].trim()) {
                isValid = false;
                break;
            }
        }

        if (!isValid) {
            showPopup("Please choose your perfect day and then submit.");
            setActiveTab("tab-2");
            return;
        }

        const csrftoken = getCookie("csrftoken");
        fetch('/schedulePrivateSession/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
        .then(response => response.json())
        .then(replaceScheduleBodyWithDoneContent)
        .catch(error => console.error('Error scheduling session:', error));
    });

    function getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
        return null;
    }

    function replaceScheduleBodyWithDoneContent() {
        const scheduleBody = document.querySelector('.schedule-body');
        if (scheduleBody) {
            scheduleBody.innerHTML = `
                <div class="schedule-body done-body">
                    <div class="schedule-body-left">
                        <img src="/static/assets/done.svg" width="340" height="340" alt="Schedule Done" class="jello-horizontal">
                    </div>
                    <div class="schedule-body-right">
                        <div class="done-container">
                            <span>Thank you for expressing interest in a private session</span>
                            <span>We're excited to connect with you! Expect a follow-up from us in 3 to 5 business days. Thanks for reaching out!</span>
                            <a href="/home" class="next-tab-btn">Go Back</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    const checkboxes = document.querySelectorAll('.time-input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkboxTile = this.closest('.checkbox-tile');
            document.querySelectorAll('.checkbox-tile').forEach(item => item.classList.remove('checked'));
            if (checkboxTile) checkboxTile.classList.add('checked');
        });
    });

    const sessionInputs = document.querySelectorAll('.session-input');
    sessionInputs.forEach(input => {
        input.addEventListener('change', function() {
            document.querySelectorAll('.checkbox-tile-session').forEach(item => item.classList.remove('checked'));
            const checkboxTileSession = this.closest('.checkbox-tile-session');
            if (checkboxTileSession) checkboxTileSession.classList.add('checked');
        });
    });

    const professorCheckboxes = document.querySelectorAll('input[name="professor"]');
    const coursCheckboxes = document.querySelectorAll('input[name="cours"]');

    professorCheckboxes.forEach(checkbox => checkbox.addEventListener('click', function() {
        uncheckOtherCheckboxes(professorCheckboxes, this);
    }));

    coursCheckboxes.forEach(checkbox => checkbox.addEventListener('click', function() {
        uncheckOtherCheckboxes(coursCheckboxes, this);
    }));

    function uncheckOtherCheckboxes(checkboxes, clickedCheckbox) {
        checkboxes.forEach(checkbox => {
            if (checkbox !== clickedCheckbox) checkbox.checked = false;
        });
    }
});

