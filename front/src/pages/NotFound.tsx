import React from "react";
import { useLocation } from "react-router";

const NotFound: React.VFC = () => {
  const location = useLocation();
  return (
    <div className="alert alert-warning">
      <h4 className="alert-heading">ページがみつかりません</h4>
      <pre>{JSON.stringify({ pathname: location.pathname }, null, 4)}</pre>
    </div>
  );
};

export default NotFound;
