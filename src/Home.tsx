import { useEffect, useState } from 'react'
import './App.css'
import { GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth } from "../firebase"

export default function Home() {
  const authProvider = new GoogleAuthProvider()

  useEffect(() => {
    async () => {
      const response = await getRedirectResult(auth)
      if (response) {
        console.log(response.user)
      }
    }
  })

  return (
    <>
      <h1>Welcome to PMC</h1>
      <button onClick={() =>{signInWithRedirect(auth, authProvider)}}>
        login with Google
      </button>
    </>
  )
}