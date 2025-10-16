document.getElementById("toSignup").addEventListener("click", function() {
  document.querySelector(".flip-card").classList.add("flip");
});

document.getElementById("toLogin").addEventListener("click", function() {
  document.querySelector(".flip-card").classList.remove("flip");
});


document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const role = document.getElementById("loginRole").value;
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if(!role){
    alert("Please select a role.");
    return;
  }

  const formData = new FormData();
  formData.append('login', true);
  formData.append('role', role);
  formData.append('email', email);
  formData.append('password', password);

  fetch('login.php', { method: 'POST', body: formData })
  .then(res => res.text())
  .then(data => {
    if(data.trim() !== "") alert(data);
   
  });
});

document.getElementById("signupForm").addEventListener("submit", function(e){
  e.preventDefault();

  const role = document.getElementById("signupRole").value;
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if(!role){
    alert("Please select a role.");
    return;
  }

  const formData = new FormData();
  formData.append('signup', true);
  formData.append('role', role);
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);

  fetch('signup.php', { method: 'POST', body: formData })
  .then(res => res.text())
  .then(data => {
    if(data.trim() !== "") alert(data);

  });
});


