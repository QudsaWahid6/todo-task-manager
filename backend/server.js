const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Upload folder
const uploadDir = path.join(__dirname, "uploads");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Make uploaded files accessible
app.use("/uploads", express.static(uploadDir));

// Temporary tasks data
let tasks = [
  {
    id: 1,
    title: "Design homepage",
    description: "Create the main layout for the application.",
    status: "TODO",
    file: null,
  },
];

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET single task
app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
});

// CREATE task
app.post("/api/tasks", (req, res) => {
  const { title, description, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    description: description || "",
    status: status || "TODO",
    file: null,
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// UPDATE task
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { title, description, status } = req.body;

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title ?? tasks[taskIndex].title,
    description: description ?? tasks[taskIndex].description,
    status: status ?? tasks[taskIndex].status,
  };

  res.json(tasks[taskIndex]);
});

// CHANGE task status
app.patch("/api/tasks/:id/status", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const { status } = req.body;

  task.status = status;

  res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    message: "Task deleted successfully",
  });
});

// FILE UPLOAD
app.post("/api/tasks/:id/file", upload.single("file"), (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  task.file = {
    originalName: req.file.originalname,
    fileName: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  };

  res.json({
    message: "File uploaded successfully",
    task,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
