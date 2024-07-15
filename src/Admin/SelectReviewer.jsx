import React, { useRef } from "react";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import leftIcon from "../Assets/lefticon.png";
import Background from "../Assets/Background.png";

import axios from "axios";
function SelectReviewer() {
  const [reviwer, setemailId] = useState("");
  const { docId } = useParams();
  const [displayBasic1, setDisplayBasic1] = useState(false);
  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [isReviewer, isReviewerSet] = useState(Boolean);
  const [values, setValues] = useState([]);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor1, setChangeColor1] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const [createdBy, setLoginUser] = useState();

  const handleClick = () => {
    setChangeColor(!changeColor);
  };

  const handleClick1 = () => {
    setChangeColor1(!changeColor1);
  };
  const handleClick2 = () => {
    setChangeColor2(!changeColor2);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("refresh prevented");
  };

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
    axios
      .get(`${process.env.REACT_APP_API_KEY}/document`)
      .then((res) => {
        // console.log(res, "?????");

        const activeEmails = res.data.filter((item) => {
          // console.log(item.status, "?////////item ");
          if (item.status === "Active") {
            return item;
          }
        });
        setValues(activeEmails);
      })
      .catch((error) => {});

    axios
      .get(`${process.env.REACT_APP_API_KEY}/document/getDocById/${docId}`)
      .then((res) => {
        // console.log(res.data, "///////////////////////////shivanik");
        // setemailId(res.adata.reviewer)
        if (
          res.data.reviewer == "undefined" ||
          res.data.reviewer == undefined
        ) {
          // console.log("1");
          isReviewerSet(true);
        } else {
          // console.log("3");
          isReviewerSet(false);
          setemailId(res.data.reviewer);
        }
      });
  }, []);

  //SAVE AS DRAFT

  function SaveasDraft() {
    let data = {
      createdBy,
    };

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

  function navigateBack(docId) {
    navigate("/documentReview/" + docId);
    // console.log(docId, "edjhhhhhhhhhhhhhhhhhhhhhhh");
  }

  //DELETE
  //delete user
  function deleteUser(docId) {
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
            toast.current.show({
              severity: "warn",
              summary: "Document Not Deleted",
              detail: "Error while Deleted User",
              life: 2000,
            });
          }
        },
        (error) => {
          toast.current.show({
            severity: "error",
            summary: "Document Not Deleted",
            detail: "Error while Deleted User",
            life: 2000,
          });
        }
      );
    } else {
      navigate("/UploadDocument");
    }
  }

  const dialogFuncMap = {
    displayBasic1: setDisplayBasic1,
    displayBasic2: setDisplayBasic2,
  };

  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);

    if (position) {
      // setPosition(position);
    }
  };

  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  };

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
            borderRadius: "2px",
            backgroundColor: "#D04A02",
            color: "#fff",
          }}
          onMouseDown={() => deleteUser(docId)}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          autoFocus
        />
      </div>
    );
  };

  //SAVE AS DRAFT
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

  function setReviwer(mailId) {
    isReviewerSet(false);

    setemailId(mailId);
  }

  function saveUser(e) {
    // console.warn({ reviwer });
    let data = { docId, reviwer };
    // console.log(data, "all data");

    fetch(`${process.env.REACT_APP_API_KEY}/document/setReviwer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(
      (result) => {
        if (result.status === 200) {
          // console.warn("result...!!!", result);
          result.json().then((resp) => {
            // console.warn("resp", resp);
          });

          toast.current.show({
            severity: "success",
            summary: "Document Added",
            detail: "Document Added Successfully",
            life: 2000,
          });
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Document Not Added",
            detail: "Error while Adding Document",
            life: 2000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "DOcument Not Added",
          detail: "Error while Adding ",
          life: 2000,
        });
      }
    );
    setTimeout(() => {
      navigate("/dashboardMain");
    }, 3000);
  }

  return (
    <div>
      {/* <Button
        style={{ backgroundColor: "white", color: "black", height: "37px" }}
        className="p-button-raised  p-button p-button-secondary p-button-text"
        onClick={() => navigateBack(docId)}

      >
        <img
          style={{ width: "25px", marginRight: "10px", height: "25px" }}
          src={leftIcon}

          alt="leftIcon "
        />
        <b> Select Reviewer</b>
      </Button>

      <img
        style={{ height: "50px", float: "right" }}
        src={Background}
        alt=" Background "
      />

      <br />
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
          onClick={() => navigateBack(docId)}
        />

        <b className="headerName" style={{ marginTop: "10px" }}>
          {" "}
          Select Reviewer
        </b>
      </div>
      <br />
      <br />

      <Card style={{ height: "auto", paddingBottom: "2rem" }}>
        <Toast ref={toast} />
        <form onSubmit={onSubmit}>
          <Card
            style={{
              borderLeft: "8px solid #FFB600  ",
              backgroundColor: "#F3F3F3",
              width: "100%",
              height: "auto",
              borderRadius: "2px",
            }}
          >
            <label>Select Reviewer</label>
            <br />
            <br />
            <Dropdown
              style={{ width: "30%", borderRadius: "2px" }}
              value={reviwer}
              options={values}
              onChange={(e) => setReviwer(e.value)}
              optionLabel="emailId"
              optionValue="emailId"
              placeholder="Select"
            />
          </Card>
          <br />

          <div style={{ float: "right" }}>
            <Button
              label="Withdraw"
              style={{ color: "#D04A02", borderRadius: "2px" }}
              onClick={() => onClick("displayBasic1")}
              onMouseDown={handleClick}
              className="p-button-sm p-button-rounded p-button-danger p-button-outlined"

              // className={`text-black p-button-sm  ${changeColor === true ? "bg-blue-800 text-white" : "bg-white"
              //   }`}
            />
            <Dialog
              header="Withdraw Document ?"
              visible={displayBasic1}
              style={{ width: "40vw" }}
              footer={DeleteFooter("displayBasic1")}
              onHide={() => onHide("displayBasic1")}
            >
              <p>
                Are you sure you want to withdraw this document, you will lose
                all data saved to the system
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
              <p>Are you sure you want to save as draft this document?</p>
            </Dialog>
            <Button
              label="Save as Draft"
              style={{ color: "#D04A02", borderRadius: "2px" }}
              onMouseDown={handleClick1}
              onClick={() => onClick("displayBasic2")}
              className="p-button-sm p-button-rounded p-button-danger p-button-outlined"

              //  className={`text-black p-button-sm  ${changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
              //   }`}
            />
            &nbsp;
            <Button
              type="button"
              onClick={saveUser}
              style={{ backgroundColor: "#d04a02", borderRadius: "2px",color:'white' }}
              onMouseDown={handleClick2}
              className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
              // className={`text-black p-button-sm  ${changeColor2 === true ? "bg-blue-800 text-white" : "bg-white"
              //   }`}
              label="Submit"
              disabled={isReviewer}
            />
            &nbsp;
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SelectReviewer;
