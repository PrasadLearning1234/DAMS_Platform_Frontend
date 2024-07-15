import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import Search from "../Assets/search.png";
import Background from "../Assets/Background.png";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { Ripple } from "primereact/ripple";
import Reactangle from "../Assets/Rectangle.png";
import Group from "../Assets/Group.png";
import DOMPurify from 'dompurify';
const DocumentSearch = () => {
  const [data, setData] = useState([]);
  const [secId, setSecId] = useState([]);
  const [customer, setCustomers] = useState([]);
  const [docView, setDocViewData] = useState();
  const [documentName, setDocumentName] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [isInputActive, setInputActive] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState([]);

  const [createdBy, setLoginUser] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const [rows1, setRows1] = useState(7);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("userName"));
  }, []);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setQuery(value);
    setInputActive(value !== "");

    axios
      .get(`${process.env.REACT_APP_API_KEY}/sample/getSuggestions/${value}`)
      .then((res) => {
        // console.log("All keyword data", res.data);
        setUsers(res.data);
        setSuggestions(res.data);
      });

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_KEY}/sample/getStringSuggestion/${value}`
      ); // Replace with the actual URL or path to your JSON data
      const data = response.data;
      setUsers(data);

      // console.log(data.Suggestion,"/?????????")
    } catch (error) {
      // console.error("Error fetching JSON data:", error);
    }
  };

  const handleSuggestionClick = (value) => {
    setQuery(value);
    setSuggestions([]);
  };

  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const displayedSuggestions = filteredSuggestions.slice(-4); // Limit the displayed suggestions to 2 keywords

  // const usersSuggestions = users.slice(-5);

  const dialogFuncMap = {
    displayBasic: setDisplayBasic,
  };

  const onClick = (name, position) => {
    setSecId(position.secId);
    // console.log(position.secId, "/////www");

    dialogFuncMap[`${name}`](true);

    if (position) {
      // console.log(position);

      axios
        .get(
          `${process.env.REACT_APP_API_KEY}/document/getHtmlContains/${position.id}`
        )
        .then((res) => {
          // console.log("All tree-sections", res.data);
          setDocViewData(DOMPurify.sanitize(res.data.data));
          setDocumentName(res.data.docName);
        });
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  // DOWNLOAD
  const downloadFileAtURL = (rowData) => {
    const url = `${process.env.REACT_APP_API_KEY}/document/downloadSec/${rowData.id}/${createdBy}`;
    // console.log(rowData, " file to be download");
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    const sanitizedUrl = DOMPurify.sanitize(url);
    aTag.href = sanitizedUrl;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  //SEARCH SECTION

  async function search(key) {
    // console.log( key.target.value,"????")
    // console.log("key:",key);
    // let outputText='';
    // let text;
    // const field=key.target.value;
    // if (field.includes('"')) {
    //   outputText = field.replace(/\\/g, "").replace(/"/g, '');
    //   console.log("output_text:", outputText);
    //   text = `${outputText}`;
    // }
    // else{
    //   outputText=field;
    //   console.log("output_text: without phrase", outputText);
    //   text = `${outputText}`;
    // }

    setSuggestions([]);

    if (key.keyCode === 13 && key.target.value.length > 1) {
      let text = key.target.value;
      // console.log("text to search: ",text);
      const encoded = encodeURIComponent(text);
      // console.log(encoded, "????")

      const data = {
        value: encoded,
      };
      fetch(
        `${process.env.REACT_APP_API_KEY}/sample/getSectionHighlightedValue`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((result) => {
        // console.log(result, "result");
        result.json().then((result) => {
          // console.warn("resp", result);

          setData(result);
          setSearchResults(result);
          if (result.length > 0) {
            setSuggestions([]);

            setSearchExecuted(false);
          } else {
            setSearchExecuted(true);
          }

          setCustomers(result);

          setLoading(false);
          // console.log(customer, "/////////////////////////////////////****");
        });
      });
    } else {
      // console.log("press enter");
      setSearchResults([]);
    }
    //
  }

  async function searchOnClick(e, key) {
    // console.log(e, "key:", key);

    // console.log("key:",key);

    setSuggestions([]);

    if (e.type === "click" && key.length > 1) {
      // console.log(key, "????????");
      let text = key.target.value;
      // console.log("text to search: ", text);
      let encoded = encodeURIComponent(text);
      // console.log(encoded, "????");

      const data = {
        value: encoded,
      };
      fetch(
        `${process.env.REACT_APP_API_KEY}/sample/getSectionHighlightedValue`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((result) => {
        // console.log(result, "result");
        result.json().then((result) => {
          // console.warn("resp", result);

          setData(result);
          setSearchResults(result);
          if (result.length > 0) {
            setSuggestions([]);

            setSearchExecuted(false);
          } else {
            setSearchExecuted(true);
          }

          setCustomers(result);

          setLoading(false);
          // console.log(customer, "/////////////////////////////////////****");
        });
      });
    } else {
      // console.log("press enter");
      setSearchResults([]);
    }
    //
  }

  // console.log(users, "??????ppppp");

  const customBody = (rowData, column) => {
    return <span dangerouslySetInnerHTML={{ __html: rowData[column.field] }} />;
  };
  

  const handleClearInput = () => {
    setQuery("");
    setSearchExecuted(false);
  };

  // const secDownload = () => {
  //   toast.current.show({
  //     severity: "success",
  //     summary: "Section Download Successfully",
  //     detail: "Section Download",
  //     life: 1000,
  //   });
  // };

  const actionbodyTemplate = (rowData) => {
    // console.log(rowData.id, "///docid");

    setSecId(rowData.id);

    return (
      <>
        <div style={{ display: "flex" }}>
          <Button
            icon="pi pi-eye"
            style={{
              // backgroundColor: "white",
              height: "30px",
              width: "30px",
              color: "#D04A02",
            }}
            className=" p-button-text"
            // onMouseDown={() => onClickHeader(rowData)}

            tooltip="View Section"
            tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
            onClick={() => onClick("displayBasic", rowData)}
          />
          &nbsp;
          <Button
            style={{
              height: "10px",
              width: "10px",
              color: "#D04A02",
            }}
            icon="pi pi-download"
            onClick={() => {
              downloadFileAtURL(rowData);
            }}
            // onMouseDown={ secDownload}
            tooltip="Download "
            tooltipOptions={{
              className: "teal-tooltip",
              position: "bottom",
            }}
            className=" p-button-text"
            // onMouseDown={secDownload}
          />{" "}
          &nbsp;
          {/* <Button
            style={{
              backgroundColor: "white",
              height: "30px",
              width: "30px",
              color: "#203570",
            }}
            icon="pi pi-download"

            onClick={() => {
              downloadFileAtURL(rowData);
            }}
            // onMouseDown={secDownload}
            tooltip="Download "
            tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
            className="p-button-raised  p-button-text"

          /> */}
        </div>
      </>
    );
  };

  const header = () => {
    return <> {documentName}</>;
  };

  const onPageInputKeyDown = (event, options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 1 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;

        setFirst1(first);
        setPageInputTooltip("Press 'Enter' key to go to this page.");
      }
    }
  };

  const onPageInputChange = (event) => {
    setCurrentPage(event.target.value);
  };

  const onCustomPage1 = (event) => {
    // console.log(event, "event");
    setFirst1(event.first);
    setRows1(event.rows);

    setCurrentPage(event.page + 1);
  };

  const template1 = {
    layout:
      "PrevPageLink CurrentPageReport NextPageLink ",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="pi pi-chevron-left"></span>
          <Ripple />
        </button>
      );
    },

    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="pi pi-chevron-right"></span>
          <Ripple />
        </button>
      );
    },

    CurrentPageReport: (options) => {
      // console.log(options, "options");
      setTotalRecords(options.totalRecords);
      return (
        <div>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            <InputText
              style={{ height: "30px", textAlign: "center" }}
              size="1"
              className="ml-1"
              value={currentPage}
              tooltip={pageInputTooltip}
              onKeyDown={(e) => onPageInputKeyDown(e, options)}
              onChange={onPageInputChange}
            />
          </span>

          <span
            style={{
              color: "var(--text-color)",
              userSelect: "none",
              width: "120px",
              textAlign: "center",
            }}
          >
            of {options.totalPages}
          </span>
        </div>
      );
    },
  };

  return (
    <div>
      {/* <Button
        style={{ backgroundColor: "white", color: "black", height: "35px" }}
        className="p-button-raised  p-button p-button-secondary p-button-text"
      >
        <img
          style={{ width: "15px", marginRight: "10px", height: "17px" }}
          src={Search}
          alt=" Search "
        />
        <b> Search Document</b>
      </Button>
      <img
        style={{ height: "53px", float: "right" }}
        src={Background}
        alt=" Background "
      />

      <br />
      <br /> */}

      <div>
        {/* <img
          style={{ height: "76px", width: "6s%", float: "right" }}
          src={Background}
          alt=" Background "
        /> */}

        {/* <br />
        <br /> */}
      </div>
      <b className="headerName">Search document</b>
      <br />
      <br />

      <Card style={{ height: "32rem" }}>
        <Toast ref={toast} />
        <div className="autocomplete">
          <div className="card-container">
            <span
              className="p-input-icon-left"
              style={{ marginLeft: "23%", width: "57vw" }}
              // className="inputfound"
            >
              {" "}
              <div
                className={`input-container ${isInputActive ? "Active" : ""}`}
              >
                <div class="layout-sidebar-filter-content p-input-icon-left p-fluid p-input-icon-right">
                  <i class="pi pi-search"></i>

                  <InputText
                    style={{ borderRadius: "2px", width: "53vw" }}
                    type="text"
                    value={query}
                    placeholder="Search..."
                    onChange={handleInputChange}
                    onKeyDown={(e) => search(e)}
                    class="p-inputtext  p-component p-filled"
                  />

                  <i
                    class="clear-icon pi pi-times"
                    onClick={handleClearInput}
                  ></i>
                </div>
              </div>
            </span>

            {displayedSuggestions.length > 0 && (
              <ul className="suggestions">
                {displayedSuggestions.map((item) => (
                  <li
                    key={item}
                    className="suggestion"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <span onClick={(e) => searchOnClick(e, query)}>
                      {" "}
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* {searchResults.length === 0 && (
        <p style={{display:"flex", alignItems: "center",justifyContent:"center"}}>No results found.</p>
      )} */}

        {searchExecuted && searchResults.length === 0 && (
          <b className="notfound">No results found.</b>
        )}
        <br />

        {data.length > 0 ? (
          // <Card>

          <div>
            {/* <b style={{ color: "black" }}>You may also be interested in........</b>
            <br /> */}
            {/* 
{usersSuggestions.map((item) => (
        <Tag style={{ backgroundColor: "#D2D7E2",color:"#2D2D2D"}} className="mr-2" > {item.Suggestion}</Tag>
        ))} */}

            {/* {usersSuggestions.length > 0 && (
              <>
                {usersSuggestions.map((item) => (


                  <Tag style={{ backgroundColor: "#D2D7E2", color: "#2D2D2D" }} className="mr-2" >

                    <div dangerouslySetInnerHTML={{ __html: item }}></div>
                  </Tag>

                ))}
              </>
            )}

            <br /> */}

            <Dialog
              header={header}
              visible={displayBasic}
              style={{ width: "80vw",margin:'1rem' }}
              onHide={() => onHide("displayBasic")}
            >
              {/* <>{uploadedDate}</> */}

              {/* <span className="tocview" dangerouslySetInnerHTML={{ __html: docView }} /> */}
              <span
                style={{ whiteSpace: "pre-line" }}
                className="tocview"
                dangerouslySetInnerHTML={{ __html: docView }}
              />
              {/* <p dangerouslySetInnerHTML={{ __html: docView }}> </p> */}

              {/* <>{docView}</> */}
            </Dialog>

            {/* <br />
             */}
            <b style={{ float: "left", color: "#2D2D2D", fontSize: "12px" }}>
              {totalRecords} Search Results
            </b>
            <br />
            <Card style={{ border: "1px solid #D04A02" }}>
              <DataTable
                value={data}
                paginator
                rowHover
                loading={loading}
                stripedRows
                scrollable
                scrollHeight="70vh"
                rows={rows1}
                paginatorTemplate={template1}
                first={first1}
                onPage={onCustomPage1}
                // paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                // currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                // rows={5}
                p-datatable-wrapper
                emptyMessage="No documents found."
              >
                <Column
  field="name"
  style={{
    maxWidth: "210px",
    minWidth: "6rem",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  }}
  header="Section name"
  
  body={(data) => {
  console.log('data',data);
    if (typeof data.name[0] === 'string') {
     
      const fileNameArray = data.name[0].split(".docx");
      const fileName = fileNameArray[0]; 
      const fileExtension = fileNameArray[1]; 
      console.log('fileNameArray',fileNameArray);

      return (
        <span>
          {fileName} 
        
        </span>
      );
    } else {
     

    }
  }}
/>


                <Column
                  field="content"
                  body={customBody}
                  header="Description"
                  style={{
                    maxWidth: "500px",
                    minWidth: "8rem",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                />

                <Column header="Action" body={actionbodyTemplate} />
              </DataTable>
            </Card>

            {/* ) : (
        <div>No documents found after the search.</div>
      )} */}
          </div>
        ) : (
          <>{/* <p>No result Found</p> */}</>
        )}

        {/* <div class="image-container">
          <img class="float-image" src={Group} alt="Group" />
          <img class="full-image" src={Reactangle} alt="Reactangle" />
        </div> */}
      </Card>
    </div>
  );
};

export default DocumentSearch;
