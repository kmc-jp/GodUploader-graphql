/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

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
        <pre className="alert alert-danger">{this.state.error.toString()}</pre>
      );
    }

    return this.props.children;
  }
}
