import React from "react";
import { Prompt } from "react-router-dom";

export default function About() {
  return (
    <>
      <Prompt when={true} message="Are you sure you want to leave?" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh"
        }}
      >
        Shop page
      </div>
    </>
  );
}
