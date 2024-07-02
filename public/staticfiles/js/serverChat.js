const changeStatusButtons = document.querySelectorAll('.change-status .status');
const userProfile = document.querySelector('.user-profile');
const changeStatusSection = document.querySelector('.change-status');
const toggleButtonIcon = document.querySelector('.change-status-btn svg');

// Toggle change-status section visibility when button is clicked
document.querySelector('.change-status-btn').addEventListener('click', function() {
    changeStatusSection.classList.toggle('hidden');
    toggleButtonIcon.innerHTML = changeStatusSection.classList.contains('hidden') ?
        `<path d="m6 9 6 6 6-6"></path>`:
        `<path d="m6 15 6-6 6 6"></path>`;
});

// Add click event listener to each change status button
changeStatusButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const status = button.classList[1]; // Get the second class which represents the status
        updateStatus(status);
        changeStatusSection.classList.add('hidden'); // Hide change-status section after selecting a status
        toggleButtonIcon.innerHTML = `<path d="m6 9 6 6 6-6"></path>`;
    });
});

function updateStatus(status) {
    const userStatus = userProfile.querySelector('.user-status-text');
    const userStatusIcon = userProfile.querySelector('.user-status');

    // Update user status and status text
    userStatus.textContent = status.charAt(0).toUpperCase() + status.slice(1); // Capitalize first letter

    // Set background color based on status
    if (status === 'online') {
        userStatusIcon.style.backgroundColor = '#4CAF50'; // Green for Online
    } else if (status === 'away') {
        userStatusIcon.style.backgroundColor = '#FFC107'; // Yellow for Away
    } else if (status === 'busy') {
        userStatusIcon.style.backgroundColor = '#FF5722'; // Orange for Busy
    }
}

const changeStatusToggleButton = document.querySelector('.change-status-btn');

// Add click event listener to the toggle button
changeStatusToggleButton.addEventListener('click', function() {
    changeStatusSection.classList.toggle('visible');
});


const toggleButtons = document.querySelectorAll('.toggle-button');
const roomName = JSON.parse(document.getElementById('room-name').textContent);

// Add click event listener to each toggle button
toggleButtons.forEach(function(toggleButton) {
    toggleButton.addEventListener('click', function() {
        const parentGroup = toggleButton.closest('.text-group');
        const channelsList = parentGroup.querySelector('.channels-list');
        const toggleButtonIcon = toggleButton.querySelector('svg');

        // Toggle channels visibility
        channelsList.classList.toggle('hidden');
        if (channelsList.classList.contains('hidden')) {
            toggleButtonIcon.innerHTML = `<path d="m6 9 6 6 6-6"></path>`;
        } else {
            toggleButtonIcon.innerHTML = `<path d="m6 15 6-6 6 6"></path>`;
        }
    });
});


document.querySelectorAll('.channel-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link action
        const roomName = this.getAttribute('data-room');
        const roomNameDisplay = document.querySelector('.chat-title-room');
        window.location.pathname = '/server-chat/' + roomName + '/';
        //console.log('Room clicked:', roomName);
        
        //updateChatMessages(roomName);
    });
});


const chatSocket = new WebSocket(
    'ws://' +
    window.location.host +
    '/ws/chat/' +
    roomName +
    '/'
);


