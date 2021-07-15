import React, { useState, useEffect } from "react";
import Axios from "axios";
import EditModal from "./EditModal";
import EditProfModal from "./EditProfModal";
import { Link } from "react-router-dom";
import "./profile.css";
import './activities.css';
import "./index.css";
import { MdPerson,MdEdit } from "react-icons/md";
import { FaGraduationCap,FaRegCalendar } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";



function Profile(props) {
    const [details, setDetails] = useState([]);
    const [src,setSrc] = useState("");
    const u = localStorage.getItem("email");
    const [countQ, setCountQ] = useState(0);
    const [countA, setCountA] = useState(0);
    const [joined,setJoined] =useState("");
    const [gradu,setGradu] =useState("");
    const [loc,setLoc] =useState("");
    const [bio,setBio] =useState("");
    
   

    useEffect(() => {
        Axios.get(`http://localhost:8001/${u}/user`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data);
            setSrc(response.data.image);
            // setJoined(details.joined.split("T"))
            
            
            
        });
    }, []);
    useEffect(() => {
        Axios.get(`http://localhost:8001/question/${u}`, {

            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            if(response.data.result!==undefined)
             setCountQ(response.data.result.length);
    });
    }, []);
    useEffect(() => {
        Axios.get(`http://localhost:8001/activityanswer/${u}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            if(response.data.result!==undefined)
                setCountA(response.data.result.length);
            // console.log(response);
        });
    }, []);
    
    return (
        
        <div className='container user-select-none overflow-hidden profile-main prof-sub-main'>
           
            <div className="row" style={{width:"100vw"}}>
            <div className='my-5 col-xl-7' >
                <div className=' h5'>Profile</div>
                <div className='card-bg  profile-size card-pad' >
                    
                    <div className='d-flex align-items-center my-3 mr-3'>
                        
                            

                            <div  className="prof-avat-main">
                           
                                
                                <div className="d-flex justify-content-center align-items-center" >
                                    {!src?<figure className='profile-page-icon'></figure>:
                                        <img className="profile-img" src={`http://localhost:8001/${src}`}/>}
                                    
                                    
                                </div>
                    
                   <div className="d-flex justify-content-center btn-posi" >
                   
                        <button
                            type='button'
                            className='btn  red-clr edit-btn'
                            data-toggle='modal'
                            data-target='#exampleEditModalCenter'
                        >
                            <div className=' d-flex align-item-center icon-edit'>
                                <MdEdit size={14}/>
                            </div>
                        </button>
                    </div>
                </div>
                        
                    <div>

                        <div
                            className='modal fade'
                            id='exampleEditModalCenter'
                            tabindex='-1'
                            role='dialog'
                            aria-labelledby='exampleEditModalCenterTitle'
                            aria-hidden='true'
                        >
                            <div
                                className='modal-dialog modal-dialog-centered'
                                role='document'
                            >
                                <div className='modal-content modal-main'>
                                    <EditModal u={u} />
                                    
                                </div>
                            </div>
                        </div>
                        <div className='h4' style={{marginTop:-15}}>{details.fullname}</div>
                        <div className='h6' style={{color:"#ffffff8e",marginTop:-10}}>{details.department}</div>
                        <button 
                            className="edit-prof edit-marg"
                            type='button'
                            data-toggle='modal'
                            data-target='#ProfEditModal'
                        >
                                Edit Profile
                        </button>
                        <div
                            className='modal fade'
                            id='ProfEditModal'
                            tabindex='-1'
                            role='dialog'
                            aria-labelledby='ProfEditModal'
                            aria-hidden='true'
                        >
                            <div
                                className='modal-dialog modal-dialog-centered'
                                role='document'
                            >
                                <div className='modal-content modal-main'>
                                    <EditProfModal u={u} data={details} />
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="abt-margin">About Me</div>
                     <div className='profile-center bio'>
                        <div>{details.bio?details.bio:"You haven’t added a description about yourself"}</div>
                        
                    </div>
                    
                </div>
                <div className="prof-count">
                    <div className="count-box cb1">
                        <div className="count">{countQ}</div>
                        <div>Questions<br/>Asked</div>
                    </div>
                    <div className="count-box cb2">
                        <div className="count">{countA}</div>
                        <div>Questions<br/>Answered</div>
                    </div>
                </div>
            </div>
            <div className="prof-loc col-xl-4">
                <div className="d-flex my-2" style={{height:"20px"}}>
                    <div className="loc-icon">
                        <FaGraduationCap size={20}/>
                    </div>
                    
                    <button 
                        className="loc-text mx-2"
                        type='button'
                        data-toggle='modal'
                        data-target='#ProfEditModal'
                    >{details.gradYear?details.gradYear:"Add your graduation year"}</button>
                </div>
                <div className="d-flex my-2">
                    <div className="loc-icon">
                        <IoLocationOutline size={20}/>
                    </div>
                    
                    <button 
                        className="loc-text mx-2"
                        type='button'
                        data-toggle='modal'
                        data-target='#ProfEditModal'
                    >{details.location?details.location:"Add your location"}</button>
                </div>
                {/* <div className="d-flex my-2">
                    <FaRegCalendar size={20}/>
                    <div className="mx-3">joined on {joined[0]} </div>
                </div> */}
            </div>
            </div>
        </div>
            
        
    );
}

export default Profile;
