import { useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design homepage",
      description: "Create the main layout for the application.",
      status: "TODO",
      file: null,
    },
    {
      id: 2,
      title: "Prepare API structure",
      description: "Plan the endpoints for task management.",
      status: "TODO",
      file: null,
    },
    {
      id: 3,
      title: "Build React components",
      description: "Create reusable components for the task board.",
      status: "IN PROGRESS",
      file: null,
    },
    {
      id: 4,
      title: "Choose database",
      description: "Decide which database should be used.",
      status: "NEED DECISION",
      file: null,
    },
    {
      id: 5,
      title: "Project setup",
      description: "React and Vite project has been configured.",
      status: "DONE",
      file: null,
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    file: null,
  });

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

  // Create / Update task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    if (editingTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: formData.title,
                description: formData.description,
                status: formData.status,
                file: formData.file,
              }
            : task,
        ),
      );
    } else {
      const newTask = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        status: formData.status,
        file: formData.file,
      };

      setTasks([...tasks, newTask]);
    }

    resetForm();
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
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Edit task
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      file: task.file || null,
    });

    setEditingTaskId(task.id);
    setShowForm(true);
  };

  // Change task status
  const handleStatusChange = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );
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
                  <div className="task-card" key={task.id}>
                    <h3>{task.title}</h3>

                    <p>{task.description || "No description provided."}</p>

                    {/* Status */}
                    <select
                      className="status-select"
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN PROGRESS">In Progress</option>
                      <option value="NEED DECISION">Need Decision</option>
                      <option value="DONE">Done</option>
                    </select>

                    {/* Attachment */}
                    {task.file && (
                      <div className="task-file">📎 {task.file.name}</div>
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
                          onClick={() => handleDelete(task.id)}
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
                  placeholder="e.g. Design dashboard"
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
