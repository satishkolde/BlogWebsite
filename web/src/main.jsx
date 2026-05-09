import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './Layout.jsx'
import BlogList from './components/BlogList.jsx'
import AuthLayout from './AuthLayout.jsx'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Blog from './components/Blog.jsx'
import BlogCreate from './components/BlogCreate.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BlogList pageTitle="Blog" endpoint="/api/v1/blog/pagination?page=" />} />
        <Route path="myposts" element={<BlogList pageTitle="My" endpoint="/api/v1/blog/me?page=" />} />
        <Route path="/:username" element={<BlogList pageTitle="" endpoint="" />} />
        <Route path="blog/" element={<BlogCreate />} />
        <Route path="blog/:id" element={<Blog />} />
        <Route path="blog/:id/update" element={<BlogCreate />} />
        <Route path="create" element={<BlogCreate />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
