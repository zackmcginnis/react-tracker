import { BrowserRouter as Router, Route} from 'react-router-dom'
import Header from "./components/Header";
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

import { useState, useEffect } from 'react'

function App({ baseApiUrl }) {
  const [showAddTasks, setShowAddTasks] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect( () => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${baseApiUrl}/tasks`)
      const data = await res.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const fetchTask = async (id) => {
    try {
      const res = await fetch(`${baseApiUrl}/tasks/${id}`)
      const data = await res.json()
      return data
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTask = async (id) => {
    try {
      fetch(`${baseApiUrl}/tasks/${id}`, {method: 'DELETE'})
    } catch (error) {
      console.error(error)
    }
    setTasks(await fetchTasks())
  }

  const toggleReminder = async (id) => {
    try {
      const taskToUpdate = await fetchTask(id)
      const updatedTask = { ...taskToUpdate, reminder: !taskToUpdate.reminder}

      await fetch(`${baseApiUrl}/tasks/${id}`, 
      {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      })
    } catch (error) {
      console.error(error);
    }
    setTasks(await fetchTasks())
  }

  const toggleShowAddTasks = () => {
    setShowAddTasks(!showAddTasks)
  }

  const saveTask = async (task) => {
    try {
      await fetch(`${baseApiUrl}/tasks/`, 
      {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })
    } catch (error) {
      console.error(error);
    }
    setTasks(await fetchTasks())
  }

  return (
    <Router>
      <div className="container">
        <Header showAdd={showAddTasks} onToggleShowAddTasks={toggleShowAddTasks}/>
        <Route path='/about' component={About}/>
        <Route path='/' exact render={(props) => (
          <>
            {showAddTasks ? <AddTask onAddTask={saveTask}/> : ''}
            {tasks.length > 0 ? <Tasks tasks={tasks} onToggle={toggleReminder} onDelete={deleteTask}/> : "No tasks to display"}
          </>
        )}/>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
