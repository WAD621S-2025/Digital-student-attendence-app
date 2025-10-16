document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("signInForm");
  const historyTable = document.getElementById("attendanceHistory");
  const messageBox = document.getElementById("signInMessage");

  let records = [];

  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const studentNumber = document.getElementById("studentNumber").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;

    const now = new Date();
    const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const date = now.toLocaleDateString();

    const classStart = new Date();
    classStart.setHours(8,0,0);

    let status = now > classStart ? "Late" : "Present";

 
    const record = {date, time, status, className:"Demo Class", name:`${firstName} ${lastName}`};
    records.push(record);

    updateHistory();
    updateStats();

    messageBox.textContent = `Attendance recorded as ${status}`;
    messageBox.className = status === "Late" ? "message error" : "message success";
    messageBox.style.display = "block";

    signInForm.reset();
  });

  function updateHistory() {
    historyTable.innerHTML = "";
    records.forEach(r => {
      let row = `<tr>
        <td>${r.date}</td>
        <td>${r.time}</td>
        <td class="status-${r.status.toLowerCase()}">${r.status}</td>
        <td>${r.className}</td>
      </tr>`;
      historyTable.innerHTML += row;
    });
  }

  function updateStats() {
    document.getElementById("totalClasses").textContent = records.length;
    let present = records.filter(r=>r.status==="Present").length;
    let late = records.filter(r=>r.status==="Late").length;
    document.getElementById("presentCount").textContent = present;
    document.getElementById("lateCount").textContent = late;
    document.getElementById("attendanceRate").textContent = 
      records.length ? Math.round((present/records.length)*100)+"%" : "0%";
  }
});

function logout() {
  window.location.href = "index.html";
}


