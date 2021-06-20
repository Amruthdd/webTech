import React,{useEffect, useState} from 'react';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";
import './activities.css';
import { Icon, InlineIcon } from '@iconify/react';
import arrowUp24Filled from '@iconify/icons-fluent/arrow-up-24-filled';
import arrowDown24Filled from '@iconify/icons-fluent/arrow-down-24-filled';


export default function Answers(props){
    const [details, setDetails] = useState();
    const email = localStorage.getItem("email");
    useEffect(() => {
        Axios.get(`http://localhost:8001/activityanswer/${email}`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.result);
            // console.log(response);
        });
    }, []);


    return(
        <div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details===undefined?"":details.map((item) => {
                    return(

                    <div className="qst-card">
                        <div className="qst-card-in">
                            <div className="qst">{item.question}</div>
                            <div className="qst-name">
                            
                                <div className="activities-qst-name">
                                <div>
                                    
                                    {!(props.src)?<figure className='person-icon'></figure>:
                                                    <img 
                                                        className="person-img" 
                                                        src={`http://localhost:8001/${props.src}`}
                                                    />
                                    }
                                </div>
                                <div>
                                    <div>{props.name}</div>
                                    <div style={{fontSize:10,color:"gray"}}>asked in{" "} 
                                        <span style={{color:"#06F2B0"}}>
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="qst-ans">
                                {item.answer}
                            </div>
                        </div>
                        <div className="vote-bar">

                    
                    

                        {/* <button
                            type='button' </button> */}
                            <div>
                            <Icon icon={arrowUp24Filled} />

                            <span className="vote-count">{item.votes}</span>
                            
                            
                            <Icon icon={arrowDown24Filled} />
                            </div>
                            
                            
                        </div>
                    </div>
                    )

                })}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}