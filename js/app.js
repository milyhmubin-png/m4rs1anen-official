const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

function openSection(section) {
  const content = document.getElementById("content");

  const sections = {
    merch: "MERCH STORE — КАТАЛОГ СКОРО БУДЕТ ДОСТУПЕН",
    music: "DISCOGRAPHY — ВСЯ МОЯ МУЗЫКА",
    releases: "NEW RELEASES — НОВЫЕ РЕЛИЗЫ",
    news: "NEWS — НОВОСТИ И СОБЫТИЯ"
  };

  content.innerHTML = `<h2>${sections[section]}</h2>`;
  content.scrollIntoView({ behavior: "smooth" });
}
