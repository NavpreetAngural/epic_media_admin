import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import ViewBookings from './pages/ViewBookings'
import Users from './pages/Users'
import ViewPortfolio from './pages/ViewPortfolio'
import AddPortfolio from './pages/AddPortfolio'
import ViewCategory from './pages/ViewCategory'
import AddCategory from './pages/AddCategory'
import ViewIdeas from './pages/ViewIdeas'
import ViewQueries from './pages/ViewQueries'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
          <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="" element={<Users />} />
          <Route path="bookings" element={<ViewBookings  />} />
          <Route path="portfolio/view" element={<ViewPortfolio />} />
          <Route path="portfolio/add" element={<AddPortfolio />} />
          <Route path="category/view" element={<ViewCategory />} />
          <Route path="category/add" element={<AddCategory />} />
          <Route path="ideas" element={<ViewIdeas />} />
          <Route path="queries" element={<ViewQueries />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
