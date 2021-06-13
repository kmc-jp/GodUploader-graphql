import React from "react";

interface State {
  error?: any;
}

export class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <p>Something went wrong.</p>;
    }

    return this.props.children;
  }
}
