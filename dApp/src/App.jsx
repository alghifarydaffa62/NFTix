import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './Pages/Home'
import ConnectPage from './Pages/ConnectPage'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/connect' element={<ConnectPage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
