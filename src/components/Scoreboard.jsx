import React from "react";
import success from "../assets/images/success.png";

export default function Scoreboard() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh"}}
    >
      <img className="img-fluid" src={success} alt="" srcset="" />
    </div>
  );
}
