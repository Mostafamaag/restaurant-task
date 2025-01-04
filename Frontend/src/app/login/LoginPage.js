"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [userToken, setUserToken] = useState(localStorage.getItem("token") || null);
  const userId = useRef(null);
  const navigate = useRouter();

  useEffect(() => {
    if (userToken) {
      navigate.push("/home");
    }
  }, [userToken]);

  useEffect(() => {
    if (otp === '123456') {
      const token = localStorage.getItem("token");
      setUserToken(token);
    }
  }, [otp]);


  // verification email
  const verifyEmail = async () => {
    const user = auth.currentUser;

    if (user && !user.emailVerified) {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      const actionCodeSettings = {
        url: `${backend}/api/auth/verify/${userId.current}`,
      };

      try {
        await sendEmailVerification(user, actionCodeSettings);
      } catch (error) {
        setError("Failed to send verification email. Please try again later.");
      }
    } else {
      setError("User is already verified or not authenticated.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginCredentials = { email, password };

    try {
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backend}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginCredentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const { token } = data;
        localStorage.setItem("token", token);
        // userId.current = data.user.id;
        // console.log(userId.current);
        setShowVerification(true);

      } else {
        setError("Invalid credentials or error occurred. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return !userToken && !showVerification ? (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 lg:gap-16">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-600">Enter your email and password!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
              placeholder="Email"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 text-white py-3 rounded-lg font-medium hover:bg-amber-500 transition duration-200"
          >
            Next
          </button>

          <p className="text-center text-gray-600">
            Don't have an Account?{" "}
            <Link href="/signup" className="text-red-500 hover:text-red-600">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  ) : showVerification ? (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 lg:gap-16">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Please send a verification email and check your inbox or Enter Otp Code.
          </h1>
        </div>

        <button
          onClick={verifyEmail}
          className="w-full bg-blue-400 text-white py-3 rounded-lg font-medium hover:bg-blue-500 transition duration-200"
        >
          Send Verification Email
        </button>

        <div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
            placeholder="Otp"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  ) : (
    <h1>Loading</h1>
  );
}

