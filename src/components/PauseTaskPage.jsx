import { useState } from 'react'
import { pauseTask, updateContext, getData } from '../utils/storage'

function PauseTaskPage({ project, task, onDone }) {

  // The four journal answers and notes
  const [answer1, setAnswer1] = useState('')
  const [answer2, setAnswer2] = useState('')
  const [answer3, setAnswer3] = useState('')
  const [answer4, setAnswer4] = useState('')
  const [notes, setNotes] = useState('')

  // Context calling fields
  const [referenceNotes, setReferenceNotes] = useState(
    task.context?.referenceNotes || ''
  )
  const [referenceLinks, setReferenceLinks] = useState(
    task.context?.referenceLinks || ''
  )
  const [additionalResources, setAdditionalResources] = useState(
    task.context?.additionalResources || ''
  )

  // Tracks whether the context panel is expanded
  const [showContext, setShowContext] = useState(false)

  function handleSubmit() {
    if (!answer1.trim() || !answer2.trim()) {
      alert('Please answer at least the first two questions before pausing.')
      return
    }

    // Save journal entry
    pauseTask(project.id, task.id, {
      answer1,
      answer2,
      answer3,
      answer4,
      notes
    })

    // Save context if anything was entered
    if (referenceNotes || referenceLinks || additionalResources) {
      updateContext(project.id, task.id, {
        referenceNotes,
        referenceLinks,
        additionalResources
      })
    }

    onDone()
  }

  // Gets the current project name freshly from storage
  const data = getData()
  const currentProject = data.projects.find(p => p.id === project.id)

  return (
    <div className="page">

      <div className="header">
        <div>
          <button className="back-button" onClick={onDone}>
            ← Back to Tasks
          </button>
          <h1>Pause Task</h1>
          <p>{task.title}</p>
        </div>
      </div>

      {/* ── Journal Form ─────────────────────── */}
      <div className="form-card">

        <h2>Task Interruption Journal</h2>
        <p style={{ color: '#6B6B6B', fontSize: '14px', marginTop: '-8px' }}>
          Answer the questions below before stepping away.
          This will help you pick up exactly where you left off.
        </p>

        <label>1. What did you last work on?</label>
        <textarea
          placeholder="Describe what you were working on when you stopped..."
          value={answer1}
          onChange={(e) => setAnswer1(e.target.value)}
        />

        <label>2. Where do you want to pick up from next time?</label>
        <textarea
          placeholder="What is the very next thing you need to do when you return?"
          value={answer2}
          onChange={(e) => setAnswer2(e.target.value)}
        />

        <label>3. Did you achieve your goal for this session?</label>
        <select
          value={answer3}
          onChange={(e) => setAnswer3(e.target.value)}
        >
          <option value="">Select an answer</option>
          <option value="Yes — fully achieved">Yes — fully achieved</option>
          <option value="Partially achieved">Partially achieved</option>
          <option value="No — not achieved">No — not achieved</option>
        </select>

        <label>4. If not fully achieved, what is still missing?</label>
        <textarea
          placeholder="What remains to be done before this task is complete?"
          value={answer4}
          onChange={(e) => setAnswer4(e.target.value)}
        />

        <label>Additional Notes</label>
        <textarea
          placeholder="Any other thoughts, blockers, or reminders for your future self..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

      </div>

      {/* ── Context Calling Panel ─────────────── */}
      <div className="context-panel">

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setShowContext(!showContext)}
        >
          <h3>Context Call</h3>
          <span style={{ color: '#8E7355', fontSize: '14px' }}>
            {showContext ? '▲ Hide' : '▼ Show'}
          </span>
        </div>

        <p style={{
          color: '#6B6B6B',
          fontSize: '13px',
          marginTop: '8px',
          marginBottom: showContext ? '16px' : '0'
        }}>
          Store references, links and resources relevant to this task.
        </p>

        {showContext && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div className="form-card" style={{ margin: 0, borderTop: 'none', boxShadow: 'none', background: 'transparent', padding: 0 }}>

              <label>Reference Notes</label>
              <textarea
                placeholder="Key notes, methods or approaches for this task..."
                value={referenceNotes}
                onChange={(e) => setReferenceNotes(e.target.value)}
              />

              <label>Reference Links</label>
              <input
                type="text"
                placeholder="Paste relevant URLs here (separate with commas)"
                value={referenceLinks}
                onChange={(e) => setReferenceLinks(e.target.value)}
              />

              <label>Additional Resources</label>
              <textarea
                placeholder="File names, tool names, documentation references..."
                value={additionalResources}
                onChange={(e) => setAdditionalResources(e.target.value)}
              />

            </div>

          </div>
        )}

      </div>

      {/* ── Submit ───────────────────────────── */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button className="btn-primary" onClick={handleSubmit}>
          Save and Pause Task
        </button>
        <button className="btn-secondary" onClick={onDone}>
          Cancel
        </button>
      </div>

    </div>
  )
}

export default PauseTaskPage