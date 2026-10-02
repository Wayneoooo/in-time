import { useState, useEffect } from 'react'
import { getData, createProject, deleteProject, updateProjectStatus } from '../utils/storage'

function HomePage({ onSelectProject }) {

  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')

  // Filter state — show all, active only, or complete only
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    refreshProjects()
  }, [])

  function refreshProjects() {
    const data = getData()
    setProjects(data.projects)
  }

  function handleCreateProject() {
    if (!title.trim()) {
      alert('Please enter a project title')
      return
    }
    createProject(title, description, deadline)
    refreshProjects()
    setTitle('')
    setDescription('')
    setDeadline('')
    setShowForm(false)
  }

  function handleDeleteProject(e, projectId) {
    // Stops the card click from firing at the same time
    e.stopPropagation()
    if (window.confirm('Delete this project and all its tasks? This cannot be undone.')) {
      deleteProject(projectId)
      refreshProjects()
    }
  }

  function handleCompleteProject(e, projectId) {
    e.stopPropagation()
    if (window.confirm('Mark this project as complete?')) {
      updateProjectStatus(projectId, 'Complete')
      refreshProjects()
    }
  }

  function handleReopenProject(e, projectId) {
    e.stopPropagation()
    updateProjectStatus(projectId, 'Active')
    refreshProjects()
  }

  // Applies the filter to the project list
  const filteredProjects = projects.filter(p => {
    if (filter === 'active') return p.status !== 'Complete'
    if (filter === 'complete') return p.status === 'Complete'
    return true
  })

  return (
    <div className="page">

      <div className="header">
        <div>
          <h1>In-Time</h1>
          <p style={{ color: '#6B6B6B', fontSize: '14px', marginTop: '4px' }}>
            Your developer task journal
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          + New Project
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Create New Project</h2>

          <label>Project Title</label>
          <input
            type="text"
            placeholder="Enter project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="form-buttons">
            <button className="btn-primary" onClick={handleCreateProject}>
              Save Project
            </button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Filter Tabs ───────────────────────── */}
      {projects.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {['all', 'active', 'complete'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px',
                borderRadius: '20px',
                border: '1.5px solid #1C1C1E',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: filter === f ? 'bold' : 'normal',
                backgroundColor: filter === f ? '#1C1C1E' : 'transparent',
                color: filter === f ? '#F5F4F0' : '#1C1C1E',
                textTransform: 'capitalize'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && !showForm && (
        <p className="empty-message">
          {filter === 'complete'
            ? 'No completed projects yet.'
            : filter === 'active'
            ? 'No active projects.'
            : 'No projects yet. Click "+ New Project" to get started.'}
        </p>
      )}

      <div className="card-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => onSelectProject(project)}
            style={{
              opacity: project.status === 'Complete' ? 0.7 : 1,
              borderLeftColor: project.status === 'Complete' ? '#AEACA8' : '#8E7355'
            }}
          >

            {project.status === 'Complete' && (
              <span className="status-badge status-Complete"
                style={{ marginBottom: '10px', display: 'inline-block' }}
              >
                Complete
              </span>
            )}

            <h2>{project.title}</h2>

            {project.description && (
              <p>{project.description}</p>
            )}

            {project.deadline && (
              <p className="deadline">Deadline: {project.deadline}</p>
            )}

            <p className="task-count">
              {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
            </p>

            {/* ── Card Actions ─────────────────── */}
            <div
              className="task-actions"
              onClick={(e) => e.stopPropagation()}
            >
              {project.status !== 'Complete' ? (
                <button
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={(e) => handleCompleteProject(e, project.id)}
                >
                  Mark Complete
                </button>
              ) : (
                <button
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={(e) => handleReopenProject(e, project.id)}
                >
                  Reopen
                </button>
              )}

              <button
                className="btn-danger"
                style={{ fontSize: '12px', padding: '6px 12px' }}
                onClick={(e) => handleDeleteProject(e, project.id)}
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

export default HomePage