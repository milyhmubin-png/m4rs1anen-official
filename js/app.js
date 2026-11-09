const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#090909");
    tg.setBackgroundColor("#090909");
}

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

navLinks.forEach(link => {
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

console.log("m4rs1anen Official App loaded");
