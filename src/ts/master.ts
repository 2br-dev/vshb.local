import Swiper from "swiper";
import {Pagination, Navigation, EffectCreative, EffectCoverflow} from 'swiper/modules';
import Lazy from 'vanilla-lazyload';
import * as $ from 'jquery';
import { confetti } from "@tsparticles/confetti";
import Masonry, {IMasonryParams } from './lib/tinymasonry';
import Zoomer from './lib/zoomer';


Swiper.use([Pagination, Navigation, EffectCreative, EffectCoverflow]);

interface ICount{
	count:number
}

interface IAudioElement{
	name:string,
	audio: HTMLAudioElement
}

let shakedCount:number = 0;
let imgWrapper:NodeListOf<HTMLElement>;
let counters:NodeListOf<HTMLElement>;
let imagesObserver:IntersectionObserver, counterObserver:IntersectionObserver;
history.scrollRestoration = "manual";

let soundfiles = ['0-fire', '1-folga', '2-wire', '3-cap', 'background'];
let sounds = new Array<IAudioElement>();

let loadedAudio = 0;
let totalAudio = soundfiles.length;
let images = 3;
let loadedImages = 0;

let rollSwiper:Swiper;


/**
 * Основной код страницы
 */
$(document).ready(() => {

	preloader();
	getLikes();

	imagesObserver = new IntersectionObserver(imagesIntersectionCallback, {
		threshold: .3,
		rootMargin: '-15%'
	});
	
	counterObserver = new IntersectionObserver(counterIntersectionCallback, {
		threshold: .3,
		rootMargin: '-15%'
	});

	imgWrapper = document.querySelectorAll('.wrapper');
	counters = document.querySelectorAll('.count-animate');

	let zoomer = new Zoomer(
		'.zoomer',
		'src',
		true
	)


	let masonryParams:IMasonryParams = {
		container: <HTMLElement>document.querySelector('.gallery-wrapper'),
		columnCount: 4,
		breakpoints: [
			{
				maxWidth: 1800,
				columnCount: 3
			},
			{
				maxWidth: 1600,
				columnCount: 2
			}
		]
	}

	new Masonry(masonryParams);

	
	$('html, body').scrollTop(0);
	
	document.documentElement.classList.add('fixed');

	
	$('body').on('click', '#shaker', shake);
	$('body').on('click', '#heart', like);
	$('body').on('click', '#mute', toggleMute);
	$('body').on('click', '#open-up', start);
	$('body').on('click', '#open-mute', start_mute);
	$('body').on('click', '.video', openModalVideo);

	$(window).on('beforeunload', resetCounters);
	
	imgWrapper.forEach((item) => {
		imagesObserver.observe(item);
	});
	
	counters.forEach((item) => {
		counterObserver.observe(item);
	});
	
	rollSwiper = (window as any).swiper = new Swiper('#roll-slider', {
		slidesPerView: 3,
		centeredSlides: true,
		centeredSlidesBounds: true,
		initialSlide: 2,
		loop: true,
		spaceBetween: 10,
		loopAdditionalSlides: 2,
		effect: 'creative',
		slideActiveClass: 'currentSlide',
		pagination: {
			type: "bullets",
			el: '.swiper-pagination'
		},
		navigation: {
			prevEl: '.prev',
			nextEl: '.next'
		},
		breakpoints:{
			850: {
				initialSlide: 2,
				slidesPerView: 5,
				creativeEffect: {
					shadowPerProgress: true,
					limitProgress: 2,
					perspective: true,
					prev: {
						translate: ["-50%", "0%", 0],
						rotate: [0, 0, -10],
						scale:  .9,
						origin: 'bottom'
					},
					next: {
						translate: ["50%", "0%", 0],
						rotate: [0, 0, 10],
						scale: .9,
						origin: 'bottom'
					}
				}
			},
			200: {
				slidesPerView: 1,
				spaceBetween: 30,
				initialSlide: 0,
				creativeEffect: {
					shadowPerProgress: true,
					limitProgress: 1,
					perspective: true,
					prev: {
						translate: ["-20%", "3%", 0],
						rotate: [0, 0, -10],
						origin: 'bottom'
					},
					next: {
						translate: ["20%", "3%", 0],
						rotate: [0, 0, 10],
						origin: 'bottom'
					}
				}
			}
		}
	});
	
	for(let i=0; i<180; i++){ makeBubble(); }

});






