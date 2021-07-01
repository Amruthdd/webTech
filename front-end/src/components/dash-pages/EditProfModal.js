import React, { useState, useEffect } from "react";
import './modal.css'
import { Link, Redirect } from "react-router-dom";




function EditProfModal(props) {
    console.log(props.data);
    


    const [bio, setBio] = useState(props.data.bio);
    const [loc, setLoc] = useState(props.data.loc);
    const [gradu, setGradu] = useState(props.data.gradYear);
    const [fullname, setFullname] = useState(props.data.fullname);
    const [department,setDepartment] = useState("select department");
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");


    const uploadDetails = (e) => {
        
       
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8001/user/update`, {
            method: "POST",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                email:email,
                fullname:fullname,
                bio:bio,
                location:loc,
                department:department,
                graduationYear:gradu
            }),
        })
            .then((r) => {
                if (r.status == 200) {
                    alert("Profile Updated successfully");
                } else if (r.status == 422) alert("Invalid!");
                else if (r.status == 401) alert("Authentication error!");
            })
            .catch((err) => console.log(err));
            window.location.reload(false);

    };
    if (!token) {
        return <Redirect to='/login' />;
    }

    return (
        <div className=' mx-5 my-3'>
            <h5 className=' my-3'>Edit Profile </h5>
            <form className='form-group'>
                <div className="d-flex">
                    <div>
                        <div>Name</div>
                        <input
                            className='form-control px-3 mb-4'
                            type='text'
                            placeholder={props.data.fullname}
                            name='fullname'
                            required
                            onChange={(e) => {
                                setFullname(e.target.value);
                            }}
                        ></input>
                    </div>
                    <div>
                        <div style={{marginLeft:5}}>Department</div>
                        <div className="dropdown">
                        <button className="prof-mod-btn dropdown-toggle" type="button" id="dropdownMenuButton2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {department}
                        </button>
                        <div class="dropdown-menu drop-it" aria-labelledby="dropdownMenu3">
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setDepartment("Computer Science")}}>Computer Science</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setDepartment("Mechanical")}}>Mechanical</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setDepartment("Electronics")}}>Electronics</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setDepartment("Electrical")}}>Electrical</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setDepartment("Civil")}}>Civil</button>
                        </div>
                    </div>
                    </div>
                </div>
                <div class='form-group'>
                    
                    <div>Bio</div>
                    <textarea
                        className='form-control iin '
                        type='text'
                        placeholder='What about yourself'
                        name='question'
                        onChange={(e) => {
                            setBio(e.target.value);
                        }}
                        required
                    ></textarea>
                </div>
                <div className="d-flex">
                    <div>
                        <div>Graduation year</div>
                        <input
                            className='form-control px-3 mb-4'
                            type='text'
                            placeholder="Eg:YYYY"
                            name='graduation'
                            required
                            onChange={(e) => {
                                setGradu(e.target.value);
                            }}
                        ></input>
                    </div>
                    <div>
                        <div className="mx-2">Location</div>
                        <input
                            className='form-control px-3 mb-4 mx-2'
                            type='text'
                            placeholder="Location"
                            name='location'
                            required
                            onChange={(e) => {
                                setLoc(e.target.value);
                            }}
                        ></input>
                    </div>
                </div>
                
                <div className='my-2 d-flex justify-content-end align-items-center'>
                    <div>
                        <button
                            type='button'
                            class=' btn ml-auto py-3 px-4'
                            data-dismiss='modal'
                            aria-label='Close'
                            style={{color:"#fff"}}
                        >
                            Cancel
                        </button>
                    </div>
                    <div>
                        <button
                            className='btn start-btn col-6'
                            onClick={uploadDetails}
                            type="submit"
                        >
                            Save
                        </button>
                
                    </div>
                </div>
                
            </form>
        </div>
    );
}

export default EditProfModal;
