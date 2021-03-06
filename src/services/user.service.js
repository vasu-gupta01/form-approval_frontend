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

  getApprovers() {
    return axios.get(API_URL + "getapproverswithoutmod", {
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

  updateRequestViewerFields(body) {
    return axios.post(API_URL + "updaterequestviewerfields", body, {
      headers: authHeader(),
    });
  }

  updaterequestviewerfields;

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

  updateDepartment(body) {
    return axios.post(API_URL + "updatedepartment", body, {
      headers: authHeader(),
    });
  }

  createForm(body) {
    return axios.post(API_URL + "createform", body, { headers: authHeader() });
  }

  getApprovalRequest(body) {
    return axios.post(API_URL + "getapprovalrequest", body, {
      headers: authHeader(),
    });
  }

  getForms() {
    return axios.get(API_URL + "getforms", { headers: authHeader() });
  }

  getFieldTypes() {
    return axios.get(API_URL + "getfieldtypes", { headers: authHeader() });
  }

  getFieldViewerTypes() {
    return axios.get(API_URL + "getviewerfieldtypes", {
      headers: authHeader(),
    });
  }

  getViewerfields(body) {
    return axios.post(API_URL + "getviewerfields", body, {
      headers: authHeader(),
    });
  }

  updateForm(body) {
    return axios.post(API_URL + "updateform", body, { headers: authHeader() });
  }
}

export default new UserService();
