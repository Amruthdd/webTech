import React, { useState, useEffect } from "react";
import './modal.css'
import { Link, Redirect } from "react-router-dom";




function Activity(props) {
    
    const [question, setQuestion] = useState("");
    const [category, setCategory] = useState("select category");
    const [message, setMessage] = useState("");
    
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");


    const uploadDetails = (e) => {
        
       
        const token = localStorage.getItem("token");
        if(category!=="select category" && question){
            fetch(`http://localhost:8001/question/user`, {
            method: "POST",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                question:question,
                category:category,
                email:email
            }),
        })
            .then((r) => {
                if (r.status == 200) {
                    alert("Question added successfully");
                } else if (r.status == 422) alert("Invalid File format");
                else if (r.status == 401) alert("Authentication error");
            })
            .catch((err) => console.log(err));
        }
        else if(category === "select category"){
            alert("Choose a category");
            e.preventDefault();
        }
        else{
            alert("Empty question not accepted");
            e.preventDefault();
        }
            
        

    };
    if (!token) {
        return <Redirect to='/login' />;
    }

    return (
        <div className=' mx-5 my-3'>
            <h5 className=' my-3'>Ask Your Question </h5>
            <form className='form-group'>
                <div class='form-group'>
                    <div className="qst-rules">
                        <ul>
                            <li>Make sure your question has not been asked already</li>
                            <li>Keep your question short and to the point</li>
                            <li>Make sure your question does not contain anything offensive or immoral</li>
                        </ul>
                    </div>
                    
                </div>
                <div class='form-group'>
                    <div className="dropdown">
                        <button className="drop-btn  dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {category}
                        </button>
                        <div class="dropdown-menu drop-it " aria-labelledby="dropdownMenu2">
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Entertainment")}}>Entertainment</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("News & Events")}}>News and Events</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Arts & Sports")}}>Arts and Sports</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Education & Reference")}}>Education and Reference</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Society & Lifestyle")}}>Society and Lifestyle</button>
                        </div>
                    </div>
                    <textarea
                        className='form-control iin my-3'
                        type='text'
                        placeholder='Write your Question'
                        name='question'
                        onChange={(e) => {
                            setQuestion(e.target.value);
                        }}
                        required
                    ></textarea>
                </div>
                
                <div className='my-2 d-flex justify-content-end align-items-center'>
                    <div>
                        <button
                            type='button'
                            class=' btn ml-auto py-3 px-4'
                            data-dismiss='modal'
                            aria-label='Close'
                            style={{color:"#fff"}}
                            onClick={()=>{
                                window.location.reload();
                            }}
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
                            Ask Question
                        </button>
                
                    </div>
                </div>
                <p
                    style={{
                        color: "red",
                        fontSize: 12,
                        textAlign: "center",
                    }}
                >
                    {message}
                </p>
            </form>
        </div>
    );
}

export default Activity;
