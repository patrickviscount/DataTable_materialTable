import React, {useEffect, useState} from 'react';
import "./Modal.css";

const Modal = (props) => {
    const URL = "http://localhost:4000/DataStreams";
    let ID = props.idNumber;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    function getDataList() {
      fetch(`${URL}/${ID}`).then(resp=>resp.json())
      .then(resp=>setData(resp));
        setLoading(false);
    }

    const closeOnEsc = (e) => {
        if((e.charCode || e.keyCode) === 27){
            props.onClose();
        }
    }

    useEffect(() => {
        setLoading(true);
        getDataList();
        document.body.addEventListener('keydown', closeOnEsc);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEsc);
        }
    }, [])

    useEffect(() => {
        getDataList();
    }, [props])

    if(!props.show){
        return null;
    }
    if(loading === true){
      return (<div className='modal'> <div className='modal-content'><h1>Content isn't finished loading</h1> </div> </div>)
    }

    return (
        <div className='modal' onClick={props.onClose} style={{height: document.body.scrollHeight+25}}>
            <div className='modal-content' onClick={e => e.stopPropagation()}>
                <div className='modal-header'>
                    <h4 className='modal-title'>{data["Vendor name"]}</h4>
                </div>
                <div className='modal-body'>
                <h6> Vendor contact: </h6> {data["Vendor contact"]} <br /> <hr />
                <h6> Buisness Unit Acquiring:</h6> {data["Buisness Unit Acquiring"]} <br /> <hr />
                <h6> Lead Data Steward:</h6> {data["Lead Data Steward"]} <br /> <hr />
                <h6> Business Contact:</h6> {data["Business Contact"]} <br /> <hr />
                <h6> Main Users of Data:</h6> {data["Main Users of Data"]} <br /> <hr />
                <h6> Brief Desc of Data Used:</h6> {data["Brief Desc of Data Used"]} <br /> <hr />
                <h6> Value Dervied From Data:</h6> {data["Value Dervied From Data"]} <br /> <hr />
                <h6> Contracts in Zycus:</h6> {data["Contracts in Zycus"]} <br /> <hr />
                <h6> IT Source:</h6> {data["IT Source"]} <br /> <hr />
                 <div>
                <h6>Contact at Axis:</h6>
                <a
                    href={`${findURL(data)}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    >
                    {findURL(data)}
                </a>
                </div> <br /> <hr />
                </div>
                <div className='modal-footer'>
                    <button onClick={props.onClose} className='exitButton'>X</button>
                </div>
            </div>
        </div>

    )
}

function findURL(dataStream) {
    if (dataStream.WorkdayLink) {
    let data = dataStream.WorkdayLink.split(" ");
    let url = "";
    
    for (let i = 0; i < data.length; i++) {
      if( data[i].startsWith("https://www.myworkday.com")){
        url = data[i];
        return url;
      }
      else if (data[i].startsWith("mailto")) {
        url = data[i];
      }
    }
    if (url === "") {
      url = "https://www.axiscapital.com/";
    }
    return url;
    }
    else {
      return "https://www.axiscapital.com/";
    }
  }

export default Modal;