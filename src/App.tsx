import React from "react";
import { Header } from "./components/header/Header";
import styles from "./App.module.css";
export default function App() {
  return <AppShell />;
}

function AppShell() {
  const [tab, setTab] = React.useState<"planner" | "shopping">("planner");

  return (
    <div className={styles["container"]}>
      <Header tab={tab} onChange={setTab} />
    </div>
  );
}
