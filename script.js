 // Questions array
const questions = [
  {
    type: 'multiple',
    question: "Which HTML tag is used to define an unordered list?",
    answers: [
      { text: "<ul>", correct: true },
      { text: "<ol>", correct: false },
      { text: "<li>", correct: false },
      { text: "<list>", correct: false },
    ],
  },
  {
    type: 'truefalse',
    question: "CSS stands for Cascading Style Sheets.",
    answers: [
      { text: "True", correct: true },
      { text: "False", correct: false }
    ],
  },
//   {
//     type: 'input',
//     question: "What does the acronym DOM stand for in web development?",
//     answer: "Document Object Model"
//   },
  {
    type: 'multiple',
    question: "Which property is used in CSS to change the text color?",
    answers: [
      { text: "font-color", correct: false },
      { text: "color", correct: true },
      { text: "text-color", correct: false },
      { text: "font-style", correct: false },
    ],
  },
//   {
//     type: 'input',
//     question: "Which JavaScript method is used to select an element by its ID?",
//     answer: "getElementById"
//   },
  {
    type: 'multiple',
    question: "Which HTTP method is commonly used to submit form data?",
    answers: [
      { text: "GET", correct: false },
      { text: "POST", correct: true },
      { text: "PUT", correct: false },
      { text: "DELETE", correct: false },
    ],
  },
  {
    type: 'truefalse',
    question: "JavaScript can be run only on the client side.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true }
    ],
  },
  {
    type: 'multiple',
    question: "What is the correct syntax to include an external CSS file in HTML?",
    answers: [
      { text: "<link rel='stylesheet' href='styles.css'>", correct: true },
      { text: "<style src='styles.css'></style>", correct: false },
      { text: "<css href='styles.css'></css>", correct: false },
      { text: "<script src='styles.css'></script>", correct: false },
    ],
  },
//   {
//     type: 'input',
//     question: "Which HTML attribute specifies an alternate text for an image, if the image cannot be displayed?",
//     answer: "alt"
//   },
  {
    type: 'multiple',
    question: "Which of the following is NOT a JavaScript framework/library?",
    answers: [
      { text: "React", correct: false },
      { text: "Angular", correct: false },
      { text: "Laravel", correct: true },
      { text: "Vue", correct: false },
    ],
  },
];


// DOM elements
const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const userForm = document.getElementById('user-form');

const questionContainer = document.getElementById('question-container');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const inputAnswer = document.getElementById('input-answer');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress');
const timerEl = document.getElementById('time');

const scoreContainer = document.getElementById('score-container');
const scoreEl = document.getElementById('score');
const totalEl = document.getElementById('total');
const restartBtn = document.getElementById('restart-btn');
const scoresList = document.getElementById('scores-list');

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let username = '';

// Enable start button only if username entered
usernameInput.addEventListener('input', () => {
  startBtn.disabled = usernameInput.value.trim() === '';
});

// Start quiz on button click
startBtn.addEventListener('click', () => {
  username = usernameInput.value.trim();
  if (!username) return;

  userForm.style.display = 'none';
  questionContainer.style.display = 'flex';
  currentQuestionIndex = 0;
  score = 0;
  updateProgressBar();
  showQuestion();
});

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
});

restartBtn.addEventListener('click', () => {
  scoreContainer.style.display = 'none';
  userForm.style.display = 'flex';
  usernameInput.value = '';
  startBtn.disabled = true;
});

function showQuestion() {
  resetState();
  startTimer();

  const currentQ = questions[currentQuestionIndex];
  questionEl.textContent = currentQ.question;

  if (currentQ.type === 'multiple' || currentQ.type === 'truefalse') {
    inputAnswer.style.display = 'none';
    answersEl.style.display = 'flex';

    currentQ.answers.forEach(answer => {
      const btn = document.createElement('button');
      btn.textContent = answer.text;
      btn.className = 'answer-btn';
      if (answer.correct) btn.dataset.correct = 'true';
      btn.addEventListener('click', selectAnswer);
      answersEl.appendChild(btn);
    });
  } else if (currentQ.type === 'input') {
    answersEl.style.display = 'none';
    inputAnswer.style.display = 'block';
    inputAnswer.value = '';
    inputAnswer.className = '';
    nextBtn.style.display = 'none';

    // Listen for Enter key on input
    inputAnswer.onkeydown = function (e) {
      if (e.key === 'Enter') {
        checkInputAnswer();
      }
    };
  }

  updateProgressBar();
}

function resetState() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = timeLeft;
  nextBtn.style.display = 'none';
  inputAnswer.onkeydown = null;

  while (answersEl.firstChild) {
    answersEl.removeChild(answersEl.firstChild);
  }
  inputAnswer.className = '';
}

function selectAnswer(e) {
  clearInterval(timer);
  const selectedBtn = e.target;
  const correct = selectedBtn.dataset.correct === 'true';

  // Disable all buttons and highlight answers
  Array.from(answersEl.children).forEach(button => {
    button.classList.add('disabled');
    if (button.dataset.correct === 'true') {
      button.classList.add('correct');
    }
  });

  if (correct) {
    score++;
    selectedBtn.classList.add('correct');
  } else {
    selectedBtn.classList.add('incorrect');
  }

  nextBtn.style.display = 'block';
}

function checkInputAnswer() {
  clearInterval(timer);
  const currentQ = questions[currentQuestionIndex];
  let userAnswer = inputAnswer.value.trim();
  if (!userAnswer) return;

  const correctAnswer = currentQ.answer.trim();

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    score++;
    inputAnswer.classList.add('correct');
  } else {
    inputAnswer.classList.add('incorrect');
  }
  nextBtn.style.display = 'block';
  inputAnswer.disabled = true;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      // Auto show correct answers if multiple choice or disable input for input questions
      autoRevealAnswer();
      nextBtn.style.display = 'block';
    }
  }, 1000);
}

function autoRevealAnswer() {
  const currentQ = questions[currentQuestionIndex];
  if (currentQ.type === 'multiple' || currentQ.type === 'truefalse') {
    Array.from(answersEl.children).forEach(button => {
      button.classList.add('disabled');
      if (button.dataset.correct === 'true') {
        button.classList.add('correct');
      }
    });
  } else if (currentQ.type === 'input') {
    inputAnswer.disabled = true;
    inputAnswer.classList.add('incorrect');
  }
}

function updateProgressBar() {
  const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

function showScore() {
  questionContainer.style.display = 'none';
  scoreContainer.style.display = 'block';

  scoreEl.textContent = score;
  totalEl.textContent = questions.length;

  saveHighScore();
  showHighScores();
}

function saveHighScore() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  highScores.push({ name: username, score: score });
  highScores.sort((a, b) => b.score - a.score);
  if (highScores.length > 5) highScores.length = 5;
  localStorage.setItem('highScores', JSON.stringify(highScores));
}
// Modify showQuestion() input section:
if (currentQ.type === 'input') {
  answersEl.style.display = 'none';
  inputAnswer.style.display = 'block';
  inputAnswer.value = '';
  inputAnswer.disabled = false;
  inputAnswer.className = '';
  nextBtn.style.display = 'none';

  // Show Next button only if user types something
  inputAnswer.addEventListener('input', () => {
    nextBtn.style.display = inputAnswer.value.trim() ? 'block' : 'none';
  });

  // Remove Enter key listener from before
  inputAnswer.onkeydown = null;

  // On Next click, check input answer
  nextBtn.onclick = () => {
    checkInputAnswer();
  };
}


function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  scoresList.innerHTML = '';
  highScores.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name}: ${item.score}`;
    scoresList.appendChild(li);
  });
} 