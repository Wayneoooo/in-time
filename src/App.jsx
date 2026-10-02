import { useState } from 'react'
import HomePage from './components/HomePage'
import TaskListPage from './components/TaskListPage'
import PauseTaskPage from './components/PauseTaskPage'
import ResumeTaskPage from './components/ResumeTaskPage'
import './App.css'

function App() {

  // Tracks which screen is currently visible
  const [currentPage, setCurrentPage] = useState('home')

  // Tracks which project the user has selected
  const [selectedProject, setSelectedProject] = useState(null)

  // Tracks which task the user has selected
  const [selectedTask, setSelectedTask] = useState(null)

  // Navigate to the task list for a specific project
  function goToTasks(project) {
    setSelectedProject(project)
    setCurrentPage('tasks')
  }

  // Navigate to the pause journal form for a specific task
  function goToPause(task) {
    setSelectedTask(task)
    setCurrentPage('pause')
  }

  // Navigate to the resume screen for a specific task
  function goToResume(task) {
    setSelectedTask(task)
    setCurrentPage('resume')
  }

  // Navigate back to the home screen
  function goHome() {
    setSelectedProject(null)
    setSelectedTask(null)
    setCurrentPage('home')
  }

  // Navigate back to the task list
  function goBackToTasks() {
    setSelectedTask(null)
    setCurrentPage('tasks')
  }

  // Renders the correct screen based on currentPage
  return (
    <div className="app">

      {currentPage === 'home' && (
        <HomePage
          onSelectProject={goToTasks}
        />
      )}

      {currentPage === 'tasks' && (
        <TaskListPage
          project={selectedProject}
          onPauseTask={goToPause}
          onResumeTask={goToResume}
          onGoHome={goHome}
        />
      )}

      {currentPage === 'pause' && (
        <PauseTaskPage
          project={selectedProject}
          task={selectedTask}
          onDone={goBackToTasks}
        />
      )}

      {currentPage === 'resume' && (
        <ResumeTaskPage
          project={selectedProject}
          task={selectedTask}
          onDone={goBackToTasks}
        />
      )}

    </div>
  )
}

export default App