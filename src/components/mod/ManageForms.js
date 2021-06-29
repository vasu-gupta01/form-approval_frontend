import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import UserService from "../../services/user.service";
import Loading from "../Loading";
import Moment from "moment";

function ManageForms(props) {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    UserService.getForms().then((res) => {
      if (res.data) {
        setForms(res.data);
      }
    });
  }, []);

  return (
    <div className="mt-2">
      <div className="row mb-3">
        <div className="col-12 text-light">
          <h4>Manage Forms</h4>
        </div>
        <div className="col-4">
          <Link to="/mod/forms/create" className="btn btn-outline-light">
            + Add form
          </Link>
        </div>
      </div>
      <FormsList forms={forms} />
    </div>
  );
}

function FormsList(props) {
  if (props.forms) {
    return props.forms.length !== 0 ? (
      <div>
        <div className="list-group request-container overflow-auto">
          {props.forms
            .slice(0)
            .reverse()
            .map((data) => {
              return (
                <Link
                  to={{
                    pathname: "/mod/form/details",
                    state: { form: data },
                  }}
                  className="list-group-item list-group-item-action"
                  key={"Link_" + data._id}
                >
                  <div
                    className="d-flex w-100 justify-content-between"
                    key={"div_" + data._id}
                  ></div>
                  <h5>Form Title: {data.name}</h5>
                  <p className="mb-2">
                    Date Created:{" "}
                    {Moment(data.date_created).format("DD/MM/YYYY - h:mm A")}
                  </p>
                  <p className="mb-2">
                    Final Approvers:{" "}
                    {data.finals.map((app) => {
                      return app.firstname + ". ";
                    })}
                  </p>
                  {data.finals.map((app) => {})}
                </Link>
              );
            })}
        </div>
      </div>
    ) : (
      <div className="card request-container mb-3 ms-1 me-1 mt-5">
        <p className="lead m-2 text-center">No forms to show.</p>
      </div>
    );
  } else {
    return <Loading></Loading>;
  }
}

export default ManageForms;
