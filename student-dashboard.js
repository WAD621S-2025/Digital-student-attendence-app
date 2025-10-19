
let studentAttendanceHistory = [];
let currentSession = null;


document.addEventListener('DOMContentLoaded', function() {

  checkQRCodeRedirect();
  
  loadStudentData();
  updateAttendanceStats();
  displayAttendanceHistory();
  

  document.getElementById('signInForm').addEventListener('submit', function(e) {
    e.preventDefault();
    signInAttendance();
  });
});


function checkQRCodeRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');
  const classId = urlParams.get('class');
  const classCode = urlParams.get('code');

  if (sessionId && classId) {
    currentSession = {
      sessionId: sessionId,
      classId: classId,
      classCode: classCode
    };

    const signInCard = document.querySelector('.card.full-width');
    signInCard.style.border = '3px solid #3718c2';
    signInCard.style.animation = 'pulse 2s infinite';


    const messageDiv = document.getElementById('signInMessage');
    messageDiv.textContent = `✅ QR Code scanned! Please sign in for class ${classCode}`;
    messageDiv.style.color = '#3718c2';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.style.display = 'block';


    document.getElementById('studentNumber').focus();
  }
}


async function signInAttendance() {
  const studentNumber = document.getElementById('studentNumber').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();

  if (!studentNumber || !firstName || !lastName) {
    showMessage('Please fill in all fields', 'error');
    return;
  }

  
  if (!currentSession) {
    showMessage('Please scan a valid QR code to sign in', 'error');
    return;
  }


  const studentData = {
    studentNumber: studentNumber,
    firstName: firstName,
    lastName: lastName
  };

  // Try to save to server first
  let result = null;
  try {
    const form = new FormData();
    form.append('studentNumber', studentData.studentNumber);
    form.append('firstName', firstName);
    form.append('lastName', lastName);
    form.append('sessionId', currentSession.sessionId);
    form.append('classId', currentSession.classId);
    form.append('classCode', currentSession.classCode);

    const resp = await fetch('save_attendance.php', { method: 'POST', body: form });
    const json = await resp.json();
    if (json && json.success) {
      result = { success: true, message: json.message, status: json.record.status, record: json.record };
    } else {
      // server rejected or error, fall back to local
      result = recordAttendanceLocally(currentSession.sessionId, studentData);
    }
  } catch (err) {
    // network or other error - fall back to local recording
    result = recordAttendanceLocally(currentSession.sessionId, studentData);
  }


  if (result.success) {
    showMessage(result.message, 'success');

    // attach first/last name and status if returned
    const rec = result.record || {
      sessionId: currentSession ? currentSession.sessionId : sessionId,
      classId: currentSession ? currentSession.classId : (result.record && result.record.classId),
      classCode: currentSession ? currentSession.classCode : (result.record && result.record.classCode),
      studentNumber: studentNumber,
      firstName: firstName,
      lastName: lastName,
      timestamp: new Date().toISOString(),
      status: result.status || 'Present'
    };

    // Mark late entries with status === 'Late'
    studentAttendanceHistory.push(rec);
    saveStudentData();
    updateAttendanceStats();
    displayAttendanceHistory();

    document.getElementById('signInForm').reset();

    setTimeout(() => {
      currentSession = null;
      const signInCard = document.querySelector('.card.full-width');
      signInCard.style.border = '';
      signInCard.style.animation = '';
    }, 2000);
  } else {
    showMessage(result.message, 'error');
  }
}

function recordAttendanceLocally(sessionId, studentData) {
  const alreadySignedIn = studentAttendanceHistory.find(
    r => r.sessionId === sessionId && r.studentNumber === studentData.studentNumber
  );

  if (alreadySignedIn) {
    return { success: false, message: 'You have already signed in for this class' };
  }

  const record = {
    sessionId: sessionId,
    classId: currentSession.classId,
    classCode: currentSession.classCode,
    studentNumber: studentData.studentNumber,
    firstName: studentData.firstName || '',
    lastName: studentData.lastName || '',
    timestamp: new Date().toISOString(),
    status: 'Present',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  return {
    success: true,
    message: 'Attendance recorded successfully!',
    status: 'Present',
    record: record
  };
}

function loadStudentData() {
  if (!studentAttendanceHistory.length) {
    studentAttendanceHistory = [];
  }
}

function saveStudentData() {

  updateAttendanceStats();
  displayAttendanceHistory();
}

function updateAttendanceStats() {
  const total = studentAttendanceHistory.length;
  const present = studentAttendanceHistory.filter(r => r.status === 'Present').length;
  const late = studentAttendanceHistory.filter(r => r.status === 'Late').length;
  
  document.getElementById('totalClasses').textContent = total;
  document.getElementById('presentCount').textContent = present;
  document.getElementById('lateCount').textContent = late;
  
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
  document.getElementById('attendanceRate').textContent = attendanceRate + '%';
}

function displayAttendanceHistory() {
  const historyTable = document.getElementById('attendanceHistory');
  
  if (studentAttendanceHistory.length === 0) {
    historyTable.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;">No records yet</td></tr>';
    return;
  }

  const sortedHistory = [...studentAttendanceHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  historyTable.innerHTML = sortedHistory.map(record => {
    const date = new Date(record.timestamp).toLocaleDateString();
    const time = new Date(record.timestamp).toLocaleTimeString();
    const statusClass = record.status.toLowerCase();
    
    return `
      <tr>
        <td>${date}</td>
        <td>${time}</td>
        <td><span class="status-badge ${statusClass}">${record.status}</span></td>
        <td>${record.classCode || record.className || 'N/A'}</td>
      </tr>
    `;
  }).join('');
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('signInMessage');
  messageDiv.textContent = message;
  messageDiv.style.color = type === 'success' ? '#28a745' : '#dc3545';
  messageDiv.style.display = 'block';

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = "welcome.html";
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }
  
  .status-badge.present {
    background-color: #d4edda;
    color: #155724;
  }
  
  .status-badge.late {
    background-color: #f8d7da;
    color: #721c24;
  }
`;
document.head.appendChild(style);