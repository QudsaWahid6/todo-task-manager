import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    file: null,
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Load tasks when page opens
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0] || null,
    });
  };

  // Create or update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    try {
      let task;

      if (editingTaskId) {
        // Update existing task
        const response = await fetch(`${API_URL}/tasks/${editingTaskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            status: formData.status,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        task = await response.json();
      } else {
        // Create new task
        const response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            status: formData.status,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create task");
        }

        task = await response.json();
      }

      // Upload file if selected
      if (formData.file) {
        const fileData = new FormData();
        fileData.append("file", formData.file);

        const fileResponse = await fetch(`${API_URL}/tasks/${task._id}/file`, {
          method: "POST",
          body: fileData,
        });

        if (!fileResponse.ok) {
          throw new Error("Task saved but file upload failed");
        }
      }

      await fetchTasks();
      resetForm();
    } catch (error) {
      console.error("Error saving task:", error);
      alert(error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      status: "TODO",
      file: null,
    });

    setEditingTaskId(null);
    setShowForm(false);
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message);
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      file: null,
    });

    setEditingTaskId(task._id);
    setShowForm(true);
  };

  // Change task status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      await fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message);
    }
  };

  // Get tasks for each column
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const columns = [
    {
      status: "TODO",
      title: "Todo",
      subtitle: "Tasks to do",
    },
    {
      status: "IN PROGRESS",
      title: "In Progress",
      subtitle: "Currently working",
    },
    {
      status: "NEED DECISION",
      title: "Need Decision",
      subtitle: "Waiting for decision",
    },
    {
      status: "DONE",
      title: "Done",
      subtitle: "Completed tasks",
    },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div>
          <h1>Todo Task Manager</h1>
          <p>Organize your work and stay productive.</p>
        </div>

        <button
          className="add-task-btn"
          onClick={() => {
            setEditingTaskId(null);

            setFormData({
              title: "",
              description: "",
              status: "TODO",
              file: null,
            });

            setShowForm(true);
          }}
        >
          + Add Task
        </button>
      </header>

      {/* Board */}
      <main className="board">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);

          return (
            <section className="column" key={column.status}>
              <div className="column-header">
                <div>
                  <h2>{column.title}</h2>
                  <span>{column.subtitle}</span>
                </div>

                <span className="task-count">{columnTasks.length}</span>
              </div>

              <div className="task-list">
                {columnTasks.map((task) => (
                  <div className="task-card" key={task._id}>
                    <h3>{task.title}</h3>

                    <p>{task.description || "No description provided."}</p>

                    {/* Status */}
                    <select
                      className="status-select"
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN PROGRESS">In Progress</option>
                      <option value="NEED DECISION">Need Decision</option>
                      <option value="DONE">Done</option>
                    </select>

                    {/* Attachment */}
                    {task.file && task.file.originalName && (
                      <div className="task-file">
                        📎 {task.file.originalName}
                      </div>
                    )}

                    <div className="card-footer">
                      <span>{task.file ? "📎 Attachment" : "Task"}</span>

                      <div className="card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(task)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(task._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="add-column-task"
                onClick={() => {
                  setEditingTaskId(null);

                  setFormData({
                    title: "",
                    description: "",
                    status: column.status,
                    file: null,
                  });

                  setShowForm(true);
                }}
              >
                + Add task
              </button>
            </section>
          );
        })}
      </main>

      {/* Add / Edit Task Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>{editingTaskId ? "Edit Task" : "Create New Task"}</h2>

                <p>
                  {editingTaskId
                    ? "Update your task details."
                    : "Add details about your task."}
                </p>
              </div>

              <button className="close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="form-group">
                <label>Task title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Complete university assignment"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Describe your task..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              {/* Status */}
              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="TODO">Todo</option>
                  <option value="IN PROGRESS">In Progress</option>
                  <option value="NEED DECISION">Need Decision</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              {/* File */}
              <div className="form-group">
                <label>Attachment</label>

                <input type="file" onChange={handleFileChange} />

                {formData.file && (
                  <small className="file-name">📎 {formData.file.name}</small>
                )}
              </div>

              {/* Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  {editingTaskId ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
