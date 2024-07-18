import './App.css'
import { GoogleAuthProvider, inMemoryPersistence, setPersistence, signInWithPopup } from 'firebase/auth';
import { auth } from "../firebase"
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const navigateTo = useNavigate()

  async function checkAuth() {
      const checkAuth = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/test`, {
        credentials: "include"
      })
      return checkAuth.ok
  }

  async function login() {
    setPersistence(auth,inMemoryPersistence)
    const authProvider = new GoogleAuthProvider()
    let signInResult;
    try {
        signInResult = await signInWithPopup(auth, authProvider)
        const user = signInResult.user;
        const idToken = await user.getIdToken()
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            user: user.toJSON(),
            idToken: idToken
          })
        })
        if (res.ok && await checkAuth()) {
          // User exists so go to /dashboard
          navigateTo("/dashboard")
        } else if (res.status == 302) {
          // New user so go to /onboarding
          navigateTo("/onboarding")
        }
      } catch (error) {
        // Show some sort of error component
        console.log(error);
      }
  }

  return (
    <>
      <h1>Welcome to PMC</h1>
      <button onClick={login}>
        login with Google
      </button>
    </>
  )
}