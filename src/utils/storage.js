// USED to identify the app's data in localStorage
const STORAGE_KEY = 'intime_data'

// Returns all data from localStorage, or a blank structure if nothing exists yet
export function getData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return {
    projects: []
  }
}

// Saves the entire data object back to localStorage
export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// Creates a new project and saves it
export function createProject(title, description, deadline) {
  const data = getData()
  const newProject = {
    id: Date.now(),
    title,
    description,
    deadline,
    tasks: []
  }
  data.projects.push(newProject)
  saveData(data)
  return newProject
}

// Creates a new task inside a project
export function createTask(projectId, title, description, deadline, objectives, dependencies, methods, priorityRanking) {
  const data = getData()
  const project = data.projects.find(p => p.id === projectId)
  const newTask = {
    id: Date.now(),
    title,
    description,
    deadline,
    objectives,
    dependencies,
    methods,
    priorityRanking,
    status: 'Active',
    context: {
      referenceNotes: '',
      referenceLinks: '',
      additionalResources: ''
    },
    journalEntries: []
  }
  project.tasks.push(newTask)
  saveData(data)
  return newTask
}

// Saves a journal entry to a task when it is paused
export function pauseTask(projectId, taskId, answers) {
  const data = getData()
  const project = data.projects.find(p => p.id === projectId)
  const task = project.tasks.find(t => t.id === taskId)
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    answer1: answers.answer1,
    answer2: answers.answer2,
    answer3: answers.answer3,
    answer4: answers.answer4,
    notes: answers.notes
  }
  task.journalEntries.push(entry)
  task.status = 'Paused'
  saveData(data)
}

// Sets a task status back to Active when resumed
export function resumeTask(projectId, taskId) {
  const data = getData()
  const project = data.projects.find(p => p.id === projectId)
  const task = project.tasks.find(t => t.id === taskId)
  task.status = 'Active'
  saveData(data)
}

// Returns the most recent journal entry for a task
export function getLatestJournalEntry(projectId, taskId) {
  const data = getData()
  const project = data.projects.find(p => p.id === projectId)
  const task = project.tasks.find(t => t.id === taskId)
  const entries = task.journalEntries
  if (entries.length === 0) return null
  return entries[entries.length - 1]
}

// Updates the context calling information for a task
export function updateContext(projectId, taskId, context) {
  const data = getData()
  const project = data.projects.find(p => p.id === projectId)
  const task = project.tasks.find(t => t.id === taskId)
  task.context = context
  saveData(data)
}

// Deletes a task from a project
export function deleteTask(projectId, taskId) {
  const data = getData()
  const project = data.projects.find(p => p.id === projectId)
  project.tasks = project.tasks.filter(t => t.id !== taskId)
  saveData(data)
}
// Deletes a project and all its tasks
export function deleteProject(projectId) {
  const data = getData()
  data.projects = data.projects.filter(p => p.id !== projectId)
  saveData(data)
}

// Updates the status of a project
export function updateProjectStatus(projectId, status) {
  const data = getData()
  const project = data.projects.find(p => p.id === projectId)
  project.status = status
  saveData(data)
}