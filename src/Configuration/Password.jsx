import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import axios from "axios";
import { InputSwitch } from "primereact/inputswitch";
import CryptoJS from "crypto-js";
import { ProgressSpinner } from "primereact/progressspinner";


function Password() {
  const [noOfDaysForExpiry, setNoOfDaysForExpiry] = useState("");
  const [noOfAttempt, setNoOfAttempt] = useState("");
  const [noOfDaysExpiry, setNoOfDaysExpiry] = useState("");
  const [specialCharacters, setSpecialCharacters] = useState(Boolean);
  const [upperCaseLetters, setUpperCaseLetters] = useState("");
  const [lowerCaseLetters, setLowerCaseLetters] = useState(Boolean);
  const [loginStatus, setChecked1] = useState(Boolean);
  const [userName, setUserName] = useState("");
  const [encryptedObject, setEncryptedObject] = useState({ confi: "" });
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({});
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor1, setChangeColor1] = useState(false);
  const toast = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log("refresh prevented");
  };

  // const handleClick = () => {
  //   window.location.reload(false);

  //   setChangeColor(!changeColor);
  // };

  const handleClick1 = () => {
    setChangeColor1(!changeColor1);
  };

  useEffect(() => {
    setLoading(true);

    setUserName(sessionStorage.getItem("emailId"));
    getConfiguration();
  }, []);
