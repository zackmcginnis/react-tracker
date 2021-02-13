import Task from './Task'

const Tasks = ({tasks, onDelete, onToggle}) => {
    return (
        <>
            {tasks.map( (task) => <Task key={task.id} onToggle={onToggle} onDelete={onDelete} task={task} />)}
        </>
    )
}

export default Tasks
