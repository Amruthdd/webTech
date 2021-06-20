import React,{ useEffect,useState} from 'react';
import './dash.css';
import {initData} from './data';
import { Link } from "react-router-dom";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";


function Explore(props){

    const [details, setDetails] = useState([]);
    const [count,setCount] = useState(0);

    useEffect(() => {
        Axios.get(`http://localhost:8001/question`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.questions);
            // setCount(response.data.questions.length);
            // console.log(details);
            // console.log(response.data.questions.length);
        });
    }, []);
    

    return (

        <div className="dash-main">
            <h5>All topics({details!==undefined?details.length:""})</h5>
            
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details!==undefined?details.filter((item)=>{
                   return props.val===""?item.question:item.question.toLowerCase().includes((props.val).toLowerCase())?item:"";
                }).map((item) => {
                    
                    
                        return(
                            <Link 
                                className="qst-link-card" 
                                to={{
                                    pathname:`/index/Explore/${item.questionid}`,
                                    state: {
                                        question: item.question, 
                                        user:item.user
                                      }
                                }}
                                
                            >

                            <div className="qst-card" key={item.questionid}>
                                <div className="qst-card-in-exp">
                                    <div className="qst">{item.question}</div>
                                    <div className="qst-name">
                                        <div>
                                            <figure className='person-icon'></figure>
                                        </div>
                                        <div>
                                            <div>{item.user}</div>
                                            <div style={{fontSize:10,color:"gray"}}>asked in{" "} 
                                                <span style={{color:"#06F2B0"}}>
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="view-ans">
                                        view answers   
                                    </div>
                                </div>
                                {/* <div className="vote-bar">
                                    
                                </div> */}
                            </div>
                            </Link>
                            )
                    
                    

                }):""}
                </Masonry>
            </ResponsiveMasonry>      
        </div>
    );
}


export default Explore;