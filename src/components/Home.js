import "bootstrap/dist/css/bootstrap.min.css";
import { Component } from "react";
import { Link } from "react-router-dom";

// import api from "../utils/api";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

import "../App.css";
import Loading from "./Loading";
import { ExportToExcel } from "./ExportToExcel";
import Moment from "moment";
import DateTimePicker from "react-datetime-picker";

class Home extends Component {
  constructor(props) {
    super(props);

    const mDate = new Date();
    mDate.setHours(0, 0, 0, 0);

    this.state = {
      currentUser: AuthService.getCurrentUser(),
      dbRequests: [],
      showAll: false,
      fromDate: mDate,
      toDate: new Date(),
    };

    this.handleShowAll = this.handleShowAll.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.setDateChange = this.setDateChange.bind(this);
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
    this.getRequests();
  }

  getRequests() {
    UserService.getApprovalRequests({
      min_date: this.state.fromDate,
      max_date: this.state.toDate,
    })
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

  handleDateChange() {
    this.getRequests();
  }

  setDateChange(from, to) {
    this.setState({ fromDate: from, toDate: to });
  }

  render() {
    const { currentUser } = this.state;

    return (
      <div>
        <div className="container d-flex align-items-center justify-content-center">
          <DateRange
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
            handleDateChange={this.handleDateChange}
            setDateChange={this.setDateChange}
          />
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <ApprovalRequestsList
            forms={this.state.dbRequests}
            handleShowAll={this.handleShowAll}
            showAll={this.state.showAll}
          />
        </div>
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

function DateRange(props) {
  return (
    <div className="row">
      <div className="col-sm-6 col-md-6 col-lg-5 mb-1">
        <div>
          <label className="form-label text-light h5 me-1">From:</label>
        </div>
        <DateTimePicker
          disableClock
          maxDate={props.toDate}
          value={props.fromDate}
          onChange={(val) => {
            val.setHours(0, 0, 0, 0);
            props.setDateChange(val, props.toDate);
            // this.setState({ showDate: val });
          }}
          format="dd/MM/yyyy"
        />
      </div>
      <div className="col-sm-6 col-md-6 col-lg-5 mb-1">
        <div>
          <label className="form-label text-light h5 me-1">To:</label>
        </div>

        <DateTimePicker
          disableClock
          maxDate={new Date()}
          value={props.toDate}
          onChange={(val) => {
            val.setHours(23, 59, 59, 0);
            props.setDateChange(props.fromDate, val);
            // this.setState({ toDate: val });
          }}
          format="dd/MM/yyyy"
        />
      </div>
      <div className="col-md-2 col-lg-2 mt-lg-4">
        <button
          className="btn btn-outline-light"
          onClick={props.handleDateChange}
        >
          Show
        </button>
      </div>
    </div>
  );
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
          <div className="col-6">
            <ExportToExcel
              apiData={createExcelData(props.forms)}
              fileName="myfile"
            />
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

function createExcelData(forms) {
  let return_data = [];

  for (let f of forms) {
    let app = [];
    let dis = [];
    for (let a of f.approval) {
      if (a.status === 1) {
        app.push(" " + a.approver.firstname + " " + a.approver.lastname);
      } else if (a.status === 2) {
        dis.push(" " + a.approver.firstname + " " + a.approver.lastname);
      }
    }

    let obj = {
      "Filled By": f.filled_by,
      "Form Type": f.form.name,
      "Approved By": "".concat(app),
      "Dissaproved By": "".concat(dis),
      "Date Filled": Moment(f.date_submitted).format("DD/MM/YYYY - h:mm A"),
    };

    if (f.viewer_fields && f.viewer_fields.length >= 0) {
      f.viewer_fields.map((vf) => {
        if (vf.type.name === "button-time") {
          obj[vf.name] = Moment(vf.value).format("DD/MM/YYYY - h:mm A");
        } else {
          obj[vf.name] = vf.value;
        }
      });
    }

    if (f.fields && f.fields.length >= 0) {
      f.fields.map((vf) => {
        if (vf.type.name === "time") {
          obj[vf.name] = Moment(vf.value).format("DD/MM/YYYY - h:mm A");
        } else {
          obj[vf.name] = vf.value;
        }
      });
    }

    if (f.final_approval === 1) {
      obj["Final Approval Status"] = "Approved -- ".concat(
        Moment(f.approval_date).format("DD/MM/YYYY - h:mm A")
      );
    } else if (f.final_approval === 2) {
      obj["Final Approval Status"] = "Not Approved -- ".concat(
        Moment(f.approval_date).format("DD/MM/YYYY - h:mm A")
      );
    } else if (f.final_approval === 0) {
      obj["Final Approval Status"] = "Pending";
    }

    return_data.push(obj);
  }

  return return_data;
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
