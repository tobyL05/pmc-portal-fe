import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormInput from "../FormInput/FormInput"
import { useNavigate } from "react-router-dom"
import { type User } from "firebase/auth"
import { loginBody } from "../../types/api"


const UserZodObj = z.object({
    first_name: z.string().min(1,{
        message: "Please enter a first name"
    }),
    last_name: z.string().min(1,{
        message: "Please enter a last name"
    }),
    student_id: z.number({
        coerce: true,
    }).min(1,{
        message: "Please enter a valid student ID"
    }),
    year: z.string().min(1,{
        message: "Please select a year"
    }),
    faculty: z.string().min(1,{
        message: "Please enter a valid faculty"
    }),
    major: z.string().min(1,{
        message: "Please enter a valid major"
    }),
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
        handleSubmit,
        formState: { errors },
      } = useForm<UserSchema>({
        resolver: zodResolver(UserZodObj)
      })

    const navigateTo = useNavigate()

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
                <FormInput
                    label="Student ID"
                    type="text"
                    placeholder="12345678"
                    name="student_id"
                    register={register}
                    error={errors.student_id}
                />

                <label>Year</label>
                <select {...register("year",{required: "please select a value"})}>
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