import React,{useEffect,useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";
import Activities from './Activities';
import Explore from './Explore'
import './index.css'
import Nav from './Nav';
import Main from './Main';
import TopBar from './TopBar';
import Logout from "../auth-pages/Logout";
import Profile from "../dash-pages/Profile";
import AnswerQst from './AnswerQst';

function Index(){
    const [question, setQuestion] = useState("");
    function handlequestion(val){
        setQuestion(val);
    }
    

    return (
        
            <div className="index-main">
            
                
                    <TopBar question={handlequestion}/>
                    <Nav/>
                    <div className="ind-comp">
                    <Switch>
                        <Route exact path="/index/:id" children={<Main val={question===""?"":question}/>} />
                        <Route path="/index/:id/:id2" component={AnswerQst}/>
                    </Switch>
                    </div>

                
            </div>
        
        
    );
}



export default Index;