function getConfiguration()
 {
  axios
  .get(`${process.env.REACT_APP_API_KEY}/dam/Configurations/list`)
  .then((res) => {
    // console.log(res.data[0].noOfDaysExpiry, "???????");
    setNoOfDaysForExpiry(res.data[0].noOfDaysForExpiry);
    setNoOfAttempt(res.data[0].noOfAttempt);
    setSpecialCharacters(res.data[0].specialCharacters);

    setNoOfDaysExpiry(res.data[0].noOfDaysExpiry);

    setUpperCaseLetters(res.data[0].upperCaseLetters);
    setLowerCaseLetters(res.data[0].lowerCaseLetters);
    setChecked1(res.data[0].loginStatus);
     sessionStorage.setItem('trigger',res.data[0].loginStatus);
    // setPosts(res.data.reverse());
    setLoading(false);
  });
}

  const isFormIncomplete = !noOfDaysForExpiry || !noOfAttempt;
  function saveUser() {

    // console.warn({
    //   noOfDaysForExpiry,
    //   noOfAttempt,
    //   loginStatus,
    //   noOfDaysExpiry,
    //   specialCharacters,
    //   upperCaseLetters,
    //   lowerCaseLetters,
    //   userName,
    // });
    let data = {
      noOfDaysForExpiry,
      loginStatus,
      noOfAttempt,
      noOfDaysExpiry,
      specialCharacters,
      upperCaseLetters,
      lowerCaseLetters,
      userName,
    };
    // console.log("data to be post: ", data);

    const cIter = 200000;
    const kSize = 128;
    const kSeparator = "::";
    const val1 = "abcd65443A";
    const val2 = "AbCd124_09876";
    const val3 = "sa2@3456s";

    const jsonString = JSON.stringify(data);
    // console.log(jsonString, "jsonString");
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
      CryptoJS.enc.Hex
    );
    // const passPhrase = "anemoi";
    const key = CryptoJS.PBKDF2(
      `${val1}${val2}${val3}`,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: kSize / 32, iterations: cIter }
    );

    // console.log("key", key);
    let cText = CryptoJS.AES.encrypt(jsonString, key, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    let aesText =
      iv +
      kSeparator +
      salt +
      kSeparator +
      cText.ciphertext.toString(CryptoJS.enc.Base64);
    let aesFinalText = btoa(aesText);

    // setEncryptedObject({confi:aesFinalText});
    // console.log("encrypt data 3 :", aesFinalText);
    // encryptConfi(encryptedObject)

    // function encryptConfi(encryptedObject){
      setLoading(true);

    fetch(`${process.env.REACT_APP_API_KEY}/dam/Configurations/con`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aesFinalText),
    }).then(
      (result) => {
        if (result.status === 200) {
          // console.warn("result...!!!", result);
          result.json().then((resp) => {
            // console.warn("resp", resp);
          });

          toast.current.show({
            severity: "success",
            summary: "Password Added",
            detail: "Password Configuration Added Successfully",
            life: 6000,
          });
          getConfiguration();
          setLoading(false);

        } else {
          toast.current.show({
            severity: "warn",
            summary: "Password Not Added",
            detail: "Error while Adding Password Configuration",
            life: 6000,
          });
          setLoading(false);

        }
      },
      (error) => {
        toast.current.show({
          severity: "error",
          summary: "Password Not Added",
          detail: "Error while Adding Password Configuration",
          life: 6000,
        });
        setLoading(false);

        setTimeout(() => {
          window.location.reload(false);
        }, 1000);
      }
    );
    // }

    // });
    if (validateForm()) {
      // console.log("Valid form submitted:", {
      //   noOfDaysForExpiry,
      //   noOfAttempt,
      //   noOfDaysExpiry,
      //   specialCharacters,
      //   upperCaseLetters,
      //   lowerCaseLetters,
      // });
    }
    // console.log("refresh prevented");
  }

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!noOfDaysForExpiry) {
      errors.noOfDaysForExpiry = "This Field is required.";
      isValid = false;
    }

    if (!noOfAttempt) {
      errors.noOfAttempt = "Email Should not be Empty";
      isValid = false;
    }

    if (noOfDaysExpiry === "") {
      errors.noOfDaysExpiry = "This Field is required.";
      isValid = false;
    }

    if (specialCharacters === "") {
      errors.specialCharacters = "This Field is required.";
      isValid = false;
    }

    if (upperCaseLetters === "") {
      errors.upperCaseLetters = "This Field is required.";
      isValid = false;
    }

    if (lowerCaseLetters === "") {
      errors.lowerCaseLetters = "This Field is required.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  // const validateForm = (data) => {
  //   let errors = {};
  //   let isValid = true;

  //   if (!noOfDaysForExpiry) {
  //     errors.noOfDaysForExpiry = "This Field is required. ";
  //     isValid = false;
  //   }

  //   if (!noOfAttempt) {
  //     errors.noOfAttempt = "Email Should not be Empty";
  //   }

  //   if (!noOfDaysExpiry) {
  //     errors.noOfDaysExpiry = "This Field is required.";
  //     isValid = false;
  //   }

  //   if (!specialCharacters) {
  //     errors.specialCharacters = "This Field is required.";
  //     isValid = false;
  //   }

  //   if (!upperCaseLetters) {
  //     errors.upperCaseLetters = "This Field is required.";
  //     isValid = false;
  //   }

  //   if (!lowerCaseLetters) {
  //     errors.lowerCaseLetters = "This Field is required.";
  //     isValid = false;
  //   }

  //   setErrors(errors);
  //   return isValid;
  // };

  // const setChecked2=(data)=>{
  //   console.log("gjhgjhgjh",data);
  // }

  return (
    <div style={{ height: "22rem", marginTop: "1rem" }}>
      <Toast ref={toast} />
      {loading ? (
        <span className="loading">
          <ProgressSpinner />
        </span>
      ) : null}
      <form onSubmit={onSubmit}>
        <br />

        <Card
          style={{
            borderLeft: "8px solid #FFB600 ",
            backgroundColor: "#F3F3F3",
            height: "70%",
            borderRadius: "2px",
            marginLeft: "2%",
            width: "95%",
          }}
          className="configCard"
        >
          <div className="grid p-fluid">
            <div className="field col-12 md:col-4">
              <label
                style={{ color: "black" }}
                htmlFor="username1"
                className="block"
              >
                No.of Days For Expiry
              </label>

              <InputText
                style={{ height: "6vh" }}
                type="text"
                value={noOfDaysForExpiry}
                onChange={(e) => {
                  setNoOfDaysForExpiry(e.target.value);
                }}
                // name="noOfDaysForExpiry"
              />
              {/* value={value1} onChange={(e) => setValue1(e.target.value)} */}

              {errors.noOfDaysForExpiry && (
                <div style={{ color: "red" }}>{errors.noOfDaysForExpiry}</div>
              )}
            </div>
            <div className="field col-12 md:col-4">
              <label
                style={{ color: "black" }}
                htmlFor="username1"
                className="block"
              >
                No.of Attempt Before Lockout
              </label>

              <InputText
                style={{ height: "6vh", width: "35" }}
                type=" text"
                value={noOfAttempt}
                className=" p-inputtext-sm block"
                onChange={(e) => {
                  setNoOfAttempt(e.target.value);
                }}
                // name="createdOn"
              />
              {errors.noOfAttempt && (
                <div style={{ color: "red" }}>{errors.noOfAttempt}</div>
              )}
            </div>
            <div className="field col-12 md:col-4">
              <label
                style={{ color: "black", marginLeft: "30%" }}
                htmlFor="username1"
                className="block"
              >
                PwC/Other
              </label>

              <InputSwitch
                style={{ marginLeft: "35%", height: "26px", width: "45px" }}
                checked={loginStatus}
                onChange={(e) => setChecked1(e.value)}
              />
            </div>
          </div>

          <h4 style={{ color: "black" }}>Password should have</h4>
          <br />
          <div className="grid p-fluid">
            <div className="field col-12 md:col-3">
              No.of Days For Expiry
              <br />
              <br />
              <div class="formgroup-inline">
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    style={{ height: "15px", width: "15px" }}
                    name="noOfDaysExpiry"
                    value={true}
                    checked={noOfDaysExpiry === true}
                    onChange={(e) => {
                      setNoOfDaysExpiry(true);
                    }}
                  />
                  <label for="city7">Yes</label>
                  {errors.noOfDaysExpiry && (
                    <div style={{ color: "red" }}>{errors.noOfDaysExpiry}</div>
                  )}
                </div>
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    style={{ height: "15px", width: "15px" }}
                    name="noOfDaysExpiry"
                    value={false}
                    checked={noOfDaysExpiry === false}
                    onChange={(e) => {
                      setNoOfDaysExpiry(false);
                    }}
                  />
                  <label for="city8">No</label>
                  {errors.noOfDaysExpiry && (
                    <div style={{ color: "red" }}>{errors.noOfDaysExpiry}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="field col-12 md:col-3">
              Special Characters(@,#,$,%)
              <br />
              <br />
              <div class="formgroup-inline">
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    style={{ height: "15px", width: "15px" }}
                    name="specialCharacters"
                    value={true}
                    checked={specialCharacters === true}
                    // onChange={(e) => {
                    //   setSpecialCharacters(e.target.value);
                    // }}
                    onChange={(e) => {
                      setSpecialCharacters(true);
                    }}
                  />
                  {/* {errors.specialCharacters && (
                    <div style={{ color: "red" }}>{errors.specialCharacters}</div>
                  )} */}
                  <label for="city7">Yes</label>
                </div>
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    style={{ height: "15px", width: "15px" }}
                    name="specialCharacters"
                    value={false}
                    // value={specialCharacters}
                    checked={specialCharacters === false}
                    onChange={(e) => {
                      setSpecialCharacters(false);
                    }}
                  />
                  {/* {errors.specialCharacters && (
                    <div style={{ color: "red" }}>{errors.specialCharacters}</div>
                  )} */}
                  <label for="city8">No</label>
                </div>
              </div>
            </div>
            {/* <div className="field "> */}
            <div className="field col-12 md:col-3">
              Upper Case Letters
              <br />
              <br />
              <div class="formgroup-inline">
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    style={{ height: "15px", width: "15px" }}
                    name="upperCaseLetters"
                    value={true}
                    checked={upperCaseLetters === true}
                    onChange={(e) => {
                      setUpperCaseLetters(true);
                    }}
                  />
                  {errors.upperCaseLetters && (
                    <div style={{ color: "red" }}>
                      {errors.upperCaseLetters}
                    </div>
                  )}
                  <label for="city7">Yes</label>
                </div>
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    name="upperCaseLetters"
                    style={{ height: "15px", width: "15px" }}
                    value={false}
                    checked={upperCaseLetters === false}
                    onChange={(e) => {
                      setUpperCaseLetters(false);
                    }}
                  />
                  <label for="city8">No</label>
                  {errors.upperCaseLetters && (
                    <div style={{ color: "red" }}>
                      {errors.upperCaseLetters}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* </div> */}
            <div className="field col-12 md:col">
              Lower Case Letters
              <br />
              <br />
              <div class="formgroup-inline">
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    style={{ height: "15px", width: "15px" }}
                    name="lowerCaseLetters"
                    value={true}
                    checked={lowerCaseLetters === true}
                    onChange={(e) => {
                      setLowerCaseLetters(true);
                    }}
                  />
                  {/* {errors.lowerCaseLetters && (
                    <div style={{ color: "red" }}>{errors.lowerCaseLetters}</div>
                  )} */}
                  <label for="city7">Yes</label>
                </div>
                <div class="field-radiobutton">
                  <input
                    type="radio"
                    name="lowerCaseLetters"
                    style={{ height: "15px", width: "15px" }}
                    value={false}
                    checked={lowerCaseLetters === false}
                    onChange={(e) => {
                      setLowerCaseLetters(false);
                    }}
                  />
                  {/* {errors.lowerCaseLetters && (
                    <div style={{ color: "red" }}>{errors.lowerCaseLetters}</div>
                  )} */}
                  <label for="city8">No</label>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <br />
        <div style={{ display: "flex",float:'right',marginRight:'3%' }}>

          <Button
            type="button"
            style={{
              borderRadius: "4px",
              backgroundColor: "#d04a02",
              marginBottom: "1rem",
              color: "white",
              width: "fit-content",
            }}
            label="Save Changes"
            onClick={saveUser}
            disabled={isFormIncomplete}
            onMouseDown={handleClick1}
            className="p-button-sm p-button-rounded p-button-danger p-button-outlined"

            // className={`text-black p-button-sm  ${
            //   changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"
            // }`}
          ></Button>
        </div>
      </form>
    </div>
  );
}

export default Password;
