
let classes = [];
let attendanceRecords = [];
let currentQRCode = null;

document.addEventListener('DOMContentLoaded', function() {
  loadData();
  updateStats();
  displayClasses();
  

  document.getElementById('addClassForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addClass();
  });
});

function loadData() {
 
  if (!classes.length) {
    classes = [];
  }
  if (!attendanceRecords.length) {
    attendanceRecords = [];
  }
}


function saveData() {

  updateStats();
  displayClasses();
}


function addClass() {
  const className = document.getElementById('className').value;
  const classCode = document.getElementById('classCode').value;
  const classDay = document.getElementById('classDay').value;
  const classTime = document.getElementById('classTime').value;
  const classVenue = document.getElementById('classVenue').value;
  const gracePeriod = document.getElementById('gracePeriod').value;
  const classDescription = document.getElementById('classDescription').value;

  const newClass = {
    id: Date.now(),
    name: className,
    code: classCode,
    day: classDay,
    time: classTime,
    venue: classVenue,
    gracePeriod: parseInt(gracePeriod),
    description: classDescription,
    createdAt: new Date().toISOString()
  };

  classes.push(newClass);
  saveData();

  const messageDiv = document.getElementById('addClassMessage');
  messageDiv.textContent = 'Class added successfully!';
  messageDiv.style.color = '#28a745';
  messageDiv.style.display = 'block';


  document.getElementById('addClassForm').reset();


  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 3000);
}


function displayClasses() {
  const classList = document.getElementById('classList');
  
  if (classes.length === 0) {
    classList.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No classes added yet</p>';
    return;
  }

  classList.innerHTML = classes.map(cls => `
    <div class="class-card">
      <div class="class-header">
        <h3>${cls.name}</h3>
        <span class="class-code">${cls.code}</span>
      </div>
      <div class="class-details">
        <p><strong>📅 Day:</strong> ${cls.day}</p>
        <p><strong>🕐 Time:</strong> ${cls.time}</p>
        <p><strong>📍 Venue:</strong> ${cls.venue}</p>
        <p><strong>⏱️ Grace Period:</strong> ${cls.gracePeriod} minutes</p>
        ${cls.description ? `<p><strong>Description:</strong> ${cls.description}</p>` : ''}
      </div>
      <div class="class-actions">
        <button onclick="generateQR(${cls.id})" class="btn-primary">Generate QR Code</button>
        <button onclick="viewAttendance(${cls.id})" class="btn-secondary">View Attendance</button>
        <button onclick="deleteClass(${cls.id})" class="btn-danger">Delete</button>
      </div>
    </div>
  `).join('');
}