/**
 * Закрытие модального окна с видео
 * @param {MouseEvent} e Эвент мыши
 */
function closeModalVideo(e:MouseEvent){

	let path = e.composedPath();
	let videoElements = path.filter((el) => {
		return (el as HTMLElement).tagName == 'VIDEO';
	});
	

	if(videoElements.length){
		return null;
	}

	// Если музыка была запущена изначально, восстанавливаем
	let background = sound('background');
	let restore = !document.querySelector('#mute')?.classList.contains('stop');

	if(restore){
		background?.play();
	}

	e.preventDefault();
	let modal = <HTMLElement>document.querySelector('.video-modal');
	let video = <HTMLVideoElement>modal.querySelector('video');

	if(!video.paused){
		video.pause();
	}

	modal.classList.remove('open');

	setTimeout(() => {
		modal.remove();
	}, 600);
}

/**
 * Открытие видео в модальном окне
 * @param {MouseEvent} e Эвент мыши
 */
function openModalVideo(e:MouseEvent){
	let linkEl = <HTMLElement>e.currentTarget;
	let targetVideo = linkEl.dataset['video'];

	// Приостанавливаем фоновую музыку
	let backgroundSound = sound('background');
	backgroundSound?.pause();

	// Создание тела модального окна
	let modalContainer = document.createElement('div');
	modalContainer.className = 'video-modal';

	// Создание элемента видео
	let video = document.createElement('video');
	video.src = `/video/${targetVideo}`;
	video.controls = true;
	video.loop = false;
	video.muted = false;
	video.playsInline = true;

	// Создание кнопки закрытия модального окна
	let closeButton = document.createElement('a');
	closeButton.className = 'close';
	closeButton.textContent = "×";
	closeButton.href="javascript:void(0)";
	modalContainer.addEventListener('click', closeModalVideo);

	modalContainer.appendChild(video);
	modalContainer.appendChild(closeButton);
	document.body.appendChild(modalContainer);

	// Открытие модального окна
	setTimeout(() => {
		modalContainer.classList.add('open');
		video.play();
	})
}

/**
 * Сброс счётчиков
 */
function resetCounters(){
	shakedCount=0;
	window.scrollTo(0,0);
}

/**
 * Запуск со звуком
 */
function start(){
	let music = sound('background');
	music.play();
	let splash = document.querySelector('.splash');

	splash?.classList.add('loaded');

	setTimeout(() => {
		(<HTMLElement>document.querySelector('.bottle-wrapper')).style.transition = 'top .4s';
	}, 80);
}

/**
 * Запуск без звука
 */
function start_mute(){

	let splash = document.querySelector('.splash');
	splash?.classList.add('loaded');
	document.querySelector('#mute')?.classList.add('stop');

	setTimeout(() => {
		(<HTMLElement>document.querySelector('.bottle-wrapper')).style.transition = 'top .4s';
	}, 80);
}

/**
 * Включение/выключение музыки
 * @param {MouseEvent} e Эвент мыши
 */
function toggleMute(e:MouseEvent){
	e.preventDefault();
	let link =  e.currentTarget as HTMLLinkElement;
	let music = sound('background');

	if (music?.paused) {
		music?.play();
		link.classList.remove('stop');
	}else{
		music.pause();
		link.classList.add('stop');

	}
}

/**
 * Пред-загрузчик
 */
function preloader(){
	// Загрузка аудиофайлов ::::::::::::::::::::::::::::::::::::::::::::::::
	soundfiles.forEach((name)=>{

		let audio = new Audio(`/audio/${name}.mp3`);
		audio.oncanplay = function(e:Event){
			loadedAudio++;
			sounds.push({
				name: name,
				audio: audio
			})
			setupSplash();
		}
		audio.load();
	});

	// Загрузка картинок бутыли ::::::::::::::::::::::::::::::::::::::::::::
	const lazy = new Lazy({}, document.querySelectorAll('.lazy'));
	const bottleLazy = new Lazy({
		callback_loaded: () => {
			loadedImages++;
			setupSplash();
		}
	}, document.querySelectorAll('.bottle-lazy'));

	// Вспышка :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
	fire();
}

/**
 * Установка splash-скрина
 */
function setupSplash(){
	if(images == loadedImages && soundfiles.length == loadedAudio){

		console.log("Загрузка завершена!");
		document.querySelector('.bottle-wrapper')?.classList.add('loaded');
		document.querySelector('.splash')?.classList.add('complete');
		document.querySelector('h1')?.classList.add('complete');

	}
}

