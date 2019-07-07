import { hot } from 'react-hot-loader/root'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const store = createStore(function(state, action) {
    return {
        a: 1,
    }
})

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
