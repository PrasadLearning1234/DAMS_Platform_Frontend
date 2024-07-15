import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import BackgroundImage from "../Assets/Grouplogin1.png";
import PwC_Logo_Black from "../Assets/PwC_Logo_Black.png";
import { InputText } from "primereact/inputtext";
const SignUpDemo = () => {
  const [emailId, setEmailId] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const IsValidate = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (IsValidate()) {
      let data = { emailId };

      fetch(
        ` ${process.env.REACT_APP_API_KEY}/dam/user/loginUser/forgetPassword/sendOtp`,
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
              summary: "OTP Sent",
              detail: "OTP Sent Successfully",
            });
            setLoading(false);

            setTimeout(() => {
              navigate("/Otp");
            }, 2000);
          } else {
            setLoading(false);

            toast.current.show({
              severity: "warn",
              summary: "OTP Not Send",
              // detail: "Invalid Credential",
            });
          }
        },
        (error) => {
          setLoading(false);

          toast.current.show({
            severity: "error",
            summary: "OTP Not Send",
            detail: "Error while Sending OTP",
          });
        }
      );
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
              <div className="maindivlogin" style={{ marginTop: "8%" }}>
                <div className="headingStyle">
                  <span style={{ color: "black", fontSize: "17px" }}>
                    Accounting Policy Manual{" "}
                  </span>
                </div>
                <div className="headingStyleSec">
                  <span style={{ color: "black", fontSize: "20px" }}>
                    <b>Forgot Password?</b>{" "}
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
                <div className="hrStyle">
                  {" "}
                  <hr />
                </div>
                <div style={{width:'40%'}}>
                  <button
                    type="submit"
                    label="Send OTP"
                    className="p-button-danger p-button-sm"
                    style={{
                      borderRadius: "2px",
                      width: "auto",
                      backgroundColor: "#D04A02",
                     float:'right',
                      color: "white",
                      marginTop: "1%",
                    }}
                  >
                    Send OTP
                  </button>{" "}
                </div>
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

      {/* <Card style={{ width: "30%", marginTop: "8%", borderRadius: "2px", marginLeft: "34%",padding:"20px" ,boxShadow:"0 4px 8px rgba(0, 0, 0, 0.1)"}}>
        <div className="offset-lg-3 col-lg-6">
          <form className="container" onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-header">
                <h3 style={{ color: "black" }}>FORGOT PASSWORD ?</h3>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label style={{ color: "black" }}>
                        Email ID: <span className="errmsg">*</span>
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


                </div>
              </div>
              <div className="card-footer">
                <Button
                  type="submit"
                  style={{ borderRadius: "2px" ,backgroundColor:"#D04A02"}}
                  label="Send OTP"
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
