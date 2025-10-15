const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Path to data file
const DATA_FILE = path.join(__dirname, "students.json");

// ✅ Ensure data file exists and is valid JSON
function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]");
      console.log("🆕 Created new students.json file.");
    } else {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      JSON.parse(content); // test if valid JSON
    }
  } catch (error) {
    console.error("⚠️ students.json was corrupted. Recreating...");
    fs.writeFileSync(DATA_FILE, "[]");
  }
}

// ✅ Read data safely
function readData() {
  ensureDataFile();
  const content = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(content || "[]");
}

// ✅ Write data safely
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET all students
app.get("/students", (req, res) => {
  const students = readData();
  res.json(students);
});

// POST add new student
app.post("/students", (req, res) => {
  const students = readData();
  const newStudent = req.body;

  // Basic validation
  if (!newStudent.name || isNaN(newStudent.average)) {
    return res.status(400).json({ error: "Invalid student data" });
  }

  students.push(newStudent);
  saveData(students);
  res.json({ message: "✅ Student added successfully", student: newStudent });
});

// DELETE all students
app.delete("/students", (req, res) => {
  saveData([]);
  res.json({ message: "🗑 All records cleared" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
