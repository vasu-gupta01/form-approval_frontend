import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Moment from "moment";

import Loading from "./Loading";
// import api from "../utils/api";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { useHistory } from "react-router-dom";
import logo from "../images/Beta-HealthcareLG-Trebuchet-MS-font.png";

function FormView(props) {
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

  const [viewerFields, setViewerFields] = useState({});

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
            if (res.data.viewer_fields.length === 0) {
              UserService.getViewerfields({ id: res.data.form._id }).then(
                (res) => {
                  if (res.data && isMounted) {
                    let view_fields = {};
                    let view_fields_array = [];

                    res.data.viewer_fields.map((v) => {
                      view_fields[v._id] = {
                        id: v._id,
                        name: v.name,
                        type: v.type,
                        value: "",
                        filled: false,
                      };
                      view_fields_array.push(view_fields[v._id]);
                    });
                    UserService.updateRequestViewerFields({
                      viewer_fields: view_fields_array,
                      request_id: id,
                    });
                    setViewerFields(view_fields);
                  }
                }
              );
            } else {
              let view_fields = {};
              res.data.viewer_fields.map((v) => {
                view_fields[v._id] = {
                  id: v._id,
                  name: v.name,
                  type: v.type,
                  value: v.value,
                  filled: v.filled,
                };
              });
              setViewerFields(view_fields);
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

  let handleViewerFieldChange = (val, f_id) => {
    let current = viewerFields;

    if (!current[f_id].filled) {
      current[f_id].value = val;
      current[f_id].filled = true;
      setViewerFields(current);
      let current_array = [];
      Object.keys(current).map((c) => {
        current_array.push(current[c]);
      });
      UserService.updateRequestViewerFields({
        request_id: id,
        viewer_fields: current_array,
      });
    }
  };

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
                <h2 className="text-center">{formData.form.name}</h2>
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
            <div className="card-footer row">
              {Object.keys(viewerFields).map((field) => {
                return (
                  <ViewerField
                    field={viewerFields[field]}
                    handleViewerFieldChange={handleViewerFieldChange}
                  />
                );
              })}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ViewerField(props) {
  const [fieldValue, setFieldValue] = useState(props.field.value);
  const [filled, setFilled] = useState(props.field.filled);

  useEffect(() => {}, [props, fieldValue, filled]);

  if (props.field.type.name == "button-time") {
    return (
      <div className="col-6 mb-3">
        {filled ? (
          <button className="btn btn-outline-primary btn-sm m-2" disabled>
            {props.field.name}
          </button>
        ) : (
          <button
            className="btn btn-outline-primary btn-sm m-2"
            onClick={(e) => {
              e.preventDefault();
              const date = new Date();
              setFilled(true);
              setFieldValue(date);
              props.handleViewerFieldChange(date, props.field.id);
            }}
          >
            {props.field.name}
          </button>
        )}

        {fieldValue ? (
          <input
            key={props.field.id}
            type="text"
            className="form-control"
            value={Moment(fieldValue).format("DD/MM/YYYY - h:mm A")}
            readOnly
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default FormView;
