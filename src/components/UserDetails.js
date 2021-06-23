import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import UserService from "../services/user.service";

function UserDetails(props) {
  const location = useLocation();
  const { user } = location.state;
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    UserService.getRoles().then((res) => {
      if (res.data) {
        setRoles(res.data);
      }
    });
  }, []);

  return (
    <div className="container container-form d-flex align-items-center justify-content-center mt-5">
      <form className="card bg-light bg-gradient">
        <div className="card-header">
          <div className="card-title">
            <h2 className="text-center">{user.firstname} - User Details</h2>
          </div>
        </div>
        <div className="card-body">
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Firstname:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={user.firstname}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Lastname:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={user.lastname}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Username:</label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={user.username}
              />
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">Role:</label>
            <div className="col-sm-8">
              <select type="text" className="form-select" value={user.role._id}>
                {roles.map((role) => {
                  return (
                    <option value={role._id}>
                      {role.name} - {role.description}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3 row">
            <label className="col-sm-4 col-form-label">New Password:</label>
            <div className="col-sm-8">
              <input type="password" className="form-control" />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <div className="row">
            <div className="col-12 text-end">
              <button className="btn btn-outline-primary">update</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserDetails;
