import axios from "axios";
import authHeader from "./auth-header";
import config from "../config/config";

const API_URL = "/api/";

class UserService {
  getDateRequests(body) {
    return axios.post(API_URL + "dashapprovalrequests", body, {
      headers: authHeader(),
    });
  }

  getApprovalRequests(body) {
    return axios.post(API_URL + "getapprovalrequests", body, {
      headers: authHeader(),
    });
  }

  getUsers() {
    return axios.get(API_URL + "getapprovers", {
      headers: authHeader(),
    });
  }

  getRoles() {
    return axios.get(API_URL + "getroles", { headers: authHeader() });
  }

  getDepartments() {
    return axios.get(API_URL + "getdepartments", { headers: authHeader() });
  }

  updateApproval(body) {
    return axios.post(API_URL + "updateapproval", body, {
      headers: authHeader(),
    });
  }

  updateApprover(body) {
    return axios.post(API_URL + "approver/update", body, {
      headers: authHeader(),
    });
  }

  updateRole(body) {
    return axios.post(API_URL + "role/update", body, {
      headers: authHeader(),
    });
  }

  createRole(body) {
    return axios.post(API_URL + "createrole", body, {
      headers: authHeader(),
    });
  }

  createDepartment(body) {
    return axios.post(API_URL + "createdepartment", body, {
      headers: authHeader(),
    });
  }

  getApprovalRequest(body) {
    return axios.post(API_URL + "getapprovalrequest", body, {
      headers: authHeader(),
    });
  }
}

export default new UserService();
