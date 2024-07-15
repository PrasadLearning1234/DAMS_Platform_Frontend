import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Password } from "primereact/password";
import { ProgressSpinner } from "primereact/progressspinner";
import BackgroundImage from "../Assets/Grouplogin1.png";
import PwC_Logo_Black from "../Assets/PwC_Logo_Black.png";
import { InputText } from "primereact/inputtext";

const SignUpDemo = () => {
  const [emailId, setEmailId] = useState("");
  const [loginpassword, setPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const toast = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword1, setShowPassword1] = useState(Boolean);
  const [showconfirmPassword1, setShowconfirmPassword1] = useState(Boolean);
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const passwordVisibility2 = () => {
    var x = document.getElementById("password1");
    if (x.type === "password") {
      x.type = "text";
      setShowPassword1(true);
    } else {
      x.type = "password";
      setShowPassword1(false);
    }
  };
  const passwordVisibility3 = () => {
    var y = document.getElementById("confirmpassword1");
    if (y.type === "password") {
      y.type = "text";
      setShowconfirmPassword1(true);
    } else {
      y.type = "password";
      setShowconfirmPassword1(false);
    }
  };

  const IsValidate = () => {
    let isProceed = true;
    let errors = {};

    if (!emailId) {
      setLoading(false);
      errors.emailId = "Please enter the emailId";
      isProceed = false;
    } else if (
      !/^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$/.test(
        emailId
      )
    ) {
      setLoading(false);
      errors.emailId = "Please enter a valid email";
      isProceed = false;
    }

    if (!loginpassword) {
      setLoading(false);
      errors.loginpassword = "Please enter the password";
      isProceed = false;
    } else if (loginpassword.length < 8) {
      setLoading(false);
      errors.loginpassword = "Password should be at least 8 characters long";
      isProceed = false;
    } else if (!/\d/.test(loginpassword)) {
      setLoading(false);
      errors.loginpassword = "Password should contain at least one digit";
      isProceed = false;
    } else if (!/[a-zA-Z]/.test(loginpassword)) {
      setLoading(false);
      errors.loginpassword = "Password should contain at least one letter";
      isProceed = false;
    } else {
      // Password is valid
      isProceed = true;
    }

    if (!confirmNewPassword) {
      setLoading(false);
      errors.confirmNewPassword = "Please enter the password";
      isProceed = false;
    } else if (confirmNewPassword.length < 8) {
      setLoading(false);
      errors.confirmNewPassword =
        "Password should be at least 8 characters long";
      isProceed = false;
    } else if (!/\d/.test(confirmNewPassword)) {
      setLoading(false);
      errors.confirmNewPassword = "Password should contain at least one digit";
      isProceed = false;
    } else if (!/[a-zA-Z]/.test(confirmNewPassword)) {
      setLoading(false);
      errors.confirmNewPassword = "Password should contain at least one letter";
      isProceed = false;
    } else {
      // Password is valid
      isProceed = true;
    }

    setFormErrors(errors);

    if (!isProceed) {
      toast.warning("Please fill in all the required fields.");
    }

    return isProceed;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (IsValidate()) {
      let data = {
        emailId,

        password: btoa(loginpassword),
        confirmPassword: btoa(confirmNewPassword),
        // password,
        // confirmPassword
      };

      // console.log("data to reset password: ", data);

      if (data.password === data.confirmPassword) {
        fetch(
          ` ${process.env.REACT_APP_API_KEY}/dam/user/loginUser/forgetPassword/createNewPassword`,
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
              result.json().then((resp) => {
                // console.warn("resp", resp);
              });

              setLoading(false);

              toast.current.show({
                severity: "success",
                summary: "Password Reset",
                detail: "Password Reset Successfully",
              });

              setTimeout(() => {
                navigate("/");
              }, 2000);
            } else {
              setLoading(false);
              toast.current.show({
                severity: "warn",
                summary: "Incorrect Credentials",
                detail: "Please enter valid data",
              });
            }
          },
          (error) => {
            setLoading(false);
            toast.current.show({
              severity: "error",
              summary: "Password Not Reset",
              detail: "Error while Reseting Password",
            });
          }
        );
      } else {
        setLoading(false);
        toast.current.show({
          severity: "warn",
          summary: "Password Not matched",
          detail: "Entered Password & Confirm password does not matched",
        });
      }
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
            <form onSubmit={handleSubmit}>
              <img
                style={{
                  width: "8%",
                  height: "100%",
                  color: "black",
                  marginLeft: "4%",
                  marginTop: "1%",
                }}
                src={PwC_Logo_Black}
                alt="PwC_Logo_Black"
              />
              <div className="maindivlogin" style={{ marginTop: "1%" }}>
                <div className="headingStyle">
                  <span style={{ color: "black", fontSize: "17px" }}></span>
                  Accounting Policy Manual{" "}
                </div>
                <div className="headingStyleSec">
                  <span style={{ color: "black", fontSize: "20px" }}>
                    <b>Create Password</b>{" "}
                  </span>
                </div>
                <div className="inputstyleLogin">
                  <label style={{ color: "black", fontSize: "14px" }}>
                    <b>Email ID: </b> <span className="errmsg">*</span>
                  </label>
                  <br />
                  <div style={{ marginTop: "1%" }}>
                    <InputText
                      style={{
                        borderRadius: "2px",
                        width: "40%",
                        height: "37px",
                        border: "none",
                      }}
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                      className={`form-control ${
                        formErrors.emailId ? "is-invalid" : ""
                      }`}
                    />
                    {formErrors.emailId && (
                      <div className="invalid-feedback error-message">
                        {formErrors.emailId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="inputstyleLogin">
                  <label style={{ color: "black", fontSize: "14px" }}>
                    <b>Password: </b> <span className="errmsg">*</span>
                  </label>
                  <br />
                  {/* <span style={{ marginTop: "0.8%" }} className="p-input-icon-right">
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={passwordVisibility2}
                      className={`pi ${
                        showPassword1 ? "pi-eye" : "pi-eye-slash"
                      }`}
                    /> */}
                  <div style={{ marginTop: "1%" }}>
                    <InputText
                      id="password1"
                      style={{
                        borderRadius: "2px",
                        width: "40%",
                        height: "37px",
                        border: "none",
                      }}
                      type="password"
                      value={loginpassword}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <i
                      style={{ cursor: "pointer", marginLeft: "-2rem" }}
                      onClick={passwordVisibility2}
                      className={`pi ${
                        showPassword1 ? "pi-eye" : "pi-eye-slash"
                      }`}
                    />
                    {formErrors.emailOtp && (
                      <div className="invalid-feedback error-message">
                        {formErrors.emailOtp}
                      </div>
                    )}
                  </div>

                  {/* </span> */}
                  {/* <div style={{ marginTop: "1%" }}>
                    <InputText
                      type="password"
                      style={{
                        borderRadius: "2px",
                        width: "30%",
                        height: "37px",
                        border: "none",
                      }}
                      value={loginpassword}
                      onChange={(e) => setPassword(e.target.value)}
                      toggleMask
                    />
                    {formErrors.emailOtp && (
                      <div className="invalid-feedback error-message">
                        {formErrors.emailOtp}
                      </div>
                    )}
                  </div> */}
                </div>
                <div className="inputstyleLogin">
                  <label style={{ color: "black", fontSize: "14px" }}>
                    <b>Confirm Password: </b> <span className="errmsg">*</span>
                  </label>
                  <br />

                  {/* <span style={{ marginTop: "0.8%" }} className="p-input-icon-right">
                    <i
                      style={{ cursor: "pointer" }}
                      onClick={passwordVisibility3}
                      className={`pi ${
                        showconfirmPassword1 ? "pi-eye" : "pi-eye-slash"
                      }`}
                    /> */}
                  <div style={{marginTop:'1%'}}>
                    <InputText
                      id="confirmpassword1"
                      style={{
                        borderRadius: "2px",
                        width: "40%",
                        height: "37px",
                        border: "none",
                      }}
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <i
                      style={{ cursor: "pointer", marginLeft: "-2rem" }}
                      onClick={passwordVisibility3}
                      className={`pi ${
                        showconfirmPassword1 ? "pi-eye" : "pi-eye-slash"
                      }`}
                    />
                    {formErrors.confirmNewPassword && (
                      <div className="invalid-feedback error-message">
                        {formErrors.confirmNewPassword}
                      </div>
                    )}
                  </div>

                  {/* </span> */}
                  {/* <div style={{ marginTop: "1%" }}>
                    <InputText
                      type="password"
                      style={{
                        borderRadius: "2px",
                        width: "30%",
                        height: "37px",
                        border: "none",
                      }}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      toggleMask
                    />
                    {formErrors.confirmNewPassword && (
                      <div className="invalid-feedback error-message">
                        {formErrors.confirmNewPassword}
                      </div>
                    )}
                  </div> */}
                </div>
                <div className="hrStyle">
                  {" "}
                  <hr />
                </div>
                <div style={{ width: "40%" }}>
                  <button
                    type="submit"
                    className="p-button-danger p-button-sm"
                    style={{
                      borderRadius: "2px",
                      width: "auto",
                      backgroundColor: "#D04A02",
                      // marginLeft: "23%",
                      color: "white",
                      marginTop: "1%",
                      float: "right",
                    }}
                  >
                    Reset Password
                  </button>{" "}
                </div>
              </div>
            </form>
          </div>
          <div className="copyRightStyle">
            <hr style={{ width: "98%", marginBottom: "1%" }} />
            © 2024 PwC. All rights reserved. PwC refers to India member firm and
            may sometimes refer to the PwC network. <br />
            Each member firm is a separate legal entity. Please see
            www.pwc.com/structure for further details.
          </div>
        </div>
        <div class="col-5" className="patternBackgStyle"></div>
      </div>

      {/* <Card style={{ width: "30%", marginTop: "8%", borderRadius: "2px", marginLeft: "34%",padding:"20px" ,boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)"}} >
        <div className="offset-lg-3 col-lg-6">
          <form className="container" onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <h3 style={{ color: "black" }}>CREATE PASSWORD</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label style={{ color: "black" }}>
                        Email Id: <span className="errmsg">*</span>
                      </label>
                      <input

                        value={emailId}
                        onChange={(e) => setEmailId(e.target.value)}
                        className={`form-control ${formErrors.emailId ? "is-invalid" : ""
                          }`}
                      ></input>
                      {formErrors.emailId && (
                        <div className="invalid-feedback error-message">
                          {formErrors.emailId}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label style={{ color: "black" }}>
                        Password: <span className="errmsg">*</span>
                      </label>
                      <br />

                      <div className="p-inputgroup">


                        <Password style={{ height: "40px" }} value={loginpassword} onChange={(e) => setPassword(e.target.value)} toggleMask />
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
                        Confirm Password: <span className="errmsg">*</span>
                      </label>



                      <div className="p-inputgroup">

                        <Password style={{ height: "40px" }} value={confirmNewPassword} onChange={(e) => setConfirmPassword(e.target.value)} toggleMask />
                      </div>
                      {formErrors.confirmNewPassword && (
                        <div className="invalid-feedback error-message">
                          {formErrors.confirmNewPassword}
                        </div>
                      )}
                    </div>
                  </div>


                </div>
              </div>
              <div className="card-footer">
                <Button
                  type="submit"
                  style={{ borderRadius: "2px" ,backgroundColor:"#D04A02"}}
                  label="Reset Password"

                  className="p-button-danger p-button-sm"
                />
                
              </div>
            </div>
          </form>
        </div>
      </Card> */}
    </div>
  );
};

export default SignUpDemo;
