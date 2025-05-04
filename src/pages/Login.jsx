import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link

export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("https://gdsc-server-fy70.onrender.com/login", { // Update to your backend URL
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: userName, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to login");
            }

            localStorage.setItem("user_id", data.user_id);
            navigate("/");
            window.location.reload();
        } catch (err) {
            setError(err.message || "Something went wrong");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="max-w-sm mx-auto p-5 bg-white border border-gray-300 rounded-lg shadow-lg text-center text-gray-800">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 p-4 rounded-lg">
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
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>
                </form>
                <p className="text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}