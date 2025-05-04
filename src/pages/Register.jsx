import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await fetch("https://gdsc-server-fy70.onrender.com/register", { // Update to your backend URL
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: userName, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to register");
            }

            navigate("/login"); // Redirect to login page after successful registration
        } catch (err) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="max-w-sm mx-auto p-5 bg-white border border-gray-300 rounded-lg shadow-lg text-center text-gray-800">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <form onSubmit={handleRegister} className="flex flex-col gap-4 p-4 rounded-lg">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Username"
                        className="input input-bordered bg-gray-200"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="input input-bordered bg-gray-200"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="input input-bordered bg-gray-200"
                        required
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" className="btn btn-primary">
                        Register
                    </button>
                </form>
                <p className="text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}