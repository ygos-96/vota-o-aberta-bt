'use strict';

const imageUrls = [
    'https://encurtador.com.br/6o92T',
    'https://encurtador.com.br/vjMRd',
    'https://encurtador.com.br/fwzy2',
    'https://encurtador.com.br/uP4gR'
];

const batalhaContainer = document.querySelector('.batalha');
const cardsContainer = document.querySelector('.batalha--cards');

function createCard(imageUrl, index) {
    const card = document.createElement('div');
    card.classList.add('batalha--card');
    if (index === 0) {
        card.classList.add('active');
    }
    card.innerHTML = `
        <div class="card-info position-absolute font-weight-bold">nome da categoria</div>
        <div class="card-info position-absolute right">tempo de tattoo</div>
        <img src="${imageUrl}">
        <div class="batalha--buttons position-absolute d-flex justify-content-between">
            <button class="nope"><i class="fa fa-remove"></i></button>
            <button class="love"><i class="fa fa-heart"></i></button>
        </div>
    `;
    return card;
}

function showNextCard() {
    const currentCard = document.querySelector('.batalha--card.active');
    if (currentCard) {
        currentCard.classList.remove('active');
        currentCard.classList.add('removed');
    }
    const nextCard = document.querySelector('.batalha--card:not(.removed)');
    if (nextCard) {
        nextCard.classList.add('active');
    }
}

function initCards() {
    batalhaContainer.classList.add('loaded');
}

imageUrls.forEach((url, index) => {
    const card = createCard(url, index);
    cardsContainer.appendChild(card);
});

initCards();

const allCards = document.querySelectorAll('.batalha--card');

allCards.forEach((el) => {
    const hammertime = new Hammer(el);

    hammertime.on('pan', (event) => {
        el.classList.add('moving');
        batalhaContainer.classList.toggle('batalha_love', event.deltaX > 0);
        batalhaContainer.classList.toggle('batalha_nope', event.deltaX < 0);

        const xMulti = event.deltaX * 0.03;
        const yMulti = event.deltaY / 80;
        const rotate = xMulti * yMulti;

        el.style.transform = `translate(${event.deltaX}px, ${event.deltaY}px) rotate(${rotate}deg)`;
    });

    hammertime.on('panend', (event) => {
        el.classList.remove('moving');
        batalhaContainer.classList.remove('batalha_love');
        batalhaContainer.classList.remove('batalha_nope');

        const moveOutWidth = document.body.clientWidth;
        const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

        if (!keep) {
            const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
            const toX = event.deltaX > 0 ? endX : -endX;
            const endY = Math.abs(event.velocityY) * moveOutWidth;
            const toY = event.deltaY > 0 ? endY : -endY;
            const xMulti = event.deltaX * 0.03;
            const yMulti = event.deltaY / 80;
            const rotate = xMulti * yMulti;

            el.style.transform = `translate(${toX}px, ${toY + event.deltaY}px) rotate(${rotate}deg)`;
            showNextCard();
        } else {
            el.style.transform = '';
        }
    });
});

function createButtonListener(love) {
    return function (event) {
        const currentCard = document.querySelector('.batalha--card.active');
        if (!currentCard) return false;

        const moveOutWidth = document.body.clientWidth * 1.5;

        currentCard.classList.add('removed');
        currentCard.style.transform = love ?
            `translate(${moveOutWidth}px, -100px) rotate(-30deg)` :
            `translate(-${moveOutWidth}px, -100px) rotate(30deg)`;

        batalhaContainer.classList.toggle('batalha_love', love);
        batalhaContainer.classList.toggle('batalha_nope', !love);

        setTimeout(() => {
            batalhaContainer.classList.remove('batalha_love');
            batalhaContainer.classList.remove('batalha_nope');
            showNextCard();
        }, 300);

        event.preventDefault();
    };
}

document.addEventListener('click', function (event) {
    if (event.target.closest('.nope')) {
        createButtonListener(false)(event);
    } else if (event.target.closest('.love')) {
        createButtonListener(true)(event);
    }
});