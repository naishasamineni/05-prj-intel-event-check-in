const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");

const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");

let attendanceGoal = 50;

let totalAttendees = 0;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

let attendeesList = [];

function loadFromStorage() {
  const savedData = JSON.parse(localStorage.getItem("intelSummitData"));

  if (savedData) {
    totalAttendees = savedData.totalAttendees;
    teamCounts = savedData.teamCounts;
    attendeesList = savedData.attendeesList;

    updateDisplay();
    renderAttendeeList();
  }
}

function saveToStorage() {
  const data = {
    totalAttendees,
    teamCounts,
    attendeesList,
  };

  localStorage.setItem("intelSummitData", JSON.stringify(data));
}

function updateDisplay() {
  attendeeCountDisplay.textContent = totalAttendees;

  waterCountDisplay.textContent = teamCounts.water;
  zeroCountDisplay.textContent = teamCounts.zero;
  powerCountDisplay.textContent = teamCounts.power;

  updateProgressBar();
}

function updateProgressBar() {
  const percentage = (totalAttendees / attendanceGoal) * 100;
  progressBar.style.width = `${percentage}%`;

  if (totalAttendees >= attendanceGoal) {
    showCelebration();
  }
}

function showGreeting(name, team) {
  const teamNames = {
    water: "Team Water Wise 🌊",
    zero: "Team Net Zero 🌿",
    power: "Team Renewables ⚡",
  };

  greeting.style.display = "block";
  greeting.classList.add("success-message");

  greeting.textContent = `Welcome, ${name}! You're checked in with ${teamNames[team]}!`;
}

function showCelebration() {
  let winningTeam = Object.keys(teamCounts).reduce((a, b) =>
    teamCounts[a] > teamCounts[b] ? a : b
  );

  const teamNames = {
    water: "Team Water Wise 🌊",
    zero: "Team Net Zero 🌿",
    power: "Team Renewables ⚡",
  };

  greeting.style.display = "block";
  greeting.classList.add("success-message");

  greeting.textContent = `🎉 Attendance goal reached! ${teamNames[winningTeam]} wins with the highest turnout!`;
}

function renderAttendeeList() {
  let listContainer = document.getElementById("attendeeList");

  if (!listContainer) {
    listContainer = document.createElement("div");
    listContainer.id = "attendeeList";
    listContainer.style.marginTop = "20px";
    document.querySelector(".team-stats").appendChild(listContainer);
  }

  listContainer.innerHTML = "<h3>Checked-In Attendees</h3>";

  attendeesList.forEach((attendee) => {
    const p = document.createElement("p");
    p.textContent = `${attendee.name} — ${attendee.team}`;
    listContainer.appendChild(p);
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  totalAttendees++;
  teamCounts[team]++;

  const teamLabelMap = {
    water: "Team Water Wise 🌊",
    zero: "Team Net Zero 🌿",
    power: "Team Renewables ⚡",
  };

  attendeesList.push({
    name: name,
    team: teamLabelMap[team],
  });

  updateDisplay();
  showGreeting(name, team);
  renderAttendeeList();
  saveToStorage();

  form.reset();
});

loadFromStorage();
updateDisplay();
