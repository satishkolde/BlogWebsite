import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './Layout.jsx'
import BlogList from './components/BlogList.jsx'
import AuthLayout from './AuthLayout.jsx'
import Register from './components/Register.jsx'
import Login from './Login.jsx'
import Blog from './components/Blog.jsx'
import BlogCreate from './components/BlogCreate.jsx'
import axios from 'axios'

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BlogList pageTitle="Blog Posts" endpoint="/api/v1/blog/pagination?page=" />} />
        <Route path="myposts" element={<BlogList pageTitle="My Posts" endpoint="/api/v1/blog/me?page=" />} />
        <Route path="article/:id" element={<Blog />} />
        <Route path="create" element={<BlogCreate isUpdate={false} endpoint="/api/v1/blog/"  />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
