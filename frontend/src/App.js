import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'popper.js/dist/popper.min.js'
import { Container } from 'react-bootstrap'

// components
import NewCollection from './components/NewCollection'

global.jQuery = require('jquery')

function App() {
  return (
    <div id="app" className="py-3">
      <Container>
        <NewCollection />
      </Container>
    </div>
  )
}

export default App
