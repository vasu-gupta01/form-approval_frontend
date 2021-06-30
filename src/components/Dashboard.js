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

class Dashboard extends Component {
  constructor(props) {
    super(props);

    const mDate = new Date();
    mDate.setHours(0, 0, 0, 0);

    this.state = {
      dbRequests: [],
      showDate: mDate,
      fromDate: new Date(),
      toDate: new Date(),
      loading: true,
      error: false,
    };

    this.handleShowAll = this.handleShowAll.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
  }

  componentDidMount() {
    const mDate = this.state.showDate;
    mDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setDate(today.getDate() + 1);

    this.getRequests();
  }

  getRequests() {
    this.setState({ error: false });
    this.setState({ loading: true });

    const mDate = this.state.showDate;
    // mDate.setHours(0, 0, 0, 0);

    // const today = new Date();
    // today.setDate(today.getDate() + 1);
    const to = this.state.toDate;

    UserService.getDateRequests({
      min_date: mDate,
      max_date: to,
    })
      .then((res) => {
        if (res.data) {
          this.setState({ dbRequests: res.data });
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  handleShowAll() {
    this.setState({ showAll: !this.state.showAll });
  }

  handleDateChange(from) {
    // switch (e.target.value) {
    //   case "0":
    //     this.setState({ showDate: new Date() }, () => {
    //       this.getRequests();
    //     });
    //     break;
    //   case "1":
    //     const date = new Date();
    //     const month = new Date(date.getFullYear(), date.getMonth(), 1);
    //     this.setState({ showDate: month }, () => {
    //       this.getRequests();
    //     });
    //     break;
    //   case "2":
    //     const new_date = new Date(1900, 1, 1);
    //     this.setState({ showDate: new_date }, () => {
    //       this.getRequests();
    //     });
    //     break;
    // }
    this.getRequests();
  }

  render() {
    const { dbRequests } = this.state;

    return (
      <div>
        <div className="container-fluid">
          <nav className="row navbar justify-content-center text-end pt-4">
            <div className="col-sm-6 col-md-5 col-lg-3 mb-2">
              <label className="form-label text-light h5 me-2">From:</label>
              <DateTimePicker
                disableClock
                maxDate={this.state.toDate}
                value={this.state.showDate}
                onChange={(val) => {
                  val.setHours(0, 0, 0, 0);
                  this.setState({ showDate: val });
                }}
                format="dd/MM/yyyy"
              />
            </div>
            <div className="col-sm-6 col-md-5 col-lg-3 mb-2">
              <label className="form-label text-light h5 me-2">To:</label>
              <DateTimePicker
                disableClock
                maxDate={new Date()}
                value={this.state.toDate}
                onChange={(val) => {
                  val.setHours(23, 59, 59, 0);
                  this.setState({ toDate: val });
                }}
                format="dd/MM/yyyy"
              />
            </div>
            <div className="col-2">
              <button
                className="btn btn-outline-light"
                onClick={this.handleDateChange}
              >
                Show
              </button>
            </div>
            {this.state.error ? (
              <strong className="text-danger col mt-4">
                There was an error fetching requests. Check network connection
                and refresh page.
              </strong>
            ) : (
              ""
            )}
          </nav>
        </div>
        <div className=" align-items-center mt-4">
          {this.state.loading ? (
            <Loading />
          ) : (
            <ApprovalRequestsDisplay forms={dbRequests} />
          )}
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

function ApprovalRequestsDisplay(props) {
  if (props.forms) {
    return (
      <div className="row">
        {props.forms.map((form) => {
          if (form.final_approval === 0) {
          } else {
            return (
              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="card m-2">
                  <div className="card-body">
                    <h5 className="card-title">
                      Employee Name: {form.filled_by}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Time Submitted:{" "}
                      {Moment(form.date_submitted).format(
                        "DD/MM/YYYY - h:mm A"
                      )}
                    </h6>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Time of Approval:{" "}
                      {Moment(form.approval_date).format("DD/MM/YYYY - h:mm A")}
                    </h6>
                    <p className="card-text text-muted">
                      Form Type: {form.form.name}
                    </p>
                    <div className="card-text">
                      {form.final_approval === 1 ? (
                        <h4>
                          <span className="badge rounded-pill mb-1 me-2 bg-success">
                            Approved
                          </span>
                        </h4>
                      ) : (
                        <h4>
                          <span className="badge rounded-pill mb-1 me-2 bg-danger">
                            Not Approved
                          </span>
                        </h4>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

function createExcelData(forms) {
  let return_data = [];

  for (let f of forms) {
    let app = [];
    let dis = [];
    for (let a of f.approval) {
      if (a.status === 1) {
        app.push(a.approver.firstname);
      } else if (a.status === 2) {
        dis.push(a.approver.firstname);
      }
    }

    let obj = {
      "Filled By": f.filled_by,
      "Form Type": f.form.name,
      "Approved By": "".concat(app),
      "Dissaproved By": "".concat(dis),
      "Date Filled": Moment(f.date_submitted).format("DD/MM/YYYY - h:mm A"),
    };

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

export default Dashboard;
