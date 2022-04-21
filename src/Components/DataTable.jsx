import React, { useState, useEffect, useRef } from "react";
import "./DataTable.css";
import MaterialTable, {MTableToolbar} from "material-table";
import { Checkbox, Select, MenuItem, TablePagination } from "@material-ui/core";
import Modal from "./Modal";
import useWindowDimensions from "./Hooks/useWindowsDimensions";
const URL = "http://localhost:4000/DataStreams"; //https://patrickviscount.github.io/DataTable_MaterialTable_JSONAPI/db.json
let oldSeg = "all";
var checker = 1;

function DataTable() {

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(false);
  const [CRUD, setCRUD] = useState(false);
  const [view, setView] = useState(true);
  const [segment, setSegment] = useState("all");
  const [tableClass, setTableClass] = useState("Simple");
  const [show, setShow] = useState(false);
  const [idNum, setIdNum] = useState(1);
  const [dropDownWidth, setDropDownWidth] = useState({width: 100, display: 'inline'});
  const [ColumnsButtonStyle, setColumnsButtonStyle] = useState({marginTop: '5%', ariaLabel: 'primary checkbox'});
  const [title, setTitle] = useState('3rd Party Data Vendors');
  const [hardCoded, setHardCoded] = useState(false);
  const [options, setOptions] = useState({
    actionsColumnIndex: -1,
    actionsCellStyle: {justifyContent: "center"},
    addRowPosition: "first",
    filtering: filter,
    search: true,
    draggable: true,
    paginationType: "stepped",
    pageSize: getPageSize(data)
  });
  const {width, height} = useWindowDimensions();
  const ref = useRef(null);
  let oldClick = 9999;

  //Gets the data to load he table, and adds an event listen for all clicks
  useEffect(()=>{
    getDataList();
    document.body.addEventListener('click', handleCRUD);
  },[]);

  useEffect(()=>{
    if (hardCoded === true){
      alert("This table has been loaded with static data for demonstrational purposes and many features such as the modal pop up and the CRUD functionality may not work as expected.")
    }
  },[hardCoded]);


  //Handles font size by assigning css depending on columns view
    useEffect(()=>{
    if(CRUD === true){
      setTableClass("All")
    }
    else if(view === true){
      setTableClass("Simple");
    }
    else if (view === false){
      setTableClass("Expanded");
    } 
  },[view, CRUD]);

  //Adds an extra event listener for all edit buttons to load all columns
  useEffect(()=>{
    setTimeout(function(){
      let test = document.querySelectorAll('button');
      for (let i = 0; i < test.length; i++){
        if (test[i].innerText === 'edit') {
          test[i].addEventListener('click', () => handleCRUD(i));
        }
      }
    }, 500)
  },[CRUD]);

  //Rendering and hiding table header functionality to avoid breaking on smaller screen sizes
  useEffect(()=>{
    let tableWidth = ref.current.offsetWidth
    let num = parseInt(document.documentElement.childNodes[2].childNodes[9].firstChild.firstChild.firstChild.style.width.match(/\d+/g));
    // console.log(num)
    // console.log(tableWidth)
    if(num){
    tableWidth = tableWidth * (0.01 * num);
    console.log("With num added " +  tableWidth)
    }
    if (tableWidth < 975){
      setTitle('');
    }
    if (tableWidth > 975){
      setTitle('3rd Party Data Vendors');  
    }
    if (tableWidth < 764){
      options.search = false;
    }
    if (tableWidth > 764){
      options.search = true;
    }
    if (tableWidth < 455){
      setDropDownWidth({width: 0, display: 'none'});
    }
    if (tableWidth > 455){
      setDropDownWidth({width: 100, display: 'inline'});
    }
    if (tableWidth > 325){
      setColumnsButtonStyle({width: 100, display: 'inline', marginTop: '5%', ariaLabel: 'primary checkbox'});
    }
    if (tableWidth < 325){
      setColumnsButtonStyle({width: 100, display: 'none', marginTop: '5%', ariaLabel: 'primary checkbox'});
    }
  },[width, height]);

  //Handles row rendering when filtering through the drop down menu
  useEffect(() => {
    if((segment !== "all" && oldSeg !== "all") || (segment === "all" && oldSeg !== "all")) {
      getDataList();
      setSegment("all");
    }
    setData(segment === 'all'? data : data.filter(dt => dt["Main Users of Data"] === segment));
    oldSeg = segment;
  }, [segment]);
  
  //API call for data
  const getDataList=()=> {
    fetch(URL).then(resp=>resp.json())
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
          setHardCoded(true);
    })
  };

  //The function drives column rendering, simple, expanded or all views
  //Don't set columns.hidden to false, or table will break
  const getColumns = () => {
    var realCols = [];

    if(CRUD === true){
      for (let j = 0; j < columns.length; j++){

        if(columns.indexOf(columns[j]) % 2 === 1){
          columns[j].cellStyle = {backgroundColor: '#FFF'};
        }
        else{
          columns[j].cellStyle = {backgroundColor: '#F1F1F0'};
        }
      }
      return columns;
    }

    columns[0].hidden = true;
    columns[9].hidden = true;
    columns[10].hidden = true;
    if (checker === 0) {
      for(let i = 0; i < columns.length; i++){
        if (columns[i].hidden !== true){
          realCols.push(columns[i]);
        }
      }
    }

    if (checker === 1) {
      columns[0].hidden = true;
      columns[2].hidden = true;
      columns[3].hidden = true;
      columns[8].hidden = true;
      columns[9].hidden = true;
      for(let i = 0; i < columns.length; i++){
        if (columns[i].hidden !== true){
          realCols.push(columns[i]);
        }
      }
    }

    for (let j = 0; j < realCols.length; j++){

      if(realCols.indexOf(realCols[j]) % 2 === 1){
        realCols[j].cellStyle = {backgroundColor: '#FFF'};
      }
      else{
        realCols[j].cellStyle = {backgroundColor: '#F1F1F0'};
      }
    }
    return realCols;
  }

  const columns = [
    { title: "ID", field: "id", editable: false},
    { title: "Vendor name", field: "Vendor name", render: (rowData) => <p>{handleRender(rowData['Vendor name'])}</p>},
    { title: "Vendor contact", field: "Vendor contact", render: (rowData) => <p>{handleRender(rowData['Vendor contact'])}</p>, cellStyle: {
      backgroundColor: '#FFF'
  }},
    { title: "Buisness Unit Acquiring", field: "Buisness Unit Acquiring", render: (rowData) => <p>{handleRender(rowData['Buisness Unit Acquiring'])}</p>}, 
    {
      title: "Lead Data Steward",
      field: "Lead Data Steward",
      render: (rowData) => <a href={`${findURL(rowData, 1)}`} target="_blank" rel="noopener noreferrer"> {handleRender(rowData["Lead Data Steward"])} </a>, cellStyle: {
        backgroundColor: '#FFF'
    }
    },
    {
      title: "Business Contact",
      field: "Business Contact",
      render: (rowData) => <a href={`${findURL(rowData, 2)}`} target="_blank" rel="noopener noreferrer"> {handleRender(rowData["Business Contact"])} </a>
    },
    { title: "Main Users of Data", field: "Main Users of Data", render: (rowData) => <p>{handleRender(rowData['Main Users of Data'])}</p>, cellStyle: {
      backgroundColor: '#FFF'
  }},
    { title: "Brief Desc of Data Used", field: "Brief Desc of Data Used", render: (rowData) => <p>{handleRender(rowData['Brief Desc of Data Used'])}</p>},
    { title: "Value Dervied From Data", field: "Value Dervied From Data", render: (rowData) => <p>{handleRender(rowData['Value Dervied From Data'])}</p>, cellStyle: {
      backgroundColor: '#FFF'
  }},
    { title: "Contracts in Zycus", field: "Contracts in Zycus", render: (rowData) => <p>{handleRender(rowData['Contracts in Zycus'])}</p>},
    { title: "IT Source", field: "IT Source", render: (rowData) => <p>{handleRender(rowData['IT Source'])}</p>}
  ];

  //Renders the modal with the passed row id number
  function handleClickModal(Id) {
    setIdNum(Id);
    setShow(!show);
  }

  //This function verifies that the cell contents are 100 characters or less, otherwise it cuts it to 100
  //This is to avoid a large wall of text taking up too much space
  function handleRender(str) {
    if(str){
    if(str.length > 100){
      let temp = str.slice(0, 99);
      temp = temp + '...';
      return temp;
    }
  }
    return str;
  }

  //Handles going into and getting out of CRUD functionality, by checking where a person is clicking
  function handleCRUD(clickInformation) {
    if(clickInformation > 0 || clickInformation < 200) {
      setCRUD(true);
  }
    else{
      setTimeout(function(){
        let CRUDrows = document.querySelectorAll('.Mui-selected'); //This css style only applies when a CRUD function is happening
        if (clickInformation.path[2].innerText > 0){ //This happens when a pagination number is clicked, needed this to refresh the edit botten click events
          setCRUD(true);
          setCRUD(false);
        } 
        let saviorRow = 0;
        const allRows = document.querySelectorAll('tr');
        for(let i =1; i < allRows.length-1; i++){
          if(allRows[i].className === 'MuiTableRow-root') {
          saviorRow = i;
          }
        }
        let top = allRows[saviorRow].getBoundingClientRect().top;
        if((clickInformation.clientY > top && clickInformation.clientY < top + 65) || (clickInformation.clientY.between(oldClick+30, oldClick-30))) {
          oldClick = clickInformation.clientY;
        }
        else if ((CRUDrows.length > 0 && ((clickInformation.path[2].innerText === 'add_box') || clickInformation.path[0].innerText === 'add_box')) || clickInformation.path[2].outerText === 'edit' || clickInformation.path[0].outerText === 'edit'){
          //If rows exist and a add row or edit row button is clicked  
          setCRUD(true);
        }
        else{
          if (CRUDrows.length > 0 ){
            if(clickInformation.path[0].nodeName !== 'INPUT' && clickInformation.path[0].tagName !== "TR"){
              //If the user clicks outside of a row input or a row itself
              setCRUD(false);
            }
          }
        else{
          setCRUD(false);
          }
        }
    }, 1);
    }
  }

  Number.prototype.between = function(a, b) {
    var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
    return this > min && this < max;
  };

  //This function flips a boolean and calls the columns function
  const handleColumns = () => {
    setView(!view);
    if(checker === 0){
      checker = 1;
    }
    else {
      checker = 0;
    }
    getColumns();
  }

  //This function handles the filtering checkbox by checking the box, and enabling the filtering functionality
  const handleCheck = () => {
    setFilter(!filter);
    setOptions({...options, filtering: !filter});
  }

  return (
    <div className={tableClass} ref={ref}>
      <MaterialTable //Actual Table call, most passed in variables can be changed via setState
        title={title}
        className={tableClass}
        data={Array.from(data)}
        columns={getColumns()}
        options={options}

        components={{
          //Sets the pagination dropdown
          Pagination: props => (
            <TablePagination
              {...props}
              rowsPerPageOptions={[5, 10, 20, 50, { value: data.length, label: 'All' }]}
            />
          ),
          //This was to properly style the header
          Toolbar: props => (
            <div style={{ backgroundColor: '#e8eaf5' }}>
              <MTableToolbar {...props} classes={{ root: "fontHandler" }} />
            </div>
          )
        }}

        //These are all for when any row is added, deleted or edited.
        //generally, these functions just pass along that information to the API endpoint
        editable={{
          onRowAdd: (newRow) =>
            new Promise((resolve, reject) => {
              let newID = findID(data);
              newRow.id = newID;
              fetch(URL,{
                method: "POST",
                headers:{
                  "Content-type": "application/json"
                },
                body: JSON.stringify(newRow)
              }).then(resp=>resp.json()).then(resp=>getDataList())
              .then(resolve());
            }),

          onRowDelete: (selectedRow) =>
            new Promise((resolve, reject) => {
              fetch(`${URL}/${selectedRow.id}`,{
                method: "DELETE",
                headers:{
                  "Content-type": "application/json"
                },
              }).then(resp=>resp.json()).then(resp=>getDataList())
              .then(resolve());
            }),

          onRowUpdate: (updatedRow, oldRow) =>
            new Promise((resolve, reject) => {
              checker = 1;
              fetch(`${URL}/${oldRow.id}`,{
                method: "PUT",
                headers:{
                  "Content-type": "application/json"
                },
                body: JSON.stringify(updatedRow)
              }).then(resp=>resp.json()).then(resp=>getDataList())
              .then(resolve());
            })
        }
      }

      //Header buttons / functionality
      actions = {[
        { //Columns simple / expanded views button
          icon:() => 
          <button className="columnsButton" onClick={handleColumns} style={ColumnsButtonStyle}>
          {view ? 'Show Columns' : 'Hide Columns'}
          </ button>,
          isFreeAction: true 
        },
        { // Filtering checkbox 
        icon:() => 
        <Checkbox
        checked = {filter}
        onChange={handleCheck} 
        inputProps={{'aria-label': 'primary checkbox'}}
        color="primary"
        />,
        tooltip:"Hide/Show Filter",
        isFreeAction: true
        },
        { // Drop down filtering
          icon: () => 
          <Select
          labelId="demo-simple-select-label"
          id="demo-select-simple"
          style={dropDownWidth}
          value={segment}
          onChange={(e) => {
            setSegment(e.target.value);
          }}
          >
          <MenuItem value={"all"}> All </MenuItem>
          <MenuItem value={"Insurance"}> Insurance </MenuItem>
          <MenuItem value={"Re-insurance"}> Re-insurance </MenuItem>
          <MenuItem value={"Admin"}> Admin </MenuItem>
          </Select>,
          tooltip: "Filter Users of Data",
          isFreeAction: true
        },
        { //Modal button
          icon: 'info',
          tooltip: 'More Info',
          onClick: (rowData, event) => {handleClickModal(event.id)}
      },
      ]}
      />

      <Modal  //The modal, its hidden until the more info button is clicked
        show={show}
        idNumber={idNum}
        onClose={() => setShow(false)}
      />
    </div>
  );
}

//This function goes from 1 to row.length to fund the first id number not in use
function findID(dataStream) {
  let data = dataStream.sort((a, b) => a.id - b.id);
  let id = 1;

  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      id++;
    }
  }
  return id;
}

function getPageSize(data) {
  console.log(data.length)
  if(data.length > 0) {  
    if(data.length > 10){
      return 10
    }
    else {
      return data.length;
    }
  }
  else {
    return 10;
  }
}

//This function looks into the links cell to fund a suitable link, mail address or redirects to Axis homepage
function findURL(dataStream, columnNumber) {
  let information = '';
  if (columnNumber === 2 && dataStream.TechLeadLink){
    information = dataStream.TechLeadLink;
  }
  else if (columnNumber === 1 && dataStream.BusinessContactLink){
    information = dataStream.BusinessContactLink;
  }
  else if(dataStream.WorkdayLink){
    information = dataStream.WorkdayLink;
  }
  if (information) {
  let data = information.split(" ");
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

export default DataTable;
