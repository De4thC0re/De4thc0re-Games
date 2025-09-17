document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 De4thC0re Games – menu załadowane!");

  const buttons = document.querySelectorAll(".play-btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      console.log(`➡️ Przechodzisz do gry: ${btn.textContent}`);
    });
  });
});