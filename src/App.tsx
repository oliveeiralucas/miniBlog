import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from './components/NavBar'
import AboutPage from './pages/about/AboutPage'
import HomePage from './pages/home/HomePage'
import Login from './pages/login/Login'
import Register from './pages/register/Register'

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <div className="h-full overflow-y-hidden">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
