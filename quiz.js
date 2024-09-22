document.addEventListener('DOMContentLoaded', function () {
  const startBtn = document.getElementById('startBtn');
  const playAgainBtn = document.getElementById('play-again');
  const quizContainer = document.getElementById('quiz');
  const welcomeContainer = document.getElementById('welcome');
  const resultContainer = document.getElementById('result');
  const questionElem = document.getElementById('question');
  const optionButtons = document.querySelectorAll('.option-btn');
  const feedbackElem = document.getElementById('feedback');
  const answerResult = document.getElementById('answer-result');
  const finalScoreElem = document.getElementById('final-score');
  const confettiContainer = document.getElementById('confetti'); 
  const categoryInputs = document.querySelectorAll('input[name="category"]');
  const difficultySelect = document.getElementById('difficulty');
  let selectedCategories = [];
  let selectedDifficulty = '';
  let currentQuestion = {};
  let score = 0;
  let questionCount = 0;
  const maxQuestions = 5;

  startBtn.addEventListener('click', startGame);
  playAgainBtn.addEventListener('click', resetGame);
  optionButtons.forEach(btn => btn.addEventListener('click', selectAnswer));

  function startGame() {
    selectedCategories = Array.from(categoryInputs)
      .filter(input => input.checked)
      .map(input => input.value);
    selectedDifficulty = difficultySelect.value;

    score = 0;
    questionCount = 0;
    welcomeContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    confettiContainer.innerHTML = ''; 
    nextQuestion();
  }

  function resetGame() {
    welcomeContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    quizContainer.classList.add('hidden');
    confettiContainer.innerHTML = ''; 
  }

  async function nextQuestion() {
    feedbackElem.classList.add('hidden');
    if (questionCount >= maxQuestions) {
      return endGame();
    }

    currentQuestion = await generateQuestion();
    if (!currentQuestion) return endGame(); 

    questionElem.textContent = currentQuestion.question;
    optionButtons.forEach((btn, index) => {
      btn.textContent = currentQuestion.options[index];
    });

    questionCount++;
  }

  function selectAnswer(e) {
    const selectedOption = e.target.textContent;
    const correct = selectedOption === currentQuestion.correctAnswer;

    feedbackElem.classList.remove('hidden');
    if (correct) {
      answerResult.textContent = 'correct';
      score++;
      triggerConfetti(); 
    } else {
      answerResult.textContent = 'incorrect';
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }

  function endGame() {
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    finalScoreElem.textContent = `${score} / ${maxQuestions}`;
  }

  async function generateQuestion() {
    try {
      const categoryParam = selectedCategories.length
        ? `&categories=${selectedCategories.join(',')}`
        : '';
      const difficultyParam = selectedDifficulty ? `&difficulty=${selectedDifficulty}` : '';
      const response = await fetch(
        `https://the-trivia-api.com/api/questions?limit=1${categoryParam}${difficultyParam}`
      );
      const data = await response.json();
      const questionData = data[0];

      return {
        question: questionData.question,
        options: [...questionData.incorrectAnswers, questionData.correctAnswer].sort(
          () => Math.random() - 0.5
        ),
        correctAnswer: questionData.correctAnswer
      };
    } catch (error) {
      console.error('Error fetching trivia question:', error);
      return null;
    }
  }

  function triggerConfetti() {
    confettiContainer.innerHTML = ''; 

    const numberOfPieces = 50;
    for (let i = 0; i < numberOfPieces; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.backgroundColor = getRandomColor();
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.top = `${Math.random() * 100}vh`;
      confettiContainer.appendChild(piece);
    }

    
    setTimeout(() => {
      confettiContainer.innerHTML = '';
    }, 2000);
  }

  function getRandomColor() {
    const colors = ['#FF007F', '#FFAB00', '#FF6F61', '#6B5B95', '#D0F0C0'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
});
