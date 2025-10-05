import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './Pages/Home'
import ConnectPage from './Pages/ConnectPage'
import BuyerPage from './Pages/BuyerPage'
import OrganizerPage from './Pages/OrganizerPage'
import BuyerEvents from './Pages/Buyer/BuyerEvents'
import BuyerHistory from './Pages/Buyer/BuyerHistory'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/connect' element={<ConnectPage/>}/>
          <Route path='/buyer' element={<BuyerPage/>}/>
          <Route path='/buyer/MyEvents' element={<BuyerEvents/>}/>
          <Route path='/buyer/history' element={<BuyerHistory/>}/>
          <Route path='/organizer' element={<OrganizerPage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
