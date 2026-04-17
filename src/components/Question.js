export const Question = (translation, lang, currentMode) => {
	const label = lang === 'uk' ? 'Країна' : 'Country';
	return `
			<div class="progress-container">
    			<div class="progress-bar" id="progressBar"></div>
			</div>
			<div class="question-card">
            	<h2 class="question-card__title">${translation.question}</h2>
            	${currentMode !== 'ukraine'
			? `<p class="question-card__subtitle">${label}: ${translation.country}</p>`
			: ''
		}
			</div>
    `;
};