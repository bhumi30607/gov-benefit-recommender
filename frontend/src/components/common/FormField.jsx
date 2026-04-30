import React from "react";

const FormField = ({ label, error, children }) => (
  <label className="form-field">
    <span>{label}</span>
    {children}
    {error ? <small className="field-error">{error}</small> : null}
  </label>
);

export default FormField;
