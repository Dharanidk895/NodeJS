const studentForm = document.getElementById("studentForm");
const tableBody = document.getElementById("tableBody");
const totalStudents = document.getElementById("totalStudents");
const classAverage = document.getElementById("classAverage");
const clearAllBtn = document.getElementById("clearAll");

document.addEventListener("DOMContentLoaded", loadStudents);

studentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const mark1 = parseInt(document.getElementById("mark1").value);
  const mark2 = parseInt(document.getElementById("mark2").value);
  const mark3 = parseInt(document.getElementById("mark3").value);

  if (name === "" || [mark1, mark2, mark3].some(m => isNaN(m))) {
    alert("Please fill all fields correctly!");
    return;
  }

  const total = mark1 + mark2 + mark3;
  const average = (total / 3).toFixed(2);
  const grade = calculateGrade(average);

  const student = { name, mark1, mark2, mark3, total, average, grade };

  saveStudent(student);
  addRow(student);
  updateStats();

  studentForm.reset();
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all records?")) {
    localStorage.removeItem("students");
    tableBody.innerHTML = "";
    updateStats();
  }
});

function calculateGrade(avg) {
  if (avg >= 90) return "A+";
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "F";
}

function saveStudent(student) {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
}

function loadStudents() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach(addRow);
  updateStats();
}

function addRow(student) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.mark1}</td>
    <td>${student.mark2}</td>
    <td>${student.mark3}</td>
    <td>${student.total}</td>
    <td>${student.average}</td>
    <td>${student.grade}</td>
  `;
  tableBody.appendChild(row);
}

function updateStats() {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  totalStudents.textContent = students.length;
  if (students.length > 0) {
    const avg = (students.reduce((acc, s) => acc + parseFloat(s.average), 0) / students.length).toFixed(2);
    classAverage.textContent = avg;
  } else {
    classAverage.textContent = 0;
  }
}
