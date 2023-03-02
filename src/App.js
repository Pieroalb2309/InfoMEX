import './App.css';
import React, {useEffect} from "react";
import {useState} from "react";
import {Route, Routes, useNavigate} from 'react-router-dom';
import {APP_CONFIG} from "./constants/ApiConstants";
//import Views from "./views";
import Login from "./views/auth-views/authentication/login";
const Views = React.lazy(()=>import("./views"));
//import {AppLayout} from "./layouts/app-layout";

function setUser(userToken) {
    sessionStorage.setItem('user', JSON.stringify(userToken));
}

function getUser() {
    const userJson = sessionStorage.getItem('user');
    //JSON.parse(sessionStorage.getItem('user'))
    return JSON.parse(userJson);
}
function App() {
    let navigate=useNavigate();
    useEffect(()=>{
        let userData=getUser()
        console.log('session?',userData);
        if(! userData?.Name) {
            //return <Login setToken={setToken}/>
            navigate("/");
        }
    },[getUser])

  return (
    <div className="App">
        <Routes>
            <Route path={"/"} element={<Login setUser={setUser}/>}/>
            <Route path={"machine/*"} element={<React.Suspense fallback={<>...</>}><Views api_url={APP_CONFIG.API_BASE_URL}/></React.Suspense>}/>
        </Routes>
    </div>
  );
}

export default App;
