/**
 * @param maxWidth {number} – Максимальная ширина экрана
 * @param columnCount {number} – Количество колонок
 */
export interface IBreakpoint{
	maxWidth: number,
	columnCount: number
}

/**
 * @param container {string | HTMLElement} – Селектор контейнера сетки или соответствующий HTMLElement
 * @param columnCount {number} – Количество колонок
 * @param breakPoints {IBreakPoint} – Адаптивные точки останова
 */
export interface IMasonryParams{
	container: string | HTMLElement,
	columnCount: number,
	breakpoints?: IBreakpoint[],
}

class TinyMasonry {
	container: HTMLElement;
	items: HTMLElement[];
	columnCount: number;
	defaultColumnCount: number;
	breakPoints: IBreakpoint[];
	updateEvent: () => void;
  
	/**
	 * 
	 * @param params {IMasonryParams} – Параметры сетки
	 */
	constructor(params: IMasonryParams | HTMLElement) {
	  this.items = [];
	  let columnCount: number;
	  let breakPoints: IBreakpoint[];
  
	  if (params instanceof HTMLElement) {
		// Если в параметрах указан HTMLElement, читаем атрибуты из элемента
		let breakPointsStr = params.dataset['masonryBreakpoints'];
		let decodedBreakPoints = decodeURI(breakPointsStr).replace(new RegExp("%3A", 'g'), ":").replace(new RegExp("%2C", 'g'), ",");
		this.breakPoints = JSON.parse(decodedBreakPoints);
		this.columnCount = this.defaultColumnCount = parseInt(params.dataset['masonryColumns']);
		this.container = params;
	  } else {
		// Если в параметрах указан IMasonryParams, читаем атрибуты из него
		this.breakPoints = params.breakpoints;
		this.columnCount = this.defaultColumnCount = params.columnCount;
		this.container = <HTMLElement>params.container;
	  }
  
	  const elements = Array.from(this.container.children) as HTMLElement[];
	  this.items = elements.filter(el => el instanceof HTMLElement);
	  this.container.style.display = 'flex';
  
	  this.updateBreakpoints();
	  this.updateEvent = this.updateBreakpoints.bind(this);
	  window.addEventListener('resize', this.updateEvent, true);
	  (this.container as any).Masonry = this;
	}
  
	render() {
	  this.container.textContent = "";
  
	  for (let i = 0; i < this.columnCount; i++) {
		let columnElement = document.createElement("div");
		columnElement.className = "m-column";
		columnElement.style.width = `calc(${100 / this.columnCount}%)`;
  
		let appendFunc = (index: number) => {
		  if (this.items[index]) {
			let el = this.items[index];
			columnElement.appendChild(el);
			appendFunc(index + this.columnCount);
		  }
		}
  
		appendFunc(i);
		this.container.appendChild(columnElement);
	  }
	}
  
	updateBreakpoints() {
	  this.columnCount = this.defaultColumnCount;
  
	  if (this.breakPoints) {
		this.breakPoints.forEach((point: IBreakpoint) => {
		  if (window.matchMedia(`(max-width: ${point.maxWidth}px)`).matches) {
			this.columnCount = point.columnCount;
		  }
		});
	  }
  
	  this.render();
	}
  
	destroy() {
	  window.removeEventListener('resize', this.updateEvent, true);
	  this.container.textContent = "";
	  this.container.style.display = "block";
  
	  this.items.forEach((item: HTMLElement) => {
		this.container.appendChild(item);
	  });
	}
  }

export default TinyMasonry;