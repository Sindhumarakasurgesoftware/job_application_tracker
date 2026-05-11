// ===============================
// ROLE DATA
// ===============================
const rolesByCompany = {
  Surge: ["Frontend Developer", "AEM Developer", "UI Engineer"],
  Google: ["Frontend Developer", "Backend Developer", "UI Engineer"],
  Amazon: ["SDE-1", "SDE-2", "Frontend Engineer"],
  Microsoft: ["Software Engineer", "Web Developer"],
  TCS: ["Java Developer", "Frontend Developer", "Tester"],
  Infosys: ["System Engineer", "UI Developer"],
  Wipro: ["Project Engineer", "Frontend Developer"]
};

// ===============================
// GLOBAL STATE
// ===============================
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
let selectedIndex = null;
let pendingIndex = null;
let chart;

// ===============================
// UPDATE ROLES BASED ON COMPANY
// ===============================
function updateRoles() {
  const company = document.getElementById("company").value;
  const roleSelect = document.getElementById("role");

  roleSelect.innerHTML = `<option value="">Select Role</option>`;
  if (!company) return;

  rolesByCompany[company].forEach(role => {
    let option = document.createElement("option");
    option.value = role;
    option.textContent = role;
    roleSelect.appendChild(option);
  });
}

// ===============================
// Add Job 
// ===============================
function addJob() {
  let company = document.getElementById("company").value;
  let role = document.getElementById("role").value;
  let status = document.getElementById("status").value;
  let appliedDate = document.getElementById("appliedDate").value;


  if (!company || !role || !appliedDate) {
    alert("Please select company, role, and applied date");
    return;
  }

  jobs.push({ company, role, status, appliedDate, notes: "" });
  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();
}

// ===============================
// RENDER JOBS as listed
// ===============================
function renderJobs(listData = jobs) {
  let list = document.getElementById("jobList");
  list.innerHTML = "";

  let counts = { Applied:0, Interview:0, Offer:0, Rejected:0 };

  listData.forEach((job, index) => {
    counts[job.status]++;

    let div = document.createElement("div");
    div.className = `job-card ${job.status.toLowerCase()}`;
    div.innerHTML = `
      <strong>${job.company}</strong> - ${job.role}
      <br>
      <small>Applied on: ${job.appliedDate}</small>
      <span>${job.status}</span>
    `;

    // div.onclick = () => openModal(index);
    div.onclick = () => showConfirmModal(index);

    list.appendChild(div);
  });

  document.getElementById("total").innerText = jobs.length;
  document.getElementById("interview").innerText = counts.Interview;
  document.getElementById("offer").innerText = counts.Offer;
  document.getElementById("rejected").innerText = counts.Rejected;

  renderChart(counts);
}
// ===============================
// open and close model
// ===============================
function openModal(index) {
  selectedIndex = index;
  let job = jobs[index];

  document.getElementById("modalCompany").innerText = job.company;
  document.getElementById("modalRole").innerText = job.role;
  document.getElementById("modalStatus").value = job.status;
  document.getElementById("modalDate").innerText = job.appliedDate;
  document.getElementById("modalNotes").value = job.notes || "";

  document.getElementById("jobModal").style.display = "block";
}

function closeModal() {
  document.getElementById("jobModal").style.display = "none";
}

// ===============================
// CONFIRMATION MODAL
// ===============================
function showConfirmModal(index) {
  pendingIndex = index;
  document.getElementById("confirmModal").style.display = "block";
}

function confirmYes() {
  document.getElementById("confirmModal").style.display = "none";
  openModal(pendingIndex);
}

function confirmNo() {
  document.getElementById("confirmModal").style.display = "none";
  pendingIndex = null;
}
// ===============================
// UPDATE THE STATUS & DELETE JOB
// ===============================
function updateStatus() {
  jobs[selectedIndex].status =
    document.getElementById("modalStatus").value;
    
    jobs[selectedIndex].notes =
    document.getElementById("modalNotes").value;

  localStorage.setItem("jobs", JSON.stringify(jobs));
  closeModal();
  renderJobs();
}

// ===============================
function deleteJob() {
  jobs.splice(selectedIndex, 1);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  closeModal();
  renderJobs();
}

// ===============================
// SEARCH & FILTER
// ===============================
function searchJobs() {
  let text = document.getElementById("search").value.toLowerCase();
  let status = document.getElementById("filterStatus").value;

  let filtered = jobs.filter(job =>
    (job.company.toLowerCase().includes(text) ||
     job.role.toLowerCase().includes(text)) &&
    (status === "" || job.status === status)
  );

  renderJobs(filtered);
}

// ===============================
// CHART
// ===============================
function renderChart(counts) {
  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("statusChart"), {
    type: "pie",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: ["#3498db","#f1c40f","#2ecc71","#e74c3c"]
      }]
    }
  });
}

renderJobs();

// ===============================
// WELCOME & LOGOUT
// ===============================
function setWelcomeMessage() {
  const name = "Sindhu"; 
  const hour = new Date().getHours();
  let greeting = "Hello";

  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  document.getElementById("welcomeMsg").innerText =
       `${greeting}, ${name} 👋`;

}

setWelcomeMessage();
// =================================
function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";