function displayOldMessages(messages) {
    const chatLog = document.querySelector('#chatBox');
    chatLog.innerHTML = ''; // Clear existing messages

    if (Array.isArray(messages) && messages.length > 0) {
        messages.forEach(message => {
            let fileContent = '';
            // Checking if there's a file attribute and it's not empty
            if (message.file) {
                //console.log("Image data received:", message.file); // Log the data for debugging
                fileContent = `<img src="/media/${message.file}" alt="Uploaded image" style="max-width: 200px;">`;
            } else {
               // console.log("No image data received.");
            }

            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message');
            messageElement.innerHTML = `
                <div class="message-header">
                    <div class="user-pic">
                        <img src="/media/${message.user__pfp}" alt="user-pic"> 
                    </div>
                </div>
                <div class="message-content">
                    <div class="user-info">
                        <span class="user-name">
                            ${message.user__user__username}
                        </span>
                        <span class="message-date">
                            ${message.timestamp}
                        </span>
                    </div>
                    <div class="message-text">
                        ${message.content}
                    </div>
                    <div class="image-user-upload">
                        ${fileContent}
                    </div>
                    <div class="reactions-box">
                        <div class="react">
                            <div class="emoji">
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 48 48">
                                    <path fill="#DD2C00" d="M39,28c0,8.395-6.606,15-15.001,15S9,36.395,9,28S22.479,12.6,20.959,5C24,5,39,15.841,39,28z"></path><path fill="#FF5722" d="M33,32c0-7.599-9-15-9-15c0,6.08-9,8.921-9,15c0,5.036,3.963,9,9,9S33,37.036,33,32z"></path><path fill="#FFC107" d="M18.999,35.406C19,32,24,30.051,24,27c0,0,4.999,3.832,4.999,8.406c0,2.525-2.237,4.574-5,4.574S18.998,37.932,18.999,35.406z"></path>
                                </svg>
                            </div>
                            <div class="count">
                                0
                            </div>
                        </div>
                    </div>
                </div>
                <div class="reply-react">
                    <button class="reply">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-reply">
                            <polyline points="9 17 4 12 9 7"/>
                            <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                        </svg>
                    </button>
                </div>
            `;

            chatLog.appendChild(messageElement);
            chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
        });
    } else {
        //console.log('No old messages for this room.');
        // console.log('Messages:', messages);
    }
}

function addMessage(message) {
    const chatLog = document.querySelector('#chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');

    const message_header = document.createElement('div');
    message_header.classList.add('message-header');
    message_header.innerHTML = `
        <div class="user-pic">
            <img src="/media/${message.user__pfp}" alt="user-pic"> 
        </div>`;

    const user_info = document.createElement('div');
    user_info.classList.add('user-info');
    user_info.innerHTML = `
        <span class="user-name">
            ${message.user__user__username}
        </span>
        <span class="message-date">
            ${message.timestamp}
        </span>`;

    const message_text = document.createElement('div');
    message_text.classList.add('message-text');
    message_text.innerHTML = `${message.content}`;

    const files_container = document.createElement('div');
    files_container.classList.add('image-user-upload');
    files_container.innerHTML = `<img src="${message.file}" alt="Uploaded file" style="max-width: 200px;">`;

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.appendChild(user_info);
    messageContent.appendChild(message_text);
    messageContent.appendChild(files_container);

    messageElement.appendChild(message_header);
    messageElement.appendChild(messageContent);
    
    /* `
        <div class="message-header">
            <div class="user-pic">
                <img src="/media/${message.user__pfp}" alt="user-pic"> 
            </div>
        </div>
        <div class="message-content">
            <div class="user-info">
                <span class="user-name">
                    ${message.user__user__username}
                </span>
                <span class="message-date">
                    ${message.timestamp}
                </span>
            </div>
            <div class="message-text">
                ${message.content}
            </div>
            <div class="image-user-upload">

            </div>
            <div class="reactions-box">
                <div class="react">
                    <div class="emoji">
                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#DD2C00" d="M39,28c0,8.395-6.606,15-15.001,15S9,36.395,9,28S22.479,12.6,20.959,5C24,5,39,15.841,39,28z"></path><path fill="#FF5722" d="M33,32c0-7.599-9-15-9-15c0,6.08-9,8.921-9,15c0,5.036,3.963,9,9,9S33,37.036,33,32z"></path><path fill="#FFC107" d="M18.999,35.406C19,32,24,30.051,24,27c0,0,4.999,3.832,4.999,8.406c0,2.525-2.237,4.574-5,4.574S18.998,37.932,18.999,35.406z"></path>
                        </svg>
                    </div>
                    <div class="count">
                        0
                    </div>
                </div>
            </div>
        </div>
        <div class="reply-react">
            <button class="reply">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-reply">
                    <polyline points="9 17 4 12 9 7"/>
                    <path d="M20 18v-2a4 4 0 0 0-4-4H4"/>
                </svg>
            </button>
        </div>
    `; */

    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

displayOldMessages(messages);

function displayMessage(data) {
    const chatLog = document.querySelector('#chatBox');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');

    const timestamp = new Date().toLocaleTimeString();
    let content = data.message || '';

    // Check and embed YouTube videos or make URLs clickable
    content = linkify(content);

    const fileContent = data.file ? `<img src="${data.file}" alt="Uploaded file" style="max-width: 200px;">` : '';
    const gifContent = data.gif ? `<img src="${data.gif}" alt="GIF" style="max-width: 200px;">` : '';

    messageElement.innerHTML = `
        <div class="message-header">
            <div class="user-pic">
                <img src="${data.pfp || '/default-user.png'}" alt="user-pic">
            </div>
        </div>
        <div class="message-content">
            <div class="user-info">
                <span class="user-name">${data.username}</span>
                <span class="message-date">${timestamp}</span>
            </div>
            <div class="message-text">${content}</div>
            ${fileContent}
        </div>
    `;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}


document.querySelector('#chat-file-input').addEventListener('change', function() {
    const filePreview = document.querySelector('#file-preview');
    const fileContainer = document.querySelector('#file-preview-container');
    if (this.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            filePreview.src = evt.target.result;
            fileContainer.style.display = 'block';
        };
        reader.readAsDataURL(this.files[0]);
    } else {
        fileContainer.style.display = 'none';
    }
});


