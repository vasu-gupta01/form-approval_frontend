import axios from "axios";
import config from "../config/config";

const api = axios.create({
  baseURL: config.ADDR + ":5000",
});

export default api;

// export default {
//   // getForms: () =>
//   //   axiosInstance({
//   //     method: "GET",
//   //     headers: { "Content-Type": "application/json" },
//   //     url: "/api/forms",
//   //   }),
//   // getFormByID: (id) =>
//   //   axiosInstance({
//   //     method: "GET",
//   //     headers: { "Content-Type": "application/json" },
//   //     url: "/api/getform",

//   //   }),
//   // updateForm: (data) =>
//   //   axiosInstance({
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     url: "/api/updateform",
//   //   }),

//   methods: {
//     getForms() {
//       axiosInstance
//         .get("/api/forms")
//         .then((res) => {
//           if (res.data) {
//             return res.data;
//           }
//         })
//         .catch((err) => console.log(err));
//     },
//     getFormByID(id) {
//       axiosInstance
//         .get("/api/getform", { id: id })
//         .then((res) => {
//           if (res.data) {
//             return res.data;
//           }
//         })
//         .catch((err) => console.log(err));
//     },
//   },
// };
