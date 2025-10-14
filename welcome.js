document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.querySelector(".enter-button");
  const overlay = document.querySelector(".overlay");


  enterBtn.addEventListener("mouseover", () => {
    enterBtn.style.transform = "scale(1.05)";
  });

  enterBtn.addEventListener("mouseout", () => {
    enterBtn.style.transform = "scale(1)";
  });


  enterBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    overlay.style.transition = "opacity 0.8s ease";
    overlay.style.opacity = "0";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 800); 
  });
});

