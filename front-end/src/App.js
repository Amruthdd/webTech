import React, { Component } from "react";
import { BrowserRouter, Router, Route, Switch } from "react-router-dom";
import "./App.css";
import './cust.css'
import './components/custom.css'
import Login from "./components/auth-pages/Login";
import SignUp from "./components/auth-pages/SignUp";
import Logout from "./components/auth-pages/Logout";
import Profile from "./components/dash-pages/Profile";

import Index from "./components/dash-pages/Index";





class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>

                    <Route exact path='/' component={Login} />
                    <Route path='/signup' component={SignUp} />
                    <Route path="/index" component={Index}/>
                    <Route path='/logout' component={Logout} />

                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
