import React, { useState } from "react";
import styles from "./InputWithLabel.module.css";

type InputWithLabelProps = {
  label: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: React.HTMLInputTypeAttribute | undefined;
  errorMessage?: string;
  value: string;
};

const InputWithLabel: React.FC<InputWithLabelProps> = (props) => {
  const [showValue, setShowValue] = useState(false);
  const toggleVisiblity = () => {
    setShowValue((props) => !props);
  };
  return (
    <div className={styles.container}>
      <label className={styles.inputLabel}>{props.label}</label>
      {props.inputType === "password" ? (
        <span className={styles.passwordInputWrapper}>
          <input
            className={styles.passwordInput}
            type={showValue ? "text" : props.inputType}
            onChange={(event) => props.onChange && props.onChange(event)}
            value={props.value}
          />
          <button className={styles.toggleBtn} onClick={toggleVisiblity}>
            {showValue ? "Hide" : "Show"}
          </button>
        </span>
      ) : (
        <input
          className={styles.input}
          type={props.inputType}
          onChange={(event) => props.onChange && props.onChange(event)}
          value={props.value}
        />
      )}
      {props.errorMessage ? (
        <div className={styles.error}>{props.errorMessage}</div>
      ) : null}
    </div>
  );
};

export default InputWithLabel;
