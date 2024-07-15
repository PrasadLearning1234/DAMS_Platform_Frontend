import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import leftIcon from "../Assets/lefticon.png";
import Background from "../Assets/Background.png";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import plus from "../Assets/plus.png";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import Circleicon from "../Assets/Circleicon.png";
import Section from "../Assets/Section.png";
import { Ripple } from "primereact/ripple";
import DOMPurify from "dompurify";
const Product = () => {
  let [bookmarks, setBookmarks] = useState(Boolean);
  let [changeText, setChangeText] = useState(Boolean);
  const [section, setSection] = useState([]);
  let [changeEnable, setChangeEnable] = useState(Boolean);
  let [Approved, setApproved] = useState(Boolean);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayBasic6, setDisplayBasic6] = useState(false);
  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [displayBasic3, setDisplayBasic3] = useState(false);
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const { id } = useParams();
  const [version, setversion] = useState([]);
  const [values, setValues] = useState([]);
  const [file, setFile] = useState();
  const [versiondata, setVersionData] = useState('version1');
  const [seectionFileName, setSectionFile] = useState();
  const [fileName, setFileName] = useState();
  const toast = useRef(null);
  const [errors, setErrors] = useState({});
  const [keywords, setKeywords] = useState("");
  const [users, setUser] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [secId, updatedSetsecId] = useState();
  const [documentName, setDocumentName] = useState();
  const [loading, setLoading] = useState(true);
  const [upladedBy, setLoginUser] = useState();
  const [createdBy, setLoginUser1] = useState();
  const [rows1, setRows1] = useState(4);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [keywordAddedSuccess, setKeywordAddedSuccessfully] = useState();
  const fileInputRef = useRef(null);
  const fileInputRefs = useRef(null);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );
  // const [disablebutton, setDisablebutton] = useState(false);
  const navigate = useNavigate();

  const [bookmarkValue] = useState("true");

  const [unBookmarkValue] = useState("false");

  const handleClick = () => {
    setChangeColor(!changeColor);
  };

  const handleClick2 = () => {
    setChangeColor2(!changeColor2);
  };

  //DOWNLOAD

  const DOC_FILE_URL = `${process.env.REACT_APP_API_KEY}/document/downloadFile/${id}/${versiondata}/${createdBy}`;
  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
    setLoginUser1(sessionStorage.getItem("emailId"));

    const version = "version1";
    setVersionData(version);
    getData(id);

    getAllDocument();

    getAllkeyword();
    getAllDocumentBookmark();
    getAllSectionBookmark();
    // getDocDataByDocId();
    getAllVersion();
  }, []);

  const getAllDocument = () => {
    // get all data by doc id
    axios
      .get(`${process.env.REACT_APP_API_KEY}/document/getDocById/${id}`)
      .then((res) => {
        // console.log(res.data, "document data1234//////nnnn");
        // setDocumentName(res.data.documentName);
        setApproved(res.data.Approved);
        setChangeEnable(res.data.enable);

        // console.log(changeText, "bookmarked....!!!!");
      });


      axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/listKeywords/${id}/version1`
      )
      .then((res) => {
        
        setDocumentName(res.data[0].documentName);
      
      })

  };

  const getAllVersion = () => {
    // get all version by doc id
    axios
  .get(
    `${process.env.REACT_APP_API_KEY}/document/getAllDocVersionsByDocId/${id}`
  )
  .then((res) => {
    // console.log(res.data, "version data");
    const sortedData = res.data
      .sort((a, b) => {
        const versionA = parseInt(a.version.match(/\d+/)[0]); // Extract numeric part and parse as integer
        const versionB = parseInt(b.version.match(/\d+/)[0]); // Extract numeric part and parse as integer
        return versionA - versionB;
      });
    setValues(sortedData);
  });
  };

  const getAllSectionBookmark = () => {
    // get all sections by doc id
    const version = "version1";
    const data = {
      userName: sessionStorage.getItem("emailId"),
    };
    // console.log("data: ", data);
    fetch(
      `${process.env.REACT_APP_API_KEY}/document/getallsectionsbydocid/${id}/${versiondata}`,
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

  const getAllDocumentBookmark = () => {
    // get bookmark by docId

    const version = versiondata;
    const obj = {
      createdBy: sessionStorage.getItem("emailId"),
      version: versiondata,
    };
    // console.log("data1...: ", obj);

    


    fetch(`${process.env.REACT_APP_API_KEY}/document/BookmarksListt/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }).then((res) => {
      res.json().then((resp) => {
        // console.log(resp, "data of bookmark by doc id");
        setBookmarks(resp.bookmarks);
        setChangeText(resp.bookmarks);
      });
    });
  };

  const getAllkeyword = () => {
    // get all keywords by doc id
    const version = "version1";

    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/listKeywords/${id}/${version}`
      )
      .then((res) => {
        // console.log(res.data[0].documentName, "document keyword");
        setDocumentName(res.data[0].documentName);
        setUser(res.data[0].keywords);
        
      });
  };
  const getAllkeyword1 = (version) => {
    // get all keywords by doc id
    // const version = "version1";

    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/listKeywords/${id}/${version}`
      )
      .then((res) => {

        setChangeEnable(res.data[0].enable)
      });
  };

  function getDocDataByDocId(data) {
    // console.log(data, "////////////////////vijaya");
    setVersionData(data);

    const data1 = {
      userName: sessionStorage.getItem("emailId"),
    };
    // console.log("data: ", data);
    fetch(
      `${process.env.REACT_APP_API_KEY}/document/getallsectionsbydocid/${id}/${data}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data1),
      }
    ).then((res) => {
      // console.log("reponse:..=> ",res);
      res.json().then((resp) => {
        // console.log(resp, "data of allsections");
        setSection(resp);
      });
    });
  }

  //DOCUMENT BOOKMARK
  function bookmark(e, bookmark) {
    // console.log(e, "././//.........", bookmark);
    const data = {
      bookmarks: bookmark,
      createdBy,
    };
    fetch(
      `${process.env.REACT_APP_API_KEY}/document/setBookmark/${id}/${versiondata}`,
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
          if (bookmark === "true") {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Bookmark added successfully.",
            });
            getAllDocumentBookmark();
          } else if (bookmark === "false") {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Bookmark removed successfully.",
            });
          }
          getAllDocumentBookmark();
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Document Not Bookmarked ",
            detail: "Error while Bookmarking Document",
            life: 2000,
          });
        }
        getAllDocumentBookmark();
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Document Not Bookmarked ",
          detail: "Error while Bookmarking Document",
          life: 2000,
        });
      }
    );
  }

  function BookmarkSection(rowData, bookmark) {
    
    // console.log(rowData, "bookmarks ????????????");

    const data = {
      bookmarks: bookmark,
      createdBy,
      docId: id,
    };

    fetch(
      `${process.env.REACT_APP_API_KEY}/document/setSectionBookmark/${rowData.secId}/${versiondata}`,
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
          if (bookmark === "true") {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Bookmark added successfully.",
            });
            getAllSectionBookmark();
          } else if (bookmark === "false") {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Bookmark removed successfully.",
            });
          }
          getAllSectionBookmark();
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Section Not Bookmarked ",
            detail: "Error while Bookmarking Section",
            life: 2000,
          });
        }
        getAllSectionBookmark();
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

  const getData = async (id) => {
    // console.log(id, "inside");
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

  const docDownload = () => {
    toast.current.show({
      severity: "success",
      summary: "Document Download Successfully",
      detail: "Document Download",
      life: 3000,
    });
  };

  //SECTION DOWNLOAD
  const downloadSectionURL = (rowData) => {
    const url = `${process.env.REACT_APP_API_KEY}/document/downloadSec/${rowData.secId}/${createdBy}`;

    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    const sanitizedUrl = DOMPurify.sanitize(url);
    aTag.href = sanitizedUrl;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  const secDownload = () => {
    toast.current.show({
      severity: "success",
      summary: "Section Download Successfully",
      detail: "Section Download",
      life: 3000,
    });
  };

  const enable = () => {
    toast.current.show({
      severity: "success",
      summary: "Document Enabled Successfully",
      detail: "Document Enabled",
      life: 3000,
    });
  };

  const disable = () => {
    toast.current.show({
      severity: "success",
      summary: "Document Disabled Successfully",
      detail: "Document Disabled",
      life: 3000,
    });
  };

  const docUpload = () => {};

  const dialogFuncMap = {
    displayBasic2: setDisplayBasic2,
    displayBasic6: setDisplayBasic6,

    displayBasic: setDisplayBasic,
    displayBasic3: setDisplayBasic3,
  };

  const onClick = (name, position) => {
    setKeyword(position);

    dialogFuncMap[`${name}`](true);
  };

  const onDialog = (name, position) => {
    updatedSetsecId(position.secId);

    dialogFuncMap[`${name}`](true);
  };

  const onHide = (name) => {
    handleDelete();
    handleDelete1();
    dialogFuncMap[`${name}`](false);
  };

  //DOCUMENT UPLOAD

  const documentUpload = (name) => {
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
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          style={{
            borderRadius: "2px",
            backgroundColor: "#D04A02",
            color: "#FFF",
          }}
          onClick={() => onHide(name)}
          onMouseDown={versionUpload}
          disabled={isVersioncomplete}
          onMouseUp={docUpload}
          autoFocus
        />
      </div>
    );
  };

  //SECTION UPLOAD

  const sectionupload = (name) => {
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
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          style={{
            borderRadius: "2px",
            backgroundColor: "#D04A02",
            color: "#FFF",
          }}
          onClick={() => onHide(name)}
          disabled={requiredfile}
          onMouseDown={handleSubmit}
          // onMouseUp={secUpload}
          autoFocus
        />
      </div>
    );
  };

  function onSelectVersion(rowData) {
    // console.log("rowData:", rowData);
    setVersionData(rowData);
    // getAllkeyword1()
    getDocDataByDocId(rowData);
    // getAllDocumentBookmark();
    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/document/listKeywords/${id}/${rowData}`
      )
      .then((res) => {
        // console.log("res.data[0]: ", res.data[0]);
        if (res.data[0].keywords) {
          setUser(res.data[0].keywords);
        }
        setChangeEnable(res.data[0].enable);
        // setChangeText(res.data[0].bookmarks);
        // setDocumentName(res.data[0].documentName);
        // console.log("res.data.enable: ", res.data[0]);



        

        const obj = {
          createdBy: sessionStorage.getItem("emailId"),
          version: rowData,
        };

        fetch(`${process.env.REACT_APP_API_KEY}/document/BookmarksListt/${id}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        }).then((res) => {
          res.json().then((resp) => {
            // console.log(resp, "data of bookmark by doc id");
            setBookmarks(resp.bookmarks);
            setChangeText(resp.bookmarks);
          });
        });
      });
  }

  //SECTION UPDATE

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!file) {
      errors.file = "This Filed is required. ";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const requiredfile = !file;
  function Documentupload(event) {
    const allowedFileTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]; // Allow only Word files
    const selectedFile = event.target.files[0];

    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setSectionFile(selectedFile.name);
    } else {
      alert("Only .docx files are allowed.");
      event.target.value = null;
      return; // Add this return statement to prevent further execution
    }
    setFile(event.target.files[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (validateForm()) {
      // console.log("Valid form submitted:", { file });
    }

    setFile(null);
  
    const url = `${process.env.REACT_APP_API_KEY}/document/updateSec`;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("docId", id);
    formData.append("secId", secId);
    formData.append("upladedBy", upladedBy);

    axios
      .put(url, formData)
      .then((response) => {
        if (response.status === 200) {
          // Show success message popup
          toast.current.show({
            severity: "success",
            summary: "Updated Successful",
            detail: "The file was updated successfully.",
          });
          dialogFuncMap[`${"displayBasic6"}`](false);
          setSectionFile(null)
          getAllSectionBookmark();
        } else {
          // Show error message popup
          toast.current.show({
            severity: "error",
            summary: "Update Failed",
            detail: "An error occurred during the file Update.",
          });
        }
        getAllSectionBookmark();
      })
      .catch((error) => {
        // Show error message popup
        toast.current.show({
          severity: "error",
          summary: "Upload Failed",
          detail: "An error occurred during the file Update.",
        });
      });
    getAllSectionBookmark();
  }
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
  
    handleFile(file,event);
  };
  const handleDragOver1 = (event) => {
    event.preventDefault();
  };

  const handleDrop1 = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
  
    handleFile1(file,event);
  };
  const handleFile = (file,event) => {
    if (file) {
      if (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFileName(file.name);
        const selectedFile = event.dataTransfer.files[0];
        setFile(selectedFile);
        setErrors({});
      } else {
        setErrors({ file: "Only .doc and .docx files are allowed." });
      }
    }
  };

  const handleFile1 = (file,event) => {
    if (file) {
      if (file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setSectionFile(file.name);
        const selectedFile = event.dataTransfer.files[0];
        setFile(selectedFile);
        setErrors({});
      } else {
        setErrors({ file: "Only .doc and .docx files are allowed." });
      }
    }
  };
  function UpdatedDocument(event) {
    // console.log("event: ", event);
    const allowedFileTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]; // Allow only Word files
    const selectedFile = event.target.files[0];

    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Only .docx files are allowed.");
      event.target.value = null;
      return; // Add this return statement to prevent further execution
    }
    setFile(event.target.files[0]);
  }

  const isVersioncomplete = !file;
  function versionUpload(event) {
    event.preventDefault();
    setLoading(true);

    if (validateForm()) {
      // console.log("Valid form submitted:", { file });
    }

    const url = `${process.env.REACT_APP_API_KEY}/document/uploadNewVersions`;
    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("docId", id);
    formData.append("createdBy", sessionStorage.getItem("emailId"));
    
    axios.post(url, formData).then((res) => {
      // console.log("response: ", res);
      
      if (res.status == "200") {
        dialogFuncMap[`${"displayBasic2"}`](false);
        toast.current.show({
          severity: "success",
          summary: "Document updated successfully",
          detail: "Document updated",
        });
      }
      axios
        .get(
          `${process.env.REACT_APP_API_KEY}/document/getAllDocVersionsByDocId/${id}`
        )
        .then((res) => {
          // console.log(res.data, "version data");
          setValues(res.data);
          getAllVersion();
        });

      setLoading(false);
    }) 
    .catch(error => {
      // console.log("Error uploading document:", error.response.data.developerMessage);
      toast.current.show({
        severity: "warn",
        summary: "Version upload failed",
        detail: error.response.data.developerMessage?.split("Unknown exception ::") 
      });
     
      // toast.current.show({
      //   severity: "info",
      //   summary: "Developer Info",
      //   detail: "Please check the server logs for more information.",
      // });
      setLoading(false);
    });

    //  setTimeout(() => {
    // setLoading(true);

    //  }, 1000);
  }

  //ENABLE DOCUMENT

  function EnableDocument() {
    setLoading(true)
    let data = { createdBy };

    fetch(
      `${process.env.REACT_APP_API_KEY}/document/setEnable/${id}/${versiondata} `,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    ).then((result) => {
      result.json().then((resp) => {
        // setChangeEnable(resp);
        // console.warn("respof enable", resp);
        setLoading(false)
        getAllkeyword1(versiondata)
      });
    });
    // getAllDocument();

  }

  //ADD KEYWORD
  const isFormIncomplete = !keywords;

  function saveUser() {
    const data = { keywords, createdBy };
    setKeywords(null);

    // setDisablebutton(false);
    const apiUrl = `${process.env.REACT_APP_API_KEY}/document/saveKeywords/${id}/${versiondata}`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        setKeywordAddedSuccessfully(response);
        if (response.status === 200) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "The keyword was added successfully.",
          });
          getAllkeyword();
          onHide("displayBasic");
          // setDisablebutton(true);
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
        // getAllkeyword();

        // setDisablebutton(false);
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail:
            "Failed to fetch. An error occurred during the adding keyword.",
        });
      });
    // getAllkeyword();
  }

  // DELETE KEYWORD

  const DeleteKeyword = () => {
    let data = { keyword, createdBy };

    fetch(
      `${process.env.REACT_APP_API_KEY}/document/deleteKeywords/${id}/${versiondata}`,
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
          getAllkeyword();
        } else {
          toast.current.show({
            severity: "error",
            summary: "Delete Failed",
            detail: "An error occurred during the Delete Keyword.",
          });
        }
        getAllkeyword();
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Delete Failed",
          detail: "An error occurred during the Delete Keyword.",
        });
      });
    getAllkeyword();
  };

  //keyword

  const renderFooter = (name) => {
    return (
      <div>
        <Button
          label="Cancel"
          style={{ borderRadius: "2px", color: "#D04A02" }}
          onClick={() => onHide(name)}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
        />

        <Button
          label="Submit"
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          style={{
            backgroundColor: "#D04A02",
            borderRadius: "2px",
            color: "#FFF",
          }}
          onMouseDown={() => saveUser()}
          // onClick={() => onHide(name)}
          autoFocus
          disabled={isFormIncomplete}
        />
      </div>
    );
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

  const actionBodyTemplate = (rowData) => {
    // console.log("rowData: ", rowData);
    return (
      <>
        <Button
          style={{
            height: "10px",
            width: "10px",
            color: "#D04A02",
          }}
          icon="pi pi-upload"
          tooltip="Update "
          className="p-button-text"
          tooltipOptions={{
            className: "teal-tooltip",
            position: "bottom",
          }}
          onClick={() => onDialog("displayBasic6", rowData)}
        />
        &nbsp;
        <Button
          visible={!rowData.bookmarks}
          style={{
            height: "20px",
            width: "20px",
            color: "#D04A02",
            marginLeft: "10px",
          }}
          icon="pi pi-bookmark"
          tooltip="Bookmark "
          tooltipOptions={{
            className: "teal-tooltip",
            position: "bottom",
          }}
          className="p-button-text"
          onClick={() => BookmarkSection(rowData, "true")}
        />
        <Button
          visible={rowData.bookmarks}
          style={{
            marginLeft: "10px",
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
            BookmarkSection(rowData, "false");
          }}
        />{" "}
        &nbsp;
        <Button
          style={{
            marginLeft: "10px",
            backgroundColor: "white",
            height: "10px",
            width: "10px",
            color: "#D04A02",
          }}
          icon="pi pi-download"
          onClick={() => {
            downloadSectionURL(rowData);
          }}
          onMouseDown={secDownload}
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
            icon="pi pi-print"
            tooltip="Print Section "
            className=" p-button-text"
            tooltipOptions={{
              className: "teal-tooltip",
              position: "bottom",
            }}
            id="print-content"
            onClick={() => handlePrint(rowData)}
          />
          &nbsp; */}
      </>
    );
  };

  // const sectionBodyTemplate = (rowData) => {
  //   return (
  //     <React.Fragment>

  //       {/* <Dropdown
  //       style={{ backgroundColor: "white",  color: "#203570" }}
  //       placeholder="Select "
  //       className="custom-dropdown"

  //       value={ secVersion}
  //       options={secVersion}
  //       // onChange={(e) => onSelectVersion(e.value)}
  //       optionLabel="version"
  //       optionValue="version"
  //     /> */}
  //       <Dropdown optionLabel="name" placeholder="Select Section " />
  //     </React.Fragment>
  //   );
  // }

  const paginatorRight = () => {
    return (
      // style={{float:"right"}}
      <div>
        <h3 style={{ color: "black" }}>{{ changeEnable }}</h3>
        <Button
          visible={!changeEnable}
          label="Enable Document"
          style={{ color: "#d203570", borderRadius: "2px" }}
          onClick={EnableDocument}
          onMouseDown={handleClick2}
          onMouseUp={enable}
          tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
          name="bookmark Document"
          className={`text-black p-button-sm  ${
            changeColor2 === true ? "bg-blue-800 text-white" : "bg-white"
          }`}
        />

        <Button
          visible={changeEnable}
          style={{ color: "#d203570", borderRadius: "2px" }}
          onClick={EnableDocument}
          label="Disable Document " 
          tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
          name="bookmark Document"
          onMouseDown={handleClick}
          onMouseUp={disable}
          className={`text-black p-button-sm  ${
            changeColor === true ? "bg-blue-800 text-white" : "bg-white"
          }`}
        />
      </div>
    );
  };

  const serialNumberTemplate = (rowData) => {
    setLoading(true)
    const serialNumber = section.indexOf(rowData) + 1;
    const [sectionName, fileExtension] = rowData.sectionName.split(".docx");
    if(sectionName == sectionName){
      setLoading(false)
    }
    return (
      <div>
        <div style={{ display: "flex" }}>
          Section {serialNumber}:&nbsp;&nbsp;
          <div>{sectionName}</div>
        </div>
      </div>
    );
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
    navigate("/dashboardMain");
  };

  const handleDelete = () => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };
  const handleDelete1 = () => {
    setSectionFile('');
    if (fileInputRefs.current) {
      fileInputRefs.current.value = null;
    }
  };
  return (
    <div>
      <Toast ref={toast} />
      {loading ? (
        <span className="loading">
          <ProgressSpinner />
        </span>
      ) : null}

      {/* <img
        style={{ height: "75px", float: "right" }}
        src={Background}
        alt=" Background "
      /> */}

      {/* <NavLink style={{color:"black"}} to="/DashboardMain" className="link1"> */}
      <div style={{ display: "flex", marginTop: "5px" }}>
        <img
          style={{
            width: "25px",
            marginRight: "10px",
            height: "25px",
            marginTop: "6px",
            cursor: "pointer",
          }}
          src={leftIcon}
          alt="leftIcon "
          onClick={Navigate}
        />
        <b className="headerName" style={{ marginTop: "6px" }}>
          {documentName?.split('.docx')}
        </b>
        &nbsp;&nbsp;
        {/* <b className="headerName">Upload Documen:"t</b> */}
        {/* <br/>
        <br/> */}
        {/* &nbsp;&nbsp; */}
        {/* 
      <NavLink to="/dashboardMain" className="link1">
        <Button
          style={{ backgroundColor: "white", color: "black", height: "37px" }}
          className="p-button-raised  p-button p-button-secondary p-button-text"
        >
          <img
            style={{ width: "25px", marginRight: "10px", height: "25px" }}
            src={leftIcon}
            alt="leftIcon "
          />
          <b>{documentName}</b>

        </Button>
      </NavLink>
      <img
        style={{ height: "55px", float: "right" }}
        src={Background}
        alt=" Background "
      /> */}
        &nbsp;
        {/* Document Bookmark functionality */}
        <Button
          visible={!changeText}
          style={{
            backgroundColor: "white",
            height: "37px",
            width: "40px",
            color: "#D04A02",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
          icon="pi pi-bookmark"
          className=" p-button-raised p-button-text"
          onClick={(e) => bookmark(e, bookmarkValue)}
          title="Bookmark"
          name="bookmark Document"
        />
        <Button
          visible={changeText}
          style={{
            backgroundColor: "white",
            height: "37px",
            width: "37px",
            color: "#D04A02",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
          icon="pi pi-bookmark-fill"
          className=" p-button-raised p-button-text"
          onClick={(e) => bookmark(e, unBookmarkValue)}
          title="Bookmark"
          name="bookmark Document"
        />
        &nbsp;
        {/* <Button
          style={{
            backgroundColor: "white",
            height: "37px",
            width: "37px",
            color: "#D04A02",
          }}
          icon="pi pi-download"
          onClick={() => {
            downloadFileAtURL(DOC_FILE_URL);
          }}
          onMouseDown={docDownload}
          tooltip="Download "
          tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
          className="p-button-raised p-button-text"
          // onMouseDown={docDownload}
        />{" "} */}
        <span
          style={{
            // border: "1px solid",
            width: "40px",
            height: "30px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "18px 0px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
          }}
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            onClick={() => {
              downloadFileAtURL(DOC_FILE_URL);
            }}
            onMouseDown={docDownload}
          >
            <title>Download</title>
            <g
              id="Icon/Outline/download-outline"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Group"
                transform="translate(-0.000000, -0.000000)"
                fill="#d04a02"
                fill-rule="nonzero"
              >
                <g id="download">
                  <path
                    d="M12.7500001,16.1893321 L16.6729,12.2666001 C16.9649001,11.9736 17.4399001,11.9736 17.7329001,12.2666001 C18.0259001,12.5596 18.0259001,13.0346001 17.7329001,13.3276 L11.9999001,19.0606001 L6.26690003,13.3276 C5.97390002,13.0346001 5.97390002,12.5596 6.26690003,12.2666001 C6.55990002,11.9736 7.03490003,11.9736 7.32790003,12.2666001 L11.25,16.1887 L11.25,7.50000003 L1.50000001,7.50000003 L1.50000001,22.5 L22.5,22.5 L22.5,7.50000003 L12.7500001,7.50000003 L12.7500001,16.1893321 Z M11.25,6 L11.25,0 L12.7500001,0 L12.7500001,6 L24,6 L24,22.5 C24,23.3280001 23.3280001,24 22.5,24 L1.5,24 C0.672000003,24 0,23.3280001 0,22.5 L0,6 L11.25,6 Z"
                    id="Combined-Shape"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </span>
        &nbsp;
        {/* <Button
        style={{
          backgroundColor: "white",
          height: "37px",
          width: "37px",
          color: "#203570",
        }}
        tooltip="Share "
        tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
        icon="pi pi-external-link"
        className=" p-button-raised p-button-text"
      /> */}
        {/* &nbsp; */}
        <span
          style={{
            // border: "1px solid",
            width: "40px",
            height: "30px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            cursor: "pointer",
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "18px 0px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            onClick={() => onClick("displayBasic2")}
          >
            <title>Update</title>
            <g
              id="Icon/Outline/upload-outline"
              stroke="none"
              stroke-width="1"
              fill="none"
              fill-rule="evenodd"
            >
              <g
                id="Group"
                transform="translate(-0.000000, -0.000000)"
                fill="#d04a02"
                fill-rule="nonzero"
              >
                <g id="upload">
                  <path
                    d="M12.7500001,16.1893321 L16.6729,12.2666001 C16.9649001,11.9736 17.4399001,11.9736 17.7329001,12.2666001 C18.0259001,12.5596 18.0259001,13.0346001 17.7329001,13.3276 L11.9999001,19.0606001 L6.26690003,13.3276 C5.97390002,13.0346001 5.97390002,12.5596 6.26690003,12.2666001 C6.55990002,11.9736 7.03490003,11.9736 7.32790003,12.2666001 L11.25,16.1887 L11.25,7.50000003 L1.50000001,7.50000003 L1.50000001,22.5 L22.5,22.5 L22.5,7.50000003 L12.7500001,7.50000003 L12.7500001,16.1893321 Z M11.25,6 L11.25,0 L12.7500001,0 L12.7500001,6 L24,6 L24,22.5 C24,23.3280001 23.3280001,24 22.5,24 L1.5,24 C0.672000003,24 0,23.3280001 0,22.5 L0,6 L11.25,6 Z"
                    id="Combined-Shape-Copy"
                    transform="translate(12.000000, 12.000000) scale(-1, 1) rotate(-180.000000) translate(-12.000000, -12.000000) "
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </span>
        {/* <Button
          style={{
            backgroundColor: "white",
            height: "37px",
            width: "37px",
            color: "#D04A02",
          }}
          icon="pi pi-upload"
          tooltip="Upload "
          className=" p-button-raised p-button-text"
          tooltipOptions={{
            className: "teal-tooltip",
            position: "bottom",
          }}
          onClick={() => onClick("displayBasic2")}
        /> */}
        <Dialog
          header="Upload version"
          visible={displayBasic2}
          style={{ width: "35vw" }}
          footer={documentUpload("displayBasic2")}
          onHide={() => onHide("displayBasic2")}
        >
          <form onSubmit={versionUpload}>
          <div>
                    <div
                      style={{
                        border: "1.7px dotted ",
                        backgroundColor: "white ",
                        height: "70px",
                        borderColor:'#d04a02'
                      }}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      
                    >
                      <input
                       ref={fileInputRef}
                        style={{ padding: "2rem", marginLeft: "3%" }}
                        type="file"
                        accept=".doc,.docx,"
                        onChange={UpdatedDocument}
                        id="update"
                      />
                      <label
                        htmlFor="update"
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          marginTop: "6%",
                        }}
                      >
                        {fileName ? (
                          <>
                            <span>{fileName}</span>
                          </>
                        ) : (
                          <span>
                            Drag and drop or&nbsp;{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                color: "#d04a02",
                                cursor: "pointer",
                              }}
                             
                            >
                              {" "}
                              choose file
                            </span>
                          </span>
                        )}
                      </label>
                    </div>
                      {errors.file && (
                        <div style={{ color: "red",fontSize:'13px' }}>{errors.file}</div>
                      )}
                    {fileName && (
                      <div style={{ marginTop: "10px" }}>
                        <span
                          style={{
                            marginLeft: "3%",
                            color: "#415385",
                            cursor: "pointer",
                          }}
                          onClick={handleDelete}
                        >
                          Delete attachment
                        </span>
                      </div>
                    )}
                  </div>
          </form>
        </Dialog>
        &nbsp;
        <Dropdown
          style={{ backgroundColor: "white", color: "black" }}
          placeholder="select "
          className="custom-dropdown"
          value={versiondata}
          options={values}
          onChange={(e) => onSelectVersion(e.value)}
          optionLabel="version"
          optionValue="version"
        />
      </div>

      <br />
      <br />

      {/* <Dropdown
        style={{ backgroundColor: "white", color: "#D04A02" }}
        placeholder="Select "
        className="custom-dropdown"

        value={versiondata}
        options={values}
        onChange={(e) => onSelectVersion(e.value)}
        optionLabel="version"
        optionValue="version"
      />
     <br/>
     <br/> */}

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
              style={{ width: "100%", borderRadius: "2px", height: "7vh" }}
              placeholder="Enter Keyword "
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
                marginTop: "3px",
                fontFamily:"HelveticaNeue",
                fontWeight:'10rem'
              }}
              onClick={() => onClick("displayBasic3", keywords)}
              icon="pi pi-times"
            >
              {keywords}
            </Tag>
          ))}

          <Dialog
            header="Delete Keyword ?"
            visible={displayBasic3}
            style={{ width: "30vw" }}
            footer={deletekeyword("displayBasic3")}
            onHide={() => onHide("displayBasic3")}
          >
            <p>Are you sure you want to delete this keyword ?</p>
          </Dialog>

          {/* //Add section */}
          <Dialog
            header="Update particular section"
            visible={displayBasic6}
            style={{ width: "35vw" }}
            footer={sectionupload("displayBasic6")}
            onHide={() => onHide("displayBasic6")}
          >
            <form onSubmit={handleSubmit}>
            <div>
                    <div
                      style={{
                        border: "1.7px dotted ",
                        backgroundColor: "white ",
                        height: "70px",
                        borderColor:'#d04a02'
                      }}
                      onDragOver={handleDragOver1}
                      onDrop={handleDrop1}
                      
                    >
                      <input
                       ref={fileInputRefs}
                        style={{ padding: "2rem", marginLeft: "3%" }}
                        type="file"
                        accept=".doc,.docx,"
                        onChange={Documentupload}
                        id="secUpload"
                      />
                      <label
                       htmlFor="secUpload"
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          display: "flex",
                          marginTop: "6%",
                        }}
                      >
                        {seectionFileName ? (
                          <>
                            <span>{seectionFileName}</span>
                          </>
                        ) : (
                          <span>
                            Drag and drop or&nbsp;{" "}
                            <span
                              style={{
                                textDecoration: "underline",
                                color: "#d04a02",
                                cursor: "pointer",
                              }}
                              onClick="UpdatedDocument"
                            >
                              {" "}
                              choose file
                            </span>
                          </span>
                        )}
                      </label>
                    </div>
                      {errors.file && (
                        <div style={{ color: "red",fontSize:'13px' }}>{errors.file}</div>
                      )}
                    {seectionFileName && (
                      <div style={{ marginTop: "10px" }}>
                        <span
                          style={{
                            marginLeft: "3%",
                            color: "#415385",
                            cursor: "pointer",
                          }}
                          onClick={handleDelete1}
                        >
                          Delete attachment
                        </span>
                      </div>
                    )}
                  </div>
            </form>
          </Dialog>

          <br />
          <br />

          <div style={{ color: "#2D2D2D" }}>
            <img
              style={{ marginRight: "10px", height: "20px", color: "#000000" }}
              src={Section}
              alt="Section"
            />
            <b>Identified Section </b>
          </div>

          <br />
          <DataTable
            value={section}
            paginator
            stripedRows
            rows={rows1}
            paginatorTemplate={template1}
            first={first1}
            onPage={onCustomPage1}
            className="datatable"
          >
            <Column field="sectionName" body={serialNumberTemplate} />

            {/* <Column field="sectionName" style={{ minWidth: "10rem" }} ></Column> */}
            {/* <Column field="sectionversion" style={{ minWidth: "10rem" }} body={(e) => sectionBodyTemplate(e)} header="Section version"></Column> */}

            <Column
              bodyStyle={{ width: "11rem" }}
              bodyClassName="custom-body"
              body={(e) => actionBodyTemplate(e)}
            ></Column>
          </DataTable>

          <br />
        </Card>
       {/* {Approved && ( */}
        <div style={{ float: "right" }}>
          <Button
            visible={!changeEnable}
            label="Enable Document"
            style={{ color: "#D04A02", borderRadius: "2px" }}
            onClick={EnableDocument}
            // onMouseDown={handleClick2}
            onMouseUp={enable}
            tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
            name="bookmark Document"
            className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
            // className={`text-black p-button-sm  ${changeColor2 === true ? "bg-blue-800 text-white" : "bg-white"
            //   }`}
          />

          <Button
            visible={changeEnable}
            style={{
              backgroundColor: "#d04a02",
              color: "white",
              borderRadius: "2px",
            }}
            onClick={EnableDocument}
            label="Disable Document "
            tooltipOptions={{ className: "teal-tooltip", position: "bottom" }}
            name="bookmark Document"
            // onMouseDown={handleClick}
            onMouseUp={disable}
            className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
            // className={`text-black p-button-sm  ${changeColor === true ? "bg-blue-800 text-white" : "bg-white"
            //   }`}
          />
        </div>
      {/* )} */}
      </Card>
    </div>
  );
};
export default Product;
