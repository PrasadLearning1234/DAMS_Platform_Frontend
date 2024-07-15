import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { ProgressSpinner } from "primereact/progressspinner";
import CryptoJS from "crypto-js";
import { format } from "date-fns";
import BackgroundImage from "../Assets/Grouplogin1.png";
import PwC_Logo_Black from "../Assets/PwC_Logo_Black.png";
import { InputText } from "primereact/inputtext";

const SignUpDemo = () => {
  const [userName, setUsername] = useState("");
  const [loginpassword, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [emailId, setEmailId] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [emailOtp, setOtp] = useState(null);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(Boolean);
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(Boolean);
  const [showconfirmPassword, setShowconfirmPassword] = useState(Boolean);
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const IsValidate = () => {
    let isProceed = true;
    let errors = {};

    if (!userName) {
      errors.userName = "Please enter the userName";
      isProceed = false;
    } else if (!/^[a-zA-Z ]+$/.test(userName)) {
      errors.userName = "Please enter a valid  userName";
      isProceed = false;
    }

    if (!loginpassword) {
      errors.loginpassword = "Please enter the password";
      isProceed = false;
    } else {
      // Password requirements
      const minLength = 8;
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const numberRegex = /[0-9]/;

      if (loginpassword.length < minLength) {
        errors.loginpassword = "Password should be at least 8 characters long.";
        isProceed = false;
      } else if (!specialCharRegex.test(loginpassword)) {
        errors.loginpassword =
          "Password should contain at least one special character.";
        isProceed = false;
      } else if (!uppercaseRegex.test(loginpassword)) {
        errors.loginpassword =
          "Password should contain at least one uppercase letter.";
        isProceed = false;
      } else if (!lowercaseRegex.test(loginpassword)) {
        errors.loginpassword =
          "Password should contain at least one lowercase letter.";
        isProceed = false;
      } else if (!numberRegex.test(loginpassword)) {
        errors.loginpassword = "Password should contain at least one number.";
        isProceed = false;
      }
    }

    if (!emailId) {
      errors.emailId = "Please enter the emailId";
      isProceed = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$/.test(
        emailId
      )
    ) {
      errors.emailId = "Please enter a valid email";
      isProceed = false;
    }

    setFormErrors(errors);

    if (!isProceed) {
      toast.warning("Please fill in all the required fields.");
    }

    return isProceed;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (IsValidate()) {
      // data.
      if (loginpassword === confirmpassword) {
        let data = {
          userName,
          password: btoa(loginpassword),

          emailId,
        };
        fetch(`${process.env.REACT_APP_API_KEY}/dam/user/submit`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              return response.json().then((data) => {
                // Successful response handling
                // console.warn("Response:", data);
                toast.current.show({
                  severity: "success",
                  summary: "User Added",
                  detail: "User Registered Successfully",
                  life: 2000,
                });

                setTimeout(() => {
                  navigate("/");
                }, 2000);
              });
            } else {
              return response.json().then((errorData) => {
                // Error response handling
                // console.warn("Error Response:", errorData);
                const errorMessage =
                  errorData.message || "Error while registering user";
                toast.current.show({
                  severity: "warn",
                  summary: "User Not Added",
                  detail: errorMessage,
                  life: 2000,
                });
              });
            }
          })
          .catch((error) => {
            // Network or other errors
            // console.error("Error:", error);
            toast.current.show({
              severity: "error",
              summary: "User Not Added",
              detail: "Error while registering user",
              life: 2000,
            });
          });
      } else {
        toast.current.show({
          severity: "warn",
          summary: "Password Not matched",
          detail: "Entered Password & Confirm password does not matched",
        });
      }
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
  const passwordVisibility1 = () => {
    var y = document.getElementById("confirmpasswords");
    if (y.type === "password") {
      y.type = "text";
      setShowconfirmPassword(true);
    } else {
      y.type = "password";
      setShowconfirmPassword(false);
    }
  };

  const IsValidate1 = () => {
    let isProceed = true;
    let errors = {};

    if (!emailId) {
      errors.emailId = "Please enter the emailId";
      isProceed = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$/.test(
        emailId
      )
    ) {
      errors.emailId = "Please enter a valid email";
      isProceed = false;
    }

    setFormErrors(errors);

    if (!isProceed) {
      toast.warning("Please fill in all the required fields.");
    }

    return isProceed;
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();

    // if(emailId.includes('pwc.com')){
    //   alert("Email id should be other than PwC domain")
    // }
    // else{
    if (IsValidate1()) {
      let data = { emailId };
      setLoading(true);

      fetch(
        ` ${process.env.REACT_APP_API_KEY}/dam/user/loginUser/RegisterEmail/sendOtp`,
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
          // console.log("result: "+result);
          if (result.status === 200) {
            // console.warn("result...!!!", result);
            result.json().then((resp) => {
              // console.warn("resp", resp);
            });

            toast.current.show({
              severity: "success",
              summary: "OTP Sent",
              detail: "OTP Sent Successfully",
            });
            setLoading(false);
          }
          //  else {
          //   toast.current.show({
          //     severity: "warn",
          //     summary: "OTP Not Send",
          //     detail: "Invalid Credential",
          //   });
          //   setLoading(false);
          // }
          else {
            result.json().then((errorData) => {
              // console.log(errorData.message, "errordata");
              toast.current.show({
                severity: "error",
                summary: "Failed",
                detail:
                  errorData.message ||
                  "An error occurred during the adding keyword.",
              });
            });
          }
          setLoading(false);
        },
        (error) => {
          toast.current.show({
            severity: "error",
            summary: "OTP Not Send",
            detail: "Error while Sending OTP",
          });
          setLoading(false);
        }
      );
    }
  // }
  };

  const validateOTP = (otp) => {
    // Regular expression to check the OTP format (alphanumeric and 6 characters long)
    const otpRegex = /^[a-zA-Z0-9]{6}$/;
    return otpRegex.test(otp);
  };

  const IsValidate2 = () => {
    let isProceed = true;
    let errors = {};

    if (!emailId) {
      errors.emailId = "Please enter the emailId";
      isProceed = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$/.test(
        emailId
      )
    ) {
      errors.emailId = "Please enter a valid email";
      isProceed = false;
    }

    if (!emailOtp) {
      setLoading(false);
      errors.emailOtp = "Please enter the emailOTP";
      isProceed = false;
    } else if (!validateOTP(emailOtp)) {
      setLoading(false);
      errors.emailOtp = "Please enter a valid OTP (alphanumeric, 6 characters)";
      isProceed = false;
    }

    setFormErrors(errors);

    if (!isProceed) {
      toast.warning("Please fill in all the required fields.");
    }

    return isProceed;
  };

  const isFormIncomplete = !emailOtp;
  function verifyOTP(e) {
    e.preventDefault();

    if (IsValidate2()) {
      const data = {
        emailId,
        emailOtp,
      };
      const cIter = 200000;
      const kSize = 128;
      const kSeparator = "::";
      const val1 = "abcd65443A";
      const val2 = "AbCd124_09876";
      const val3 = "sa2@3456s";

      fetch(
        ` ${process.env.REACT_APP_API_KEY}/dam/user/loginUser/RegisterEmail/verifyOtp`,
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
          if (result.status === 200) {
            // console.warn("result...!!!", result);
            result.text().then((resp) => {
              // console.warn("resp", resp);
              // console.log('resp..././././',resp);
              const base64EncodedData = resp;
              const decodedData = atob(base64EncodedData);
              // const decodedData = base64EncodedData;
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

              if (
                data.emailId === email &&
                message === "OTP valid" &&
                localServerTime > currentDateTime
              ) {
                setIsVerified(true);
              }
            });

            setShowOtpVerification(true);
            toast.current.show({
              severity: "success",
              summary: "OTP Verified ",
              detail: "OTP Verified Successfully",
            });
          } else {
            toast.current.show({
              severity: "warn",
              summary: "OTP verification failed",
              detail: "Please enter valid Email and OTP",
            });
          }
        },
        (error) => {
          toast.current.show({
            severity: "error",
            summary: "OTP Not Verified",
            detail: "Error while Verifying OTP",
          });
        }
      );
    }
  }

  return (
    <div>
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
            height: "106vh",
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
          <div className="backgroundImage">
            <form onSubmit={handleSubmit} style={{ zoom: "85%" }}>
              <img
                style={{
                  width: "6%",
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
                    <b>User Registration</b>{" "}
                  </span>
                </div>
                <div className="inputstyleLogin">
                  <label style={{ color: "black", fontSize: "14px" }}>
                    <b>Name </b> <span className="errmsg">*</span>
                  </label>
                  <br />
                  <div style={{ marginTop: "0.8%" }}>
                    <InputText
                      style={{
                        borderRadius: "2px",
                        width: "40%",
                        height: "33px",
                        border: "none",
                      }}
                      placeholder="Name"
                      value={userName}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`form-control ${
                        formErrors.userName ? "is-invalid" : ""
                      }`}
                    />
                    {formErrors.userName && (
                      <div className="invalid-feedback error-message">
                        {formErrors.userName}
                      </div>
                    )}
                  </div>
                </div>
                <div class="gird">
                  <div class="col-8" className="inputstyleLogin">
                    <label style={{ color: "black", fontSize: "14px" }}>
                      <b>Email Id </b> <span className="errmsg">*</span>
                    </label>
                    <br />
                    <div>
                      <InputText
                        style={{
                          borderRadius: "2px",
                          width: "40%",
                          height: "33px",
                          border: "none",
                        }}
                        placeholder="Email"
                        value={emailId}
                        readOnly={isVerified}
                        onChange={(e) => setEmailId(e.target.value)}
                        className={`form-control ${
                          formErrors.emailId ? "is-invalid" : ""
                        }`}
                      />
                      <button
                        label="Send OTP "
                        onClick={handleSubmit1}
                        className="p-button-sm btn btn-primary"
                        style={{
                          borderRadius: "4px",
                          width: "auto",
                          backgroundColor: "#D04A02",
                          marginLeft: "2%",
                          color: "white",
                          marginTop: "1%",
                          height: "30px",
                        }}
                      >
                        Send OTP
                      </button>{" "}
                    </div>
                    {formErrors.emailId && (
                      <div className="invalid-feedback error-message">
                        {formErrors.emailId}
                      </div>
                    )}
                  </div>
                </div>
                <div class="gird">
                  <div class="col-8" className="inputstyleLogin">
                    <label style={{ color: "black", fontSize: "14px" }}>
                      <b>OTP </b> <span className="errmsg">*</span>
                    </label>
                    <br />
                    <div>
                      <InputText
                        style={{
                          borderRadius: "2px",
                          width: "40%",
                          height: "33px",
                          border: "none",
                        }}
                        type="password"
                        readOnly={isVerified}
                        value={emailOtp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={`form-control ${
                          formErrors.emailOtp ? "is-invalid" : ""
                        }`}
                      />
                      <button
                        label="Verify OTP "
                        className="p-button-sm btn btn-primary"
                        style={{
                          borderRadius: "4px",
                          width: "auto",
                          backgroundColor: "#d04a02",
                          marginLeft: "2%",
                          color: "white",
                          marginTop: "1%",
                          height: "30px",
                        }}
                        onClick={verifyOTP}
                      >
                        Verify OTP
                      </button>{" "}
                    </div>
                    {formErrors.emailOtp && (
                      <div className="invalid-feedback error-message">
                        {formErrors.emailOtp}
                      </div>
                    )}
                  </div>
                </div>
                <div className="inputstyleLogin">
                  <label style={{ color: "black", fontSize: "14px" }}>
                    <b>Password </b> <span className="errmsg">*</span>
                  </label>
                  <br />
                  {/* <div style={{ marginTop: "0.8%" }}>
                    <InputText
                      style={{
                        borderRadius: "2px",
                        width: "25%",
                        height: "33px",
                        border: "none",
                      }}
                      value={loginpassword}
                      onChange={(e) => setPassword(e.target.value)}
                      toggleMask
                      type="password"
                    />
                    {formErrors.loginpassword && (
                      <div className="invalid-feedback error-message">
                        {formErrors.loginpassword}
                      </div>
                    )}
                  </div> */}
                  <div>
                    <InputText
                      id="password"
                      style={{
                        borderRadius: "2px",
                        width: "40%",
                        height: "37px",
                        border: "none",
                      }}
                      type="password"
                      value={loginpassword}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`form-control ${
                        formErrors.loginpassword ? "is-invalid" : ""
                      }`}
                    />
                    <i
                      style={{ cursor: "pointer", marginLeft: "-2rem" }}
                      onClick={passwordVisibility}
                      className={`pi ${
                        showPassword ? "pi-eye" : "pi-eye-slash"
                      }`}
                    />
                  </div>
                  {formErrors.loginpassword && (
                    <div className="invalid-feedback error-message">
                      {formErrors.loginpassword}
                    </div>
                  )}
                </div>
                <div className="inputstyleLogin">
                  <label style={{ color: "black", fontSize: "14px" }}>
                    <b>Confirm Password </b> <span className="errmsg">*</span>
                  </label>
                  <br />
                  <div>
                    <InputText
                      id="confirmpasswords"
                      style={{
                        borderRadius: "2px",
                        width: "40%",
                        height: "37px",
                        border: "none",
                      }}
                      value={confirmpassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type="password"
                      className={`form-control ${
                        formErrors.confirmpassword ? "is-invalid" : ""
                      }`}
                    />
                    <i
                      style={{ cursor: "pointer", marginLeft: "-2rem" }}
                      onClick={passwordVisibility1}
                      className={`pi ${
                        showconfirmPassword ? "pi-eye" : "pi-eye-slash"
                      }`}
                    />
                    {formErrors.confirmpassword && (
                      <div className="invalid-feedback error-message">
                        {formErrors.confirmpassword}
                      </div>
                    )}
                  </div>
                  {/* <div style={{ marginTop: "0.8%" }}>
                    <InputText
                      style={{
                        borderRadius: "2px",
                        width: "25%",
                        height: "33px",
                        border: "none",
                      }}
                      value={confirmpassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      toggleMask
                      type="password"
                    />
                    {formErrors.confirmpassword && (
                      <div className="invalid-feedback error-message">
                        {formErrors.confirmpassword}
                      </div>
                    )}
                  </div> */}
                </div>
                <div style={{ paddingTop: "1%", width: "40%" }}>
                  {" "}
                  <hr />
                </div>

                <div style={{width:'40%'}}>
                  <button
                    type="button"
                    label="Cancel"
                    style={{
                      borderRadius: "4px",
                      width: "auto",
                      backgroundColor: "#d04a02",
                      // marginLeft: "20%",
                      color: "white",
                      marginTop: "1%",
                      height: "30px",
                      fontSize: "15px",
                    }}
                    className="p-button-warn p-button-sm"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </button>
                  {showOtpVerification && (
                    <Button
                      type="submit"
                      style={{
                        borderRadius: "2px",
                        width: "auto",
                        backgroundColor: "#d04a02",
                        // marginLeft: "20%",
                        color: "white",
                        marginTop: "1%",
                        height: "30px",
                        fontSize: "15px",
                        float: "right",
                      }}
                      label="Submit"
                      className="p-button-danger p-button-sm"
                    />
                  )}
                </div>

                {/* <button
                  type="submit"
                  label="Verify OTP"
                  className="p-button-danger p-button-sm"
                  style={{
                    borderRadius: "2px",
                    width: "10%",
                    backgroundColor: "#D04A02",
                    marginLeft: "20%",
                    color: "white",
                    marginTop: "1%",
                  }}
                >
                  Login
                </button>{" "} */}
              </div>
            </form>
          </div>
          <div className="copyRightStyle">
            <hr style={{ width: "98%", marginBottom: "1%" }} />
            © 2024 PwC. All rights reserved. PwC refers to India member firm and
            may sometimes refer to the PwC network. <br /> Each member firm is a
            separate legal entity. Please see www.pwc.com/structure for further
            details.
          </div>
        </div>
        <div class="col-5" className="patternBackgStyle"></div>
      </div>

      {/* <Card className="register_module">
        <div className="card_module">
         
          <form className="container" onSubmit={handleSubmit}>
            <div className="card">
             
              <div className="card-header">
                <h3 style={{ color: "black" }}>USER REGISTRATION</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label style={{ color: "black" }}>
                        Name : <span className="errmsg">*</span>
                      </label>
                      <br />

                      <input
                        value={userName}
                        
                        onChange={(e) => setUsername(e.target.value)}
                        className={`form-control ${
                          formErrors.userName ? "is-invalid" : ""
                        }`}
                      ></input>
                      {formErrors.userName && (
                        <div className="invalid-feedback error-message">
                          {formErrors.userName}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div class="grid">
                      <div class="col">
                        <div className="form-group">
                          <label style={{ color: "black" }}>
                            Email Id : <span className="errmsg">*</span>
                          </label>
                          <input
                            value={emailId}
                            readOnly={isVerified}
                            onChange={(e) => setEmailId(e.target.value)}
                            className={`form-control ${
                              formErrors.emailId ? "is-invalid" : ""
                            }`}
                          ></input>
                          {formErrors.emailId && (
                            <div className="invalid-feedback error-message">
                              {formErrors.emailId}
                            </div>
                          )}
                        </div>
                       
                      </div>
                      
                      <div class="col">
                        <br />

                        <button
                          label="Send OTP "
                          className="p-button-sm btn btn-primary"
                          style={{
                            height: "35px",
                            borderRadius: "2px",
                            fontSize: "16px",
                            backgroundColor:"#D04A02"
                          }}
                          onClick={handleSubmit1}
                        >
                          Send OTP
                        </button>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div class="grid">
                        <div class="col">
                          <label style={{ color: "black" }}>
                            OTP : <span className="errmsg">*</span>
                          </label>
                          <input
                            type="password"
                            readOnly={isVerified}
                            value={emailOtp}
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
                          <br />

                          <button
                            className="p-button-sm btn btn-primary"
                            disabled={isFormIncomplete}
                            label="Verify OTP "
                            style={{
                              height: "35px",
                              borderRadius: "2px",
                              fontSize: "16px",
                              backgroundColor:"#D04A02"
                            }}
                            onClick={verifyOTP}
                          >
                            Verify OTP
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label style={{ color: "black" }}>
                        Password :  <span className="errmsg">*</span>
                      </label>
                      <br />

                      <div className="p-inputgroup">
                        <Password
                          style={{ height: "35px", width: "85%" }}
                          value={loginpassword}
                          onChange={(e) => setPassword(e.target.value)}
                          toggleMask
                        />
                      </div>

                      {formErrors.loginpassword && (
                        <div className="invalid-feedback error-message">
                          {formErrors.loginpassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label style={{ color: "black" }}>
                        Confirm Password : <span className="errmsg">*</span>
                      </label>
                      <br />

                      <div className="p-inputgroup">
                        <Password
                          style={{ height: "35px", width: "85%" }}
                          value={confirmpassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          toggleMask
                        />
                      </div>

                      {formErrors.confirmpassword && (
                        <div className="invalid-feedback error-message">
                          {formErrors.confirmpassword}
                        </div>
                      )}
                    </div>
                  </div>

                 
                </div>
              </div>

              <div className="card-footer" >
              


                  {showOtpVerification && (
                  <Button
                    type="submit"
                    style={{ borderRadius: "2px" ,backgroundColor:"#D04A02"}}
                    label="Submit"
                    className="p-button-danger p-button-sm"
                  />
                  )} 


               <Button
                  type="button"
                  label="Cancel"
                  style={{ borderRadius: "2px",backgroundColor:"#22992E",marginLeft:"20px"}}
                  className="p-button-warn p-button-sm"
                  onClick={() => navigate("/")}
                />
           
              </div>
              <br />
              <div style={{marginLeft:"10%"}}>

              Already have an Account? | <Link
              
                style={{color:"#FFB601"}}
                className="btn btn-success"
                to={"/login"}
              >
                {" "}
            Login now
              </Link>
              </div>
            </div>
          </form>
        </div>
     
      </Card> */}
    </div>
  );
};

export default SignUpDemo;
