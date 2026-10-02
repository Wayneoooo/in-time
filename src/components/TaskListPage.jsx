import { useState, useEffect } from 'react'
import { getData, createTask, deleteTask } from '../utils/storage'

function TaskListPage({ project, onPauseTask, onResumeTask, onGoHome }) {

  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [objectives, setObjectives] = useState('')
  const [dependencies, setDependencies] = useState('')
  const [methods, setMethods] = useState('')
  const [priorityRanking, setPriorityRanking] = useState(3)

  // Loads tasks from localStorage when page opens
  useEffect(() => {
    refreshTasks()
  }, [])

  function refreshTasks() {
    const data = getData()
    const currentProject = data.projects.find(p => p.id === project.id)
    if (currentProject) {
      setTasks(currentProject.tasks)
    }
  }

  function handleCreateTask() {
    if (!title.trim()) {
      alert('Please enter a task title')
      return
    }
    createTask(
      project.id,
      title,
      description,
      deadline,
      objectives,
      dependencies,
      methods,
      priorityRanking
    )
    refreshTasks()
    setTitle('')
    setDescription('')
    setDeadline('')
    setObjectives('')
    setDependencies('')
    setMethods('')
    setPriorityRanking(3)
    setShowForm(false)
  }

  function handleDeleteTask(taskId) {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(project.id, taskId)
      refreshTasks()
    }
  }

  // Passes the full updated task object to App.jsx
  function handlePause(task) {
    const data = getData()
    const currentProject = data.projects.find(p => p.id === project.id)
    const freshTask = currentProject.tasks.find(t => t.id === task.id)
    onPauseTask(freshTask)
  }

  function handleResume(task) {
    const data = getData()
    const currentProject = data.projects.find(p => p.id === project.id)
    const freshTask = currentProject.tasks.find(t => t.id === task.id)
    onResumeTask(freshTask)
  }

  return (
    <div className="page">

      <div className="header">
        <div>
          <button className="back-button" onClick={onGoHome}>
            ← Back to Projects
          </button>
          <h1>{project.title}</h1>
          {project.description && (
            <p>{project.description}</p>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + New Task
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Task</h2>

          <label>Task Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="What does this task involve?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <label>Objectives</label>
          <textarea
            placeholder="What should be achieved by completing this task?"
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
          />

          <label>Dependencies</label>
          <input
            type="text"
            placeholder="What does this task depend on?"
            value={dependencies}
            onChange={(e) => setDependencies(e.target.value)}
          />

          <label>Methods</label>
          <input
            type="text"
            placeholder="What methods or approaches will you use?"
            value={methods}
            onChange={(e) => setMethods(e.target.value)}
          />

          <label>Priority Ranking (1 = Low, 5 = High)</label>
          <select
            value={priorityRanking}
            onChange={(e) => setPriorityRanking(Number(e.target.value))}
          >
            <option value={1}>1 — Low</option>
            <option value={2}>2 — Below Average</option>
            <option value={3}>3 — Average</option>
            <option value={4}>4 — High</option>
            <option value={5}>5 — Critical</option>
          </select>

          <div className="form-buttons">
            <button className="btn-primary" onClick={handleCreateTask}>
              Save Task
            </button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {tasks.length === 0 && !showForm && (
        <p className="empty-message">
          No tasks yet.<br />Click "+ New Task" to add one.
        </p>
      )}

      <div>
        {tasks.map((task) => (
          <div key={task.id} className="task-card">

            <span className={`status-badge status-${task.status}`}>
              {task.status}
            </span>

            <span className="priority-badge">
              Priority {task.priorityRanking}
            </span>

            <h3>{task.title}</h3>

            {task.description && <p>{task.description}</p>}

            {task.deadline && (
              <p className="deadline">Deadline: {task.deadline}</p>
            )}

            {task.objectives && (
              <p><strong>Objectives:</strong> {task.objectives}</p>
            )}

            {task.journalEntries.length > 0 && (
              <p className="task-count">
                {task.journalEntries.length} journal{' '}
                {task.journalEntries.length !== 1 ? 'entries' : 'entry'}
              </p>
            )}

            <div className="task-actions">

              {task.status !== 'Complete' && (
                <button
                  className="btn-accent"
                  onClick={() => handlePause(task)}
                >
                  Pause Task
                </button>
              )}

              {task.status === 'Paused' && (
                <button
                  className="btn-primary"
                  onClick={() => handleResume(task)}
                >
                  Resume Task
                </button>
              )}

              {task.status !== 'Complete' && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    deleteTask(project.id, task.id)
                    refreshTasks()
                  }}
                >
                  Mark Complete
                </button>
              )}

              <button
                className="btn-danger"
                onClick={() => handleDeleteTask(task.id)}
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default TaskListPage