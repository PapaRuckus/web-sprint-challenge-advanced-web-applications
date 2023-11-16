// 👉 DO NOT CHANGE THIS FILE 👈
// 👉 DO NOT CHANGE THIS FILE 👈
// 👉 DO NOT CHANGE THIS FILE 👈
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router} from 'react-router-dom'
import App from './components/App'
import './styles/reset.css'
import './styles/styles.css'

render(
  <Router>
    <App />
  </Router>
  , document.getElementById('root'))
