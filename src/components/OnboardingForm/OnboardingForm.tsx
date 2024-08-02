import { coerce, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "../FormInput/FormInput"
import { useNavigate } from "react-router-dom"
import { type User } from "firebase/auth"
import { loginBody } from "../../types/api"
import { useEffect } from "react"


const UserZodObj = z.object({
    first_name: z.string().min(1,{
        message: "Please enter a first name"
    }),

    last_name: z.string().min(1,{
        message: "Please enter a last name"
    }),

    ubc_student: z.string().min(1,{
        message: "Please select an option."
    }),

    student_id: z.number({
        coerce: true
    })
    .int({
        message: "Student IDs must not have decimal points!"
    })
    .gte(10000000, {
        message: "Please enter a valid 8-digit student ID."
    })
    .lte(99999999, {
        message: "Please enter a valid 8-digit student ID."
    })
    .optional(),

    year: z.string().min(1,{
        message: "Please select a year"
    }).optional(),

    faculty: z.string().min(1,{
        message: "Please enter a valid faculty"
    }).optional(),

    major: z.string().min(1,{
        message: "Please enter a valid major"
    }).optional(),

    why_pm: z.string().min(1,{
        message: "Why would you like to join PMC?"
    }).max(300, {
        message: "Maximum 300 characters"
    }),

    returning_member: z.boolean({
        required_error: "Are you a returning member?"
    })
})

type UserSchema = z.infer<typeof UserZodObj>

/**
 * 
 * @param user
 * The currently logged in user via Google SSO that needs to be onboarded 
 * 
 * @param creds
 * Login credentials such as userUID and idToken needed to exchange for session cookie. 
 * These credentials are needed as the login method is called after onboarding. 
 * This will log the user in after onboarding.
 * 
 */
export default function OnboardingForm({ user, creds }: { user: User, creds: loginBody }) {
    const {
        register,
        unregister,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<UserSchema>({
        resolver: zodResolver(UserZodObj)
      })

    const student_status = watch("ubc_student")

    useEffect(() => {
        if (student_status === "no, other uni") {
            // Other university student
            unregister("student_id")
        } else {
            // Not a university student
            unregister("student_id")
            unregister("year")
            unregister("faculty")
            unregister("major")
        }
    },[student_status])

    const onSubmit = async (data: UserSchema) => {
        // fetch onboarding endpoint
        const onboarding = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/onboarding`,{
            method: "POST",
            credentials: "include",
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
                creds: creds,
                userDoc: {
                    displayName: user.displayName,
                    email: user.email,
                    pfp: user.photoURL,
                    ... data
                }
            })
        })
        
        if (onboarding.ok) {
            navigateTo("/dashboard")
        } else {
            // show error component
            const jsonresp = await onboarding.json()
            console.log(jsonresp)

        }
    }

    const navigateTo = useNavigate()

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormInput
                    label="First name"
                    type="text"
                    name="first_name"
                    placeholder="Steve"
                    register={register}
                    error={errors.first_name}
                />
                <FormInput
                    label="Last name"
                    type="text"
                    name="last_name"
                    placeholder="Jobs"
                    register={register}
                    error={errors.last_name}
                />
                <label>Are you a UBC student?</label>
                <select defaultValue="Please select a value" {...register("ubc_student",{required: "please select a value"})}>
                    <option value={"yes"}>Yes</option>
                    <option value={"no, other uni"}>No, I'm from another university.</option>
                    <option value={"no, other"}>No, other</option>
                </select>

                {student_status === "yes" && 
                    <FormInput
                        label="Student ID"
                        type="text"
                        placeholder="12345678"
                        name="student_id"
                        register={register}
                        error={errors.student_id}
                    />
                }

                {student_status !== "no, other" && 
                    <>
                    <label>Year</label>
                    <select defaultValue="Please select a value" {...register("year",{required: "please select a value"})}>
                        <option value={"1"}>1</option>
                        <option value={"2"}>2</option>
                        <option value={"3"}>3</option>
                        <option value={"4"}>4</option>
                        <option value={"4+"}>4+</option>
                    </select>
                        <FormInput
                            label="Faculty"
                            type="text"
                            placeholder="Science"
                            name="faculty"
                            register={register}
                            error={errors.faculty}
                        />
                        <FormInput
                            label="Major"
                            type="text"
                            placeholder="Computer Science"
                            name="major"
                            register={register}
                            error={errors.major}
                        />
                    </>
                }       
                
                <FormInput
                    label="Why product management?"
                    type="text"
                    placeholder="Products go brr"
                    name="why_pm"
                    register={register}
                    error={errors.major}
                />
                <FormInput
                    label="Are you a returning PMC member?"
                    placeholder=""
                    type="checkbox"
                    name="returning_member"
                    register={register}
                    error={errors.returning_member}
                />
                <button type="submit">Continue to dashboard</button>
            </form>
        </div>
    )
}