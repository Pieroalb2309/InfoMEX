import React from 'react';
import ReactDOM from 'react-dom';
//import { createRoot } from "react-dom/client";
import './assets/fonts/Oswald/Oswald-Light.ttf'
import  './assets/fonts/Oswald/Oswald-Medium.ttf'
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
/*
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App/>);
 */
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