function generateQR(classId) {
  const cls = classes.find(c => c.id === classId);
  if (!cls) return;

  const sessionId = Date.now();
  const sessionData = {
    sessionId: sessionId,
    classId: classId,
    className: cls.name,
    classCode: cls.code,
    time: cls.time,
    gracePeriod: cls.gracePeriod,
    startTime: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  };


  if (!window.activeSessions) {
    window.activeSessions = [];
  }
  window.activeSessions.push(sessionData);

 
  const baseURL = window.location.origin + window.location.pathname.replace('lecturer-dashboard.html', 'student-dashboard.html');
  const qrURL = `${baseURL}?session=${sessionId}&class=${classId}&code=${cls.code}`;


  document.getElementById('qrModal').style.display = 'flex';
  document.getElementById('qrClassName').textContent = cls.name;
  document.getElementById('qrClassCode').textContent = cls.code;
  document.getElementById('qrDate').textContent = new Date().toLocaleDateString();
  document.getElementById('qrTime').textContent = new Date().toLocaleTimeString();
  document.getElementById('qrGracePeriod').textContent = cls.gracePeriod;


  document.getElementById('qrcode').innerHTML = '';

  currentQRCode = new QRCode(document.getElementById('qrcode'), {
    text: qrURL,
    width: 256,
    height: 256,
    colorDark: "#3718c2",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  updateStats();
}


function closeQRModal() {
  document.getElementById('qrModal').style.display = 'none';
}


function downloadQR() {
  const qrCanvas = document.querySelector('#qrcode canvas');
  if (qrCanvas) {
    const url = qrCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `attendance-qr-${Date.now()}.png`;
    link.href = url;
    link.click();
  }
}

function viewAttendance(classId) {
  const cls = classes.find(c => c.id === classId);
  if (!cls) return;


  const classAttendance = attendanceRecords.filter(record => record.classId === classId);


  document.getElementById('attendanceModal').style.display = 'flex';
  document.getElementById('attClassName').textContent = cls.name;
  document.getElementById('attDate').textContent = new Date().toLocaleDateString();
  document.getElementById('attTotal').textContent = classAttendance.length;

  const onTime = classAttendance.filter(r => r.status === 'Present').length;
  const late = classAttendance.filter(r => r.status === 'Late').length;

  document.getElementById('attOnTime').textContent = onTime;
  document.getElementById('attLate').textContent = late;

  const attendanceList = document.getElementById('attendanceList');
  
  if (classAttendance.length === 0) {
    attendanceList.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">No attendance records yet</p>';
    return;
  }

  attendanceList.innerHTML = classAttendance.map(record => `
    <div class="attendance-record">
      <div class="student-info">
        <strong>${record.firstName} ${record.lastName}</strong>
        <span>${record.studentNumber}</span>
      </div>
      <div class="attendance-status ${record.status.toLowerCase()}">
        ${record.status}
      </div>
      <div class="attendance-time">
        ${new Date(record.timestamp).toLocaleTimeString()}
      </div>
    </div>
  `).join('');
}

function closeAttendanceModal() {
  document.getElementById('attendanceModal').style.display = 'none';
}

function deleteClass(classId) {
  if (confirm('Are you sure you want to delete this class?')) {
    classes = classes.filter(c => c.id !== classId);
    attendanceRecords = attendanceRecords.filter(r => r.classId !== classId);
    saveData();
  }
}


function updateStats() {
  document.getElementById('totalClasses').textContent = classes.length;
  
  const uniqueStudents = new Set(attendanceRecords.map(r => r.studentNumber));
  document.getElementById('totalStudents').textContent = uniqueStudents.size;


  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = classes.filter(c => c.day === today).length;
  document.getElementById('todayClasses').textContent = todayClasses;

  const activeQRs = window.activeSessions ? window.activeSessions.filter(session => {
    const sessionTime = new Date(session.startTime);
    const now = new Date();
    const diffHours = (now - sessionTime) / (1000 * 60 * 60);
    return diffHours < 2;
  }).length : 0;
  
  document.getElementById('activeQRs').textContent = activeQRs;
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'index.html';
  }
}

window.onclick = function(event) {
  const qrModal = document.getElementById('qrModal');
  const attModal = document.getElementById('attendanceModal');
  
  if (event.target === qrModal) {
    closeQRModal();
  }
  if (event.target === attModal) {
    closeAttendanceModal();
  }
}

window.recordAttendance = function(sessionId, studentData) {
  const session = window.activeSessions ? window.activeSessions.find(s => s.sessionId === parseInt(sessionId)) : null;
  
  if (!session) {
    return { success: false, message: 'Invalid or expired session' };
  }
  const alreadySignedIn = attendanceRecords.find(
    r => r.sessionId === sessionId && r.studentNumber === studentData.studentNumber
  );

  if (alreadySignedIn) {
    return { success: false, message: 'You have already signed in for this class' };
  }
  const sessionStartTime = new Date(session.startTime);
  const currentTime = new Date();
  const minutesLate = (currentTime - sessionStartTime) / (1000 * 60);
  const status = minutesLate <= session.gracePeriod ? 'Present' : 'Late';
  const attendanceRecord = {
    sessionId: sessionId,
    classId: session.classId,
    className: session.className,
    classCode: session.classCode,
    studentNumber: studentData.studentNumber,
    firstName: studentData.firstName,
    lastName: studentData.lastName,
    timestamp: new Date().toISOString(),
    status: status,
    minutesLate: Math.round(minutesLate)
  };

  attendanceRecords.push(attendanceRecord);
  saveData();

  return { 
    success: true, 
    message: `Attendance recorded successfully! Status: ${status}`,
    status: status,
    record: attendanceRecord
  };
};