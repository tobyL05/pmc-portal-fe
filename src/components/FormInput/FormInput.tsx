import { FormInputProps } from "./types";


export default function FormInput({ label, type, placeholder, name, register, error, valueAsNumber } : FormInputProps) {
    return (
        <>
            <label>{label}</label>
            <input type={type} placeholder={placeholder} {...register(name, { valueAsNumber })} />
            {error && <span className="error-message">{error.message}</span>}
        </>
    )
}
