import React from "react";

export interface AuthTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  labelClassName?: string;
  inputClassName?: string;
}

const AuthTextField: React.FC<AuthTextFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder = "Type here",
  labelClassName = "",
  inputClassName = "",
  ...rest
}) => {
  return (
    <label htmlFor={id} className={`${labelClassName} z-10`}>
      {label}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`${inputClassName} z-10`}
        {...rest}
      />
    </label>
  );
};

export default AuthTextField;
