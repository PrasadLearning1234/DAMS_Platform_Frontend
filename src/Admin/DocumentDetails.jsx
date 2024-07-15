import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { CustomerService } from "../service/CustomerService";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";

function DocumentDetails() {
  const [file, setFile] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [description, setDescription] = useState('');
  const [clientName ,setClientName] = useState(null);
  const [uploadedBy, setLoginUser] = useState();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor2, setChangeColor2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [inputKey, setInputKey] = useState(Date.now());
  const fileInputRef = useRef(null);

  const handleClick5 = () => {
    setChangeColor(!changeColor);
  };

  const handleClick2 = () => {
    setChangeColor2(!changeColor2);
  };

  useEffect(() => {
    setLoginUser(sessionStorage.getItem("emailId"));
  }, []);

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!documentName.trim()) {
      errors.documentName = "This Field is required. ";
      isValid = false;
    }

    if (!description) {
      errors.description = "This Field is required.";
      isValid = false;
    }

    if (!clientName) {
      errors.clientName = "This Field is required.";
      isValid = false;
    }
    if (!file) {
      errors.file = "This Field is required.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const customerService = new CustomerService();

  function handleChange(event) {
    const allowedFileTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const selectedFile = event.target.files[0];

    if (selectedFile && allowedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setFileName(selectedFile.name); // Set the file name
    } else {
      setFileName(""); // Reset the file name if an invalid file is selected
      setErrors({ file: "Only .docx files are allowed." });
      event.target.value = null;
    }
  }
  function document(event) {
    setDocumentName(event.target.value);
  }
  function Description(event) {
    setDescription(event.target.value);
  }
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
  
    handleFile(file,event);
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
  // const handleDragEnter = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  // };

  // const handleDragOver = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  // };

  // const handleDragLeave = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  // };

  // const handleDrop = (event) => {
  //   event.preventDefault();
  //   event.stopPropagation();

  //   const file = event.dataTransfer.files[0];
  //   if (file) {
  //     setFileName(file.name);
  //     setErrors({});
  //   }
  // };

  const isFormIncomplete = !file || documentName.trim().length === 0 || description.trim().length === 0
  function handleSubmit(event) {
    // console.log(documentName, " ", description, " ", clientName);
    event.preventDefault();
    if (validateForm()) {
      // console.log("Valid form submitted:", {
      //   documentName,
      //   description,
      //   clientName,
      // });
    }

    try {
      setLoading(true);
      const url = `${process.env.REACT_APP_API_KEY}/document/upload`;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentName", documentName);
      formData.append("description", description);
      formData.append("clientName", clientName);
      formData.append("uploadedBy", uploadedBy);
      // console.log(formData, "//////////////////////////////");

      axios.post(url, formData).then((res) => {
        // console.log(res, ",/////////doc id//////");
        setLoading(false);

        customerService.docId = res.data;
        navigate("/documentReview/" + res.data.docId);
      });
    } catch (error) {
      // console.error(error);
      setLoading(false);
    }
  }
  function Cancel() {
    navigate("/dashboardMain");
  }

  const handleDelete = () => {
    setFileName('');
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };


  return (
    <div>
      <div style={{ height: "auto", marginTop: "1rem", paddingBottom: "3rem" }}>
        <br />

        <Card
          style={{
            borderLeft: "8px solid #FFB600   ",
            backgroundColor: "#F3F3F3",
            borderRadius: "2px",
            width: "90vm",
            margin: "10px",
            height: "auto",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div class="grid">
              <div class="col-12 md:col-6 lg:col-3">
                <label for="lastname2" style={{ color: "black" }}>
                  Document Name
                </label>

                <br />
                <br />
                <InputText
                  style={{ width: "90%", height: "42px", borderRadius: "2px" }}
                  value={documentName}
                  placeholder="Document Name"
                  onChange={document}
                />

                {errors.documentName && (
                  <div style={{ color: "red" }}>{errors.documentName}</div>
                )}
              </div>
              <div class="col-12 md:col-6 lg:col-4">
                <label for="lastname2" style={{ color: "black" }}>
                  {" "}
                  Document Description
                </label>
                <br />
                <br />
                <InputTextarea
                  style={{ borderRadius: "2px", width: "90%" }}
                  value={description}
                  placeholder="Description"
                  onChange={Description}
                  rows={5}
                  cols={80}
                />
                {errors.description && (
                  <div style={{ color: "red" }}>{errors.description}</div>
                )}
              </div>
              <div class="col-12 md:col-6 lg:col-5">
                {/* <Card
                  style={{
                    backgroundColor: "#FFECBD ",
                    width: "90%",

                    height: "200px",
                  }}
                > */}
                  <label style={{ color: "black" }}>Upload Document</label>
                  <br />
                  <br />
                  <div>
                    <div
                      style={{
                        border: "1.7px dotted ",
                        backgroundColor: "white ",
                        height: "70px",
                      }}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      // onDragEnter={handleDragEnter}
                      // onDragOver={handleDragOver}
                      // onDragLeave={handleDragLeave}
                      // onDrop={handleDrop}
                    >
                      <input
                       ref={fileInputRef}
                        style={{ padding: "2rem", marginLeft: "3%" }}
                        type="file"
                        accept=".doc,.docx,"
                        onChange={handleChange}
                        id="inputFile"
                      />
                      <label
                        htmlFor="inputFile"
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
                 
                  <br />

                  <h6>Eligible Formats:DOCX Only</h6>
              
              </div>
             
            </div>
            <div style={{ display: "flex", float: "right", marginTop: "4%" }}>
            <Button
              label="Cancel"
              style={{
                width: "50%",
                color: "#D04A02",
                borderRadius: "1px",

                borderRadius: "5px",
                // marginLeft: "80%",
              }}
              onMouseDown={handleClick2}
              onClick={Cancel}
              className="p-button-sm p-button-rounded p-button-danger p-button-outlined"

              // className={`text-black p-button-sm  ${changeColor2 === true ? "bg-blue-800 text-white" : "bg-white"
              //   }`}
            />
            &nbsp; &nbsp;
            <Button
              label="Next"
              style={{
                color: "#D04A02",
                borderRadius: "1px",
                width: "50%",
                backgroundColor: "#D04A02",
                color: "white",
                borderRadius: "5px",
              }}
              onMouseDown={handleClick5}
              disabled={isFormIncomplete}
              onClick={handleSubmit}
              className=" p-button-sm p-button-rounded p-button-danger p-button-outlined"
              // className={`text-black p-button-sm  ${changeColor === true ? "#D04A02 text-white" : "bg-white"
              //   }`}
            />
          </div>
           
          </form>
        </Card>
        <span>
          {loading ? (
            <span className="loading">
              <ProgressSpinner />
            </span>
          ) : null}

          <br />

         
        </span>
      </div>
    </div>
  );
}

export default DocumentDetails;
