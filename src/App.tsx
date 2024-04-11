import { onAuthStateChanged, User } from 'firebase/auth'
import React from 'react'
//hooks
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Footer from './components/Footer'
import Navbar from './components/NavBar'
import { AuthProvider } from './context/AuthContext'
import { useAuthentication } from './hooks/useAuthentication'
import AboutPage from './pages/about/AboutPage'
import Dashboard from './pages/dashboard/Dashboard'
import HomePage from './pages/home/HomePage'
import Login from './pages/login/Login'
import EditPost from './pages/post/createPost copy/EditPost'
import CreatePost from './pages/post/createPost/CreatePost'
import Post from './pages/post/Post'
import Register from './pages/register/Register'
import Search from './pages/search/Search'

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const { auth } = useAuthentication()

  const loadingUser = user === undefined

  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUser(user))
  }, [auth])

  if (loadingUser) {
    return <p>Carregando...</p>
  }

  return (
    <>
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <div className="h-full overflow-x-hidden">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route
                path="/login"
                element={user ? <Navigate to={'/'} /> : <Login />}
              />
              {/* Rotas protegidas */}
              <Route
                path="/register"
                element={user ? <Navigate to={'/'} /> : <Register />}
              />
              <Route
                path="/post/create"
                element={!user ? <Login /> : <CreatePost />}
              />
              <Route
                path="/posts/edit/:id"
                element={user ? <Navigate to={'/login'} /> : <EditPost />}
              />
              <Route
                path="/dashboard"
                element={!user ? <Login /> : <Dashboard />}
              />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