/**
 * Создание пузырька шампанского
 */
function makeBubble(){

	let scale = randomBetween(9, 10) / 10;
	let pos = randomBetween(0, 100);
	let speed = randomBetween(4000, 8000);
	let delay = randomBetween(200, 2000);
	let ratio = randomBetween(1 , 3);

	let bubble = document.createElement('div');
	let riggle = document.createElement('div');
	let wrapper = document.createElement('div');
	let container = <HTMLElement>document.querySelector('.champ');

	bubble.classList.add('bubble');
	riggle.classList.add('bubble-riggle');
	wrapper.classList.add('bubble-wrapper');

	riggle.style.transform = `scale(${scale})`;
	riggle.style.aspectRatio = `${ratio} / 1`;
	riggle.style.animationDuration = `${speed}ms`;
	riggle.style.animationDelay = `${delay}ms`;
	wrapper.appendChild(riggle);
	wrapper.style.left = `${pos}%`;
	riggle.appendChild(bubble);

	container.appendChild(wrapper);
	
}

/**
 * Получение текущего количества лайков
 */
function getLikes(){
	fetch('/classes/count.json')
		.then(res => res.json())
		.then((data:ICount) => {
			document.querySelector('#currentHearts').textContent = data.count.toString();
		})
}

/**
 * Запрос на back-end для установки лайков
 */
function increaseLikes(){
	fetch('/classes/increaser.php')
		.then(res => res.json())
		.then((data:ICount) => {
			document.querySelector('#currentHearts').textContent = data.count.toString();
		})
}

/**
 * Установка лайков
 * @param {MouseEvent} e Эвент мыши
 */
function like(e:MouseEvent){

	let x = e.clientX;
	let y = e.clientY;

	let el = <HTMLElement>document.querySelector('#heart');
	let triggerRect = el.getBoundingClientRect();

	let container = <HTMLElement>document.querySelector('#hearts');
	let containerRect = container.getBoundingClientRect();

	let top = (triggerRect.top + triggerRect.height / 2) - containerRect.top + 'px';
	let left = triggerRect.left + triggerRect.width / 2 + 'px';
	
	increaseLikes();
	
	for(let i=0; i < 4; i++){
		let heart = document.createElement('div');
		heart.classList.add('flying-heart');

		container.appendChild(heart);
		
		Object.assign(heart.style, {
			position: 'absolute',
			top: top,
			left: left
		})

		setTimeout(() => {

			let minX = 70;
			let maxX = window.innerWidth - 70;
			let minY = 70;
			let maxY = containerRect.height - 240;
			let minScale = 30;
			let maxScale = 120;
			let minRotate = 0;
			let maxRotate = 360;

			let randomX = randomBetween(minX, maxX);
			let randomY = randomBetween(minY, maxY);
			let randomScale = randomBetween(minScale, maxScale) / 100;
			let randomRotate = randomBetween(minRotate, maxRotate);

			let transform = {
				top: randomY + 'px',
				left: randomX + 'px',
				transform: `scale(${randomScale}) rotate(${randomRotate}deg) translate(-50%, -50%)`,
				opacity: 1
			}

			Object.assign(heart.style, transform);

			setTimeout(() => {

				heart.style.opacity = '0';

				setTimeout(() => {
					heart.remove();
				}, 1000)
			}, 5000);
		})
	}
}

/**
 * Случайное число в диапазоне
 * @param {number} x Нижний порог
 * @param {number} y Верхний порог
 * @returns 
 */
function randomBetween(x:number, y:number):number{
	return  Math.floor((y - x + 1) * Math.random()) + x;
}

/**
 * Обработчик попадания счётчиков в область видимости
 * @param {IntersectionObserverEntry[]} entries Вхождения
 * @param {IntersectionObserver} observer Обозреватель
 */
function counterIntersectionCallback(entries:IntersectionObserverEntry[], observer:IntersectionObserver){

	entries.forEach((entry:IntersectionObserverEntry) => {
		let element = <HTMLElement>entry.target;

		let current = parseInt(element.textContent);

		if(current != 0) return;
		
		if (entry.isIntersecting){
			
			let start = 0;
			let end = parseInt(element.dataset['target']);
			let current = {x: start};

			$(current).animate({
				x: end
			}, {
				duration: 1000,
				step: function(now:number){
					let intVal = parseInt(now.toString());
					let val = intVal.toLocaleString('ru');
					element.textContent = val;
				}
			})
		}
	})
}

