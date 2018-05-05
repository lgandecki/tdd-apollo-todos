/* eslint-disable react/prop-types */
import React from "react";

jest.mock("sweetalert2-react", () => props =>
  props.show ? (
    <div>
      {props.title} {props.text}
      {props.showCancelButton ? (
        <button onClick={props.onCancel}>{props.cancelButtonText}</button>
      ) : null}
      <button onClick={props.onConfirm}>{props.confirmButtonText}</button>
    </div>
  ) : null
);
