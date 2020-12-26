import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './custom.css'
import 'popper.js/dist/popper.min.js'
import { Container } from 'react-bootstrap'

// components
import NewCollection from './components/NewCollection'

global.jQuery = require('jquery')

function App() {
  return (
    <>
      <style type="text/css">
        {`
        @font-face {
          font-family: 'Ubuntu';
          font-style: normal;
          font-weight: 300;
          font-display: swap;
          src: url(./fonts/Ubuntu/Ubuntu-Light.ttf) format('truetype');
        }
        @font-face {
          font-family: 'Ubuntu';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url(./fonts/Ubuntu/Ubuntu-Regular.ttf) format('truetype');
        }
        @font-face {
          font-family: 'Ubuntu';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: url(./fonts/Ubuntu/Ubuntu-Bold.ttf) format('truetype');
        }
      `}
      </style>
      <div id="app" className="py-3">
        <Container>
          <NewCollection />
        </Container>
      </div>
    </>
  )
}

export default App
