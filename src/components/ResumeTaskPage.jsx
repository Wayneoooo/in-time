import { useState, useEffect } from 'react'
import { getLatestJournalEntry, resumeTask, getData } from '../utils/storage'

function ResumeTaskPage({ project, task, onDone }) {

  const [latestEntry, setLatestEntry] = useState(null)
  const [context, setContext] = useState(null)
  const [allEntries, setAllEntries] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  // Loads the latest journal entry and context when page opens
  useEffect(() => {
    const entry = getLatestJournalEntry(project.id, task.id)
    setLatestEntry(entry)

    const data = getData()
    const currentProject = data.projects.find(p => p.id === project.id)
    const currentTask = currentProject.tasks.find(t => t.id === task.id)
    setContext(currentTask.context)
    setAllEntries(currentTask.journalEntries)
  }, [])

  function handleResume() {
    resumeTask(project.id, task.id)
    onDone()
  }

  // Formats the ISO timestamp into a readable date and time
  function formatTimestamp(iso) {
    const date = new Date(iso)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="page">

      <div className="header">
        <div>
          <button className="back-button" onClick={onDone}>
            ← Back to Tasks
          </button>
          <h1>Resume Task</h1>
          <p>{task.title}</p>
        </div>
        <button className="btn-primary" onClick={handleResume}>
          Resume Task →
        </button>
      </div>

      {/* ── Latest Journal Entry ──────────────── */}
      {latestEntry ? (
        <div>
          <p className="section-title">Last Session Log</p>

          <div className="journal-entry">

            <h4>Logged on {formatTimestamp(latestEntry.timestamp)}</h4>

            <div className="journal-question">
              <p>What did you last work on?</p>
              <span>{latestEntry.answer1 || '—'}</span>
            </div>

            <div className="journal-question">
              <p>Where do you want to pick up from next time?</p>
              <span>{latestEntry.answer2 || '—'}</span>
            </div>

            <div className="journal-question">
              <p>Did you achieve your goal for this session?</p>
              <span>{latestEntry.answer3 || '—'}</span>
            </div>

            {latestEntry.answer4 && (
              <div className="journal-question">
                <p>What is still missing?</p>
                <span>{latestEntry.answer4}</span>
              </div>
            )}

            {latestEntry.notes && (
              <div className="journal-question">
                <p>Additional Notes</p>
                <span>{latestEntry.notes}</span>
              </div>
            )}

          </div>
        </div>
      ) : (
        <p className="empty-message">
          No journal entries yet for this task.
        </p>
      )}

      {/* ── Context Panel ─────────────────────── */}
      {context && (
        context.referenceNotes ||
        context.referenceLinks ||
        context.additionalResources
      ) && (
        <div className="context-panel">
          <h3>Context Call</h3>

          {context.referenceNotes && (
            <div className="journal-question">
              <p>Reference Notes</p>
              <span>{context.referenceNotes}</span>
            </div>
          )}

          {context.referenceLinks && (
            <div className="journal-question">
              <p>Reference Links</p>
              <span>{context.referenceLinks}</span>
            </div>
          )}

          {context.additionalResources && (
            <div className="journal-question">
              <p>Additional Resources</p>
              <span>{context.additionalResources}</span>
            </div>
          )}

        </div>
      )}

      {/* ── Full Journal History ──────────────── */}
      {allEntries.length > 1 && (
        <div style={{ marginTop: '24px' }}>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: '16px'
            }}
            onClick={() => setShowHistory(!showHistory)}
          >
            <p className="section-title" style={{ marginBottom: 0 }}>
              Full Journal History ({allEntries.length} entries)
            </p>
            <span style={{ color: '#8E7355', fontSize: '14px' }}>
              {showHistory ? '▲ Hide' : '▼ Show'}
            </span>
          </div>

          {showHistory && (
            <div>
              {[...allEntries]
                .reverse()
                .slice(1)
                .map((entry) => (
                  <div key={entry.id} className="journal-entry"
                    style={{ opacity: 0.75 }}
                  >
                    <h4>Logged on {formatTimestamp(entry.timestamp)}</h4>

                    <div className="journal-question">
                      <p>What did you last work on?</p>
                      <span>{entry.answer1 || '—'}</span>
                    </div>

                    <div className="journal-question">
                      <p>Where did you want to pick up?</p>
                      <span>{entry.answer2 || '—'}</span>
                    </div>

                    <div className="journal-question">
                      <p>Goal achieved?</p>
                      <span>{entry.answer3 || '—'}</span>
                    </div>

                    {entry.answer4 && (
                      <div className="journal-question">
                        <p>What was still missing?</p>
                        <span>{entry.answer4}</span>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="journal-question">
                        <p>Additional Notes</p>
                        <span>{entry.notes}</span>
                      </div>
                    )}

                  </div>
                ))}
            </div>
          )}

        </div>
      )}

      {/* ── Bottom Resume Button ──────────────── */}
      <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
        <button className="btn-primary" onClick={handleResume}>
          Resume Task →
        </button>
        <button className="btn-secondary" onClick={onDone}>
          Back to Tasks
        </button>
      </div>

    </div>
  )
}

export default ResumeTaskPage