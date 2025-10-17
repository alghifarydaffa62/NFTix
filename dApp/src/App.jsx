import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './Pages/Home'
import ConnectPage from './Pages/ConnectPage'
import BuyerPage from './Pages/BuyerPage'
import OrganizerPage from './Pages/OrganizerPage'
import BuyerEvents from './Pages/Buyer/BuyerEvents'
import BuyerHistory from './Pages/Buyer/BuyerHistory'
import CreateEventPage from './Pages/Organizer.jsx/CreateEventPage'
import OrganizerEvents from './Pages/Organizer.jsx/OrganizerEvents'
import EventDetailPage from './Pages/Buyer/EventDetailPage'
import EventScannerPage from './Pages/Organizer.jsx/EventScannerPage'
import OrganizerEventDetailPage from './Pages/Organizer.jsx/OrganizerEventDetailPage'

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
          <Route path='/organizer/create' element={<CreateEventPage/>}/>
          <Route path='/organizer/MyEvents' element={<OrganizerEvents/>}/>
          <Route path='/organizer/scanner/:eventId' element={<EventScannerPage/>} />
          <Route path='/organizer/event/:eventId' element={<OrganizerEventDetailPage/>}/>
          <Route path='/event/:eventId' element={<EventDetailPage/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
