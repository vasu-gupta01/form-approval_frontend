import React from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

import { Link } from "react-router-dom";

function FormResult(props) {
  // const [isOpen, setIsOpen] = useState(false);

  const success = true;

  // useEffect(() => {
  //   setIsOpen(props.show);
  // }, [props.show]);

  // const showModal = () => {
  //   setIsOpen(true);
  // };

  // const hideModal = () => {
  //   setIsOpen(false);
  // };

  return success ? (
    <Modal show={props.show} dialogClassName="modal-dialog-centered">
      <div className="">
        <Modal.Header>
          <Modal.Title className="text-danger bg-gradient">
            Login failed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Please check your username/password.</Modal.Body>
        <Modal.Footer as="footer">
          <button className="btn btn-outline-dark" onClick={props.hideModal}>
            Close
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  ) : (
    <div className="container container-form alert alert-danger" role="alert">
      <h5 className="alert-heading">Submission failed</h5>
      <hr />
      <p className="mb-0">
        <Link className="btn btn-primary" to="/">
          Click here
        </Link>{" "}
        to fill another form
      </p>
    </div>
  );
}

// const SuccessMessage = () => {
//   return (
//     <div className="container container-form alert alert-success" role="alert">
//       <h5 className="alert-heading">
//         Your approval request was successfully submitted!
//       </h5>
//       <hr />
//       <p className="mb-0">
//         <Link className="btn btn-outline-dark" to="/">
//           Click here
//         </Link>{" "}
//         to fill another form
//       </p>
//     </div>
//   );
// };

// function FailureMessage() {}

export default FormResult;
