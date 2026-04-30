import React from "react";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Application render failed", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="app-error-shell">
          <div className="app-error-panel">
            <span className="eyebrow">Frontend error</span>
            <h1>The app hit a render error.</h1>
            <p>{this.state.error.message || "Unexpected error"}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
