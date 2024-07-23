document.addEventListener('DOMContentLoaded', () => {
  const answers = new Array(totalQuestions).fill(null);

  const optionElements = document.querySelectorAll('.dark-option');
  const inputElements = document.querySelectorAll('.input-answer');
  const continueButtons = document.querySelectorAll('.continue');
  const finishQuizButton = document.getElementById('finishQuiz');

  function handleOptionSelection() {
    const questionElement = this.closest('.question-step');
    const questionIndex = parseInt(questionElement.dataset.index) - 1;
    const optionId = parseInt(this.dataset.id);

    // Mark the selected option
    questionElement.querySelectorAll('.dark-option').forEach(opt => opt.classList.remove('selected'));
    this.classList.add('selected');

    // Store the selected option's id
    answers[questionIndex] = optionId;

    // Enable the continue button
    const continueButton = questionElement.querySelector('.continue');
    continueButton.classList.add('active');
    continueButton.disabled = false;
  }

  function handleInputField() {
    const questionIndex = parseInt(this.dataset.questionId) - 1;
    answers[questionIndex] = this.value;

    // Enable the continue button if input is provided
    const questionElement = this.closest('.question-step');
    const continueButton = questionElement.querySelector('.continue');
    if (this.value.trim() !== '') {
      continueButton.classList.add('active');
      continueButton.disabled = false;
    } else {
      continueButton.classList.remove('active');
      continueButton.disabled = true;
    }
  }

  function handleContinueButton() {
    const currentQuestionIndex = parseInt(this.closest('.question-step').dataset.index) - 1;
    const nextQuestionIndex = parseInt(this.dataset.next.replace('question', '')) - 1;

    if (answers[currentQuestionIndex] !== null) {
      // Hide current question and show the next one
      document.querySelector(`.question-step[data-index="${currentQuestionIndex + 1}"]`).style.display = 'none';
      const nextQuestionElement = document.querySelector(`.question-step[data-index="${nextQuestionIndex + 1}"]`);
      if (nextQuestionElement) nextQuestionElement.style.display = 'flex';

      // Update loading bar
      const percentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
      document.querySelector('.loading-fill').style.width = `${percentage}%`;
      document.querySelector('.percentage').textContent = `${Math.round(percentage)}%`;
    } else {
      alert('Please provide an answer to continue.');
    }
  }

  function handleFinishQuiz() {
    if (answers.includes(null)) {
      alert('Please answer all questions before finishing the quiz.');
    } else {
      // Make an AJAX request to save answers
      ajaxRequest('POST', '/onboarding/', { answers }, (response) => {
        if (response.success) {
          window.location.href = '/home';
        } else {
          alert('An error occurred. Please try again.');
        }
      });
    }
  }

  optionElements.forEach(option => option.addEventListener('click', handleOptionSelection));
  inputElements.forEach(input => input.addEventListener('input', handleInputField));
  continueButtons.forEach(button => button.addEventListener('click', handleContinueButton));
  finishQuizButton.addEventListener('click', handleFinishQuiz);
});
