import React, { useState } from "react";
import { api } from "../api.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");


    React.useEffect(() => {
      if (token) {
        setSuccess("Already logged in");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }
        , 1000);
        return;
      }
    }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
  

    const login_api = api + "/api/v1/nth/auth/login/";

    fetch(login_api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw data;
        }

        return data;
      })
      .then((data) => {
        if (data.success) {
          setSuccess("Login successful");

          localStorage.setItem("token", data.token);

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 800);
        } else {
          setError(data.detail || data.message || "Login failed");
        }
      })
      .catch((err) => {
        console.log(err);

        setError(err.detail || "Invalid email or password");
      });
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-10">

        <div className="w-full max-w-md rounded-[40px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-3xl">

          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-white/40">
            NTH BANK
          </p>

          <h1 className="text-5xl font-extralight">Sign In</h1>

          <p className="mt-4 text-white/50">
            Access your premium banking account.
          </p>

          {/* Messages */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-300">
              {success}
            </div>
          )}

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={handleLogin}>

            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30 focus:border-white/30"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30 focus:border-white/30"
            />

            <button
              type="submit"
              className="w-full rounded-2xl bg-white py-4 text-black transition hover:scale-[1.02]"
            >
              Sign In
            </button>

          </form>

          <p className="mt-8 text-center text-white/40">
            Don't have an account?
            <span
              className="ml-2 cursor-pointer text-white"
              onClick={() => (window.location.href = "/register")}
            >
              Create one
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;