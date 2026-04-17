
import '@/reset.scss';
import '@/style.scss';

import { europeQuestions, ukraineQuestions, ukraineMapTasks } from '@data/countries.js';
import { Header } from '@components/Header.js';
import { Footer } from '@components/Footer.js';
import { Question } from '@components/Question.js';
import { Answers } from '@components/Answers.js';
import { Counter } from '@components/Counter.js';
import { NextButton } from '@components/NextButton.js';
import { ukraineMap } from '@components/MapData.js';

const uiLabels = {
	nextBtn: { uk: "Наступне питання", en: "Next question" },
	restartBtn: { uk: "Почати заново", en: "Start over" },
	scoreLabel: { uk: "из", en: "out of" },
	finalTitle: { uk: "Квіз завершено!", en: "Quiz completed!" },
	menuTitle: { uk: "Оберіть рівень складності", en: "Choose your level" },
	modeEurope: { uk: "Країни та столиці Європи", en: "European Countries & Capitals" },
	modeUkraine: { uk: "Україна: Історія та факти", en: "Ukraine: History & Facts" },
	startBtn: { uk: "Почати квіз", en: "Start Quiz" },
	modeMap: { uk: "Інтерактивна мапа України", en: "Interactive Map of Ukraine" }
};

let currentLang = 'uk';
let currentMode = null;
let currentQuestionsSet = [];
let currentQuestionIndex = 0;
let score = 0;

const app = document.querySelector('#app');


function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function launchVictoryConfetti() {
	confetti({
		zIndex: 9999,
		particleCount: 150,
		spread: 70,
		origin: { y: 0.6 },
		colors: ['#ffd700', '#1e90ff', '#ffffff']
	});
}
function updateProgressBar() {
	const progressBar = document.getElementById('progressBar');
	if (!progressBar) return;
	const total = currentMode === 'map' ? ukraineMapTasks.length : currentQuestionsSet.length;
	const progress = ((currentQuestionIndex + 1) / (total || 1)) * 100;
	progressBar.style.width = `${progress}%`;
}


function renderMenu() {
	currentMode = null;
	app.innerHTML = `
        <div class="wrapper">
            ${Header(currentLang)}
            <main class="page">
                <div class="page__container">
                    <h1 class="page__title">${uiLabels.menuTitle[currentLang]}</h1>
                    <div class="page__selection">
                        <button class="mode-btn button" data-mode="europe">${uiLabels.modeEurope[currentLang]}</button>
                        <button class="mode-btn button" data-mode="ukraine">${uiLabels.modeUkraine[currentLang]}</button>
                        <button class="mode-btn button" data-mode="map">${uiLabels.modeMap[currentLang]}</button>
                    </div>
                    <button class="start-game-btn button">${uiLabels.startBtn[currentLang]}</button>
                </div>
            </main>
            ${Footer()}
        </div>
    `;
	initMenuLogic();
	initLanguageLogic();
}
function renderApp() {
	const countryData = currentQuestionsSet[currentQuestionIndex];
	const currentTranslation = countryData.translations[currentLang];
	const shuffledOptions = shuffle([...currentTranslation.options]);

	app.innerHTML = `
        <div class="wrapper">
            ${Header(currentLang)}
            <main class="page">
                <div class="page__container">
                    ${Question(currentTranslation, currentLang, currentMode)}
                    ${Answers(shuffledOptions)}
                    ${Counter(currentQuestionIndex + 1, currentQuestionsSet.length)}
                    ${NextButton(uiLabels.nextBtn[currentLang])}
                </div>
            </main>
            ${Footer()}
        </div>
    `;
	initLanguageLogic();
	initQuizLogic();
	initNextButton();
	initHomeNavigation();
}
function startMapGame() {
	currentMode = 'map';
	const task = ukraineMapTasks[currentQuestionIndex];

	app.innerHTML = `
        <div class="wrapper">
            ${Header(currentLang)}
            <main class="page">
                <div class="page__container">
                    <div class="progress-container"><div class="progress-bar" id="progressBar"></div></div>
                    <div class="page__nav">
                        <div class="question-count">${currentQuestionIndex + 1} / ${ukraineMapTasks.length}</div>
                        <div id="map-controls">
                            <button class="button next-btn hide">${currentLang === 'uk' ? 'Наступне питання' : 'Next Question'}</button>
                        </div>
                    </div>
                    <div class="question-card">
                        <h2 class="question-card__title">${currentLang === 'uk' ? 'Покажіть на мапі область:' : 'Find this region on the map:'}</h2>
                        <p class="question-card__subtitle" id="target-region-name">${task ? task[currentLang] : '...'}</p>
                    </div>
                    <div id="map-canvas" class="map-interactive-container">${ukraineMap}</div>
                </div>
            </main>
            ${Footer()}
        </div>
    `;

	setTimeout(() => {
		updateProgressBar();
		const mapContainer = document.getElementById('map-canvas');
		if (mapContainer && window.innerWidth < 768) mapContainer.scrollLeft = 200;
	}, 10);

	initLanguageLogic();
	initHomeNavigation();
	initMapGameLogic();
}
function renderFinalScreen() {
	const isMap = currentMode === 'map';
	const total = isMap ? ukraineMapTasks.length : currentQuestionsSet.length;
	const finalScore = score;

	const finalMessage = finalScore === total
		? (currentLang === 'uk' ? "Ідеально! Ви справжній знавець!" : "Perfect! You are a true expert!")
		: (currentLang === 'uk' ? "Гарний результат! Спробуєте ще раз?" : "Good result! Try again?");

	app.innerHTML = `
        <div class="wrapper">
            ${Header(currentLang)}
            <main class="page">
                <div class="page__container final-container">
                    <div class="question-card final-card">
                        <h2 class="final-card__title">${uiLabels.finalTitle[currentLang]}</h2>
                        <div class="score-display">
                            <span>${finalScore}</span> ${uiLabels.scoreLabel[currentLang]} <span>${total}</span>
                        </div>
                        <p class="final-card__text">${finalMessage}</p>
                    </div>
                    <div class="button__container">
                        <button class="restart-btn button">${uiLabels.restartBtn[currentLang]}</button>
                    </div>
                </div>
            </main>
            ${Footer()}
        </div>
    `;
	initRestartButton();
	initLanguageLogic();
	initHomeNavigation();
	if (finalScore === total) launchVictoryConfetti();
}


