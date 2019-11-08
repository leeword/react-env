import { hot } from 'react-hot-loader/root'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import abnormalError from './asserts/abnormal_error.png'

function Index() {
  return <h2 className="home-title">Home</h2>;
}

function About() {
  return (
    <h2>
      About
      <img alt="测试" src={abnormalError} />
    </h2>
  );
}

function Users() {
  return <h2>Users</h2>;
}

const store = createStore((state, action) => ({
  a: 1,
}))

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about/">About</Link>
              </li>
              <li>
                <Link to="/users/">Users</Link>
              </li>
            </ul>
          </nav>
          <Route path="/" exact component={Index} />
          <Route path="/about/" component={About} />
          <Route path="/users/" component={Users} />
        </div>
      </Router>
    </Provider>
  )
}

export default hot(App)
