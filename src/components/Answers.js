export const Answers = (options) => {
	return `
  <div class="answers-grid">
    ${options.map(opt => `<button class="answer-btn button">${opt}</button>`).join('')}
  </div>
`;
};