function initMenuLogic() {
	const modeButtons = document.querySelectorAll('.mode-btn');
	const startBtn = document.querySelector('.start-game-btn');

	modeButtons.forEach(btn => {
		btn.onclick = () => {
			modeButtons.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			currentMode = btn.getAttribute('data-mode');
		};
	});

	startBtn.onclick = () => {
		if (!currentMode) return alert(currentLang === 'uk' ? "Оберіть режим!" : "Select a mode!");
		currentQuestionIndex = 0;
		score = 0;
		if (currentMode === 'map') {
			shuffle(ukraineMapTasks);
			startMapGame();
		} else {
			const fullSet = currentMode === 'europe' ? europeQuestions : ukraineQuestions;
			currentQuestionsSet = shuffle([...fullSet]).slice(0, 10);
			renderApp();
		}
	};
}
export function initQuizLogic() {
	const answerButtons = document.querySelectorAll('.answer-btn');
	const correctAnswer = currentQuestionsSet[currentQuestionIndex].translations[currentLang].capital;
	const nextBtn = document.querySelector('.next-quiz-btn');

	answerButtons.forEach(button => {
		button.onclick = () => {
			if (button.textContent.trim() === correctAnswer) {
				button.classList.add('correct');
				score++;
			} else {
				button.classList.add('wrong');
				answerButtons.forEach(btn => { if (btn.textContent.trim() === correctAnswer) btn.classList.add('correct'); });
			}
			answerButtons.forEach(btn => btn.disabled = true);
			if (nextBtn) nextBtn.classList.add('show');
		};
	});
	updateProgressBar();
}
function initMapGameLogic() {
	const regions = document.querySelectorAll('#map-canvas path');
	const task = ukraineMapTasks[currentQuestionIndex];
	const nextBtn = document.querySelector('.next-btn');
	const mapCanvas = document.getElementById('map-canvas');


	mapCanvas.style.pointerEvents = 'auto';


	let answered = false;

	regions.forEach(region => {
		region.onclick = () => {

			if (answered) return;


			answered = true;


			mapCanvas.style.pointerEvents = 'none';
			if (region.id === task.id) {
				region.classList.add('correct');
				score++;
			} else {
				region.classList.add('wrong');
				const correctRegion = document.getElementById(task.id);
				if (correctRegion) correctRegion.classList.add('correct');
			}
			if (nextBtn) nextBtn.classList.add('show');
		};
	});


	if (nextBtn) {
		nextBtn.onclick = () => {

			answered = false;
			regions.forEach(r => r.classList.remove('correct', 'wrong'));

			currentQuestionIndex++;
			if (currentQuestionIndex < ukraineMapTasks.length) {
				startMapGame();
			} else {
				renderFinalScreen();
			}
		};
	}
}
function initNextButton() {
	const nextBtn = document.querySelector('.next-quiz-btn');
	if (nextBtn) {
		nextBtn.onclick = () => {
			if (currentQuestionIndex < currentQuestionsSet.length - 1) {
				currentQuestionIndex++;
				renderApp();
			} else renderFinalScreen();
		};
	}
}
function initRestartButton() {
	const restartBtn = document.querySelector('.restart-btn');
	if (restartBtn) {
		restartBtn.onclick = () => {
			currentQuestionIndex = 0;
			score = 0;
			if (currentMode === 'map') {
				shuffle(ukraineMapTasks);
				startMapGame();
			} else {
				let baseQuestions = currentMode === 'ukraine' ? ukraineQuestions : europeQuestions;
				currentQuestionsSet = shuffle([...baseQuestions]).slice(0, 10);
				renderApp();
			}
		};
	}
}
function initLanguageLogic() {
	document.querySelectorAll('.lang-btn').forEach(btn => {
		btn.onclick = () => {
			const selectedLang = btn.getAttribute('data-lang');
			if (currentLang !== selectedLang) {
				currentLang = selectedLang;
				if (currentMode === 'map') startMapGame();
				else if (currentMode) renderApp();
				else renderMenu();
			}
		};
	});
}
function initHomeNavigation() {
	const homeBtn = document.querySelector('#home-btn');
	if (homeBtn) {
		homeBtn.onclick = () => {
			currentMode = null;
			renderMenu();
		};
	}
}
renderMenu();