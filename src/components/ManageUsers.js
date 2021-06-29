import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import UserService from "../services/user.service";
import Loading from "./Loading";

function ManageUsers(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    UserService.getUsers().then((res) => {
      if (res.data) {
        setUsers(res.data);
      }
    });
  }, []);

  return (
    <div className="mt-2">
      <div className="row mb-3">
        <div className="col-12 text-light">
          <h4>Manage Approvers</h4>
        </div>

        <div className="col">
          <Link to="/mod/signup" className="btn btn-outline-light">
            + Add approver
          </Link>
        </div>
        <div className="col">
          <Link to="/mod/roles" className="btn btn-outline-light">
            Manage Roles
          </Link>
        </div>
      </div>
      <UsersList users={users} />
    </div>
  );
}

function UsersList(props) {
  if (props.users) {
    return props.users.length !== 0 ? (
      <div>
        <div className="list-group request-container overflow-auto">
          {props.users
            .slice(0)
            .reverse()
            .map((data) => {
              return (
                <Link
                  to={{ pathname: "/mod/userdetails", state: { user: data } }}
                  className="list-group-item list-group-item-action"
                  key={"Link_" + data._id}
                >
                  <div
                    className="d-flex w-100 justify-content-between"
                    key={"div_" + data._id}
                  ></div>
                  <h5>{data.firstname + " " + data.lastname}</h5>
                  <p className="mb-2">Username: {data.username}</p>
                  <p className="mb-2">Role: {data.role.description}</p>
                </Link>
              );
            })}
        </div>
      </div>
    ) : (
      <div className="card request-container mb-3 ms-1 me-1 mt-5">
        <p className="lead m-2 text-center">No users to show.</p>
      </div>
    );
  } else {
    return <Loading></Loading>;
  }
}

export default ManageUsers;
