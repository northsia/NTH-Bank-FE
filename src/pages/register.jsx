import React from "react";
import { api } from "../api.jsx";
import { useState } from "react";

const Register = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const Logic = () => {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (firstName === "" || lastName === "" || email === "" || password === "") {
        alert("Please fill in all fields");
          return;
        }

      const register_api = api + "/api/v1/nth/auth/register";
      console.log("Registering user:", { firstName, lastName, email });
      console.log("API endpoint:", register_api);

      fetch(register_api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw data;
          }
          return data;
        }
        )
        .then((data) => {
          if (data.success) {
            setMsg("Registration successful!");
            if (data.token) {
              localStorage.setItem("token", data.token);
            }
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 2000);
          }
        })
        .catch((error) => {
          // Handle registration error
          console.error("Registration error:", error);
          setError(error.message || "An error occurred during registration.");
        });
  }






  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-10">

        <div className="w-full max-w-xl rounded-[40px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-3xl">

          <p className="mb-3 text-sm uppercase tracking-[0.4em] text-white/40">
            NTH BANK
          </p>

          <h1 className="text-5xl font-extralight">
            Create Account
          </h1>

          <p className="mt-4 text-white/50">
            Join the next generation of digital banking.
          </p>

          <form className="mt-10 grid grid-cols-2 gap-5" onSubmit={(e) => e.preventDefault()}>

            <input
              type="text"
              placeholder="First Name"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Last Name"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              className="col-span-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="col-span-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="col-span-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              className="col-span-2 mt-3 rounded-2xl bg-white py-3 text-black transition hover:scale-[1.00]"
              onClick={Logic}
            >
              Create Account
            </button>

            {Msg && (
              <div className="col-span-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
                {Msg}
              </div>
            )}

            {error && (
              <div className="col-span-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-100">
                {error}
              </div>
            )}

            <span className="col-span-2 mt-8 text-center text-white/40" onClick={() => (window.location.href = "/login")}>
                Already have an account?
            </span>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Register;