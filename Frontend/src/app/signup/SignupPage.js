"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [userType, setUserType] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useRouter();
    const validateForm = () => {
        const newErrors = {};

        if (!userType) newErrors.userType = "User type is required.";
        if (!name.trim()) newErrors.name = "Name is required.";
        if (!phoneNumber.trim() || !/^\d+$/.test(phoneNumber))
            newErrors.phoneNumber = "Valid phone number is required.";
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
            newErrors.email = "Valid email address is required.";
        if (!password.trim() || password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const signupCredentials = {
            email,
            password,
            phone: phoneNumber,
            name,
            role: userType,
        };

        try {
            const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
            const response = await fetch(`${backend}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify(signupCredentials),
            });

            if (response.ok) {
                // After successful signup, try signing in with the same email and password
                await createUserWithEmailAndPassword(auth, email, password);
                navigate.push('/login')
                console.log("vaaann");
                //setVerification(true); // Indicate that verification was successful
            } else {
                const errorData = await response.json();
                setErrors({ general: errorData.message || "Signup failed." });
            }
        } catch (err) {
            setErrors({ general: "An error occurred. Please try again." });
        }
    };

    return (

        <div className="min-h-screen bg-white flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 gap-8 lg:gap-16">
            {/* Left Section */}
            <div className="w-full max-w-md space-y-8">
                {/* Welcome Text */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Register Now!
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <select
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                        >
                            <option value="" disabled>
                                Select User Type
                            </option>
                            <option value="CUSTOMER">CUSTOMER</option>
                            <option value="RESTAURANT">RESTAURANT</option>
                            <option value="CAFE">CAFE</option>
                        </select>
                        {errors.userType && (
                            <p className="text-red-500 text-sm">{errors.userType}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                            placeholder="Name"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                            placeholder="Phone Number"
                        />
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                            placeholder="Email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                            placeholder="Password"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    {errors.general && (
                        <p className="text-red-500 text-sm text-center">
                            {errors.general}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-amber-400 text-white py-3 rounded-lg font-medium hover:bg-amber-500 transition duration-200"
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
}
