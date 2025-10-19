const card = document.getElementById('card');
const toSignup = document.getElementById('toSignup');
const toLogin = document.getElementById('toLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const forgotLink = document.getElementById('forgotLink');


toSignup.addEventListener('click', () => {
  card.classList.add('flipped');
});

toLogin.addEventListener('click', () => {
  card.classList.remove('flipped');
});


const users = {};


signupForm.addEventListener('submit', (e) => {
  
  
  const role = document.getElementById('signupRole').value;
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const errorMsg = document.getElementById('signupError');
  const successMsg = document.getElementById('signupSuccess');


  errorMsg.style.display = 'none';
  successMsg.style.display = 'none';

  if (users[email]) {
    errorMsg.textContent = 'User already exists with this email';
    errorMsg.style.display = 'block';
    return;
  }

 
  users[email] = {
    name: name,
    password: password,
    role: role
  };

  successMsg.textContent = 'Account created successfully! Please login.';
  successMsg.style.display = 'block';

  
  signupForm.reset();


  setTimeout(() => {
    card.classList.remove('flipped');
    successMsg.style.display = 'none';
  }, 1500);
});


loginForm.addEventListener('submit', (e) => {
  
  
  const role = document.getElementById('loginRole').value;
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('loginError');

  
  errorMsg.style.display = 'none';

  
  if (!users[email]) {
    errorMsg.textContent = 'User not found. Please sign up first.';
    errorMsg.style.display = 'block';
    return;
  }

  
  if (users[email].password !== password) {
    errorMsg.textContent = 'Incorrect password';
    errorMsg.style.display = 'block';
    return;
  }

  
  if (users[email].role !== role) {
    errorMsg.textContent = 'Role mismatch. Please select the correct role.';
    errorMsg.style.display = 'block';
    return;
  }

  if (role === 'lecturer') {
   
    window.location.href = 'lecturer-dashboard.html';
  } else if (role === 'student') {
    
    window.location.href = 'student-dashboard.html';
  }
});


forgotLink.addEventListener('click', () => {
  alert('Password reset functionality would be implemented here. For demo purposes, please contact admin.');
});




