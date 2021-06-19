import React, { useState, useEffect } from 'react';
import {Link, useLocation} from "react-router-dom";
import Axios from "axios";
import "./ansqst.css"

function AnswerQst({match},{aboutProps}){

    const [details, setDetails] = useState([]);
    const [src,setSrc] = useState(null);
    const [answer,setAnswer] = useState("");
    let location = useLocation();



    useEffect(() => {
        Axios.get(`http://localhost:8001/answer/${match.params.id2}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.result);
            // setSrc('http://localhost:8001/'+ response.data.image);
            console.log(response.data);
            // console.log(response.data);
        });
    }, []);

    const uploadAnswer = (e) => {
        
       
        const u = localStorage.getItem("email");

        fetch(`http://localhost:8001/answer/user`, {
            method: "POST",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
                questionid:match.params.id2,
                email:u,
                answer:answer
            }),
        })
            .then((r) => {
                if (r.status == 200) {
                    alert("Answer added successfully");
                } else if (r.status == 422) alert("Invalid File format");
                else if (r.status == 401) alert("Authentication error");
            })
            .catch((err) => console.log(err));
        window.location.reload(false);

    };
    return (
        <div className="ansqst-main">
            <div>Q){location.state.question}</div>
            <div>Asked by: {location.state.user}</div>
            <textarea
                            className='form-control iin my-3'
                            type='text'
                            placeholder='Your answer'
                            name='answer'
                            onChange={(e) => {
                                setAnswer(e.target.value);
                            }}
                            required
                    ></textarea>
                     <button
                            className='btn start-btn col-6'
                            onClick={uploadAnswer}
                            type="submit"
                        >
                            Submit answer
                    </button>
            {details!==undefined?details.map((item) =>{
                return(
                    <div>
                        
                        
                    <div>
                        {item.answereduser}
                    </div>
                    <div>
                        {item.answer}
                    </div>
                    <div>
                        {item.votes}
                    </div>
                    
                    </div>
                )
            }):""}
        </div>
    );
}


export default AnswerQst;