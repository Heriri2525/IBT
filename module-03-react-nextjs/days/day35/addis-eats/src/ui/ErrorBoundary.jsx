import { Component } from "react";
import { logError } from "./logError";

// The one class component you still write — there is no hook for this.
//   fallback   an element, or a function ({ error, reset }) => element
//   name       label used when logging
//   resetKeys  when any of these change while in the error state, try again
//
// Catches: errors during render, in lifecycle methods and in child constructors.
// Does NOT catch: event handlers, async code / promises, or errors thrown by
// the boundary itself. Handle those with try/catch and an error state.
function keysChanged(a = [], b = []) {
  return a.length !== b.length || a.some((item, i) => !Object.is(item, b[i]));
}

export default class ErrorBoundary extends Component {
  state = { error: null };

  // 1. update state so the NEXT render shows the fallback
  static getDerivedStateFromError(error) {
    return { error };
  }

  // 2. the side-effect half: report it somewhere you will actually read it
  componentDidCatch(error, info) {
    logError(error, info, this.props.name);
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps, prevState) {
    // Only reset if we were ALREADY failing before this update; otherwise a
    // crash caused by a key change would reset itself straight away (a loop).
    if (
      this.state.error !== null &&
      prevState.error !== null &&
      keysChanged(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (error === null) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === "function") {
      return fallback({ error, reset: this.reset });
    }
    return fallback ?? null;
  }
}