/**
 * Обработчик попадания картинок в область обзора
 * @param {IntersectionObserverEntry[]} entries Вхождения
 * @param {IntersectionObserver} observer Обозреватель
 */
function imagesIntersectionCallback(entries:IntersectionObserverEntry[], observer:IntersectionObserver){
	
	entries.forEach((entry:IntersectionObserverEntry) => {
		let element = <HTMLElement>entry.target;
		if (entry.isIntersecting){
			element.classList.add('active');
		// }else{
		// 	element.classList.remove('active');
		}
	})

}

/**
 * Запуск анимации тряски бутылки
 * @param {MouseEvent} e Эвент мыши
  */
function shake(e:MouseEvent){

	let el = <HTMLElement>document.querySelector('.bottle-wrapper');
	let link = <HTMLElement>e.currentTarget;
	let cap = document.querySelector('.bottlecap');

	if(link.classList.contains('disabled')) return null;

	fire(e);

	switch(true){
		case shakedCount == 0:
			link.classList.add('disabled');
			el.classList.add('active'); 
			sound('0-fire')?.play();
			setTimeout(() => {
				link.classList.remove('disabled');
				shakedCount++;
			}, 1000);
			break;
		case shakedCount == 1:
			el.classList.add('shake');
			link.classList.add('disabled');
			sound('1-folga')?.play();
			setTimeout(() =>{
				el.classList.remove('shake');
				link.classList.remove( 'disabled');
				shakedCount++;
			}, 1000);
			setTimeout(() => {
				(<HTMLElement>document.querySelector('#step1')).style.display = 'none';
				(<HTMLElement>document.querySelector('#step2')).style.display = 'block';
			}, 500);
			break;
		case shakedCount == 2:
			el.classList.add('shake');
			link.classList.add('disabled');
			sound('2-wire')?.play();
			setTimeout(() =>{
				el.classList.remove('shake');
				link.classList.remove( 'disabled');
				shakedCount++;
			}, 1000);
			setTimeout(() => {
				(<HTMLElement>document.querySelector('#step2')).style.display = 'none';
				(<HTMLElement>document.querySelector('#step3')).style.display = 'block';
			}, 500);
			break;
		case shakedCount == 3:
			cap.classList.add('flying');
			let foamEl = document.querySelector('#foam');
			let start = (foamEl?.clientHeight / 3) * 2;
			sound('3-cap')?.play();
			$('.foam-el').addClass('active');
			let targetEl = <HTMLElement>document.querySelector('.champ');
			let top = targetEl.offsetTop + window.innerHeight;
			document.querySelector('#step3')?.classList.add('shut');
			document.documentElement.scrollTop = start;
			link.classList.add('disabled');

			setTimeout(() => {
				
				$('html, body').animate({
					scrollTop: top
				}, 2400, () => {
					document.documentElement.classList.remove('fixed');
					$('#hero').addClass('hide');
					$('#foam').addClass('hide');
					$('#bubbles').addClass('hide');
					document.documentElement.scrollTop = 0;
					link.classList.remove('disabled');
				})
			}, 600);
			break;
	}
}

/**
 * Запуск анимации феерверка
 * @param {MouseEvent} e Эвент мыши
 */
function fire(e?:MouseEvent){

	let _x:number, _y:number;

	if(e){

		let element = <HTMLElement>document.querySelector('#heart');
	
		let rect:DOMRect = element.getBoundingClientRect();
		let top = rect.top + rect.height / 2;
		let left = rect.left + rect.width / 2;
	
		top -= element.scrollTop;
	
		_x = e.clientX;
		_y = e.clientY;
	}else{
		_x = -window.innerWidth;
		_y = -window.innerHeight;
	}


	let normalX = _x / window.innerWidth;
	let normalY = _y / window.innerHeight;

	confetti({
		shapes: ['square', 'circle', 'polygon'],
		scalar: 2,
		position: {
			x: normalX * 100,
			y: normalY * 100
		},
		zIndex: 200
	});
}

/**
 * 
 * @param {string} name  Имя аудиодорожки
 * @returns {HTMLAudioElement | undefined}  Аудиоэлемент или undefined
*/
type audio = HTMLAudioElement | undefined;
function sound(name:string):audio{
	
	let soundEl:IAudioElement[] = sounds.filter((s) => {
		return s.name == name;
	})

	if(soundEl.length){
		return soundEl[0].audio;
	}
}