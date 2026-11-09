const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#090909");
    tg.setBackgroundColor("#090909");
}

// NAVIGATION

const navLinks = document.querySelectorAll(".bottom-nav a");
const sections = document.querySelectorAll("main section[id]");

function setActive(id) {
    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
        );
    });
}

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        rootMargin: "-25% 0px -60% 0px"
    });

    sections.forEach(section => observer.observe(section));
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);

        if (target) {
            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// MUSIC CATALOG

const musicGrid = document.getElementById("music-grid");
const musicDetails = document.getElementById("music-details");
const catalogTabs = document.querySelectorAll(".catalog-tab");

let musicData = null;
let currentCatalog = "releases";

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function getReleaseType(item, single = false) {
    if (single) return "СИНГЛ";

    const types = {
        album: "АЛЬБОМ",
        ep: "МИНИ-АЛЬБОМ / EP",
        compilation: "СБОРНИК"
    };

    return types[item.type] || "РЕЛИЗ";
}

function getReleaseDate(item) {
    if (item.releaseDate) {
        const date = new Date(item.releaseDate + "T12:00:00");
        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        }
    }

    return item.year ? String(item.year) : "Дата не указана";
}

function renderMusic() {
    if (!musicData || !musicGrid) return;

    const isSingle = currentCatalog === "singles";
    const items = isSingle
        ? musicData.singles || []
        : musicData.releases || [];

    musicDetails.hidden = true;
    musicGrid.hidden = false;

    if (!items.length) {
        musicGrid.innerHTML =
            '<p class="music-loading">В ЭТОМ РАЗДЕЛЕ ПОКА НЕТ РЕЛИЗОВ.</p>';
        return;
    }

    musicGrid.innerHTML = items.map((item, index) => {
        const title = escapeHTML(item.title);
        const cover = item.coverUrl
            ? `<img src="${escapeHTML(item.coverUrl)}" alt="${title}" loading="lazy">`
            : '<span class="music-cover-empty">ОБЛОЖКА НЕ ДОБАВЛЕНА</span>';

        const count = item.trackCount
            ? `${item.trackCount} ТРЕКОВ`
            : "";

        return `
            <article class="music-item"
                data-index="${index}"
                role="button"
                tabindex="0"
                aria-label="Подробнее: ${title}">
                <div class="music-cover">
                    ${cover}
                </div>
                <div class="music-item-info">
                    <span>${getReleaseType(item, isSingle)}</span>
                    <h3>${title}</h3>
                    <p>${getReleaseDate(item)}${count ? " · " + count : ""}</p>
                </div>
            </article>
        `;
    }).join("");
}

function openMusicDetails(index) {
    if (!musicData) return;

    const isSingle = currentCatalog === "singles";
    const items = isSingle
        ? musicData.singles || []
        : musicData.releases || [];

    const item = items[index];
    if (!item) return;

    const tracks = item.tracks || [];

    const cover = item.coverUrl
        ? `<img src="${escapeHTML(item.coverUrl)}" alt="${escapeHTML(item.title)}">`
        : '<div class="music-cover-empty">ОБЛОЖКА НЕ ДОБАВЛЕНА</div>';

    const trackList = tracks.length
        ? `<div class="music-track-list">
            ${tracks.map((track, i) => `
                <div class="music-track">
                    <span>${String(i + 1).padStart(2, "0")}</span>
                    <span>${escapeHTML(track.title)}</span>
                    <span>${escapeHTML(track.duration || "")}</span>
                </div>
            `).join("")}
           </div>`
        : `<p class="music-loading">ТРЕК-ЛИСТ ПОКА НЕ ДОБАВЛЕН.</p>`;

    const platformLinks = [
        { label: "APPLE MUSIC", url: item.appleMusicUrl },
        { label: "YANDEX MUSIC", url: item.yandexMusicUrl },
        { label: "VK MUSIC", url: item.vkMusicUrl }
    ].filter(platform => platform.url);

    const platformButtons = platformLinks.length
        ? `<div class="music-platform-buttons">
            ${platformLinks.map(platform => `
                <a href="${escapeHTML(platform.url)}"
                   target="_blank"
                   rel="noopener noreferrer">
                    ${platform.label} ↗
                </a>
            `).join("")}
           </div>`
        : "";

    musicGrid.hidden = true;
    musicDetails.hidden = false;

    musicDetails.innerHTML = `
        <button class="music-back" type="button">
            ← НАЗАД К КАТАЛОГУ
        </button>

        <div class="music-detail-cover">
            ${cover}
        </div>

        <span class="music-label">
            ${getReleaseType(item, isSingle)}
        </span>

        <h3 class="music-detail-title">
            ${escapeHTML(item.title)}
        </h3>

        <p class="music-detail-date">
            ${getReleaseDate(item)}
        </p>

        ${item.duration
            ? `<p class="music-detail-date">${escapeHTML(item.duration)}</p>`
            : ""}

        <div class="music-track-heading">ТРЕК-ЛИСТ</div>
        ${trackList}
        ${platformButtons}
    `;

    musicDetails.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

if (musicGrid && musicDetails) {
    musicGrid.addEventListener("click", event => {
        const card = event.target.closest(".music-item");
        if (card) openMusicDetails(Number(card.dataset.index));
    });

    musicGrid.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            const card = event.target.closest(".music-item");
            if (card) {
                event.preventDefault();
                openMusicDetails(Number(card.dataset.index));
            }
        }
    });

    musicDetails.addEventListener("click", event => {
        if (event.target.closest(".music-back")) {
            musicDetails.hidden = true;
            musicGrid.hidden = false;
            musicGrid.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

    catalogTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            currentCatalog = tab.dataset.catalog;

            catalogTabs.forEach(button => {
                button.classList.toggle(
                    "active",
                    button === tab
                );
            });

            renderMusic();
        });
    });

    fetch("./music.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Не удалось загрузить music.json");
            }
            return response.json();
        })
        .then(data => {
            musicData = data;
            renderMusic();
            console.log("Музыкальный каталог загружен:", data);
        })
        .catch(error => {
            console.error(error);
            musicGrid.innerHTML =
                '<p class="music-loading">НЕ УДАЛОСЬ ЗАГРУЗИТЬ МУЗЫКАЛЬНЫЙ АРХИВ.</p>';
        });
}

console.log("m4rs1anen Official App loaded");
