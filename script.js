const API_URL = "https://rss.app/feeds/v1.1/but8eOWtIdvgaCVa.json";
const INTERVAL_MS = 15000;

let newsItems = [];
let currentNewsIndex = 0;
let carouselInterval;

const carouselContainer = document.getElementById("news-carousel-container");
const paginationContainer = document.getElementById("pagination");

async function fetchNews() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        newsItems = data.items || [];

        if (newsItems.length > 0) {
            renderCarousel();
            startCarousel();
        } else {
            carouselContainer.innerHTML =
                '<p style="text-align:center;color:red;">No hay noticias</p>';
        }
    } catch (error) {
        carouselContainer.innerHTML =
            '<p style="text-align:center;color:red;">Error al cargar noticias</p>';
    }
}

function renderCarousel() {
    carouselContainer.innerHTML = "";
    paginationContainer.innerHTML = "";

    newsItems.forEach((item, index) => {
        carouselContainer.appendChild(createNewsCard(item, index));
        paginationContainer.appendChild(createDot(index));
    });

    updateDisplay(0);
}

function createNewsCard(item, index) {
    const card = document.createElement("div");
    card.className = "card-body";
    card.dataset.index = index;

    card.innerHTML = `
                <div class="image-container">
                    <div class="image-frame">
                        <img src="${item.image || 'placeholder.png'}" alt="${item.title}">
                    </div>
                </div>
                <div class="text-content">
                    <h2 class="title">${item.title}</h2>
                    <p class="summary">${item.content_text || item.title}</p>
                </div>
            `;
    return card;
}

function createDot(index) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.onclick = () => {
        clearInterval(carouselInterval);
        updateDisplay(index);
        startCarousel();
    };
    return dot;
}

function updateDisplay(index) {
    currentNewsIndex = index;
    document.querySelectorAll(".card-body").forEach((card, i) => {
        card.classList.toggle("active", i === index);
    });
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function startCarousel() {
    clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        updateDisplay((currentNewsIndex + 1) % newsItems.length);
    }, INTERVAL_MS);
}

document.addEventListener("DOMContentLoaded", fetchNews);