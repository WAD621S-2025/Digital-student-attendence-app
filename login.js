document.getElementById("toSignup").addEventListener("click", function() {
  document.querySelector(".flip-card").classList.add("flip");
});

document.getElementById("toLogin").addEventListener("click", function() {
  document.querySelector(".flip-card").classList.remove("flip");
});


function normalizeRole(value){
  const v = String(value || "").trim().toLowerCase();
  if(v === "student") return "student";
  if(v === "teacher" || v === "lecturer" || v === "lectuer") return "lecturer";
  return v;
}

document.getElementById("loginForm").addEventListener("submit", function(e){
  e.preventDefault();

  const role = document.getElementById("loginRole").value;
  const normalizedRole = normalizeRole(role);
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if(!role){
    alert("Please select a role.");
    return;
  }

  const formData = new FormData();
  formData.append('login', true);
  formData.append('role', normalizedRole);
  formData.append('email', email);
  formData.append('password', password);

  fetch('login.php', { method: 'POST', body: formData })
  .then(res => {
    if (res.redirected) {
      window.location.href = res.url;
      return Promise.reject('redirected');
    }
    return res.text();
  })
  .then(data => {
    const trimmed = data.trim();
    if(trimmed !== ""){
  
      if(/<html|<!DOCTYPE/i.test(trimmed)){
        if(normalizedRole === "student"){
          window.location.href = "student-dashboard.html";
        } else if(normalizedRole === "lecturer"){
          window.location.href = "lecturer-dashboard.html";
        }
        return;
      }
      alert(trimmed);
    }

    if(trimmed === "" || /success/i.test(trimmed)){
      if(normalizedRole === "student"){
        window.location.href = "student-dashboard.html";
      } else if(normalizedRole === "lecturer"){
        window.location.href = "lecturer-dashboard.html";
      }
    }
  }).catch(err => {
    if (err !== 'redirected') console.error(err);
  });
});

document.getElementById("signupForm").addEventListener("submit", function(e){
  e.preventDefault();

  const role = document.getElementById("signupRole").value;
  const normalizedRole = normalizeRole(role);
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if(!role){
    alert("Please select a role.");
    return;
  }

  const formData = new FormData();
  formData.append('signup', true);
  formData.append('role', normalizedRole);
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);

  fetch('signup.php', { method: 'POST', body: formData })
  .then(res => {
    if (res.redirected) {
      window.location.href = res.url;
      return Promise.reject('redirected');
    }
    return res.text();
  })
  .then(data => {
    const trimmed = data.trim();
    if(trimmed !== ""){
    
      if(/<html|<!DOCTYPE/i.test(trimmed)){
        if(normalizedRole === "student"){
          window.location.href = "student-dashboard.html";
        } else if(normalizedRole === "lecturer"){
          window.location.href = "lecturer-dashboard.html";
        }
        return;
      }
      alert(trimmed);
    }

    if(trimmed === "" || /success/i.test(trimmed)){
      if(normalizedRole === "student"){
        window.location.href = "student-dashboard.html";
      } else if(normalizedRole === "lecturer"){
        window.location.href = "lecturer-dashboard.html";
      }
    }
  }).catch(err => {
    if (err !== 'redirected') console.error(err);
  });
});



