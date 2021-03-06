import React from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

import TodoItem from "./todo-item"
import "./styles.css"

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            todo: "",
            todos: []
        }
    }

    componentDidMount() {
        fetch('http://localhost:5000/todos')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    todos: data
                })
            })
    }

    handleChange = e => {
        this.setState({
            todo: e.target.value
        })
    }

    renderTodos = () => {
        return this.state.todos.map(item => {
            return (
                <TodoItem key={item.id} item={item} deleteItem={this.deleteItem}/>
            )
        })
    }

    addTodo = e => {
        e.preventDefault()
        axios({
            method: "POST",
            url: "http://localhost:5000/todo",
            headers: { "content-type": "application/json"},
            data: {
                title: this.state.todo, 
                done: false
            }
        })
        .then(data => {
            this.setState({
                todos: [...this.state.todos, data.data],
                todo: ""
            })
        })
        .catch(error => console.log("Add todo Error: ", error))
    }

    deleteItem = id => {
        fetch(`http://localhost:5000/todo/${id}`, {
            method: "DELETE"
        })
        .then(
            this.setState({
                todos: this.state.todos.filter(item => {
                    return item.id !== id
                })
            })
        )
        .catch(error => console.log('deletedItem Error', error))
    }

    render() {
        
        return (
            <div className="app">
                <h1>ToDo List</h1>
                <form className="add-todo" onSubmit={this.addTodo}>
                    <input 
                        type="text" 
                        placeholder="Add Todo" 
                        onChange={this.handleChange}
                        value={this.state.todo} 
                    />
                    <button type="submit">Add</button>
                </form>
                {this.renderTodos()}
            </div>
        )
    }
}

const rootElement = document.getElementById('root')
ReactDom.render(<App />, rootElement)