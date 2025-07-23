import { configureStore } from "@reduxjs/toolkit";
import  useReducer  from "../Reducers/userslice";
import restaurantReducer from '../Reducers/Restaurantslice'
import  MenuReducer from '../Reducers/Menuslice'
import UserMenuReducer from '../Reducers/UserMenuslice'
import CardReducer from '../Reducers/Cardslice'


 export const store = configureStore({
    reducer : {
     user : useReducer ,
    restaurant : restaurantReducer,
     Menu : MenuReducer,
     UserMenu : UserMenuReducer,
     Card : CardReducer
    }
});

