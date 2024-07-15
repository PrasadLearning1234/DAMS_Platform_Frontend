import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { NavLink, useParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { useNavigate } from "react-router-dom";
import leftIcon from "../Assets/lefticon.png";
import Background from "../Assets/Background.png";
import { Tag } from "primereact/tag";
import axios from "axios";
import plus from "../Assets/plus.png";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { Ripple } from "primereact/ripple";
import Section from "../Assets/Section.png";
import Circleicon from "../Assets/Circleicon.png";

const Product = () => {
  const [section, setSection] = useState([]);
  const { docId } = useParams();
  const [keywords, setKeywords] = useState("");
  const [keyword, setKeyword] = useState("");
  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayBasic1, setDisplayBasic1] = useState(false);
  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [displayBasic3, setDisplayBasic3] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor1, setChangeColor1] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const [users, setUser] = useState([]);
  const [createdBy, setLoginUser] = useState();
  const [loading, setLoading] = useState(false);
  const [rows1, setRows1] = useState(6);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
    // console.log("customerService.docId:", docId);
    getData(docId);
  }, []);
  const version = "version1";

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
    getAllKeyword();
  }, []);

  const getAllKeyword = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/listKeywords/${docId}/${version}`
      )
      .then((res) => {
        // console.log("res: ", res);
        if (res.data[0].keywords) {
          setUser(res.data[0].keywords);
        }
      });
  };

  // console.warn(users, "/.//////////////////////////////////shivani");

  const handleClick = () => {
    setChangeColor(!changeColor);
  };
  const handleClick1 = () => {
    setChangeColor1(!changeColor1);
  };
  const handleClick2 = () => {
    setChangeColor2(!changeColor2);
  };

  //SAVE AS DRAFT
  function SaveasDraft() {
    let data = {
      createdBy,
    };

    let reviwer = undefined;
    fetch(
      `${process.env.REACT_APP_API_KEY}/document/uploadSaveAsDraftById/${docId}/${reviwer}`,

      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then(
      (result) => {
        // console.warn("result...!!!", result);
        if (result.status === 200) {
          // console.warn("result...!!!", result);
          result.json().then((resp) => {
            // console.warn("resp", resp);
          });

          toast.current.show({
            severity: "success",
            summary: "Saved As Draft",
            detail: "Saved As Draft Successfully",
            life: 2000,
          });
          setTimeout(() => {
            navigate("/dashboardMain");
          }, 1300);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Document not Saved As Draft",
            detail: "Error while Document Saved As Draft",
            life: 2000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Document not Saved As Draft",
          detail: "Error while Document Saved As Draft",
          life: 2000,
        });
      }
    );
  }

  //delete user
  function deleteUser(docId) {
    setLoading(true);
    if (docId) {
      let data = {
        createdBy,
      };

      fetch(
        `${process.env.REACT_APP_API_KEY}/document/deleteDocument/${docId}`,

        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then(
        (result) => {
          if (result.status === 200) {
            // console.warn("result...!!!", result);
            result.json().then((resp) => {
              // console.warn("resp", resp);
            });
            setLoading(false);

            toast.current.show({
              severity: "success",
              summary: "Document Deleted",
              detail: "Document Deleted Successfully",
              life: 2000,
            });

            setTimeout(() => {
              navigate("/UploadDocument");
            }, 1000);
          } else {
            setLoading(false);
            toast.current.show({
              severity: "warn",
              summary: "Document Not Deleted",
              detail: "Error while Deleted User",
              life: 2000,
            });
          }
        },
        (error) => {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Document Not Deleted",
            detail: "Error while Deleted User",
            life: 2000,
          });
        }
      );

      // .then((res) => {

      //   console.log("deleted successfully");
      //   navigate("/UploadDocument");
      // });
    } else {
      navigate("/UploadDocument");
    }
  }

  const dialogFuncMap = {
    displayBasic: setDisplayBasic,
    displayBasic1: setDisplayBasic1,
    displayBasic2: setDisplayBasic2,
    displayBasic3: setDisplayBasic3,
  };

  const onClick = (name, position) => {
    // console.log(position, "shivani.....");
    setKeyword(position);
    dialogFuncMap[`${name}`](true);
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Cancel"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-outlined"
        />
        <Button
          label="Submit"
          className="p-button-sm p-button-rounded p-button-danger"
          style={{
            backgroundColor: "#D04A02",
            borderRadius: "2px",
            color: "#FFF",
          }}
          onMouseDown={() => saveUser()}
          autoFocus
          disabled={isFormIncomplete}
        />
      </div>
    );
  };

  //   const cancel=()=>{
  // window.location.reload(false)
  //   }

  //withdraw document
  const DeleteFooter = (name) => {
    return (
      <div>
        <Button
          label="No"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
        />
        <Button
          label="Yes"
          style={{
            backgroundColor: "#D04A02",
            borderRadius: "2px",
            color: "#FFF",
          }}
          onMouseDown={() => deleteUser(docId)}
          // onMouseUp={Deletedoc}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          autoFocus
        />
      </div>
    );
  };

  const DraftDoc = (name) => {
    return (
      <div>
        <Button
          label="No"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
        />
        <Button
          label="Yes"
          style={{
            backgroundColor: "#D04A02",
            borderRadius: "2px",
            color: "#FFF",
          }}
          onMouseDown={SaveasDraft}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          autoFocus
        />
      </div>
    );
  };

  const isFormIncomplete = !keywords;

  function saveUser() {
    const version = "version1";
    setKeywords(null);

    const data = { keywords, createdBy };
    const apiUrl = `${process.env.REACT_APP_API_KEY}/document/saveKeywords/${docId}/${version}`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "The keyword was added successfully.",
          });
          getAllKeyword();
          onHide("displayBasic");
        } else {
          response.json().then((errorData) => {
            // console.log(errorData.developerMessage, "errordata");
            toast.current.show({
              severity: "error",
              summary: "Failed",
              detail:
                errorData.developerMessage ||
                "An error occurred during the adding keyword.",
            });
          });
        }
        getAllKeyword();
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail:
            "Failed to fetch. An error occurred during the adding keyword.",
        });
      });
    getAllKeyword();
  }

  const DeleteKeyword = () => {
    let data = { keyword, createdBy };
    const version = "version1";

    fetch(
      `${process.env.REACT_APP_API_KEY}/document/deleteKeywords/${docId}/${version}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => {
        if (response.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Delete Successful",
            detail: "The keyword was Deleted successfully.",
          });
          getAllKeyword();
        } else {
          toast.current.show({
            severity: "error",
            summary: "Delete Failed",
            detail: "An error occurred during the Delete Keyword.",
          });
        }
        getAllKeyword();
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Delete Failed",
          detail: "An error occurred during the Delete Keyword.",
        });
      });

    getAllKeyword();
  };

  //DELETE KEYWORD

  const deletekeyword = (name) => {
    return (
      <div>
        <Button
          label="No"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
        />
        &nbsp;&nbsp;
        <Button
          label="Yes"
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          style={{
            backgroundColor: "#D04A02",
            borderRadius: "2px",
            color: "#FFF",
          }}
          onMouseDown={() => DeleteKeyword()}
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };

  //document
  const getData = async (docId) => {
    const version = "version1";
    // axios
    //   .get(
    //     `${process.env.REACT_APP_API_KEY}/document/getallsectionsbydocid/${docId}/${version}`
    //   )

    //   .then((res) => {
    //     setSection(res.data);

    //     console.log(
    //       res.data,
    //       "data of sections///////////////////////////////"
    //     );
    //   });

    const data = {
      userName: sessionStorage.getItem("emailId"),
    };
    // console.log("data: ", data);
    fetch(
      `${process.env.REACT_APP_API_KEY}/document/getallsectionsbydocid/${docId}/${version}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((res) => {
      res.json().then((resp) => {
        // console.log(resp, "data of allsections");
        setSection(resp);
      });
    });
  };

  const save = async () => {
    navigate("/selectReviewer/" + docId);
    // console.log(docId, "shivani.//.///.///.//.//");
  };

  // const paginatorRight = () => {
  //   <div style={{ float: "right" }}>
  //   &nbsp;
  //   <Button
  //     label="Withdraw"
  //     style={{
  //       color: "#203570",
  //       borderRadius: "2px",

  //     }}
  //     onClick={() => onClick("displayBasic1")}
  //     onMouseDown={handleClick2}
  //     className={`text-black p-button-sm  ${
  //       changeColor2 === true ? "bg-blue-800 text-white" : "bg-white"
  //     }`}
  //   />
  //   <Dialog
  //     header="Withdraw Document ?"
  //     visible={displayBasic1}
  //     style={{ width: "40vw" }}
  //     footer={DeleteFooter("displayBasic1")}
  //     onHide={() => onHide("displayBasic1")}
  //   >
  //     <p>
  //       Are you sure you want to withdraw this document, you will lose all
  //       data saved to the system
  //     </p>
  //   </Dialog>
  //   &nbsp;

  //   <Dialog
  //     header="Save As Draft Document "
  //     visible={displayBasic2}
  //     style={{ width: "40vw" }}
  //     footer={DraftDoc("displayBasic2")}
  //     onHide={() => onHide("displayBasic2")}
  //   >
  //     <p>
  //       Are you sure you want to Save As Draft this Document?
  //     </p>
  //   </Dialog>
  //   <Button
  //     label="Save as Draft"
  //     style={{
  //       color: "#203570",
  //       borderRadius: "2px",

  //     }}
  //     onMouseDown={handleClick}
  //    onClick={() => onClick("displayBasic2")}
  //    className={`text-black p-button-sm  ${
  //       changeColor === true ? "bg-blue-800 text-white" : "bg-white"
  //     }`}
  //   />
  //   &nbsp;
  //   <Button
  //     label="Next"
  //     style={{
  //       color: "#203570",
  //       borderRadius: "2px",

  //     }}
  //     onClick={save}
  //     onMouseDown={handleClick1}
  //     className={`text-black p-button-sm  ${
  //       changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
  //     }`}
  //   ></Button>
  // </div>
  // }

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
    layout: "PrevPageLink CurrentPageReport NextPageLink ",
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

  const Navigate = () => {
    navigate("/UploadDocument");
  };

  return (
    <div>
      <Toast ref={toast} />
      {loading ? (
        <span className="loading">
          <ProgressSpinner />
        </span>
      ) : null}

      {/* <NavLink to="/UploadDocument" className="link1">
        <Button
          style={{ backgroundColor: "white", color: "black", height: "37px" }}
          className="p-button-raised  p-button p-button-secondary p-button-text"
        >
          <img
            style={{ width: "25px", marginRight: "10px", height: "25px" }}
            src={leftIcon}
            alt="leftIcon "
          />
          <b> Review Document</b>
        </Button>
      </NavLink>
      <img
        style={{ height: "55px", float: "right" }}
        src={Background}
        alt=" Background "
      /> */}

      {/* <br />
      <br /> */}

      {/* <img
        style={{ height: "70px", float: "right" }}
        src={Background}
        alt=" Background "
      /> */}

      <div style={{ display: "flex" }}>
        <img
          style={{
            width: "25px",
            marginRight: "10px",
            height: "25px",
            marginTop: "10px",
          }}
          src={leftIcon}
          alt="leftIcon "
          onClick={Navigate}
        />

        <b className="headerName" style={{ marginTop: "10px" }}>
          Review Document
        </b>
      </div>
      <br />
      <br />

      <Card style={{ height: "auto", paddingBottom: "2rem" }}>
        <Card
          style={{
            borderLeft: "8px solid #FFB600   ",
            backgroundColor: "#F3F3F3",
            borderRadius: "2px",
            // width: "100%",
            margin: "10px",
            height: "auto",
          }}
        >
          <Button
            style={{
              backgroundColor: "#F3F3F3",
              float: "right",
              color: "black",
              height: "auto",
            }}
            className=" p-button p-button-secondary p-button-text"
            onClick={() => onClick("displayBasic")}
          >
            <img
              style={{ width: "15px", marginRight: "5px", height: "15px" }}
              src={plus}
              alt="plus "
            />
            <p style={{ color: "#D04A02" }}> Add Keywords</p>
          </Button>
          <Dialog
            icon="pi pi-plus-circle"
            header="Add Keyword"
            visible={displayBasic}
            style={{ width: "25vw" }}
            footer={renderFooter("displayBasic")}
            onHide={() => onHide("displayBasic")}
          >
            <InputText
              type="text "
              style={{ width: "95%", borderRadius: "2px", height: "7vh" }}
              placeholder="Enter Keyword"
              onChange={(e) => {
                setKeywords(e.target.value);
              }}
            />
          </Dialog>
          <div style={{ color: "#2D2D2D" }}>
            <img
              style={{ marginRight: "10px", height: "20px", color: "#000000" }}
              src={Circleicon}
              alt="Circleicon"
            />
            <b>Identified Section Keywords</b>
          </div>
          <br />
          {users.map((keywords) => (
            <Tag
              style={{
                backgroundColor: "#d04a02",
                color: "white",
                marginRight: "3px",
                borderRadius: "12px",
                marginTop: "2px",
              }}
              icon="pi pi-times"
              onClick={() => onClick("displayBasic3", keywords)}
            >
              &nbsp;
              {keywords}
            </Tag>
          ))}
          &nbsp;
          <br />
          <br />
          <Dialog
            header="Delete Keyword ?"
            visible={displayBasic3}
            style={{ width: "30vw" }}
            footer={deletekeyword("displayBasic3")}
            onHide={() => onHide("displayBasic3")}
          >
            <p>Are you sure you want to delete this keyword ?</p>
          </Dialog>
          <img
            style={{ marginRight: "10px", height: "20px", color: "#000000" }}
            src={Section}
            alt="Section"
          />
          <b>Identified Section </b>
          <br />
          <br />
          <DataTable
            rowHover
            stripedRows
            paginator
            rows={rows1}
            // style={{borderRadius:"10px",border:"1px solid #FFB601"}}
            paginatorTemplate={template1}
            first={first1}
            onPage={onCustomPage1}
            value={section}

            // paginatorRight={paginatorRight}
          >
            {/* <Column field="sectionName"></Column> */}
            <Column
              field="sectionName"
              header="Section name"
              body={(section) => {
                const parts = section.sectionName.split(".docx");
                return (
                  <>
                    <span>{parts[0]}</span>
                  </>
                );
              }}
            ></Column>
          </DataTable>
        </Card>

        <div style={{ float: "right", marginTop: "1%" }}>
          &nbsp;
          <Button
            label="Withdraw"
            style={{
              color: "#D04A02",
              borderRadius: "4px",
            }}
            className="p-button-outlined p-button-sm"
            onClick={() => onClick("displayBasic1")}
            onMouseDown={handleClick2}
            // className={`text-black p-button-sm  ${
            //   changeColor2 === true ? "white text-white" : "bg-white"
            // }`}
          />
          <Dialog
            header="Withdraw Document ?"
            visible={displayBasic1}
            style={{ width: "40vw" }}
            footer={DeleteFooter("displayBasic1")}
            onHide={() => onHide("displayBasic1")}
          >
            <p>
              Are you sure you want to withdraw this document, you will lose all
              data saved to the system
            </p>
          </Dialog>
          &nbsp;
          {/* <Button label="Primary" className="p-button-outlined" /> */}
          <Dialog
            header="Save As Draft Document "
            visible={displayBasic2}
            style={{ width: "40vw" }}
            footer={DraftDoc("displayBasic2")}
            onHide={() => onHide("displayBasic2")}
          >
            <p>Are you sure you want to Save As Draft this Document?</p>
          </Dialog>
          <Button
            label="Save as Draft"
            style={{
              color: "#D04A02",
              borderRadius: "4px",
            }}
            onMouseDown={handleClick}
            className="p-button-outlined p-button-sm"
            onClick={() => onClick("displayBasic2")}
            //  className={`text-black p-button-sm  ${
            //     changeColor === true ? "bg-blue-800 text-white" : "bg-white"
            //   }`}
          />
          &nbsp;
          <Button
            label="Next"
            style={{
              color: "#D04A02",
              borderRadius: "4px",
              backgroundColor: "#D04A02",
              color: "white",
            }}
            onClick={save}
            onMouseDown={handleClick1}
            className="p-button-outlined p-button-sm"
            // className={`text-black p-button-sm  ${
            //   changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
            // }`}
          ></Button>
        </div>

        {/* 
  <div style={{ float: "right" }}>
    &nbsp;
    <Button
      label="Withdraw"
      style={{
        color: "#203570",
        borderRadius: "2px",
      
      }}
      onClick={() => onClick("displayBasic1")}
      onMouseDown={handleClick2}
      className={`text-black p-button-sm  ${
        changeColor2 === true ? "bg-blue-800 text-white" : "bg-white"
      }`}
    />
    <Dialog
      header="Withdraw Document ?"
      visible={displayBasic1}
      style={{ width: "40vw" }}
      footer={DeleteFooter("displayBasic1")}
      onHide={() => onHide("displayBasic1")}
    >
      <p>
        Are you sure you want to withdraw this document, you will lose all
        data saved to the system
      </p>
    </Dialog>
    &nbsp;

    <Dialog
      header="Save As Draft Document "
      visible={displayBasic2}
      style={{ width: "40vw" }}
      footer={DraftDoc("displayBasic2")}
      onHide={() => onHide("displayBasic2")}
    >
      <p>
        Are you sure you want to Save As Draft this Document?
      </p>
    </Dialog>
    <Button
      label="Save as Draft"
      style={{
        color: "#203570",
        borderRadius: "2px",
       
      }}
      onMouseDown={handleClick}
     onClick={() => onClick("displayBasic2")}
     className={`text-black p-button-sm  ${
        changeColor === true ? "bg-blue-800 text-white" : "bg-white"
      }`}
    />
    &nbsp;
    <Button
      label="Next"
      style={{
        color: "#203570",
        borderRadius: "2px",
     
      }}
      onClick={save}
      onMouseDown={handleClick1}
      className={`text-black p-button-sm  ${
        changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
      }`}
    ></Button>
  </div> */}
        <br />
      </Card>
    </div>
  );
};
export default Product;
