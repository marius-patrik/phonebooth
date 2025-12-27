import type { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import { Input } from "liqid";

const InputField: FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = (props) => {
  return <Input className="md:w-auto" type="text" {...props} />;
};

export default InputField;
