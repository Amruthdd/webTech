import React, { useState, useEffect } from "react";
import Axios from "axios";
import ActivityModal from "./ActivityModal";
import { BrowserRouter as Router,Link,useHistory } from "react-router-dom";
import { Icon, InlineIcon } from '@iconify/react';
import search24Filled from '@iconify/icons-fluent/search-24-filled';


import './topbar.css'
import "./index.css";
function TopBar(){

    const [src,setSrc] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const u = localStorage.getItem("email");

    useEffect(() => {
        Axios.get(`http://localhost:8001/${u}/user`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {

            setSrc('http://localhost:8001/'+ response.data.image);
        });
    }, []);
    
    return (
        <div className="top-bar-main">
            <div className="search-main ">
                <input className='search-input form-control px-3 mb-4'
                        type='text'
                        placeholder='Search for a question'
                        name='search'
                        onChange={e=>setSearchTerm(e.target.value)}>
                </input>
                <button>
                    <Icon icon={search24Filled} />  
                </button>
                
            </div>
            <div className="prof-right">
                <button
                    className='btn start-btn'
                    type='button'
                    data-toggle='modal'
                    data-target='#exampleModalCenter'
                    style={{marginRight:40}}>
                    Ask a question
                </button>
                <div
                    className='modal fade'
                    data-backdrop="false"
                    id='exampleModalCenter'
                    tabindex='-1'
                    role='dialog'
                    aria-labelledby='exampleModalCenterTitle'
                    aria-hidden='true'
                >
                    <div
                        className='modal-dialog modal-dialog-centered'
                        role='document'
                    >
                        <div className='modal-content modal-main'>
                            <ActivityModal />
                        </div>
                    </div>
                </div>

                <div className="dropdown">
                    <a class="prof-a dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        
                    {!src?<figure className='top-profile'></figure>:<img className="top-profile" src={src}/>}
                    </a>
                    <div class="drop dropdown-menu" aria-labelledby="dropdownMenuLink">
                        
                        <Link to="/index/profile" class="dr-link dropdown-item" href="#">Profile</Link>
                        <Link to="/logout" class="dr-link dropdown-item" href="#">Log Out</Link>
                       
                    </div>
                </div>
               
            </div>
            
            
            {/* <Link to='/logout' className='btn start-btn px-3'>
                        Logout
            </Link> */}
        </div>
    );
}



export default TopBar;