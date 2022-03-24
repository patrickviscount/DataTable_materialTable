import React, { useState, useEffect } from "react";
import "./App.css";
import MaterialTable, {MTableToolbar} from "material-table";
import { Checkbox, Select, MenuItem, TablePagination } from "@material-ui/core";
import Modal from "./Modal"
const URL = "http://localhost:4000/DataStreams";
let oldSeg = "all";
var checker = 1;

function DataTable() {

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(false);
  const [view, setView] = useState(true);
  const [segment, setSegment] = useState("all");
  const [show, setShow] = useState(false);
  const [idNum, setIdNum] = useState(1);
  // const [fontSize, setFontSize] = useState(20);


  useEffect(()=>{
    getDataList();
  },[]);

  // useEffect(()=>{
  //   if (checker === 0) {
  //     setFontSize(15);
  //   }
  //   if (checker === 1) {
  //     setFontSize(20);
  //   }
  // },[checker]);
  
  const getDataList=()=> {
    fetch(URL).then(resp=>resp.json())
    .then(resp=>setData(resp))
  };

  const getColumns = () => {
    columns[9].hidden = true;

    if (checker === 1) {
      columns[0].hidden = true;
      columns[2].hidden = true;
      columns[3].hidden = true;
      columns[8].hidden = true;
      columns[9].hidden = true;
      // console.log(columns);
      // columns[2].cellStyle={backgroundColor: '#fff'};
    }
    return columns;
  }

  const columns = [
    { title: "ID", field: "id", editable: false, hidden: true},
    { title: "Vendor name", field: "Vendor name", render: (rowData) => <p>{handleRender(rowData['Vendor name'])}</p>},
    { title: "Vendor contact", field: "Vendor contact", render: (rowData) => <p>{handleRender(rowData['Vendor contact'])}</p>, cellStyle: {
      backgroundColor: '#FFF'
  }},
    { title: "Buisness Unit Acquiring", field: "Buisness Unit Acquiring", render: (rowData) => <p>{handleRender(rowData['Buisness Unit Acquiring'])}</p>}, 
    {
      title: "Lead Data Steward",
      field: "Lead Data Steward",
      render: (rowData) => <a href={`${findURL(rowData)}`} target="_blank" rel="noopener noreferrer"> {handleRender(rowData["Lead Data Steward"])} </a>, cellStyle: {
        backgroundColor: '#FFF'
    }
    },
    {
      title: "Business Contact",
      field: "Business Contact",
      render: (rowData) => <a href={`${findURL(rowData)}`} target="_blank" rel="noopener noreferrer"> {handleRender(rowData["Business Contact"])} </a>
    },
    { title: "Main Users of Data", field: "Main Users of Data", render: (rowData) => <p>{handleRender(rowData['Main Users of Data'])}</p>, cellStyle: {
      backgroundColor: '#FFF'
  }},
    { title: "Brief Desc of Data Used", field: "Brief Desc of Data Used", render: (rowData) => <p>{handleRender(rowData['Brief Desc of Data Used'])}</p>},
    { title: "Value Dervied From Data", field: "Value Dervied From Data", render: (rowData) => <p>{handleRender(rowData['Value Dervied From Data'])}</p>, cellStyle: {
      backgroundColor: '#FFF'
  }},
    { title: "Contracts in Zycus", field: "Contracts in Zycus", hidden: true, render: (rowData) => <p>{handleRender(rowData['Contracts in Zycus'])}</p>},
    { title: "IT Source", field: "IT Source", hidden: true, hiddenByColumnsButton: true, render: (rowData) => <p>{handleRender(rowData['IT Source'])}</p>}
  ];

  function handleClickModal(Id) {
    setIdNum(Id);
    setShow(!show);
  }

  function handleRender(str) {
    if(str.length > 100){
      let temp = str.slice(0, 99);
      temp = temp + '...';
      return temp;
    }

    return str;
  }

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

  const handleCheck = () => {
    setFilter(!filter);
  }

  useEffect(() => {

    if((segment !== "all" && oldSeg !== "all") || (segment === "all" && oldSeg !== "all")) {
      getDataList();
      setSegment("all");
    }
    setData(segment === 'all'? data : data.filter(dt => dt["Main Users of Data"] === segment));
    oldSeg = segment;
  }, [segment]);

  return (
    <div className="App">
      <MaterialTable
        title=" "
        data={Array.from(data)}
        columns={getColumns()}
        options={{
          actionsColumnIndex: -1,
          actionsCellStyle: {justifyContent: "center"},
          addRowPosition: "first",
          filtering: filter,
          search: true,
          draggable: true,
          paginationType: "stepped",
          pageSize: 5
        }}
            
        components={{
          Pagination: props => (
            <TablePagination
              {...props}
              rowsPerPageOptions={[5, 10, 20, 50, { value: data.length, label: 'All' }]}
            />
          ),
          Toolbar: props => (
            <div style={{ backgroundColor: '#e8eaf5' }}>
              <MTableToolbar {...props} classes={{ root: "my-temp-class" }} />
            </div>
          )
        }}

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

      actions = {[
        {
          icon:() => 
          <Checkbox
          checked = {view}
          onChange={handleColumns}
          inputProps={{'aria-label': 'primary checkbox'}}
          color="primary"
          />,
          tooltip:"Hide/Show Columns",
          isFreeAction: true
        },
        {
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
        {
          icon: () => 
          <Select
          labelId="demo-simple-select-label"
          id="demo-select-simple"
          style={{width: 100}}
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
        {
          icon: 'info',
          tooltip: 'More Info',
          onClick: (rowData, event) => {handleClickModal(event.id)}
      },
      ]}
      />
      <Modal
        show={show}
        idNumber={idNum}
        onClose={() => setShow(false)}
      />
    </div>
  );
}

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

function findURL(dataStream) {
  if (dataStream.WorkdayLink) {
  let data = dataStream.WorkdayLink.split(" ");
  let url = "";
  
  for (let i = 0; i < data.length; i++) {
    if( data[i].startsWith("https://www.myworkday.com")){
      url = data[i];
      return url;
    }
    else if (data[i].startsWith("mailtdo")) {
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
