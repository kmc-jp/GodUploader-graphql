/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Alert } from "react-bootstrap";

interface State {
  error?: any;
}

export class ErrorBoundary extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Alert variant="danger">
          <pre>{this.state.error.toString()}</pre>
        </Alert>
      );
    }

    return this.props.children;
  }
}
