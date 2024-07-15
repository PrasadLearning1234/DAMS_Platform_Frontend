import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import jwt_decode from "jwt-decode";
import axios from "axios";
import PwC_Logo_Black from "../Assets/PwC_Logo_Black.png";
import CryptoJS from "crypto-js";
import { Checkbox } from "primereact/checkbox";
import BackgroundImage from "../Assets/Grouplogin1.png";

import pdfFile from "../Assets/Documents/DAMsK3DraftUserT&C.pdf";

const Login = () => {
  const [emailId, setUsername] = useState("");
  const [loginpassword, setPassword] = useState(null);
  const [loginStatus, setLoginStatus] = useState("");
  const toast = useRef(null);
  const [emailOtp, setOtp] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [loggedUserData, setLoggedUserData] = useState();
  const [showOtpVerification, setShowOtpVerification] = useState();
  const [showLoginepage, setshowLoginepage] = useState();
  const [loading, setLoading] = useState(Boolean);
  const [showPassword, setShowPassword] = useState(Boolean);
  const [displayBasic, setDisplayBasic] = useState(false);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [previewCard, setPreviewCard] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // IDAM code
  const [username, usernameupdate] = useState("");
  // const [password, passwordupdate] = useState("");

  const usenavigate = useNavigate();

  // const login_url = "https://login-stg.pwc.com/openam/oauth2/authorize";
  // const reponse_type = "code";
  // const client_id = "urn:ipzyatgcaswv001.pwcglb.com";
  // const redirect_url = "https://ipzyatgcaswv001.pwcglb.com";
  // const scope = "openid";
  //  const grant_type = "authorization_code";
  // const secret = "NymifqabiwKnfD7BeHcR";
  // const access_token = "https://login-stg.pwc.com/openam/oauth2/access_token";
  // const user_info = "https://login-stg.pwc.com/openam/oauth2/userinfo";
  // const REACT_APP_API_KEY = "https://ipzyatgcaswv001.pwcglb.com/api";
  ///

  const reponse_type = `${process.env.REACT_APP_API_RESPONSEKEY}`;
  const scope = `${process.env.REACT_APP_API_SCOPE}`;
  const grant_type = `${process.env.REACT_APP_API_GRANTTYPE}`;

  const login_url = `${process.env.REACT_APP_BASE_URL}/authorize`;
  const access_token = `${process.env.REACT_APP_BASE_URL}/access_token`;
  const user_info = `${process.env.REACT_APP_BASE_URL}/userinfo`;

  const client_id = `${process.env.REACT_APP_API_CLIENTKEY}`;
  const redirect_url = `${process.env.REACT_APP_API_REDIRECTKEY}`;
  const secret = `${process.env.REACT_APP_API_SECRETKEY}`;
  const REACT_APP_API_KEY = `${process.env.REACT_APP_API_MAINAPPKEY}`;

  useEffect(() => {
    sessionStorage.clear();
    setShowOtpVerification(false);
    setshowLoginepage(true);
    axios
      .get(`${process.env.REACT_APP_API_KEY}/dam/Configurations/list`)
      .then((res) => {
        // console.log(res, "acc statsu");
        // console.log(res.data[0].noOfDaysExpiry, "???????");
        setLoginStatus(res.data[0].loginStatus, " loginStatus");
        //  if(res.data[0].loginStatus===true){
        sessionStorage.setItem("trigger", res.data[0].loginStatus);
      });
  }, []);

  if (loginStatus === true) {
    const isFormIncomplete = !emailId || !loginpassword;

    const proceedLogin = (e) => {
      // console.log("<=======================================>");
      if (acceptedTerms) {
        setLoading(true);

        e.preventDefault();

        // console.log("loading: ", loading);
        if (validate()) {
          // const encoded = btoa(password);
          // var encoded= btoa(password);
          // const encoded = encodeURI(password);
          const data = {
            emailId,
            password: btoa(loginpassword),
            // password: encodeURIComponent(btoa(password)),
            //  password: btoa(password),
          };
          setLoading(true);

          fetch(`${process.env.REACT_APP_API_KEY}/dam/user/login`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              if (response.ok) {
                setLoading(false);
                return response.json().then((data) => {
                  // Successful response handling
                  if (data.status !== "Active") {
                  } else {
                    setShowOtpVerification(true);
                    setshowLoginepage(false);

                    setLoading(false);

                    // console.warn("Response:", data);
                    setLoggedUserData(data);
                    toast.current.show({
                      severity: "success",
                      summary: "Email OTP sent",
                      detail: "Email OTP sent on registered mail-id ",
                    });
                  }

                  if (Object.keys(data).length === 0) {
                    // console.log(data, ">>>>>>>>>");
                    // Handle empty response
                  } else {
                    setLoading(false);

                    if (data.status === "Inactive") {
                      toast.current.show({
                        severity: "warn",
                        summary: "User Inactive",
                        detail:
                          "The user is inactive. Please contact to your administrator.",
                        life: 2000,
                      });
                    } else {
                      sessionStorage.setItem("userName", data.userName);
                      sessionStorage.setItem("userrole", data.userRole);
                      sessionStorage.setItem("emailId", data.emailId);
                      sessionStorage.setItem("status", data.status);
                      setLoading(false);
                    }
                  }
                });
              } else {
                return response.json().then((errorData) => {
                  // Error response handling
                  setLoading(false);
                  // console.warn("Error Response:", errorData);
                  const errorMessage =
                    errorData.message || "Error while registering user";
                  toast.current.show({
                    severity: "warn",
                    summary: "Invalid Credentials",
                    detail: errorMessage,
                  });
                });
              }
            })

            .catch((error) => {
              // Network or other errors
              setLoading(false);

              // console.error("Error...!!:", error);
              toast.current.show({
                severity: "error",
                summary: "User Not Added",
                detail: "Error while registering user",
              });
            })

            .catch((err) => {
              // console.log(err.message, "????");
              toast.current.error("Login Failed due to: " + err.message);
            });
          // setLoading(false);
        }
      } else {
        e.preventDefault();
        // toast.warning("Please accept the terms and conditions...!! ");
        // alert("Please accept the terms and conditions...!! ");
        toast.current.show({
          severity: "warn",
          summary: "Please accept the terms and conditions...!! ",
        });
      }
    };
    const passwordVisibility = () => {
      var x = document.getElementById("password");
      if (x.type === "password") {
        x.type = "text";
        setShowPassword(true);
      } else {
        x.type = "password";
        setShowPassword(false);
      }
    };
    const validate = () => {
      let result = true;
      let isProceed = true;
      let errors = {};
      if (emailId.trim() === "") {
        result = false;

        if (!emailId) {
          errors.emailId = "Please enter the userName";
          isProceed = false;
        } else if (!/^[a-zA-Z0-9]+$/.test(emailId)) {
          errors.emailId = "Please enter a valid alphanumeric userName";
          isProceed = false;
        }

        if (!loginpassword) {
          errors.loginpassword = "Please enter the password";
          isProceed = false;
        }

        setFormErrors(errors);
      }

      return result;
    };
    const backToLogin = () => {
      setShowOtpVerification(false);
      setshowLoginepage(true);
      // alert("hi")
    };
    const signUp = () => {
      navigate("/register");
    };
    const validateOTP = (otp) => {
      // Regular expression to check the OTP format (alphanumeric and 6 characters long)
      const otpRegex = /^[a-zA-Z0-9]{6}$/;
      return otpRegex.test(otp);
    };

    //terms and conditions

    const onclickTerms = () => {};

    const isValidateOTP = () => {
      let isProceed = true;
      let errors = {};

      if (!emailOtp) {
        setLoading(false);
        errors.emailOtp = "Please enter the emailOTP";
        isProceed = false;
      } else if (!validateOTP(emailOtp)) {
        setLoading(false);
        errors.emailOtp =
          "Please enter a valid OTP (alphanumeric, 6 characters)";
        isProceed = false;
      }

      setFormErrors(errors);

      if (!isProceed) {
        toast.warning("Please fill in all the required fields.");
      }

      return isProceed;
    };

    const dialogFuncMap = {
      displayBasic: setDisplayBasic,
    };

    const termsCondition = (name) => {
      dialogFuncMap[`${name}`](true);
    };
    const close = (name) => {
      dialogFuncMap[`${name}`](false);
    };

    const onClickTerms = (e) => {
      // console.log("e.checked: ", e);
      setAcceptedTerms(e);
      // setDisplayBasic(true);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      // console.warn("loggedUserData...!!!", loggedUserData);

      if (isValidateOTP()) {
        // console.log(emailOtp, "emailotp...");

        let data = {
          emailOtp: emailOtp,
          emailId: loggedUserData.emailId,
        };

        const cIter = 200000;
        const kSize = 128;
        const kSeparator = "::";
        const val1 = "abcd65443A";
        const val2 = "AbCd124_09876";
        const val3 = "sa2@3456s";

        // const jsonString = JSON.stringify(data);
        // console.log(jsonString, "jsonString");
        // const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(
        //   CryptoJS.enc.Hex
        // );
        // const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(
        //   CryptoJS.enc.Hex
        // );
        // const passPhrase = "anemoi";
        // const key = CryptoJS.PBKDF2(
        //   `${val1}${val2}${val3}`,
        //   CryptoJS.enc.Hex.parse(salt),
        //   { keySize: kSize / 32, iterations: cIter }
        // );

        // console.log("key", key);
        // let cText = CryptoJS.AES.encrypt(jsonString, key, {
        //   iv: CryptoJS.enc.Hex.parse(iv),
        //   mode: CryptoJS.mode.CBC,
        //   padding: CryptoJS.pad.Pkcs7,
        // });

        // let aesText =
        //   iv +
        //   kSeparator +
        //   salt +
        //   kSeparator +
        //   cText.ciphertext.toString(CryptoJS.enc.Base64);
        // let aesFinalText = btoa(aesText);
        // //  this.newEncryptedObject = {};
        // const encryptedData = aesFinalText;
        // console.log("encrypt data 2 :", encryptedData);

        // console.log("data: ", data);

        fetch(
          `
    ${process.env.REACT_APP_API_KEY}/dam/user/loginUser/forgetPassword/verifyOtp`,
          // dam/user/loginUser/forgetPassword/verifyOtp
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
            // console.warn("result...!!!", result);
            if (result.status === 200) {
              // console.warn("loggedUserData...!!!", loggedUserData);
              result.text().then((resp) => {
                // console.log("resp.....''''''", resp);

                const base64EncodedData = resp;
                const decodedData = atob(base64EncodedData);
                // console.log('toArray',decodedData);
                let toArray = decodedData.split(kSeparator);
                // console.log('toArray',toArray);
                const key = CryptoJS.PBKDF2(
                  `${val1}${val2}${val3}`,
                  CryptoJS.enc.Hex.parse(toArray[1]),
                  {
                    keySize: kSize / 32,
                    iterations: cIter,
                  }
                );
                // console.log(key, 'key');
                let cipherParams = CryptoJS.lib.CipherParams.create({
                  ciphertext: CryptoJS.enc.Base64.parse(toArray[2]),
                });
                //  console.log('cipherParams',cipherParams);

                const _iv = toArray[0];
                let cText1 = CryptoJS.AES.decrypt(cipherParams, key, {
                  iv: CryptoJS.enc.Hex.parse(_iv),
                  mode: CryptoJS.mode.CBC,
                  padding: CryptoJS.pad.Pkcs7,
                });
                // OTP valid::morenarendras98@gmail.com

                // console.log('cText1',cText1);
                const decryptedString = cText1.toString(CryptoJS.enc.Utf8);
                // console.log('decryptedString.......',decryptedString);
                const otpString = decryptedString;
                const parts = otpString.split("::");
                const message = parts[0];
                const email = parts[1];
                const time = parts[2];
                // console.log('email',email);
                // console.log('message',message);
                // console.log('time',time);

                const currentDateTime = new Date();
                currentDateTime.setMinutes(currentDateTime.getMinutes() - 5);

                const serverTime = new Date(time);
                // console.log('converted date time :::',serverTime);

                const localServerTime = new Date(
                  serverTime.getTime() -
                    currentDateTime.getTimezoneOffset() * 60000
                );
                // console.log('converted local date time :::',localServerTime);

                // console.log('current date time - 5 min :::',currentDateTime);

                if (
                  loggedUserData.emailId === email &&
                  message === "OTP valid" &&
                  localServerTime > currentDateTime
                ) {
                  if (
                    loggedUserData.userRole === "Admin" &&
                    loggedUserData.status === "Active"
                  ) {
                    navigate("/dashboardMain");
                  } else if (
                    loggedUserData.userRole === "Reviewer" &&
                    loggedUserData.status === "Active"
                  ) {
                    navigate("/reviewermain");
                  } else if (
                    loggedUserData.userRole === "Viewer" &&
                    loggedUserData.status === "Active"
                  ) {
                    navigate("/bookmarkdoc");
                  } else {
                    alert("Incorrect credentials...!!");
                  }
                } else {
                  // console.log('emal not validate');
                }
              });

              toast.current.show({
                severity: "success",
                summary: "OTP Verified ",
                detail: "OTP Verified Successfully",
                life: 2000,
              });
              // navigate("/ConfirmPassword")
            } else {
              toast.current.show({
                severity: "warn",
                summary: "Invalid OTP",
                detail: "You have entered invalid OTP",
                life: 2000,
              });
            }
          },
          (error) => {
            toast.current.show({
              severity: "error",
              summary: "OTP Not Verify",
              detail: "Error while Verify OTP",
              life: 6000,
            });
          }
        );
      }
    };
    return (
      <>
        <Toast ref={toast} />

        {loading ? (
          <span className="loading">
            <ProgressSpinner />
          </span>
        ) : null}

        <div
          class="grid"
          style={{ position: "relative", display: "-webkit-box " }}
        >
          <img
            style={{
              width: "41.5%",
              height: "100vh",
              objectFit: "cover",
              position: "absolute",
              zIndex: 1,
              marginLeft: "59%",
              marginTop: "-0.6%",
            }}
            src={BackgroundImage}
            alt="Background"
          />
          <div class="col-7" style={{ zIndex: -2 }}>
            <div className="backgroundImagelogin">
              <form onSubmit={proceedLogin}>
                <img
                  style={{
                    width: "7%",
                    height: "100%",
                    color: "black",
                    marginLeft: "4%",
                    marginTop: "1%",
                  }}
                  src={PwC_Logo_Black}
                  alt="PwC_Logo_Black"
                />
                <div className="maindivlogin">
                  <div className="headingStyle">
                    <span style={{ color: "black", fontSize: "17px" }}>
                      Accounting Policy Manual{" "}
                    </span>
                  </div>
                  <div className="headingStyleSec">
                    <span style={{ color: "black", fontSize: "20px" }}>
                      It's nice to have you back!{" "}
                    </span>
                  </div>
                  {showLoginepage && (
                    <div>
                      <div className="inputstyleLogin">
                        <label style={{ color: "black", fontSize: "14px" }}>
                          <b>Email id: </b> <span className="errmsg">*</span>
                        </label>
                        <br />
                        <div style={{ marginTop: "1%" }}>
                          <InputText
                            value={emailId}
                            placeholder="Email id"
                            style={{
                              borderRadius: "2px",
                              width: "40%",
                              height: "37px",
                              border: "none",
                            }}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`form-control ${
                              formErrors.userName ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                      </div>
                      <div className="inputstyleLogin">
                        <label style={{ color: "black", fontSize: "14px" }}>
                          <b>Password: </b> <span className="errmsg">*</span>
                        </label>

                        <br />
                        <div style={{ marginTop: "1%" }}>
                          {/* <span className="p-input-icon-right">
                            <i
                              style={{ cursor: "pointer" }}
                              onClick={passwordVisibility}
                              className={`pi ${
                                showPassword ? "pi-eye" : "pi-eye-slash"
                              }`}
                            /> */}
                          <InputText
                            id="password"
                            style={{
                              borderRadius: "2px",
                              width: "40%",
                              height: "37px",
                              border: "none",
                            }}
                            placeholder="Password"
                            type="password"
                            value={loginpassword}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <i
                            style={{ cursor: "pointer", marginLeft: "-2rem" }}
                            onClick={passwordVisibility}
                            className={`pi ${
                              showPassword ? "pi-eye" : "pi-eye-slash"
                            }`}
                          />
                          {/* </span> */}
                        </div>
                        {formErrors.password && (
                          <div className="invalid-feedback error-message">
                            {formErrors.password}
                          </div>
                        )}
                        <div className="rememberStyle">
                          <span></span>
                          <Checkbox
                            checked={acceptedTerms}
                            onChange={(e) => onClickTerms(e.checked)}
                          />
                          <span>
                            &nbsp; I accept the{" "}
                            <span
                              onClick={() => setDisplayBasic(true)}
                              style={{
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                            >
                              terms & conditions
                            </span>
                          </span>
                        </div>
                        <Dialog
                          visible={displayBasic}
                          style={{
                            width: "80%",
                            height: "100%",
                            backgroundColor: "gray",
                            zoom: "60%",
                          }}
                          onHide={() => close("displayBasic")}
                        >
                          <iframe
                            style={{ height: "100%", width: "100%" }}
                            src={pdfFile}
                            frameborder="0"
                            title="Terms and Conditions"
                          ></iframe>
                        </Dialog>
                        <div class="grid" style={{ marginTop: "1%" }}>
                          <div class="col-2">
                            <Link
                              style={{ color: "black", fontSize: "14px" }}
                              to={"/reset"}
                            >
                              Forgot Password?
                            </Link>
                          </div>
                          <div class="col-10" style={{ width: "25.5%" }}>
                            <button
                              type="submit"
                              disabled={isFormIncomplete}
                              style={{
                                borderRadius: "2px",
                                width: "auto",
                                backgroundColor: "#D04A02",
                                // marginLeft: "5.2rem",
                                float: "right",
                              }}
                              className="p-button-sm btn btn-primary"
                            >
                              Login
                            </button>{" "}
                          </div>
                        </div>
                        <div className="hrStyle">
                          {" "}
                          <hr />
                        </div>
                      </div>
                      <div className="signupStyle">
                        {/* <Link
                          style={{ color: "#FFB601" }}
                          className="btn btn-success"
                          to={"/register"}
                        > */}
                        <button
                          type="submit"
                          style={{
                            borderRadius: "5px",
                            width: "40%",
                            // marginLeft: "18%",
                            color: "black",
                            border: "1.4px solid",
                            height: "36px",
                            fontSize: "90%",
                            cursor: "pointer",
                          }}
                          onClick={signUp}
                          outlined
                        >
                          Sign Up
                        </button>{" "}
                        {/* </Link> */}
                      </div>
                    </div>
                  )}
                  <div className="verifyotpStyle">
                    {showOtpVerification && (
                      <div className="footer">
                        <br />

                        <form className="container">
                          <div style={{ width: "30%" }}>
                            <label style={{ color: "black", fontSize: "14px" }}>
                              <b>Enter OTP </b>
                            </label>
                            <br />
                            <InputText
                              type="password"
                              style={{
                                borderRadius: "2px",
                                width: "100%",
                                height: "37px",
                                border: "none",
                                marginTop: "2%",
                              }}
                              value={emailOtp}
                              onChange={(e) => setOtp(e.target.value)}
                              className={`form-control ${
                                formErrors.emailOtp ? "is-invalid" : ""
                              }`}
                            />{" "}
                            {formErrors.emailOtp && (
                              <div className="invalid-feedback error-message">
                                {formErrors.emailOtp}
                              </div>
                            )}
                            <div>
                              <div class="grid" style={{ marginTop: "2%" }}>
                                <div class="col-8">
                                  <span
                                    style={{
                                      color: "black",
                                      fontSize: "13px",
                                      cursor: "pointer",
                                    }}
                                    onClick={backToLogin}
                                  >
                                    Back
                                  </span>
                                </div>
                                <div class="col-4">
                                  <button
                                    type="submit"
                                    style={{
                                      borderRadius: "2px",
                                      height: "32px",
                                      backgroundColor: "#D04A02",
                                      color: "white",
                                      // marginLeft: "17%",
                                      width: "100%",
                                      cursor: "pointer",
                                    }}
                                    onClick={handleSubmit}
                                    className="p-button-danger p-button-sm"
                                  >
                                    Verify
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>

                {/* old login page code */}

                {/* <Card style={{ borderRadius: "2px" }} className="loginCard">
            <div className="card_module">
              <div className="card-header">
                <img
                  style={{ width: "20%", height: "100%", color: "black" }}
                  src={PwC_Logo_Black}
                  alt="PwC_Logo_Black"
                />

                <h3 style={{ color: "black" }}>Accounting Policy Manual </h3>
              </div>
              <br />
              <div className="card-body">
                <label style={{ color: "black" }}>
                  Email Id: <span className="errmsg">*</span>
                </label>
                <br />
                <InputText
                  value={emailId}
                  style={{ borderRadius: "2px", width: "100%", height: "40px" }}
                  onChange={(e) => setUsername(e.target.value)}
                  // className="form-control"
                  className={`form-control ${
                    formErrors.userName ? "is-invalid" : ""
                  }`}
                />

                {formErrors.userName && (
                  <div className="invalid-feedback error-message">
                    {formErrors.userName}
                  </div>
                )}
                <br />
                <br />
                <label style={{ color: "black" }}>
                  Password: <span className="errmsg">*</span>
                </label>
                <br />
                <div className="p-inputgroup">
                  <InputText
                    type="password"
                    style={{ height: "40px" }}
                    value={loginpassword}
                    onChange={(e) => setPassword(e.target.value)}
                    toggleMask
                  />
                </div>
                {formErrors.password && (
                  <div className="invalid-feedback error-message">
                    {formErrors.password}
                  </div>
                )}
                <br />
                <Link style={{ color: "#FFB601" }} to={"/reset"}>
                  Forgot Password?
                </Link>
                <br />
                <br />
                {/* className="footer"
                 */}
                {/* <div>
                  <button
                    type="submit"
                    disabled={isFormIncomplete}
                    style={{
                      borderRadius: "2px",
                      width: "100%",
                      backgroundColor: "#D04A02",
                    }}
                    className="p-button-sm btn btn-primary"
                  >
                    LOGIN
                  </button>{" "}
                </div>

                <div>
                  <br />
                  Don't have an account? |{" "}
                  <Link
                    style={{ color: "#FFB601" }}
                    className="btn btn-success"
                    to={"/register"}
                  >
                    Register now
                  </Link>
                </div>
              </div> */}
                <br />

                {/* {showOtpVerification && (
                <div className="footer">
                  <hr></hr>
                  <br /> */}
                {/* onSubmit={handleSubmit} */}
                {/* <form className="container">
                    <div class="grid">
                      <div class="col">
                        <input
                          type="password"
                          value={emailOtp}
                          placeholder="Enter OTP"
                          style={{ height: "31px" }}
                          onChange={(e) => setOtp(e.target.value)}
                          className={`form-control ${
                            formErrors.emailOtp ? "is-invalid" : ""
                          }`}
                        ></input>
                        {formErrors.emailOtp && (
                          <div className="invalid-feedback error-message">
                            {formErrors.emailOtp}
                          </div>
                        )}
                      </div>

                      <div class="col">
                        <Button
                          type="submit"
                          style={{
                            borderRadius: "2px",
                            backgroundColor: "#D04A02",
                          }}
                          label="Verify OTP"
                          onClick={handleSubmit}
                          className="p-button-danger p-button-sm"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div> */}
                {/* </Card> */}
              </form>
            </div>
            <div className="copyRightStyle">
              <hr style={{ width: "98%", marginBottom: "1%" }} />
              © 2024 PwC. All rights reserved. PwC refers to India member firm
              and may sometimes refer to the PwC network.
              <br /> Each member firm is a separate legal entity. Please see
              www.pwc.com/structure for further details.
            </div>
          </div>
          <div class="col-5" className="patternBackgStyle"></div>
        </div>
      </>
    );
  } else if (loginStatus === false) {
    // navigate("/Idam");

    sessionStorage.clear();
        sessionStorage.setItem("trigger", loginStatus);

    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    console.log("code: ", code);
    if (code) {
      getAccessToken(code);
    } else {
      const loginUrl = `${login_url}?response_type=${reponse_type}&client_id=${client_id}&redirect_uri=${redirect_url}&scope=${scope}`;
      window.location.href = loginUrl;
    }

    function getAccessToken(code) {
      // console.log("code: ", code);
      const data = new URLSearchParams({
        code: code,
        redirect_uri: redirect_url,
        grant_type: grant_type,
        client_id: client_id,
        client_secret: secret,
      });

      axios
        .post(access_token, data)
        .then((response) => {
          ProceedLogin(response.data);
        })
        .catch((error) => {
          console.error(error);
          alert("Error while getting userinfo");
        });
    }

    function getTokenInfo(token) {
      try {
        return jwt_decode(token);
      } catch (error) {
        return null;
      }
    }

    function ProceedLogin(data) {
      // e.preventDefault();
      // console.log("token data: ",data);

      const allUserData = getTokenInfo(data.id_token);
      // console.log("extracted token data: ",allUserData);
      usernameupdate(allUserData.upn);

      if (true) {
        fetch(
          `${process.env.REACT_APP_API_KEY}/dam/user/email/` + allUserData.upn
        )
          .then((res) => {
            return res.json();
          })
          .then((resp) => {
            // console.log(resp, "///////////");
            // console.log("userData: ", resp);
            sessionStorage.setItem("emailId", resp.emailId);
            sessionStorage.setItem("userName", resp.userName);
            sessionStorage.setItem("userrole", resp.userRole);

            if (resp.userRole === "Admin" && resp.status === "Active") {
              usenavigate("/dashboardMain");
            } else if (
              resp.userRole === "Reviewer" &&
              resp.status === "Active"
            ) {
              usenavigate("/reviewermain");
            } else if (resp.userRole === "Viewer" && resp.status === "Active") {
              usenavigate("/bookmarkdoc");
            } else {
              alert("incorrect credentials...!!");
            }
          })
          .catch((err) => {
            alert("User details not found..!!")
            const logoutUrl = "https://login-stg.pwc.com/openam/UI/Logout";
            // console.log("inside error log");
            window.location.href = logoutUrl;
          });
      }
    }
  }
  //  else{
  //   alert("someting went wrong...!!")
  //  }
};

export default Login;
