import React from "react";
import styles from "./ErrorBoundary.module.css";
type Props = { children: React.ReactNode };
type State = { hasError: boolean; message: string };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: unknown): State {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    console.error("ErrorBoundary caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles["container"]}>
          <div className={styles["card"]}>
            <div className={styles["card-header"]}>
              <h2>App crashed</h2>
              <small>Recoverable</small>
            </div>
            <div className={styles["card-body"]}>
              <div className={`${styles["alert"]} ${styles["alert-error"]}`}>
                <strong>Reason:</strong> {this.state.message}
              </div>
              <hr className={styles["hr"]} />
              <button
                className={`${styles["btn"]} ${styles["btn-primary"]}`}
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
