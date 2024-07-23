document.addEventListener('DOMContentLoaded', generateAnswers);

const answers = [
    { id: 1, text: "a) Elon Musk who created Bitcoin", image: "../assets/elon.png", correct: false },
    { id: 2, text: "b) aymen benrom who created Bitcoin", image: "../assets/tate.png", correct: false },
    { id: 3, text: "c) Satoshi Nakamoto who created Bitcoin", image: "../assets/satochi.png", correct: true },
    { id: 4, text: "d) Walid haj moussa who created Bitcoin", image: "../assets/jeff.png", correct: false }
];

function generateAnswers() {
    const container = document.querySelector('#container-answers');
    container.innerHTML = '';

    removeExistingFeedbackAndRetryButton();

    answers.forEach(answer => {
        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answers-with-img');

        const img = document.createElement('img');
        img.src = answer.image;
        img.alt = "Answer image";
        img.classList.add('image-answers');
        answerDiv.appendChild(img);

        const answerSpan = document.createElement('span');
        answerSpan.textContent = answer.text;
        answerDiv.appendChild(answerSpan);

        container.appendChild(answerDiv);

        answerDiv.addEventListener('click', () => handleAnswerSelection(answer.correct, answer.id, img, answerDiv));
    });
}

function handleAnswerSelection(isCorrect, selectedId, img, answerDiv) {
    const container = document.querySelector('#container-answers');
    disableClicks(container);
    highlightAnswers(isCorrect, selectedId, img, answerDiv);
    displayFeedbackMessage(isCorrect ? "Correct! Satoshi Nakamoto created Bitcoin." : "Sorry, that's incorrect. Please try again.");
    showRetryButton();
}

function highlightAnswers(isCorrect, selectedId, img, answerDiv) {
    img.style.display = 'none'; // Hide the image when an answer is clicked
    answers.forEach(answer => {
        const div = document.querySelector(`.answers-with-img:nth-child(${answer.id})`);
        if (answer.id === 3) {
            div.style.background = "rgba(51, 255, 0, 0.29)";
            div.style.transition = "1.5s";
            appendIcon(div, '../assets/Check Mark.png', true);
        } else if (answer.id === selectedId) {
            div.style.background = "rgba(255, 0, 0, 0.21)";
            appendIcon(div, '../assets/Close.png', false);
        }
    });
}

function appendIcon(div, iconPath, isCorrect) {
    const existingIcon = div.querySelector('.icon');
    if (existingIcon) div.removeChild(existingIcon);

    const iconImage = document.createElement('img');
    iconImage.src = iconPath;
    iconImage.classList.add('icon');
    iconImage.style.position = 'absolute';
    iconImage.style.top = '50%';
    iconImage.style.left = '50%';
    iconImage.style.transform = 'translate(-50%, -50%)';
    div.appendChild(iconImage);
}

function disableClicks(container) {
    container.querySelectorAll('.answers-with-img').forEach(div => {
        div.style.pointerEvents = 'none';
    });
}

function removeExistingFeedbackAndRetryButton() {
    const existingFeedback = document.querySelector('.feedback-message');
    const existingButton = document.querySelector('.retry-button');
    if (existingFeedback) existingFeedback.remove();
    if (existingButton) existingButton.remove();
}

function showRetryButton() {
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Retry Quiz';
    retryButton.classList.add('retry-button');
    retryButton.addEventListener('click', () => document.location.reload(true));
    document.body.appendChild(retryButton);
}

function displayFeedbackMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('feedback-message');
    messageDiv.textContent = message;
    const container = document.querySelector('#container-answers');
    container.after(messageDiv);
}
