import { HTMLAttributes } from "react";
import Styles from "./styles.scss";

type SpinnerProps = HTMLAttributes<HTMLDivElement>;

export const Spinner = (props: SpinnerProps) => {
  return (
    <div {...props} className={[Styles.spinner, props.className].join(" ")}>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};
