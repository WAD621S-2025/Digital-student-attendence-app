
document.getElementById("toSignup").addEventListener("click", function() {
  document.querySelector(".flip-card").classList.add("flip");
});

document.getElementById("toLogin").addEventListener("click", function() {
  document.querySelector(".flip-card").classList.remove("flip");
});

document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();
  alert(`Logging in as ${document.getElementById("loginRole").value}`);
});

document.getElementById("signupForm").addEventListener("submit", function(e){
  e.preventDefault();
  alert(`Signing up as ${document.getElementById("signupRole").value}`);
});


