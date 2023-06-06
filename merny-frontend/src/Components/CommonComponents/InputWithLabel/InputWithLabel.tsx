import React from "react";
import styles from "./InputWithLabel.module.css";

type InputWithLabelProps = {
  label: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: React.HTMLInputTypeAttribute | undefined;
  errorMessage?: string;
  value: string;
};

const InputWithLabel: React.FC<InputWithLabelProps> = (props) => {
  return (
    <div className={styles.container}>
      <label className={styles.inputLabel}>{props.label}</label>
      <input
        className={styles.input}
        type={props.inputType}
        onChange={(event) => props.onChange && props.onChange(event)}
        value={props.value}
      />
      {props.errorMessage ? (
        <div className={styles.error}>{props.errorMessage}</div>
      ) : null}
    </div>
  );
};

export default InputWithLabel;