document.querySelector('.chat-message-submit').addEventListener('click', function() {
    const messageInput = document.querySelector('.chat-message-input');
    const fileInput = document.querySelector('#chat-file-input');
    const gifs = document.querySelectorAll('.selected-gifs-container img');
    const message = messageInput.value.trim();
    const file = fileInput.files[0];
    const gifUrls = Array.from(gifs).map(img => img.src);

    console.log('Username:', username); // Ensure username is logged correctly
    if (!message && gifUrls.length === 0 && !file) {
        console.error('No message, GIF, or file selected.');
        return;
    }

    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            console.log('File ready for sending:', evt.target.result);
            sendToServer({
                username: username,
                message: message,
                file: evt.target.result,
                filename: file.name,
                gif: gifUrls.length > 0 ? gifUrls[0] : null
            });
            clearInputs();
        };
        reader.onerror = function(error) {
            console.error('Error reading file:', error);
        };
        reader.readAsDataURL(file);
    } else {
        sendToServer({
            username: username,
            message: message,
            gif: gifUrls.length > 0 ? gifUrls[0] : null
        });
        clearInputs();
    }
});


function clearInputs() {
    document.querySelector('.chat-message-input').value = '';
    document.querySelector('#chat-file-input').value = '';
    document.querySelector('.selected-gifs-container').innerHTML = '';
}


function sendToServer(data) {
    console.log("Attempting to send data to WebSocket: ", data);
    chatSocket.send(JSON.stringify(data));
}


document.querySelector('.chat-message-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        document.querySelector('.chat-message-submit').click();
    }
});


chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    displayMessage(data);
};

chatSocket.onerror = function(error) {
    console.error("WebSocket error:", error);
};

chatSocket.onopen = function() {
    console.log("Connected to WebSocket server.");
};

chatSocket.onclose = function(e) {
    console.log("WebSocket connection closed", e);
};


document.getElementById('toggleButton').addEventListener('click', function() {
    const chatMembers = document.querySelector('.chat-members');
    const iconVisible = document.getElementById('icon-visible');
    const iconHidden = document.getElementById('icon-hidden');
    const isVisible = this.getAttribute('data-visible') === 'true';

    if (isVisible) {
        chatMembers.classList.add('hidden');
        iconVisible.style.display = 'none';
        iconHidden.style.display = 'block';
        this.setAttribute('data-visible', 'false');
    } else {
        chatMembers.classList.remove('hidden');
        iconVisible.style.display = 'block';
        iconHidden.style.display = 'none';
        this.setAttribute('data-visible', 'true');
    }
});


