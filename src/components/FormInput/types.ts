import { FieldError, UseFormRegister } from "react-hook-form";

export type FormData = {
    first_name: string
    last_name: string
    student_id: number
    year: string
    faculty: string
    major: string
    why_pm: string
    returning_member: boolean
};

export type FormInputProps = {
    label: string
    type: string
    placeholder: string
    name: ValidFieldNames
    register: UseFormRegister<FormData>
    error: FieldError | undefined
    valueAsNumber?: boolean
};
  

export type ValidFieldNames = "first_name" | "last_name" | "student_id" | "year" | 
                              "faculty" | "major" | "why_pm" | "returning_member";