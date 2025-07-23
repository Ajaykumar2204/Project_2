import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Body from './Compents/Body'
import Login from './Compents/Login'
import  InfoRest from './Compents/InfoRest'
import RegisterRest from './Compents/RegisterRest'
import Itemadd from './Compents/Itemadd'
import MenuCard from './Compents/MenuCard'
import EditMenuItem from './Compents/EditMenuItem'
import UserMenuCard from './Compents/UserMenuCard'
import Card from './Compents/Card'
import Orders from './Compents/Orders'
import  ShowAllOrders from './Compents/ShowAllOrders'



function App() {
  


return (
    <Routes>
      <Route path='/' element={<Login />} /> 
      <Route path='/' element={<Body />}>
        <Route path='/restaurant/view' element={<InfoRest  ></InfoRest>}></Route>
         <Route path='/restaurant/register' element={<RegisterRest ></RegisterRest>}></Route>
         <Route path='/menu/ItemsAdd'  element={<Itemadd  ></Itemadd>}></Route>
          {/* restaurantinfologinUser = {restaurant} */}
        <Route path="menu/view/edit/:RestaurantId" element={<MenuCard />} />
        <Route path='/menu/item/Update/:RestaurantId/:itemId'  element={<EditMenuItem></EditMenuItem>} />  
       {/* loginUserData = {data}  */}
      <Route path='/menu/:RestaurantId/orders/view' element={<Orders></Orders>}></Route>
      <Route path='/orders/:RestaurantId' element={<ShowAllOrders></ShowAllOrders>}></Route>
      </Route>
      <Route path='menu/view/:RestaurantId' element={<UserMenuCard></UserMenuCard>}></Route>
         <Route path='/menu/view/:RestaurantId/cart' element={<Card />} />
    </Routes>
  )
}

export default App
