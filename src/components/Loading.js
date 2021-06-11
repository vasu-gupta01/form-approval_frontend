import "bootstrap/dist/css/bootstrap.min.css";

export default function Loading() {
  return (
    <div className="d-flex justify-content-center text-center text-light">
      <div className="row">
        <div className="col-12 mb-2">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div className="col-12">
          <strong className="">Loading...</strong>
        </div>
      </div>
    </div>
  );
}
