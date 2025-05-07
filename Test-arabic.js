const questions = [
  { disorder: "depression", question: "هل تشعر بالحزن أو اليأس معظم الوقت؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "schizophrenia", question: "هل تسمع أو ترى أشياء لا يراها الآخرون؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "anxiety", question: "هل تشعر بالتوتر أو القلق بشكل متكرر؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "bipolar", question: "هل تتقلب حالتك المزاجية بين السعادة الشديدة والحزن الشديد؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "ptsd", question: "هل تعاني من كوابيس أو ذكريات مؤلمة لحدث صادم؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "ocd", question: "هل تشعر بأنك مضطر للقيام بطقوس أو عادات معينة؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "adhd", question: "هل تجد صعوبة في التركيز أو الجلوس بهدوء لفترات طويلة؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "eating", question: "هل تشعر بقلق مفرط بشأن وزنك أو طعامك؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "bpd", question: "هل تشعر أن علاقاتك غير مستقرة أو شديدة؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "social", question: "هل تتجنب المواقف الاجتماعية خوفًا من الحكم عليك؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "trust", question: "هل تجد صعوبة في الوثوق بالآخرين؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] },
  { disorder: "trauma", question: "هل مررت بتجربة مؤلمة ما زالت تؤثر عليك؟", answers: ["نعم", "أحيانًا", "نادرًا", "لا"], scores: [3, 2, 1, 0] }
];

const disorderNames = {
  depression: "الاكتئاب", schizophrenia: "الفصام", anxiety: "اضطرابات القلق",
  bipolar: "الاضطراب ثنائي القطب", ptsd: "اضطراب ما بعد الصدمة", ocd: "الوسواس القهري",
  adhd: "فرط الحركة وتشتت الانتباه", eating: "اضطرابات الأكل", bpd: "اضطراب الشخصية الحدية",
  social: "القلق الاجتماعي", trust: "مشاكل الثقة", trauma: "الصدمة النفسية"
};

let currentQuestion = 0;
let disorderScores = {};

function loadQuestion() {
  const questionElement = document.getElementById('question');
  const answersElement = document.getElementById('answers');
  const progressElement = document.getElementById('progress');

  const current = questions[currentQuestion];
  questionElement.innerText = current.question;
  answersElement.innerHTML = '';

  current.answers.forEach((answer, index) => {
    const label = document.createElement('label');
    const className = answer.toLowerCase().replace(/\s/g, '');
    label.className = `option ${className}`;
    label.innerHTML = `<input type="radio" name="answer" value="${current.scores[index]}"> ${answer}`;
    answersElement.appendChild(label);
  });

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  progressElement.style.width = progressPercentage + '%';
}

function nextQuestion() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  if (selectedAnswer) {
    const score = parseInt(selectedAnswer.value);
    const disorder = questions[currentQuestion].disorder;

    if (!disorderScores[disorder]) disorderScores[disorder] = 0;
    disorderScores[disorder] += score;

    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  } else {
    alert("يرجى اختيار إجابة قبل المتابعة.");
  }
}

function showResults() {
  const resultsElement = document.getElementById('results');
  const quizForm = document.getElementById('quizForm');
  quizForm.style.display = 'none';
  resultsElement.style.display = 'block';

  const totalScore = Object.values(disorderScores).reduce((sum, val) => sum + val, 0);

  if (totalScore === 0) {
    resultsElement.innerHTML = `
      <h3>النتيجة:</h3>
      <p>لا توجد مؤشرات على اضطراب نفسي، أنت بخير.</p>
      <button onclick="restartQuiz()">إعادة الاختبار</button>
    `;
    return;
  }

  const sortedDisorders = Object.entries(disorderScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  let total = 100;
  const percentages = [];

  for (let i = 0; i < sortedDisorders.length - 1; i++) {
    const random = Math.floor(Math.random() * (total - (sortedDisorders.length - i - 1))) + 1;
    percentages.push(random);
    total -= random;
  }
  percentages.push(total);

  resultsElement.innerHTML = `<h3>نتائج الاختبار:</h3><ul>`;
  sortedDisorders.forEach(([disorder, _], index) => {
    const name = disorderNames[disorder] || disorder;
    resultsElement.innerHTML += `<li><strong>${name}</strong>: ${percentages[index]}%</li>`;
  });
  resultsElement.innerHTML += `</ul>
    <p><a href="service-arabic.html#disorders" target="_blank">اعرف المزيد</a></p>
    <button onclick="restartQuiz()">إعادة الاختبار</button>
  `;
}

function restartQuiz() {
  currentQuestion = 0;
  disorderScores = {};
  document.getElementById('results').style.display = 'none';
  document.getElementById('quizForm').style.display = 'block';
  loadQuestion();
}

loadQuestion();
