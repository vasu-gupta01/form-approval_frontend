import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import UserService from "../../services/user.service";
import Loading from "../Loading";

function ManageRoles(props) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    UserService.getRoles().then((res) => {
      if (res.data) {
        setRoles(res.data);
      }
    });
  }, []);

  return (
    <div className="mt-2">
      <RolesList roles={roles} />
    </div>
  );
}

function RolesList(props) {
  if (props.roles) {
    return props.roles.length !== 0 ? (
      <div>
        <div className="row mb-3">
          <div className="col-12 text-light">
            <h4>Roles</h4>
          </div>
          <div className="col-4">
            <Link to="/mod/roles/create" className="btn btn-outline-light">
              + Add role
            </Link>
          </div>
          <div className="col-6">
            <Link
              to="/mod/roles/createdepartment"
              className="btn btn-outline-light"
            >
              + Add department
            </Link>
          </div>
        </div>
        <div className="list-group request-container overflow-auto">
          {props.roles
            .slice(0)
            .reverse()
            .map((data) => {
              if (data.name !== "mod") {
                return (
                  <Link
                    to={{
                      pathname: "/mod/role/details",
                      state: { role: data },
                    }}
                    className="list-group-item list-group-item-action"
                    key={"Link_" + data._id}
                  >
                    <div
                      className="d-flex w-100 justify-content-between"
                      key={"div_" + data._id}
                    ></div>
                    <h5>{data.description}</h5>
                    <p className="mb-2">Type: {data.name}</p>
                    <p className="mb-2">Access Level: {data.level}</p>
                  </Link>
                );
              }
            })}
        </div>
      </div>
    ) : (
      <div className="card request-container mb-3 ms-1 me-1 mt-5">
        <p className="lead m-2 text-center">No roles to show.</p>
      </div>
    );
  } else {
    return <Loading></Loading>;
  }
}

export default ManageRoles;
