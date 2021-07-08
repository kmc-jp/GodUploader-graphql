import React from "react";
import { useRouteMatch } from "react-router-dom";

const NotFound: React.VFC = () => {
  const match = useRouteMatch();
  return (
    <div className="alert alert-warning">
      <h4 className="alert-heading">ページがみつかりません</h4>
      <pre>{JSON.stringify(match, null, 4)}</pre>
    </div>
  );
};

export default NotFound;
