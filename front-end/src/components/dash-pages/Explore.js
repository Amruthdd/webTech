import React,{ useEffect,useState} from 'react';
import './dash.css';
import {initData} from './data';
import { Link } from "react-router-dom";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import Axios from "axios";


function Explore(props){

    const [details, setDetails] = useState([]);
    const [count,setCount] = useState(0);
    const [src,setSrc] = useState(null);
    const [category, setCategory] = useState("All categories");
    useEffect(() => {
        Axios.get(`http://localhost:8001/explore/questions`, {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((response) => {
            setDetails(response.data.questions);
            setSrc(response.data.questions.image);
            console.log(response);
            // setCount(response.data.questions.length);
            // console.log(details);
            // console.log(response.data.questions.length);
        });
    }, []);
    

    return (

        <div className="dash-main">
            <h5 style={{display:"inline-block", marginBottom:"10vh"}}>All questions({details!==undefined?details.length:""})</h5>
            <div className="dropdown" style={{display:'inline-block', marginLeft:"5vh"}}>
                        <button className="drop-btn  dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {category}
                        </button>
                        <div class="dropdown-menu drop-it " aria-labelledby="dropdownMenu2">
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Entertainment")}}>Entertainment</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("News & Events")}}>News and Events</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Arts & Sports")}}>Arts and Sports</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Education & Reference")}}>Education and Reference</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("Society & Lifestyle")}}>Society and Lifestyle</button>
                            <button className="dropdown-item drop-each" type="button" onClick={()=>{setCategory("All categories")}}>All categories</button>
                        </div>
                    </div>
            <ResponsiveMasonry
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry>
                {details!==undefined?details.filter((item)=>{
                   return props.val===""?item.question:item.question.toLowerCase().includes((props.val).toLowerCase())?item:"";
                }).filter((item)=>{
                    return category==="All categories"?item.question:category===item.category?item:"";
                }).map((item) => {
                    
                    
                        return(
                            <Link 
                                className="qst-link-card" 
                                to={{
                                    pathname:`/index/Explore/${item.questionid}`,
                                    state: {
                                        question: item.question, 
                                        user:item.user,
                                        category:item.category,
                                        id: item.questionid,
                                        image: item.image
                                      }
                                }}
                                
                            >

                            <div className="qst-card" key={item.questionid}>
                                <div className="qst-card-in-exp">
                                    
                                    <div className="qst-name">
                                        <div>
                                        {!(item.image)?<figure className='person-icon'></figure>:
                                                (!src?
                                                    <img 
                                                        className="person-img" 
                                                        src={`http://localhost:8001/${item.image}`}
                                                    />:<figure className='person-icon'></figure>
                                                )
                                            }
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
                                    <div className="qst">{item.question}</div>
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