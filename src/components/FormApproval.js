import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Moment from "moment";

import Loading from "./Loading";
// import api from "../utils/api";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { useHistory } from "react-router-dom";
import logo from "../images/Beta-HealthcareLG-Trebuchet-MS-font.png";

function FormApproval(props) {
  //   constructor(props) {
  //     super(props);

  //     this.state = { name: "", formFields: [], formData: [], done: false };
  //   }
  const history = useHistory();
  const { id } = useParams();
  const [formData, setFormData] = useState([]);
  const [formDate, setFormDate] = useState("");
  const [formApproved, setFormApproved] = useState(false);
  const [formStatus, setFormStatus] = useState(0);
  const [formComments, setFormComments] = useState("");

  const [clickedApprove, setClickedApprove] = useState(false);
  const [clickedDisapprove, setClickedDisapprove] = useState(false);
  const [appError, setAppError] = useState(false);

  useEffect(
    () => {
      let isMounted = true;
      // api
      //   .get(`/api/getform/${id}`)
      //   .then((res) => {
      //     if (res.data && isMounted) {
      //       setFormData(res.data);
      //       if (res.data.date_filled) {
      //         setFormDate(Moment(res.data.date_filled).format("DD-MM-YYYY"));
      //       }
      //     }
      //   })
      //   .catch((err) => console.log(err));

      const body = {
        id: id,
        approver: AuthService.getCurrentUser().id,
      };

      UserService.getApprovalRequest(body)
        .then((res) => {
          if (res.data && isMounted) {
            setFormData(res.data);
            if (res.data.date_submitted) {
              setFormDate(
                Moment(res.data.date_submitted).format("DD/MM/YYYY - h:mm A")
              );
            }
            if (res.data.approval) {
              if (res.data.approval.status === 0) {
                setFormApproved(false);
                setFormStatus(0);
                console.log("Form not approved");
              } else {
                setFormApproved(true);
                setFormStatus(res.data.approval.status);
                setFormComments(res.data.approval.comments);
                console.log("Form already approved!");
              }
            } else {
              setFormStatus(-1);
              console.log("MOD");
            }
          }
        })
        .catch((err) => console.log(err));

      return () => {
        isMounted = false;
      };
    },
    [id],
    [formApproved],
    [formData]
  );

  function handleApproval(e) {
    e.preventDefault();
    setClickedApprove(true);
    setAppError(false);
    const body = {
      request_id: id,
      approver: AuthService.getCurrentUser().id,
      action: 1,
      comments: formComments,
    };

    UserService.updateApproval(body)
      .then(() => {
        setFormApproved(true);
        setFormStatus(1);
      })
      .catch((e) => {
        setClickedApprove(false);
        setAppError(true);
      });
  }

  function handleDisapproval(e) {
    e.preventDefault();
    setClickedDisapprove(true);
    setAppError(false);
    const body = {
      request_id: id,
      approver: AuthService.getCurrentUser().id,
      action: 2,
      comments: formComments,
    };

    console.log(body);

    UserService.updateApproval(body)
      .then(() => {
        setFormApproved(true);
        setFormStatus(2);
      })
      .catch((e) => {
        setClickedDisapprove(false);
        setAppError(true);
      });
  }

  function handleComments(e) {
    setFormComments(e.target.value);
  }

  return formData.length === 0 ? (
    <Loading />
  ) : (
    <div className="container-fluid">
      <div className="container d-flex align-items-center justify-content-center mt-5">
        <div className="container-form">
          <form className="card bg-light bg-gradient">
            <div className="row card-body">
              <img src={logo} className="img-fluid" alt="logo"></img>
            </div>
            <div className="card-header">
              <div className="card-title">
                <h2 className="text-center">
                  {formData.form.name} - Approval Request
                </h2>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">
                  Employee Name:
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.filled_by}
                    readOnly
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Department:</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={formData.department}
                    readOnly
                  />
                </div>
              </div>
              {formData.fields.map((field) => {
                return (
                  <div key={"div_" + field._id} className="mb-3 row">
                    <label
                      key={"label_" + field._id}
                      className="col-sm-4 col-form-label"
                    >
                      {field.name}:
                    </label>
                    <div className="col-sm-8">
                      {field.type.name === "time" ? (
                        <input
                          key={field._id}
                          type="text"
                          className="form-control"
                          value={Moment(field.value).format(
                            "DD/MM/YYYY - h:mm A"
                          )}
                          readOnly
                        />
                      ) : (
                        <input
                          key={field._id}
                          type="text"
                          className="form-control"
                          value={field.value}
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="mb-3 row">
                <label className="col-sm-4 col-form-label">Date filled:</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="form-control"
                    value={formDate}
                    readOnly
                  />
                </div>
              </div>
            </div>
            {formStatus != -1 ? (
              formApproved ? (
                <div className="card-footer row">
                  <p className="lead m-2 text-center mb-3">
                    This approval request was{" "}
                    {formStatus === 1 ? (
                      <strong className="text-success">approved </strong>
                    ) : (
                      <strong className="text-danger">disapproved </strong>
                    )}
                    by you.
                  </p>
                  <label className="col-sm-4 col-form-label mb-3">
                    Comments:
                  </label>
                  <div className="col-sm-8">
                    <input
                      type="text"
                      className="form-control"
                      value={formComments}
                      readOnly
                    />
                  </div>
                </div>
              ) : (
                <div className="card-footer">
                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      placeholder="comments"
                      id="floatingTextarea"
                      style={{ height: "100px", "max-height": "100px" }}
                      onChange={handleComments}
                    ></textarea>
                    <label className="text-muted" htmlFor="floatingTextarea">
                      Leave a comment here
                    </label>
                  </div>

                  <div className="row">
                    <div className="col-6 text-left">
                      {/* <button
                        className="btn btn-outline-danger"
                        onClick={handleDisapproval}
                      >
                        Disapprove
                      </button> */}
                      {clickedDisapprove ? (
                        <button
                          className="btn btn-danger"
                          type="button"
                          disabled
                        >
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-danger"
                          onClick={handleDisapproval}
                        >
                          Disapprove
                        </button>
                      )}
                    </div>
                    <div className="col-6 text-end">
                      {/* <button
                        className="btn btn-outline-success"
                        onClick={handleApproval}
                      >
                        Approve
                      </button> */}
                      {clickedApprove ? (
                        <button
                          className="btn btn-success"
                          type="button"
                          disabled
                        >
                          <span
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading...
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success"
                          onClick={handleApproval}
                        >
                          Approve
                        </button>
                      )}
                    </div>
                    {appError ? (
                      <div className="col-12 text-center text-danger">
                        <strong>An error occured. Please try again.</strong>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="card-footer row">
                <p className="lead m-2 text-center mb-3">
                  Your approval is currently not requested.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormApproval;
