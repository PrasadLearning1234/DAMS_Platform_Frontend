import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import Moment from "react-moment";
import axios from "axios";
import CryptoJS from "crypto-js";
import { ProgressSpinner } from "primereact/progressspinner";

function Email() {
  const [hostName, setHostName] = useState("");
  const [portName, setPortName] = useState("");
  const [loading, setLoading] = useState(true);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [timeForEmailSent, setTimeForEmailSent] = useState("");
  const [errors, setErrors] = useState({});
  const [changeColor, setChangeColor] = useState(false);
  const [changeColor1, setChangeColor1] = useState(false);
  const [encryptedObject1, setEncryptedObject] = useState({ emailconfi: "" });
  const [loginUser, loginsetUserName] = useState("");
  const toast = useRef(null);

  useEffect(() => {
    setLoading(true);

    loginsetUserName(sessionStorage.getItem("emailId"));
    axios
      .get(
        `${process.env.REACT_APP_API_KEY}/dam/Configurations/listEmailConfiguration`
      )
      .then((res) => {
        // console.log(res.data[0]
        //   ,"???????")

        setTimeSlot(res.data[0].timeSlot);
        setHostName(res.data[0].hostName);
        setPortName(res.data[0].portName);
        setUserName(res.data[0].userName);
        setPassword(res.data[0].password);

        //           const dateObj = res.data[0].timeForEmailSent;

        // const hours = dateObj.getUTCHours();
        // const minutes = dateObj.getUTCMinutes();
        // const seconds = dateObj.getUTCSeconds();

        // const formattedTime = `${hours}:${minutes}:${seconds}`;
        // setTimeForEmailSent(formattedTime);

        // console.log(formattedTime); // O
        const timeForEmailSentValue = new Date(res.data[0].timeForEmailSent);
        // console.log(timeForEmailSentValue, 'timeForEmailSent');
        
        setTimeForEmailSent(timeForEmailSentValue);
        setLoading(false);

      });
  }, []);

  const handleClick = () => {
    setChangeColor(!changeColor);
  };

  const handleClick1 = () => {
    setChangeColor1(!changeColor1);
  };

  function saveUser() {
    setLoading(true);
    // console.log('loginuserName',loginUser);
    let data = {
      timeForEmailSent,
      timeSlot,
      hostName,
      portName,
      userName,
      password,
      loginUser,
    };
    // console.log(data, "data");
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
    fetch(
      `${process.env.REACT_APP_API_KEY}/dam/Configurations/emailConfiguration`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aesFinalText),
      }
    ).then((result) => {
      // alert('alert')
      // console.log("email config:",result);
      result.json().then((resp) => {
        // console.log("response email config:",resp);
        toast.current.show({
          severity: "success",
          summary: "Email configuration updated",
          detail: "Email configuration updated successfully",
        });
        setLoading(false);

      });
    });
    // }

    if (validateForm()) {
    }
    // console.log("refresh prevented");
  }

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!timeForEmailSent) {
      errors.timeForEmailSent = "This Field is required. ";
      isValid = false;
    }

    if (!timeSlot) {
      errors.timeSlot = "This Field is required.";
      isValid = false;
    }

    if (!hostName) {
      errors.hostName = "This Field is required.";
      isValid = false;
    }

    if (!portName) {
      errors.portName = "This Field is required. ";
      isValid = false;
    }

    if (!userName) {
      errors.userName = "This Field is required. ";
      isValid = false;
    }

    if (!password) {
      errors.password = "This Field is required.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  return (
    
    <div style={{ height: "27rem", marginTop: "1rem" }}>
      <Toast ref={toast} />
      {loading ? (
        <span className="loading">
          <ProgressSpinner />
        </span>
      ) : null}
      <br />
      <Card
        style={{
          borderLeft: "8px solid #FFB600",
          backgroundColor: "#F3F3F3",

          width: "95%",
          borderRadius: "2px",
          marginLeft: "2%",
        }}
        className="configCard"
      >
        <div className="grid p-fluid">
          <div className="field col-12 md:col-3" style={{display:"none"}}>
            <p style={{ color: "black", marginBottom: "3%" }}>
              Time for Email to be sent
            </p>

            <Calendar
              id="timeForEmailSent"
              value={timeForEmailSent}
              onChange={(e) => setTimeForEmailSent(e.target.value)}
              timeOnly
            />
            {errors.timeForEmailSent && (
              <div style={{ color: "red" }}>{errors.timeForEmailSent}</div>
            )}
          </div>

          <div className="field col-12 md:col" style={{display:"none"}}>
            <div
              className="formgroup-inline"
              style={{ marginTop: "32px", marginLeft: "80px" }}
            >
              <div className="field-radiobutton">
                <input
                  style={{ height: "17px", width: "17px", color: "#203570" }}
                  type="radio"
                  name="timeSlot"
                  value="AM"
                  checked={timeSlot === "AM"}
                  onChange={(e) => {
                    setTimeSlot(e.target.value);
                  }}
                />
                {errors.timeSlot && (
                  <div style={{ color: "red" }}>{errors.timeSlot}</div>
                )}
                <label htmlFor="city7">AM</label>
              </div>
              <div className="field-radiobutton">
                <input
                  style={{ height: "17px", width: "17px", color: "#203570" }}
                  type="radio"
                  name="timeSlot"
                  value="PM"
                  checked={timeSlot === "PM"}
                  onChange={(e) => {
                    setTimeSlot(e.target.value);
                  }}
                />
                {errors.timeSlot && (
                  <div style={{ color: "red" }}>{errors.timeSlot}</div>
                )}
                <label htmlFor="city8">PM</label>
              </div>
            </div>
          </div>
        </div>

        <h4 style={{ color: "black" }}>SMTP Details</h4>
        <br />
        <div className="grid p-fluid">
          <div className="field col-12 md:col-4">
            <label
              style={{ color: "black" }}
              htmlFor="username1"
              className="block"
            >
              Host Name
            </label>

            <InputText
              style={{ height: "6vh" }}
              type="text"
              value={hostName}
              onChange={(e) => {
                setHostName(e.target.value);
              }}
              // name="name"
            />
            {errors.hostName && (
              <div style={{ color: "red" }}>{errors.hostName}</div>
            )}
          </div>

          <div className="field col-12 md:col-4">
            <label
              style={{ color: "black" }}
              htmlFor="username1"
              className="block"
            >
              Port Name
            </label>
            <InputText
              style={{ height: "6vh" }}
              type="text"
              value={portName}
              onChange={(e) => {
                setPortName(e.target.value);
              }}
              // name="portName"
            />
            {errors.portName && (
              <div style={{ color: "red" }}>{errors.portName}</div>
            )}
          </div>
        </div>

        <div className="grid p-fluid">
          <div className="field col-12 md:col-4">
            <label
              style={{ color: "black" }}
              htmlFor="username1"
              className="block"
            >
              User Name
            </label>
            <InputText
              style={{ height: "6vh" }}
              type="text"
              value={userName}
              onChange={(e) => {
                // replace(/[^a-z\s]/gi, "")
                setUserName(e.target.value);
              }}
              // name="userName"
            />
            {errors.userName && (
              <div style={{ color: "red" }}>{errors.userName}</div>
            )}
          </div>

          <div className="field col-12 md:col-4">
            <label
              style={{ color: "black" }}
              htmlFor="username1"
              className="block"
            >
              Password
            </label>
            <InputText
              style={{ height: "6vh" }}
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              // name="mobile"
            />
            {errors.password && (
              <div style={{ color: "red" }}>{errors.password}</div>
            )}
          </div>
        </div>
      </Card>
      <br />

      <div style={{ display: "flex", float:'right',marginRight:'3%'}}>

        <Button
          style={{
            borderRadius: "4px",
            backgroundColor: "#D04A02",
            color: "white",
          }}
          type="button"
          label="Save"
          onClick={saveUser}
          onMouseDown={handleClick1}
          className="p-button-sm p-button-rounded p-button-danger p-button-outlined"
          // className={`text-black p-button-sm ${changeColor1 === true ? "bg-blue-800 text-white" : "bg-white"}`}
        />
      </div>
    </div>
  );
}

export default Email;
