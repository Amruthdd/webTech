import React,{ useEffect,useState} from 'react';
import './dash.css';
import {initData} from './data';
import { Link } from "react-router-dom";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";
import { Icon, InlineIcon } from '@iconify/react';
import arrowUp24Filled from '@iconify/icons-fluent/arrow-up-24-filled';
import arrowDown24Filled from '@iconify/icons-fluent/arrow-down-24-filled';


function Dash(props){

    const [details, setDetails] = useState([]);
    const [src,setSrc] = useState(null);

    useEffect(() => {
        Axios.get(`http://localhost:8001/question`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.questions);
            setSrc('http://localhost:8001/'+ response.data.image);
            // console.log(details);
            // console.log(response.data);
        });
    }, []);
    

    return (

        <div className="dash-main">
            <h5>Discover new topics</h5>
            
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details!==undefined?details.filter((item)=>{
                   return props.val===""?item.question:item.question.toLowerCase().includes((props.val).toLowerCase())?item:"";
                }).map((item) => {
                    if(item.answereduser !== null){
                        return(
                            <Link 
                                className="qst-link-card" 
                                to={{
                                    pathname:`/index/Home/${item.questionid}`,
                                    state: {
                                        question: item.question, 
                                        user:item.user
                                      }
                                }}
                                
                            >
                            <div className="qst-card" key={item.questionid}>
                                <div className="qst-card-in">
                                    <div className="qst">{item.question}</div>
                                    <div className="qst-name">
                                        <div>
                                            {!(item.answereduser.image)?<figure className='person-icon'></figure>:
                                                (!src?
                                                    <img 
                                                        className="person-img" 
                                                        src={`http://localhost:8001/${item.answereduser.image}`}
                                                    />:<figure className='person-icon'></figure>
                                                )
                                            }
                                            
                                        </div>
                                        <div>
                                            <div>{item.answereduser.fullname}</div>
                                            <div style={{fontSize:10,color:"gray"}}>from{" "} 
                                                <span style={{color:"#06F2B0"}}>
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="qst-ans">
                                        {item.answer}
                                        
                                    </div>
                                </div>

                                <div className="vote-bar">
                                    <div>
                                    <Icon icon={arrowUp24Filled} />

                                    <span className="vote-count">{item.answervotes}</span>
                                    
                                    
                                    
                                    </div>
                                    <div>
                                        asked by <span style={{color:"#06E6B1",fontSize:12}}>{item.user}</span>
                                    </div>   
                                </div>

                                
                            </div>
                            </Link>     
                        )
                    }
                  

                }):""}
                </Masonry>
            </ResponsiveMasonry>      
        </div>
    );
}


export default Dash;