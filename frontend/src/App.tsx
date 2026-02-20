import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { accessTokenStore, authApi, tokenStorage } from './api/apiClient'
import Footer from './components/Footer'
import Navbar from './components/NavBar'
import { AuthProvider, LocalUser } from './context/AuthContext'
import AboutPage from './pages/about/AboutPage'
import ProjectFormPage from './pages/admin/projects/ProjectFormPage'
import ContactPage from './pages/contact/ContactPage'
import Dashboard from './pages/dashboard/Dashboard'
import ErrorPage from './pages/error/ErrorPage'
import HomePage from './pages/home/HomePage'
import Login from './pages/login/Login'
import PortfolioPage from './pages/portfolio/PortfolioPage'
import ProjectDetailPage from './pages/portfolio/ProjectDetailPage'
import EditPost from './pages/post/createPost copy/EditPost'
import CreatePost from './pages/post/createPost/CreatePost'
import Post from './pages/post/Post'
import Register from './pages/register/Register'
import Search from './pages/search/Search'
import TermsPage from './pages/terms/TermsPage'

const App: React.FC = () => {
  // undefined = checking auth; null = not logged in; LocalUser = logged in
  const [user, setUser] = useState<LocalUser | null | undefined>(undefined)

  const loadingUser = user === undefined

  useEffect(() => {
    const refresh = tokenStorage.getRefresh()
    if (!refresh) {
      setUser(null)
      return
    }

    authApi
      .refresh(refresh)
      .then((data) => {
        accessTokenStore.set(data.accessToken)
        tokenStorage.setRefresh(data.refreshToken)
        const apiUser = data.user
        setUser({
          id: apiUser.id,
          uid: apiUser.id,
          email: apiUser.email,
          displayName: apiUser.displayName,
          isAdmin: apiUser.isAdmin ?? false,
        })
      })
      .catch(() => {
        tokenStorage.clearRefresh()
        accessTokenStore.set(null)
        setUser(null)
      })
  }, [])

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ed-bg">
        <div className="flex flex-col items-center gap-4">
          <span className="font-display text-2xl italic text-ed-tp">
            devlog<span className="text-ed-accent">.</span>
          </span>
          <div className="h-px w-16 bg-ed-border">
            <div className="h-full bg-ed-accent animate-[loadBar_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider value={{ user, setUser }}>
      <BrowserRouter>
        <div className="min-h-screen bg-ed-bg flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/search" element={<Search />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route
                path="/login"
                element={user ? <Navigate to={'/'} /> : <Login />}
              />
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
                element={!user ? <Navigate to={'/login'} /> : <EditPost />}
              />
              <Route
                path="/dashboard"
                element={!user ? <Login /> : <Dashboard />}
              />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
              <Route
                path="/admin/projects/new"
                element={!user?.isAdmin ? <Navigate to="/" /> : <ProjectFormPage />}
              />
              <Route
                path="/admin/projects/edit/:slug"
                element={!user?.isAdmin ? <Navigate to="/" /> : <ProjectFormPage />}
              />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