document.getElementById('chatRoomsToggle').addEventListener('click', function() {
    const chatRooms = document.querySelector('.chat-rooms');
    const iconVisible = document.getElementById('icon-visible');
    const iconHidden = document.getElementById('icon-hidden');

    chatRooms.classList.toggle('collapsed');

    if (chatRooms.classList.contains('collapsed')) {
        iconVisible.style.display = 'none';
        iconHidden.style.display = 'block';
    } else {
        iconVisible.style.display = 'block';
        iconHidden.style.display = 'none';
    }
});


// Function to make links clickable and embed YouTube videos
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    // Embed YouTube videos
    const youtubePattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
    replacedText = replacedText.replace(youtubePattern, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');

    return replacedText;
}


// Ensure the room links and display element are selected correctly
const roomLinks = document.querySelectorAll('.channel-link');
const roomNameDisplay = document.querySelector('.chat-title-room');

roomLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const roomName = this.getAttribute('data-room');
        roomNameDisplay.textContent = '🌠・' + roomName; // Update the room name display
    });
});


function toggleEmojiPicker() {
    var picker = document.getElementById('emoji-picker');
    picker.style.display = picker.style.display === 'flex' ? 'none' : 'flex';
    if (picker.style.display === 'flex') {
        loadEmojis();
    }
}

function loadEmojis() {
    var picker = document.getElementById('emoji-picker');
    picker.innerHTML = '';
    var emojis = ['😀', '😂', '🤬', '😊', '😍', '💩', '👍', '📈', '📉', '🚀', '💸', '✅', '👻', '💰', '🌍', '❤️', '🎉', '🎂'];
    emojis.forEach(function(emoji) {
        var span = document.createElement('span');
        span.textContent = emoji;
        span.className = 'emoji-span';
        span.onclick = function() { insertEmoji(emoji); };
        picker.appendChild(span);
    });
}


function insertEmoji(emoji) {
    var input = document.querySelector('.chat-message-input');
    input.value += emoji;
    input.focus();
}



document.getElementById('toggleGifPicker').addEventListener('click', function() {
    var picker = document.getElementById('gif-picker');
    picker.style.display = picker.style.display === 'block' ? 'none' : 'block';
    if (picker.style.display === 'block') {
        loadGifs();
    }
});

function loadGifs() {
    var apiKey = 'HnBk0eOngtbCc6S7u9Xt1vOXiaxf59VU';
    var url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`;

    fetch(url)
        .then(response => response.json())
        .then(content => {
            var picker = document.getElementById('gif-picker');
            picker.innerHTML = ''; // Clear existing GIFs if any
            content.data.forEach((gif) => {
                var img = document.createElement('img');
                img.src = gif.images.fixed_height.url;
                img.style.width = '100%';
                img.onclick = () => insertGif(gif.images.fixed_height.url);
                picker.appendChild(img);
            });
        })
        .catch(err => {
            console.error('Error fetching trending GIFs:', err);
        });
}

function insertGif(gifUrl) {
    var displayContainer = document.querySelector('.selected-gifs-container');
    var img = document.createElement('img');
    img.src = gifUrl;
    img.alt = "Selected GIF";
    img.style.maxWidth = "100px"; // Thumbnail size
    img.style.marginRight = "5px";
    displayContainer.appendChild(img);
}

console.log('Username:', username); // Debugging output


function toggleRoomsMobile() {
    const rooms = document.querySelector('.chat-rooms');
    const members = document.querySelector('.chat-members');
    const chat = document.querySelector('.chat-container');
    rooms.classList.toggle('show');
    members.classList.toggle('hidden');
    chat.classList.toggle('hidden');
}
function toggleMembersMobile() {
    const rooms = document.querySelector('.chat-rooms');
    const members = document.querySelector('.chat-members');
    const chat = document.querySelector('.chat-container');
    rooms.classList.toggle('hidden');
    members.classList.toggle('show');
    chat.classList.toggle('hidden');

}