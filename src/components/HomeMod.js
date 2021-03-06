import "bootstrap/dist/css/bootstrap.min.css";
import { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";

// import api from "../utils/api";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

import "../App.css";
import Loading from "./Loading";
import ManageUsers from "./ManageUsers";
import UserDetails from "./UserDetails";
import Signup from "./Signup";
import ManageRoles from "./mod/ManageRoles";
import RoleCreate from "./mod/RoleCreate";
import DepartmentCreate from "./mod/DepartmentCreate";
import RoleDetails from "./mod/RoleDetails";
import ManageForms from "./mod/ManageForms";
import FormDetails from "./mod/FormDetails";
import FormCreate from "./mod/FormCreate";
import Dashboard from "./Dashboard";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      dbRequests: [],
      showAll: false,
    };

    this.handleShowAll = this.handleShowAll.bind(this);
  }

  componentDidMount() {
    //    api
    //      .get("/api/getapprovalrequests")
    //      .then((res) => {
    //        if (res.data) {
    //          this.setState({ dbRequests: res.data });
    //        }
    //      })
    //      .catch();
    UserService.getApprovalRequests()
      .then((res) => {
        if (res.data) {
          let db_data = [];
          for (let d of res.data) {
            let pending = 0;
            for (let app of d.approval) {
              if (app.approver._id === AuthService.getCurrentUser().id) {
                pending += app.status;
              }
            }
            if (pending === 0) {
              db_data.push({ ...d, show: true });
            } else {
              db_data.push({ ...d, show: false });
            }
          }

          this.setState({ dbRequests: db_data });
        }
      })
      .catch();
  }

  handleShowAll() {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div className="d-flex align-items-center justify-content-center">
        <Switch>
          <Route
            exact
            path="/mod/userdetails"
            component={() => <UserDetails />}
          />
          <Route
            exact
            path="/mod/role/details"
            component={() => <RoleDetails />}
          />
          <Route exact path="/mod/signup" component={() => <Signup />} />
          <Route exact path="/mod/users" component={() => <ManageUsers />} />
          <Route exact path="/mod/roles" component={() => <ManageRoles />} />
          <Route exact path="/mod/forms" component={() => <ManageForms />} />

          <Route
            exact
            path="/mod/roles/create"
            component={() => <RoleCreate />}
          />
          <Route
            exact
            path="/mod/form/details"
            component={() => <FormDetails />}
          />
          <Route
            exact
            path="/mod/roles/createdepartment"
            component={() => <DepartmentCreate />}
          />
          <Route
            exact
            path="/mod/forms/create"
            component={() => <FormCreate />}
          />
        </Switch>
      </div>
    );
  }
}

function timeStamp(date1, date2) {
  var val = 0;

  let date_val = new Date(date1);

  val = date2.getTime() - date_val.getTime();

  return Math.floor(val / (1000 * 3600 * 24));
}

function ApprovalRequestsList(props) {
  if (props.forms) {
    return props.forms.length !== 0 ? (
      <div>
        <div className="row mb-3 ms-1 me-1 mt-5">
          <div className="form-check form-switch col-6">
            <label
              className="form-check-label text-light h5 ms-1"
              htmlFor="flexSwitchCheckDefault"
            >
              Show all
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              onChange={props.handleShowAll}
            ></input>
          </div>
          <div className="col-6 text-end">
            <button className="btn btn-outline-success">Export to Excel</button>
          </div>
        </div>
        <div className="list-group request-container overflow-auto">
          {props.forms
            .slice(0)
            .reverse()
            .map((data) => {
              return (
                <Link
                  to={"/form/" + data._id}
                  className="list-group-item list-group-item-action"
                  key={"Link_" + data._id}
                  style={{
                    display: props.showAll || data.show ? "block" : "none",
                  }}
                >
                  <div
                    className="d-flex w-100 justify-content-between"
                    key={"div_" + data._id}
                  >
                    <h5 className="mb-2">{data.filled_by}</h5>
                    <small>
                      {data.date_submitted
                        ? timeStamp(data.date_submitted, new Date()) +
                          " days ago"
                        : ""}
                    </small>
                  </div>
                  <p className="mb-2">{data.form.name}</p>
                  {getApprovalStatuses(data.approval).map((app) => {
                    return (
                      <span
                        className={"badge rounded-pill mb-1 me-2 " + app.status}
                      >
                        {app.message}
                      </span>
                    );
                  })}
                </Link>
              );
            })}
        </div>
      </div>
    ) : (
      <div className="card request-container mb-3 ms-1 me-1 mt-5">
        <p className="lead m-2 text-center">No requests to show.</p>
      </div>
    );
  } else {
    return <Loading></Loading>;
  }
}

function getApprovalStatuses(approval) {
  var approvals = [];

  for (let app of approval) {
    if (app.status === 1) {
      // console.log(app.status);
      approvals.push({
        status: "bg-success",
        message: app.approver.firstname + " Approved",
      });
    } else if (app.status === 2) {
      // console.log(app.firstname);
      approvals.push({
        status: "bg-danger",
        message: app.approver.firstname + " Disapproved",
      });
    }
  }

  if (approvals.length === 0) {
    approvals.push({
      status: "bg-warning",
      message: "Approval Pending",
    });
  }

  return approvals;
}

export default Home;
