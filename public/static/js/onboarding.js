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
    }
  
    function handleInputField() {
      const questionIndex = parseInt(this.dataset.questionId) - 1;
      answers[questionIndex] = this.value;
    }
  
    function handleContinueButton() {
      const currentQuestionIndex = parseInt(this.closest('.question-step').dataset.index) - 1;
      const nextQuestionIndex = parseInt(this.dataset.next.replace('question', '')) - 1;
  
      // Ensure an option is selected or input is provided before moving to the next question
      if (answers[currentQuestionIndex] !== null) {
        // Hide current question and show the next one
        document.querySelector(`.question-step[data-index="${currentQuestionIndex + 1}"]`).style.display = 'none';
        const nextQuestionElement = document.querySelector(`.question-step[data-index="${nextQuestionIndex + 1}"]`);
        if (nextQuestionElement) nextQuestionElement.style.display = 'block';
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
  