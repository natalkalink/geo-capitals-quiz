export const Counter = (current, total) => {
	return `
    <div class="counter">
      <div class="counter__container">
        Вопрос <span>${current}</span> из <span>${total}</span>
      </div>
    </div>
  `;
};