import React, {useEffect, useState} from 'react';
import "./Modal.css";

const Modal = (props) => {
    const URL = "http://localhost:4000/DataStreams";
    let ID = props.idNumber;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    //gets information to populate modal
    function getDataList() {
      fetch(`${URL}/${ID}`).then(resp=>resp.json())
      .then(resp=>setData(resp)).catch(error => {
        setData([
          {
            "id": 1,
            "Vendor name": "Petah INC",
            "Vendor contact": "petAH@xasdx.com",
            "Buisness Unit Acquiring": "Insurance",
            "Lead Data Steward": "Tom Brady",
            "Business Contact": "CONTACST",
            "Main Users of Data": "Insurance",
            "Brief Desc of Data Used": "global variable checking",
            "Value Dervied From Data": "Risk Assesment",
            "Contracts in Zycus": "H1Z1Z0MB13Saz",
            "IT Source": "MASHws",
            "TechLeadLink": "mailto:google@google.com",
            "BusinessContactLink": "nothjign imporetant here"
          },
          {
            "id": 2,
            "Vendor name": "PEOPLE INC",
            "Vendor contact": "peterZon@poeple.com",
            "Buisness Unit Acquiring": "Cyber and Tech",
            "Lead Data Steward": "Cyotes",
            "Business Contact": "John Jhon",
            "Main Users of Data": "Re-insurance",
            "Brief Desc of Data Used": "Criminal Check",
            "Value Dervied From Data": "Risk Assesment",
            "Contracts in Zycus": "ZOOM13Z",
            "IT Source": "HERE",
            "TechLeadLink": "https://www.myworkday.com/axiscapital/d/inst/1$17/247$5193.htmld#TABINDEX=0&SUBTABINDEX=0",
            "BusinessContactLink": "mailto:google@google.com"
          },
          {
            "id": 3,
            "Vendor name": "3 INC",
            "Vendor contact": "3@testeremailnotreal.com",
            "Buisness Unit Acquiring": "Insurance",
            "Lead Data Steward": "Patriots",
            "Business Contact": "Scott Thomas",
            "Main Users of Data": "Admin",
            "Brief Desc of Data Used": "Counting services",
            "Value Dervied From Data": "IT",
            "Contracts in Zycus": "09JHKH09",
            "IT Source": "Hola!",
            "TechLeadLink": "https://www.myworkday.com/axiscapital/d/inst/1$17/247$5193.htmld#TABINDEX=0&SUBTABINDEX=0",
            "BusinessContactLink": "nothjign imporetant here"
          }])
      });
        setLoading(false);
    }
    //escape key closes modal
    const closeOnEsc = (e) => {
        if((e.charCode || e.keyCode) === 27){
            props.onClose();
        }
    }

    //loading until data is finished populating
    useEffect(() => {
        setLoading(true);
        getDataList();
        document.body.addEventListener('keydown', closeOnEsc);
        return function cleanup() {
            document.body.removeEventListener('keydown', closeOnEsc);
        }
    }, [])

    //updates data when props change
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

//this function finds workday / mail urls or redirects to axis home page
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