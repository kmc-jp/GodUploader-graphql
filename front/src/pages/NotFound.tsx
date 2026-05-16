import React from "react";
import { Alert } from "react-bootstrap";
import { useLocation } from "react-router";

const NotFound: React.FC = () => {
  const location = useLocation();
  return (
    <Alert variant="warning">
      <Alert.Heading>ページがみつかりません</Alert.Heading>
      <pre>{location.pathname}</pre>
    </Alert>
  );
};

export default NotFound;
