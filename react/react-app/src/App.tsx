// 以下はデフォルト
// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

//以下はAPIテスト用
// import React, { useEffect, useState } from "react";
// import { execTest } from "lib/api/test";

// 以下はデフォルト
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

//以下はAPIテスト用
// const App: React.FC = () => {
//   // return (
//   //   <h1>Hello World!</h1>
//   // )
//   const [message, setMessage] = useState<string>("")
//
//   const handleExecTest = async () => {
//     const res = await execTest()
//
//     if (res.status === 200) {
//       setMessage(res.data.message)
//     }
//   }
//
//   useEffect(() => {
//     handleExecTest()
//   }, [])
//
//   return (
//     <h1>{message}</h1>
//   )
// }

// 以下はテストアプリ用
// import React from "react"
//
// const App: React.FC = () => {
//   return (
//     <h1>Hello React!</h1>
//   )
// }
//
// export default App;

// 以下はポートフォリオ用
import React, { useState, useEffect } from "react"
import { TodoList } from "./components/TodoList"
import { TodoForm } from "./components/TodoForm"

import { getTodos } from "./lib/api/todos"
import { Todo} from "./interfaces/index"

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const handleGetTodos = async () => {
    try {
      const res = await getTodos()
      console.log(res)

      if (res?.status === 200) {
        setTodos(res.data.todos)
      } else {
        console.log(res.data.message)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleGetTodos()
  }, [])

  return (
    <>
      <h1>Todo App</h1>
      <TodoForm todos={todos} setTodos={setTodos} />
      <TodoList todos={todos} setTodos={setTodos} />
    </>
  )
}

export default App
