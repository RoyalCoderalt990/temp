import React from 'react'
import { Route ,Routes} from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login'
import Register from '../components/Register'
import SeatBook from '../components/SeatBook'
import PrivateRoutes from './PrivateRoutes'
import Cart from '../components/Cart'
import AllBookeTicket from '../components/AllBookeTicket'
import PayNow from '../components/PayNow'

import AdminDashboard from '../components/AdminDashBoard'

const AllRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} > </Route>
      <Route path='/login' element={<Login/>} > </Route>
      <Route path='/register' element={<Register/>} > </Route>
      {/* <Route path='/seatbook' element={<PrivateRoutes>
        <SeatBook/>
      </PrivateRoutes>}  > </Route> */}
       <Route path="/seatbook/:busId" element={<SeatBook />} />
       <Route path='/cart' element={<Cart/>} > </Route>
       <Route path='/bookedticket' element={<AllBookeTicket/>} > </Route>
       <Route path='/pay' element={<PayNow/>} > </Route>
       <Route path="/admin/dashboard" element={<PrivateRoutes><AdminDashboard /></PrivateRoutes>} />

    </Routes>
  )
}

export default AllRoutes
