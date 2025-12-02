import type { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";

const InputField: FC<
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = (props) => {
	return (
		<input
			type="text"
			className="text-xl w-full md:w-auto rounded-md 
			border bg-zinc-300/40 border-zinc-100/10 shadow-lg backdrop-blur-xs hover:scale-101 active:scale-101 transition-transform p-3 dark:bg-zinc-950/60 dark:border-zinc-600/30;
			"
			{...props}
		/>
	);
};

export default InputField;
