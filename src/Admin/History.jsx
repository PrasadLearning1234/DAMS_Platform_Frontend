import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import { Tooltip } from 'primereact/tooltip';
import Background from "../Assets/Background.png";

import DOMPurify from 'dompurify';


import "../App.css";

import { Dropdown } from 'primereact/dropdown';
import { Ripple } from 'primereact/ripple';
import { Card } from "primereact/card";


export default function AuditHistory() {
  const [selectedCustomers, setSelectedCustomers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const dt = useRef(null);
  const [rows1, setRows1] = useState(15);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInputTooltip, setPageInputTooltip] = useState('Press \'Enter\' key to go to this page.');

  const DOC_FILE_URL = `${process.env.REACT_APP_API_KEY}/AuditHistory/download/excel/${sessionStorage.getItem('emailId')} `;
  const CSV_FILE_URL = `${process.env.REACT_APP_API_KEY}/AuditHistory/download/csv/${sessionStorage.getItem('emailId')} `;
  const PDF_FILE_URL = `${process.env.REACT_APP_API_KEY}/AuditHistory/download/pdf/${sessionStorage.getItem('emailId')} `;

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    userName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    activity: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },

    userName_description: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },



  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_KEY}/AuditHistory/list`)
      .then((res) => {
// console.log(res.data,"?//////////////")
        setPosts(res.data);
        if(res.data.length>0){
          setCurrentPage(1)
        }
        setLoading(false);
      });

  }, []);





  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };





  // DOCUMENT DOWNLOAD
  const downloadFileAtURL = (url) => {
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    const sanitizedUrl = DOMPurify.sanitize(url);
    aTag.href = sanitizedUrl;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  

  

    const [selectedFormat, setSelectedFormat] = useState(null);
  
 
 
  
    const handleSelectChange = (e) => {
      setSelectedFormat(e.value);
      // console.log("e.value",e.value);
  
      if (e.value === 'pdf') {
        // downloadFileAtURL(PDF_FILE_URL);
       
        // generatePDF();
      } else if (e.value === 'excel') {
        // console.log("e.value",e.value);
        // generateExcel();
        downloadFileAtURL(DOC_FILE_URL);
      } else if (e.value === 'csv') {
        // generateCSV();
        downloadFileAtURL(CSV_FILE_URL);
      }
      e.value=null;
    };
  
    const exportOptions = [
      // { label: 'PDF', value: 'pdf' },
      { label: 'Excel', value: 'excel' },
      { label: 'CSV', value: 'csv' },
    ];
  
    



  const renderHeader = () => {



    return (
      <div className="flex justify-content-between align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
            className="p-inputtext-sm"
          />
        </span>
        <Dropdown
        style={{backgroundColor:"#d04a02",color:"white !important"}}
          value={selectedFormat}
          options={exportOptions}
          onChange={handleSelectChange}
          placeholder="Export data"
          className="exportDataClass"
        />
  




      </div>
    );
  };

  const dateBodyTemplate = (createOn) => {


    return (
      <div>
        {new Intl.DateTimeFormat("en-IN", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }).format(createOn.createOn)}
      </div>
    );
  };

  const countryBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div>
          <Tooltip position="top" style={{ width: "30%" }} target={`.custom-tooltip-btn-${rowData.id}`}>
            {rowData.userName_description}
          </Tooltip>
          <div className={`custom-tooltip-btn-${rowData.id}`}>
            {rowData.userName_description}
          </div>
        </div>
      </React.Fragment>
    );
  };



  const header = renderHeader();

  const onPageInputKeyDown = (event, options) => {
    if (event.key === 'Enter') {
        const page = parseInt(currentPage);
        if (page < 1 || page > options.totalPages) {
            setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
        }
        else {
            const first = currentPage ? options.rows * (page - 1) : 0;

            setFirst1(first);
            setPageInputTooltip('Press \'Enter\' key to go to this page.');
        }
    }
}

const onPageInputChange = (event) => {
    setCurrentPage(event.target.value);
}

  const onCustomPage1 = (event) => {
    // console.log(event,"event");
    setFirst1(event.first);
    setRows1(event.rows);
    
    setCurrentPage(event.page + 1);
   
}


  const template1 = {
    layout: 'PrevPageLink CurrentPageReport NextPageLink ',
    'PrevPageLink': (options) => {
        return (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                <span   className="pi pi-chevron-left"></span>
                <Ripple />
            </button>
        )
    },
  

    
    'NextPageLink': (options) => {
        return (
            <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
           <span  className="pi pi-chevron-right"></span>
                <Ripple />
            </button>
        )
    },

    'CurrentPageReport': (options) => {
      // console.log(options,"options")
      return (
        <div>
        
          <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
              <InputText size="1" style={{textAlign: 'center'}}  className="ml-1" value={currentPage} tooltip={pageInputTooltip}
                  onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange}/>
          </span>
            

          <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
            of {options.totalPages}
          </span>
          </div>
      )
  }
 
};





  return (
    <div className="datatable-doc-demo">
   
<div >
    {/* <img
       
        style={{ height: "76px",width:"6s%",float: "right" }}
        src={Background}
        alt=" Background "
      /> */}
     
     {/* <br/>
      <br/> */}
   
      </div>
   <b className="headerName">Audit history</b>
      <br/>
      <br/>



{/* <img
      style={{ height: "80px",float: "right" }}
          src={Background}
          alt=" Background "
        />
       
      <br/>
      <br/>
      <br/>
      <br/>
       <b className="headerName">Audit History</b>
        */}

{/* 



      <Button
        style={{  color: "black", height: "35px" }}
        className="p-button-text p-button-plain"
      >
        <img
          style={{ width: "17px", marginRight: "10px", height: "15px" }}
          src={refresh}
          alt="refresh "
        />
        <b>Audit Histo</b>
      </Button>
      <img
        style={{ height: "53px", float: "right" }}
        src={Background}
        alt=" Background "
      />
      <br />
      <br /> */}
         <Card>
      <div>
        <DataTable
          ref={dt}
          value={posts}
          style={{borderRadius:"10px",border:"1px solid #FFB601"}}
          className="p-datatable-customers"
          header={header}
          stripedRows
        
          loading={loading}
          rows={rows1} 
        
          paginator paginatorTemplate={template1} first={first1} onPage={onCustomPage1}
          // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          showGridlines
          dataKey="id"
          rowHover
          size="small"
          selection={selectedCustomers}
          onSelectionChange={(e) => setSelectedCustomers(e.value)}
          filters={filters}
          filterDisplay="menu"
          // responsiveLayout="scroll"
          globalFilterFields={[
            "userName",
            "activity",
            "userName_description",
            "reviewer",
            "balance",
            "status",
          ]}
          emptyMessage="No documents found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            field="activity"
            header="Activity"
            sortable
            filter
            filterMenuStyle={{ width: "6rem" }}
            filterPlaceholder="Search by Activity"
            // style={{ minWidth: "6rem" }}
          />


          <Column
            field="userName_description"
            header="User name & description"
            sortable
            filterField="userName_description"
            body={countryBodyTemplate}

            style={{
              maxWidth: "500px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              minWidth: "8rem"
            }}
            filterMenuStyle={{ width: "14rem" }}
            filter
            filterPlaceholder="Search by userName_description"
          />

          <Column
            bodyStyle={{ width: "11rem" }}
            field="createOn"
            header="Activity date"
            sortable
            dataType="date"
            body={dateBodyTemplate}
            style={{ minWidth: "10rem" }}

          />
        </DataTable>

      </div>
      </Card>
    </div>
  );
}

