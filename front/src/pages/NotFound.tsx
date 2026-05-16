import React from "react";
import { useLocation } from 'react-router';

const NotFound: React.FC = () => {
  const location = useLocation();
  return (
    <div className="alert alert-warning">
      <h4 className="alert-heading">ページがみつかりません</h4>
      <pre>{location.pathname}</pre>
    </div>
  );
};

export default NotFound;
