import React, { useState, useEffect } from "react";
import './editquestionmodal.css'
import { Link, Redirect } from "react-router-dom";




export default function EditQuestionModal(props) {
    
    const [answer, setAnswer] = useState(props.answer);
    // const [tempQuestion, setTempQuestion] = useState(props.question);
    // const [category, setCategory] = useState(props.category);
    const email = localStorage.getItem("email");

    const editAnswer = (e) => {

        
        
        fetch('http://localhost:8001/answer/user', {
            method: "PUT",
            headers: {
                'content-type':'application/json',
                "x-access-token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                answer:answer,
                answeridid:props.id,
            }),
        })
            .then((r) => {
                if (r.status == 200) {
                    alert("Question edited successfully");
                } else if (r.status == 422) alert("Invalid File format");
                else if (r.status == 401) alert("Authentication error");
            })
            .catch((err) => console.log(err));

    };
    if (!localStorage.getItem("token")) {
        return <Redirect to='/login' />;
    }

    function reload(){
        window.location.reload();

    }

    return (
        <div className=' mx-5 my-3'>
            <h5 className=' my-3'>Edit Your Answer </h5>
            <form className='form-group'>
                <div class='form-group'>
                    
                    <textarea
                        className='form-control my-3'
                        type='text'
                        placeholder="Answer the question"
                        name='question'
                        id="qst-edit"
                        defaultValue={props.answer}
                        onChange={(e) => {
                            setAnswer(e.target.value);
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
                            onClick={reload}
                        >
                            Cancel
                        </button>
                    </div>
                    <div>
                        <button
                            className='btn start-btn col-6'
                            onClick={editAnswer}
                            type="submit"
                        >
                            Edit 
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
                </p>
            </form>
        </div>
    );
}