import React,{useEffect, useState} from 'react';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";
import './activities.css';
import { Icon, InlineIcon } from '@iconify/react';
import arrowUp24Filled from '@iconify/icons-fluent/arrow-up-24-filled';
import arrowDown24Filled from '@iconify/icons-fluent/arrow-down-24-filled';
import EditAnswerModal from "./EditAnswerModal";

export default function Answers(props){
    const [details, setDetails] = useState();
    const [id, setId] = useState();
    const [ans, setAns] = useState();
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
            <div
                    className='modal fade'
                    data-backdrop="false"
                    id='EditAnswerModalCenter'
                    tabindex='-1'
                    role='dialog'
                    aria-labelledby='EditQuestionModalCenterTitle'
                    aria-hidden='true'
                >
                    <div
                        className='modal-dialog modal-dialog-centered'
                        role='document'
                    >
                        <div className='modal-content modal-main'>
                            <EditAnswerModal answer={ans} id={id}/>
                        </div>
                    </div>
                </div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details===undefined?"":details.map((item) => {
                    return(

                    <div className="qst-card">
                        <div className="qst-card-in">
                            <div className="qst">{item.question}</div>
                            <div className="dropdown" >
                                <a class="menu-icon dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                            
                            <figure className="menu-icon"/>
                            </a>
                            
                            <div class="drop dropdown-menu dropdown-menu-right" id="dropdown" aria-labelledby="dropdownMenuLink" >
                            <button
                                className='btn dr-link dropdown-item'
                                type='button'
                                data-toggle='modal'
                                data-target='#EditAnswerModalCenter'
                                style={{marginRight:40}}
                                onClick={()=>{setAns(item.answer); setId(item.id);  }}
                                >
                                    Edit
                                </button>
                                
                                <button
                                className='btn dr-link dropdown-item'
                                type='button'
                                data-toggle='modal'
                                // data-target='#deleteAnswerModalCenter'
                                style={{marginRight:40}}
                                // onClick={
                                //     ()=>{
                                //     deleteQuestion(item.questionid)}
                                // }
                                >
                                    Delete
                                </button>
                                
                            </div>
                </div>
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
                                    <div style={{fontSize:10,color:"gray"}}>answered in{" "} 
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
                           
                                            <Icon icon={arrowUp24Filled}/>
                                       

                            <span className="vote-count">{item.votes}</span>
                            
                            
                           
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