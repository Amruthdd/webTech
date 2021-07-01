import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import Axios from "axios";
import './login.css'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [access, setAccess] = useState(false);
    const [message, setMessage] = useState("");

    // Axios.defaults.withCredentials = true;

    const login = (e) => {
        e.preventDefault();

        Axios.post("http://localhost:8001/login", {
            email: email,
            password: password,
        }).then((response) => {
            if (response.data.auth) {
                localStorage.setItem("token", response.data.token);

                localStorage.setItem("email",email);
                setAccess(true);
            } else {
                setAccess(false);
                setMessage(response.data.message);
            }
        });
    };

    if (access) {
        return (
            <Redirect
                to={{
                    pathname: "/index/Home",
                    state: { email: email }, // your data array of objects
                }}
            />
        );
    }

    return (
        <div className='log-page user-select-none overflow-hidden min-vh-100 log-bg'>
            <div className='mx-auto m-5 log-page-title'>
                {/* <TitleSVG /> */}
            </div>
            <figure className='dot-top'></figure>
            <figure className='dot-right'></figure>
            <figure className='dot-left'></figure>
            <figure className='dot-bottom'></figure>
            <figure className='ppl-bottom'></figure>
            <div className='row px-md-5'>
                <div className='col-12 col-md-6 order-sm-2 my-5 px-xl-5'>
                    <div className='d-flex justify-content-center mx-auto w-75'>
                        <div className='dark-blue-text-active'>Sign in</div>
                        <div className='dark-blue-text'>
                            <Link to='/signup' draggable='false'>
                                Sign Up
                            </Link>
                        </div>
                    </div>
                    <div className='mx-auto py-4 log-box-main'>
                        <div className="py-2">
                            <div className="wlcm">Welcome Back</div>
                            <div className='wlcm-p'>
                                Don't have an account?&nbsp;
                                <Link to='/signup' draggable='false' style={{color:"#06F2B0"}}>
                                Sign up
                                </Link>
                            </div>
                        </div>
                        <form
                            className='mx-auto form-group col-10'
                            onSubmit={login}
                        >
                            <div className='py-4'>
                                <input
                                    className='form-control px-3 mb-4'
                                    type='email'
                                    placeholder='CET Email ID'
                                    name='email'
                                    required
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                ></input>
                                <input
                                    className='form-control px-3 mt-4'
                                    type='password'
                                    placeholder='Password'
                                    name='password'
                                    required
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                ></input>
                            </div>
                            <div className='my-2'>
                                <button
                                    className='btn mx-auto start-btn d-block col-6'
                                    type='submit'
                                >
                                    Login
                                </button>
                                <p
                                    style={{
                                        color: "red",
                                        textAlign: "center",
                                        fontSize: 12,
                                    }}
                                >
                                    {message}
                                </p>
                            </div>
                        </form>
                    </div>
                    
                </div>
                <div className='col-12 col-md-6 order-sm-1 my-3 py-5'>
                    {/* <figure className='login-data-rafiki'></figure> */}
                    <div className="log-title">
                        <figure className='ask-cet'></figure>
                        
                        {/* <h3>ask CET</h3> */}
                        <p>
                            Ask anything and everything to find the best answers to your<br/>
                            never ending doubts regarding our prestigious college. ;)
                        </p>
                    </div>
                </div>
            </div>
           
        </div>
    );
}

export default Login;
