import React from 'react'
import { render } from 'react-dom'

import App from './App'
import './index.scss'
import './sw-register'

const renderApp = (Component) => {
  render(
    <Component />,
    document.getElementById('root'),
  )
}

renderApp(App)

if (module.hot) {
  module.hot.accept('./App', () => renderApp(App))
}
