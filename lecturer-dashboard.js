
let classes = [];
let currentQRCode = null;
let currentClass = null;


function init() {
  loadClasses();
  updateStats();
}

function loadClasses() {
  const savedClasses = localStorage.getItem('lecturerClasses');
  if (savedClasses) {
    classes = JSON.parse(savedClasses);
  }
  renderClasses();
  updateStats();
}


function saveClasses() {
  localStorage.setItem('lecturerClasses', JSON.stringify(classes));
}


document.getElementById('addClassForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const newClass = {
    id: Date.now(),
    name: document.getElementById('className').value,
    code: document.getElementById('classCode').value,
    day: document.getElementById('classDay').value,
    time: document.getElementById('classTime').value,
    venue: document.getElementById('classVenue').value,
    description: document.getElementById('classDescription').value,
    createdAt: new Date().toISOString(),
    students: []
  };

  classes.push(newClass);
  saveClasses();
  renderClasses();
  updateStats();

 
  const message = document.getElementById('addClassMessage');
  message.textContent = 'Class added successfully!';
  message.className = 'message success';
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);

  
  this.reset();
});

function renderClasses() {
  const classList = document.getElementById('classList');
  
  if (classes.length === 0) {
    classList.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No classes added yet</p>';
    return;
  }

  classList.innerHTML = classes.map(classItem => `
    <div class="class-item">
      <div class="class-info">
        <h3>${classItem.name}</h3>
        <p>📝 Code: ${classItem.code}</p>
        <p>📅 ${classItem.day} at ${classItem.time}</p>
        <p>📍 ${classItem.venue}</p>
        ${classItem.description ? `<p style="font-size:12px;margin-top:5px;">${classItem.description}</p>` : ''}
      </div>
      <div class="class-actions">
        <button class="btn btn-qr" onclick="generateQR(${classItem.id})">Generate QR</button>
        <button class="btn btn-delete" onclick="deleteClass(${classItem.id})">Delete</button>
      </div>
    </div>
  `).join('');
}


function generateQR(classId) {
  currentClass = classes.find(c => c.id === classId);
  if (!currentClass) return;

  
  document.getElementById('qrcode').innerHTML = '';

  const baseURL = window.location.origin;
  const loginURL = `${baseURL}/login.html?class=${currentClass.code}&session=${Date.now()}`;

  currentQRCode = new QRCode(document.getElementById('qrcode'), {
    text: loginURL,
    width: 256,
    height: 256,
    colorDark: '#3718c2',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });

  document.getElementById('qrClassName').textContent = currentClass.name;
  document.getElementById('qrClassCode').textContent = currentClass.code;
  document.getElementById('qrDate').textContent = new Date().toLocaleDateString();
  document.getElementById('qrTime').textContent = new Date().toLocaleTimeString();

  
  document.getElementById('qrModal').classList.add('active');
}


function closeQRModal() {
  document.getElementById('qrModal').classList.remove('active');
}


function downloadQR() {
  const canvas = document.querySelector('#qrcode canvas');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = `QR_${currentClass.code}_${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL();
  link.click();
}


function deleteClass(classId) {
  if (!confirm('Are you sure you want to delete this class?')) return;

  classes = classes.filter(c => c.id !== classId);
  saveClasses();
  renderClasses();
  updateStats();
}


function updateStats() {
  document.getElementById('totalClasses').textContent = classes.length;
  
  const totalStudents = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);
  document.getElementById('totalStudents').textContent = totalStudents;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = classes.filter(c => c.day === today).length;
  document.getElementById('todayClasses').textContent = todayClasses;

  document.getElementById('activeQRs').textContent = classes.length;
}


function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'login.html';
  }
}

window.onclick = function(event) {
  const modal = document.getElementById('qrModal');
  if (event.target === modal) {
    closeQRModal();
  }
}


window.addEventListener('DOMContentLoaded', init);


