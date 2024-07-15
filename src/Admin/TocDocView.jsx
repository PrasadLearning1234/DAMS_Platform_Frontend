import React, { useState, useEffect, useRef } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import axios from "axios";
import { Button } from "primereact/button";
import Background from "../Assets/Background.png";
import { Card } from "primereact/card";
import { ScrollPanel } from "primereact/scrollpanel";
import { Badge } from "primereact/badge";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { ProgressSpinner } from "primereact/progressspinner";
import document from "../Assets/document.png";
import plus from "../Assets/plus.png";
import Tooltip from "react-tooltip";
import DOMPurify from "dompurify";
const TreeTableDemo = () => {
  const [nodes, setNodes] = useState([]);
  const [docView, setDocViewData] = useState([]);
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor1, setChangeColor1] = useState(false);

  const [notes, setNotes] = useState("");
  const [notesid, SetNotesId] = useState("");
  const [secId, setSecId] = useState("");
  const [docId, setDocId] = useState("");
  const [secBookmark, setsecBookmark] = useState();
  const toast = useRef(null);
  const [position, setPosition] = useState("center");
  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [displayBasic6, setDisplayBasic6] = useState(false);
  const [displayBasic4, setDisplayBasic4] = useState(false);
  const [displayBasic5, setDisplayBasic5] = useState(false);
  const [allnotes, setAllNotes] = useState([]);
  const [data, setData] = useState([]);
  const [docName, setDocName] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [createdBy, setLoginUser] = useState();
  const [userName, setUserName] = useState("");

  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const handleClick = () => {
    setNotes('');
    setChangeColor(!changeColor);
  };
  const handleClick1 = () => {
    setChangeColor1(!changeColor1);
  };

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
    setUserName(sessionStorage.getItem("emailId"));
    getAllTreeLevelSection();
  }, [secBookmark]);

  const getAllTreeLevelSection = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_KEY}/document/getTreeLevel`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(sessionStorage.getItem("emailId")),
    }).then((res) => {
      res.json().then((resp) => {
        // console.warn("resp", resp);
        // console.log("All tree-sections", JSON.stringify(resp));

        // const sortedData = resp.sort((a, b) => {
        //   const nameA = a.data.headerText.toLowerCase();
        //   const nameB = b.data.headerText.toLowerCase();
        //   if (nameA < nameB) {
        //     return -1;
        //   }
        //   if (nameA > nameB) {
        //     return 1;
        //   }
        //   return 0; // names must be equal
        // });

        const sortedData = resp.sort((a, b) => {
          // const nameA = a.data.headerText.toLowerCase();
          // const nameB = b.data.headerText.toLowerCase();
          const nameA =
            (a.data.headerText && a.data.headerText.toLowerCase()) || "";
          const nameB =
            (b.data.headerText && b.data.headerText.toLowerCase()) || "";

          // Check if both names are numeric
          const isANumeric = !isNaN(parseFloat(nameA)) && isFinite(nameA);
          const isBNumeric = !isNaN(parseFloat(nameB)) && isFinite(nameB);

          // If both are numeric, compare as numbers
          if (isANumeric && isBNumeric) {
            return parseFloat(nameA) - parseFloat(nameB);
          }

          // If only one is numeric, it comes after
          if (isANumeric && !isBNumeric) {
            return 1;
          }
          if (!isANumeric && isBNumeric) {
            return -1;
          }

          // If both are non-numeric, compare as strings
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0; // names must be equal
        });
        // console.log(sortedData, "sort data");
        setNodes(sortedData, secId);
        setLoading(false);
      });
    });
  };

  const onRowClick = (event) => {
    // console.log(event, "event");
    setIsClicked(true);
    setSecId(event.node.data.secId);
    setDocId(event.node.data.docId);
    const emailId = sessionStorage.getItem("emailId");
    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/getHtmlContains/${event.node.data.secId}/${emailId}`
      )
      .then((res) => {
        // console.log("All tree-sections//", res.data.data);
        // console.log("All tree-sections//", res.data.bookmarks);
        setsecBookmark(res.data.bookmarks);
        console.log("html cpntent: ", res.data.data);
        setDocViewData(DOMPurify.sanitize(res.data.data));
        setDocName(res.data.docName);
      });
  };
  const onRowClickNotes = (event) => {
    // console.log(event, "event");
    setIsClicked(true);
    setSecId(event.node.data.secId);
    setDocId(event.node.data.docId);
    const emailId = sessionStorage.getItem("emailId");
    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/getHtmlContains/${event.node.data.secId}/${emailId}`
      )
      .then((res) => {
        // console.log("All tree-sections//", res.data.data);
        // console.log("All tree-sections//", res.data.bookmarks);
        setsecBookmark(res.data.bookmarks);
        setDocViewData(DOMPurify.sanitize(res.data.data));
        setDocName(res.data.docName);
      });
  };

  function getBookmarkRefresh(secId) {
    const emailId = sessionStorage.getItem("emailId");
    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/getHtmlContains/${secId}/${emailId}`
      )
      .then((res) => {
        // console.log("All tree-sections//", res.data);
        // console.log("All tree-sections//", res.data.bookmarks);
        setsecBookmark(res.data.bookmarks);
        setDocViewData(DOMPurify.sanitize(res.data.data));
        setDocName(res.data.docName);
      });
  }

  const isFormIncomplete = notes.trim().length === 0;
  function saveUser() {
    setNotes('');
    // console.warn({ notes });
    let data = { secId, notes, createdBy, userName };
    // console.log(data, "all data");
    fetch(`${process.env.REACT_APP_API_KEY}/dam/notes/`, {
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
            summary: "Note Added",
            detail: "Note Added Successfully",
            life: 2000,
          });

          AllNotes();
          getAllTreeLevelSection();
          inputRef.current.value = "";
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Note Not Added",
            detail: "Error while Adding Note",
            life: 2000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Note Not Added",
          detail: "Error while Adding Note",
          life: 2000,
        });
      }
    );
  }
  const dialogFuncMapForView = {
    displayBasic6: setDisplayBasic6,
  };
  const dialogFuncMap = {
    displayBasic2: setDisplayBasic2,
    displayBasic4: setDisplayBasic4,
    displayBasic5: setDisplayBasic5,
  };

  const onClick = (name, position) => {
    AllNotes(position);
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onDelete = (name, value) => {
    SetNotesId(value.id);

    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onEdit = (name, value1) => {
    SetNotesId(value1.id);
    setNotes(value1.notes);
    dialogFuncMap[`${name}`](true);

    if (position) {
      setPosition(position);
    }
  };

  const onHide = (name) => {
    // console.log(name,'name');
    dialogFuncMap[`${name}`](false);
  };
  const onHideView = (name) => {
    // console.log(name,'name');
    dialogFuncMapForView[`${name}`](false);
  };

  const filterData = (allData) => {
    // console.log(allData, "value");
    const emailId = sessionStorage.getItem("emailId");
    const filteredData = allData.filter((data) => data.createdBy === emailId);
    // console.log(filteredData, "filteredData ");

    setAllNotes(filteredData);
  };

  function AllNotes() {
    // console.log(position,"???????????????")
    fetch(
      `${
        process.env.REACT_APP_API_KEY
      }/dam/notes/${secId}/${sessionStorage.getItem("emailId")}`
    )
      .then((res) => {
        // console.log(res, "/////////AlllNotes");
        return res.json();
      })
      .then((resp) => {
        filterData(resp);
        // console.log(resp[0].createdBy, "//notesid");

        setData(resp);
      })
      .catch((err) => {
        // console.log(err.message);
      });
  }

  function deleteNotes(name) {
    // console.log(name,'name delete');
    let item = {
      createdBy,
      userName,
    };

    // console.warn("item", item);
    fetch(`${process.env.REACT_APP_API_KEY}/dam/notes/deleteById/${notesid}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then(
      (result) => {
        if (result.status === 200) {
          // console.warn("result...!!!", result);
          result.json().then((resp) => {
            // console.warn("resp", resp);
          });
          AllNotes();
          getAllTreeLevelSection();

          toast.current.show({
            severity: "success",
            summary: "Note Deleted",
            detail: "Note Deleted Successfully",
            life: 2000,
          });
          dialogFuncMap[`${name}`](false);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Note Not Deleted",
            detail: "Error while Deleting Note",
            life: 2000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "warn",
          summary: "Note Not Deleted",
          detail: "Error while Deleting Note",
          life: 2000,
        });
      }
    );
  }

  //DELETE PARTICULAR NOTES
  const Delete = (name) => {
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
          onMouseDown={() => deleteNotes("displayBasic2", secId)}
          onClick={() => onHide(name)}
          autoFocus
        />
      </div>
    );
  };

  const headerName = () => {
    return <>{docName}</>;
  };

  function update() {
    let item = {
      notes,
      createdBy,
      userName,
    };

    fetch(`${process.env.REACT_APP_API_KEY}/dam/notes/${notesid}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then(
      (result) => {
        if (result.status === 200) {
          // console.warn("result...!!!", result);
          result.json().then((resp) => {
            // console.warn("resp", resp);
          });

          toast.current.show({
            severity: "success",
            summary: "Note Edited",
            detail: "Note Edited Successfully",
            life: 6000,
          });
          setNotes('');
          AllNotes();
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Note Not Edited",
            detail: "Error while Editing Note",
            life: 6000,
          });
        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Note Not Edited",
          detail: "Error while Editing Note",
          life: 6000,
        });
      }
    );
  }

  //bookmark

  function BookmarkSection(state) {
    setsecBookmark(state);
    // console.log(secId, "bookmarks ????????????");
    // console.log(state, "bookmarks ????????????");
    // console.log(sessionStorage.getItem("emailId"), "email ????????????");
    const version = "version1";
    const data = {
      bookmarks: state,
      createdBy,
      docId: docId,
    };

    fetch(
      `${process.env.REACT_APP_API_KEY}/document/setSectionBookmark/${secId}/${version}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then(
      (result) => {
        // console.log(result, "?????");
        if (result.status === 200) {
          result.json().then((response) => {
            // console.warn("resp", response);
          });
          // console.log("bookmark: ", bookmark);
          if (state === "true") {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Bookmark added successfully.",
            });
            getBookmarkRefresh(secId);
          } else if (state === "false") {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Bookmark removed successfully.",
            });
          }
          getBookmarkRefresh(secId);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Section Not Bookmarked ",
            detail: "Error while Bookmarking Section",
            life: 2000,
          });
        }
        getBookmarkRefresh(secId);
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Section Not Bookmarked ",
          detail: "Error while Bookmarking Section",
          life: 2000,
        });
      }
    );
  }

  const renderFooter = (name) => {
    return (
      <div style={{ marginTop: "-4%", marginRight: "4%" }}>
        <Button
          label="Cancel"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onMouseDown={handleClick}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          // className={`text-black p-button-sm  ${
          //   changeColor === true ? "bg-blue-800 text-white" : "bg-white"
          // }`}
          onClick={() => onHide(name)}
        />
        <Button
          style={{
            float: "right",
            backgroundColor: "#D04A02",
            color: "#FFF",
            borderRadius: "2px",
          }}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          // className={`text-black p-button-sm  ${
          //   changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
          // }`}
          label="Update"
          onMouseDown={() => update()}
          onMouseUp={handleClick1}
          onClick={() => onHide(name)}
          disabled={isFormIncomplete}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <Toast ref={toast} />
      {loading ? (
        <span className="loading">
          <ProgressSpinner />
        </span>
      ) : null}

      {/* <Button
        style={{ backgroundColor: "white", color: "black", height: "35px" }}
        className="p-button-raised p-button p-button-secondary p-button-text"
        icon="pi pi-book"
      >
        &nbsp;&nbsp; <b>Financial Manuals</b>
      </Button>

      <img
        style={{ height: "53px", float: "right" }}
        src={Background}
        alt=" Background "
      />
      <br />
      <br /> */}

      <Card style={{ height: "auto" }}>
        <div
          style={{ display: "flex" }}
          // className="p-button-text p-button-plain p-button"
        >
          <img
            style={{ width: "16px", marginRight: "10px", height: "20px" }}
            src={document}
            alt="  document  "
          />
          <b style={{ fontSize: "18px", marginTop: "2px" }}>
            Table of contents{" "}
          </b>
        </div>
        <br />
        <Splitter style={{ borderRadius: "2px" }}>
          <SplitterPanel size={2}>
            <TreeTable
              scrollable
              scrollHeight="60vh"
              value={nodes}
              // loading={loading}
              onRowClick={(e) => onRowClick(e)}
            >
              <Column
                //  style={{ padding: "10px !important" }}
                field="headerText"
                expander
                body={(node) => (
                  <>
                    {/* <span className="spanStyleClass" >
                    {node.data.headerText}{" "}
                  </span> */}
                    <span
                      className="spanStyleClass"
                      title={node.data.headerText}
                    >
                      {node.data.headerText?.split(":")}
                    </span>

                    {node.data.notesCounts > 0 && (
                      <Badge
                        style={{ backgroundColor: "#d04a02" }}
                        value={node.data.notesCounts}
                        className="mr-2"
                      ></Badge>
                    )}
                    {/* <Tooltip
                      id={`tooltip-${node.data.headerText}`} // Match the ID used in data-for
                      effect="solid"
                      place="bottom"
                    /> */}
                  </>
                )}
              />
            </TreeTable>
          </SplitterPanel>

          <SplitterPanel style={{ marginLeft: "10px" }}>
            <ScrollPanel style={{ height: "60vh" }}>
              <Dialog
                header={headerName}
                visible={displayBasic2}
                style={{ width: "60vw" }}
                // footer={Footer('displayBasic2')}
                onHide={() => onHide("displayBasic2")}
              >
                <div class="grid">
                  <div class="col-12">
                    <Dialog
                      header="Delete Note"
                      visible={displayBasic4}
                      style={{ width: "27vw" }}
                      footer={Delete("displayBasic4", data)}
                      onHide={() => onHide("displayBasic4")}
                    >
                      <p>Are you sure you want to delete particular notes ?</p>
                    </Dialog>

                    <Dialog
                      header="Edit Notes"
                      visible={displayBasic5}
                      style={{ width: "35vw", fontsize: "14px" }}
                      footer={renderFooter("displayBasic5", data)}
                      onHide={() => onHide("displayBasic5")}
                    >
                      <InputTextarea
                        type="text "
                        value={notes !== null ? notes : ""}
                        onChange={(e) => {
                          setNotes(e.target.value);
                        }}
                        style={{ borderRadius: "2px" }}
                        rows={8}
                        cols={42}
                      />
                    </Dialog>

                    <ScrollPanel style={{ width: "100%", height: "350px" }}>
                      {data.length > 0 ? (
                        <div value={allnotes}>
                          {allnotes.map((data) => (
                            <div key={data.id}>
                              <br />

                              <Card
                                style={{
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "2px",
                                }}
                              >
                                <div class="grid">
                                  <div class="col-10">
                                    <div style={{ fontSize: "14px" }}>
                                      {new Intl.DateTimeFormat("en-IN", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }).format(data.createdOn)}
                                    </div>
                                  </div>
                                  <div
                                    style={{ display: "flex" }}
                                    class="col-2"
                                  >
                                    <Button
                                      className=" p-button-text"
                                      style={{
                                        height: "20px",
                                        width: "20px",
                                        marginLeft: "50px",
                                        color: "black",
                                      }}
                                      icon="pi pi-pencil"
                                      onClick={() =>
                                        onEdit("displayBasic5", data)
                                      }
                                    />
                                    &nbsp;&nbsp;
                                    <Button
                                      style={{
                                        height: "20px",
                                        float: "right",
                                        width: "20px",
                                        color: "black",
                                      }}
                                      icon="pi pi-trash"
                                      onClick={() =>
                                        onDelete("displayBasic4", data)
                                      }
                                      className=" p-button-text"
                                    />
                                  </div>

                                  <div class="col-12">
                                    <p style={{ color: "black" }}>
                                      {data.notes}
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </ScrollPanel>
                  </div>

                  <div class="col-12">
                    <div>
                      <div style={{ display: "flex" }}>
                        <InputText
                          style={{
                            width: "80%",
                            borderRadius: "2px",
                            border: "1px solid #D04A02",
                            height: "2rem",
                            verticalAlign: "middle",
                          }}
                          ref={inputRef}
                          // value={notes}
                          type="text "
                          placeholder="Add Notes here..."
                          onChange={(e) => {
                            setNotes(e.target.value);
                          }}
                        />

                        <Button
                          style={{
                            borderRadius: "2px",
                            backgroundColor: "#D04A02",
                            marginLeft: "4%",
                            height: "2rem",
                            width: "fit-content",
                            padding: "10px 10px",
                          }}
                          label="Add Notes"
                          disabled={isFormIncomplete}
                          onClick={saveUser}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog>

              <div style={{ marginTop: "1rem" }}>
                {isClicked && (
                  <>
                    {/* <span
                      style={{
                        marginLeft: "44rem",
                        top:'1rem'
                        
                      }}
                    >
                      <Button
                        visible={!secBookmark}
                        style={{
                          backgroundColor: "white",
                          height: "20px",
                          width: "20px",
                          color: "#D04A02",
                        }}
                        icon="pi pi-bookmark"
                        tooltip="Bookmark "
                        tooltipOptions={{
                          className: "teal-tooltip",
                          position: "bottom",
                        }}
                        className="p-button-text"
                        onClick={() => BookmarkSection("true")}
                      />
                      <Button
                        visible={secBookmark}
                        style={{
                          backgroundColor: "white",
                          height: "20px",
                          width: "20px",
                          color: "#D04A02",
                        }}
                        tooltip="Bookmark "
                        tooltipOptions={{
                          className: "teal-tooltip",
                          position: "bottom",
                        }}
                        icon="pi pi-bookmark-fill"
                        className=" p-button-text"
                        onClick={() => {
                          BookmarkSection("false");
                        }}
                      />{" "}
                    </span> */}
                    &nbsp;
                    <Button
                      label=" Notes"
                      style={{
                        borderRadius: "4px",
                        float: "right",
                        backgroundColor: "#D04A02",
                        marginTop: "0rem",
                        color: "#fff",
                      }}
                      className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
                      onClick={() => onClick("displayBasic2", secId)}
                    />
                    <Button
                      visible={secBookmark}
                      style={{
                        borderRadius: "4px",
                        float: "right",
                        backgroundColor: "white",
                        marginTop: "0rem",
                        border: "1px solid #D04A02",
                        height: "1.9rem",
                        color: "#D04A02",
                      }}
                      tooltip="Bookmark "
                      tooltipOptions={{
                        className: "teal-tooltip",
                        position: "bottom",
                      }}
                      icon="pi pi-bookmark-fill"
                      className=" p-button-text"
                      onClick={() => {
                        BookmarkSection("false");
                      }}
                    />
                    &nbsp; &nbsp;
                    <Button
                      visible={!secBookmark}
                      style={{
                        borderRadius: "4px",
                        float: "right",
                        backgroundColor: "white",
                        border: "1px solid #D04A02",
                        marginTop: "0rem",
                        color: "#D04A02",
                        height: "1.9rem",
                      }}
                      icon="pi pi-bookmark"
                      tooltip="Bookmark "
                      tooltipOptions={{
                        className: "teal-tooltip",
                        position: "bottom",
                      }}
                      className="p-button-text"
                      onClick={() => BookmarkSection("true")}
                    ></Button>
                    &nbsp;
                    <br />
                    <br />
                    <hr />
                  </>
                )}
                {/* {isClicked && !secBookmark && (
                  <>
                    <span
                      style={{
                        margin: "1rem  0 0 45.5rem ",
                        top: "1rem",
                        bottom: "1rem",
                      }}
                    >
                      <Button
                        visible={!secBookmark}
                        style={{
                          backgroundColor: "white",
                          height: "20px",
                          width: "20px",
                          color: "#D04A02",
                          padding: ".8rem",
                          color: "#D04A02",
                          border: "1px solid #D04A02 ",
                        }}
                        icon="pi pi-bookmark"
                        tooltip="Bookmark "
                        tooltipOptions={{
                          className: "teal-tooltip",
                          position: "bottom",
                        }}
                        className="p-button-text"
                        onClick={() => BookmarkSection("true")}
                      />
                      {" "}
                    </span>
                    <br />
                    <br />
                    <hr />
                  </>
                )}
                {isClicked && secBookmark && (
                  <>
                    <span
                      style={{
                        margin: "1rem  0 0 45.5rem ",
                        top: "1rem",
                        bottom: "1rem",
                      }}
                    >
                     
                      <Button
                        visible={secBookmark}
                        style={{
                          backgroundColor: "white",
                          height: "16px",
                          width: "16px",
                          color: "#D04A02",
                          padding: ".8rem",
                          border: "1px solid #D04A02",
                        }}
                        tooltip="Bookmark "
                        tooltipOptions={{
                          className: "teal-tooltip",
                          position: "bottom",
                        }}
                        icon="pi pi-bookmark-fill"
                        className=" p-button-text"
                        onClick={() => {
                          BookmarkSection("false");
                        }}
                      />{" "}
                    </span>
                    <br />
                    <br />
                    <hr />
                  </>
                )} */}
              </div>

              <span
                style={{
                  whiteSpace: "pre-line",
                  marginLeft: "5rem",
                  zoom: "70%",
                }}
                className="tocview"
                dangerouslySetInnerHTML={{ __html: docView }}
              />
            </ScrollPanel>
          </SplitterPanel>
        </Splitter>
      </Card>

      <Dialog
        visible={displayBasic6}
        style={{ width: "80vw", margin: "1rem" }}
        onHide={() => onHideView("displayBasic6")}
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
    </div>
  );
};

export default TreeTableDemo;
