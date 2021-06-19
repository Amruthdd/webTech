import React,{useEffect,useState} from 'react';
import {
    useParams
} from "react-router-dom";
import Activities from './Activities';
import AnswerQst from './AnswerQst';
import Dash from './Dash';
import Explore from './Explore'
import Profile from './Profile';

function Main(){

    const [par, setPar] = useState("Home");
    let { id } = useParams();
    // console.log(id);


    useEffect(() => {
        setPar(id);
      },[id]);
    const display =()=>{
        if(par === "Home"){
            return(
                <Dash/>
            )
        }

        else if(par === "Activities"){
            return(
                <div>
                <Activities/>
                </div>
                
            )
                
        }

        else if (par === "Explore"){
            return(
                <Explore/>
            )
                
        }

        

        
        else if (par === "profile"){
            return(
                <Profile/>
            )
                
        }
        
    }
    return (
        <div>
           {display()}
        </div>
    );
}


export default Main;