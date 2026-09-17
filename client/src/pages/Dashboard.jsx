import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import ThemeToggle from "../components/ThemeToggle.jsx";
import Toast from "../components/Toast.jsx";
import SkeletonTask from "../components/SkeletonTask.jsx";
import {
  IconCheck,
  IconPlus,
  IconTrash,
  IconSearch,
  IconX,
  IconLogOut,
  IconCheckCircle,
  IconClock,
  IconListTodo,
  IconSparkles,
  IconLoader,
} from "../components/Icons.jsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const navigate = useNavigate();

  // Retrieve cached user name if available
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  function showToast(message, type = "info") {
    setToast({ message, type });
  }

  function hideToast() {
    setToast({ message: "", type: "info" });
  }

  async function fetchTasks() {
    setInitialLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      showToast("Failed to load tasks", "error");
    } finally {
      setInitialLoading(false);
    }
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post("/tasks", { title: title.trim(), description: description.trim() });
      setTasks([res.data, ...tasks]);
      setTitle("");
      setDescription("");
      showToast("Task created successfully!", "success");
    } catch (err) {
      showToast("Failed to add task", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleComplete(task) {
    try {
      const res = await api.put(`/tasks/${task._id}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
      showToast(
        !task.completed ? "Task completed! Great job." : "Task marked as pending.",
        "info"
      );
    } catch (err) {
      showToast("Failed to update task", "error");
    }
  }

  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      showToast("Task deleted", "info");
    } catch (err) {
      showToast("Failed to delete task", "error");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // Calculated Metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered and Searched Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (filter === "active" && task.completed) return false;
      if (filter === "completed" && !task.completed) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title?.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [tasks, filter, searchQuery]);

  // Helper for human-readable dates
  function formatTaskDate(dateStr) {
    if (!dateStr) return null;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="dashboard-wrapper">
      {/* Top Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="brand-wrapper">
            <div className="brand-icon-box">
              <IconListTodo size={22} />
            </div>
            <span className="brand-title">TaskFlow</span>
          </div>

          <div className="navbar-actions">
            {user?.name && (
              <div className="user-badge" title={`Logged in as ${user.name}`}>
                <div className="user-avatar-initial">{userInitial}</div>
                <span className="user-name-text">{user.name}</span>
              </div>
            )}
            <ThemeToggle />
            <button onClick={handleLogout} className="btn-logout" title="Log out of your account">
              <IconLogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-content">
        {/* Stats Overview */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-number">{totalCount}</span>
            </div>
            <div className="stat-icon-wrapper stat-icon-total">
              <IconListTodo size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">In Progress</span>
              <span className="stat-number">{activeCount}</span>
            </div>
            <div className="stat-icon-wrapper stat-icon-pending">
              <IconClock size={22} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Completed</span>
              <span className="stat-number">{completedCount}</span>
            </div>
            <div className="stat-icon-wrapper stat-icon-completed">
              <IconCheckCircle size={22} />
            </div>
          </div>
        </section>

        {/* Progress Card */}
        {totalCount > 0 && (
          <section className="progress-card">
            <div className="progress-header">
              <span className="progress-label">Task Completion Rate</span>
              <span className="progress-pct">{completionPercentage}%</span>
            </div>
            <div className="progress-track" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </section>
        )}

        {/* Add Task Card */}
        <section className="task-add-card">
          <form onSubmit={handleAddTask} className="task-add-form">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="task-input-title"
              required
            />
            <input
              type="text"
              placeholder="Add optional notes or description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="task-input-desc"
            />
            <div className="task-add-bottom-row">
              <button type="submit" className="btn-add-task" disabled={submitting || !title.trim()}>
                {submitting ? (
                  <>
                    <IconLoader size={16} />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <IconPlus size={16} />
                    <span>Add Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Toolbar: Filter Tabs & Search */}
        <div className="task-toolbar">
          <div className="filter-tabs" role="tablist">
            <button
              type="button"
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              role="tab"
              aria-selected={filter === "all"}
            >
              <span>All</span>
              <span className="filter-count">{totalCount}</span>
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
              role="tab"
              aria-selected={filter === "active"}
            >
              <span>Active</span>
              <span className="filter-count">{activeCount}</span>
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
              role="tab"
              aria-selected={filter === "completed"}
            >
              <span>Completed</span>
              <span className="filter-count">{completedCount}</span>
            </button>
          </div>

          <div className="search-box">
            <span className="search-icon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <IconX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Task List */}
        {initialLoading ? (
          <SkeletonTask count={3} />
        ) : filteredTasks.length > 0 ? (
          <ul className="task-list">
            {filteredTasks.map((task) => {
              const formattedDate = formatTaskDate(task.createdAt);
              return (
                <li
                  key={task._id}
                  className={`task-card ${task.completed ? "completed" : ""}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleComplete(task)}
                    className="task-checkbox-btn"
                    aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
                    title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed && <IconCheck size={14} />}
                  </button>

                  <div onClick={() => toggleComplete(task)} className="task-details">
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && <p className="task-description">{task.description}</p>}
                    <div className="task-meta">
                      <span className={`task-status-pill ${task.completed ? "done" : "active"}`}>
                        {task.completed ? "Completed" : "Active"}
                      </span>
                      {formattedDate && (
                        <span className="task-badge-date">
                          <IconClock size={12} />
                          {formattedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTask(task._id)}
                    className="task-delete-btn"
                    aria-label={`Delete task: ${task.title}`}
                    title="Delete task"
                  >
                    <IconTrash size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : tasks.length === 0 ? (
          /* Zero Tasks Overall */
          <div className="empty-state">
            <div className="empty-icon-box">
              <IconSparkles size={28} />
            </div>
            <h3 className="empty-title">You&apos;re all caught up!</h3>
            <p className="empty-desc">
              No tasks found. Use the form above to add your first task and stay organized.
            </p>
          </div>
        ) : (
          /* Filtered or Searched No Match */
          <div className="empty-state">
            <div className="empty-icon-box">
              <IconSearch size={28} />
            </div>
            <h3 className="empty-title">No matching tasks</h3>
            <p className="empty-desc">
              We couldn&apos;t find any tasks matching &quot;{searchQuery}&quot; in the {filter} list.
            </p>
          </div>
        )}
      </main>

      {/* Floating Toast Portal */}
      <div className="toast-portal">
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      </div>
    </div>
  );
}
