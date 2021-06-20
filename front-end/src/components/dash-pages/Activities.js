
import React,{useState, useEffect} from 'react';
import Axios from "axios";
import {
    Link, Switch, Route
} from "react-router-dom";
import './activities.css';
import Main from './Main';
import Questions from './Questions';
import Answers from './Answers';


function Activities(props){

    const u = localStorage.getItem("email");
    const [questionsClicked, setQuestionsClicked] = useState(true);
    const [countQ, setCountQ] = useState(0);
    const [countA, setCountA] = useState(0);
    const [colorA, setColorA] = useState();
    const [colorQ, setColorQ] = useState();
    const [name, setName] = useState();
    const [src, setSrc] = useState("");

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

    useEffect(() => {
        Axios.get(`http://localhost:8001/${u}/user`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setName(response.data.fullname);
            setSrc(response.data.image)
            // console.log(response.data);
        });
    }, []);

    function handleQuestionClick(){
        setQuestionsClicked(true);
        setColorQ("#404251");
        setColorA("");
    }

    function handleAnswerClick(){
        setQuestionsClicked(false);
        setColorA("#404251");
        setColorQ("");
    }
    return (

        <div className="dash-main">
            <Link className="activities-link" onClick={handleQuestionClick} style={{backgroundColor:colorQ}}>My Questions ({countQ})</Link>
            <Link className="activities-link" onClick={handleAnswerClick} style={{backgroundColor:colorA}}>My Answers ({countA})</Link>
            <div className="activities-main">
            {questionsClicked===true?<Questions val={props.val} name={name} src={src} count={countQ}/>:<Answers name={name} src={src} count={countA}/>} 

            </div>
        </div>
      

    );
}


export default Activities;