import React from "react";
import '../css/home.css';

const Home = () => {
  return (
      <div className="relative min-h-screen bg-black text-white">      
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Navbar */}
      <header className="relative z-20 flex items-center justify-between px-20 py-10">
        <h1 className="text-2xl font-light tracking-[0.4em]">
          NTH BANK
        </h1>

        <nav className="flex gap-12 text-sm uppercase tracking-[0.2em] text-white/60">
          <a href="#">Accounts</a>
          <a href="#">Transfers</a>
          <a href="#">Security</a>
          <a href="#">Support</a>
        </nav>
      </header>

      {/* Hero */}
      <div className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-[1600px] items-center justify-between px-10">

        <div className="max-w-3xl">
          <p className="mb-6 text-sm uppercase tracking-[0.4em] text-white/40">
            Private Banking Experience
          </p>

          <h1 className="text-8xl font-extralight leading-none">
            Banking
            <br />
            Reimagined
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/50">
            A premium financial ecosystem designed for modern clients.
            Seamless transactions, advanced security and elegant simplicity.
          </p>

          <div className="mt-12 flex gap-6">
            <button onClick={() => (window.location.href = "/register")} className="rounded-full border border-white bg-white px-10 py-4 text-black transition hover:scale-105">
              Open Account
            </button>

            <button className="rounded-full border border-white/20 px-10 py-4 backdrop-blur-xl transition hover:bg-white/5">
              Learn More
            </button>
          </div>
        </div>

        {/* Luxury Card */}
        <div className="w-[520px]">
          <div className="rounded-[40px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-3xl">
            
            <div className="mb-16 flex items-center justify-between">
              <span className="text-white/50">
                Premium Account
              </span>

              <span className="text-white/30">
                NTH
              </span>
            </div>

            <h2 className="text-6xl font-thin">
              $125,420
            </h2>

            <p className="mt-2 text-white/40">
              Available Balance
            </p>

            <div className="mt-20 flex justify-between border-t border-white/10 pt-8">
              <div>
                <p className="text-white/30">Account</p>
                <h3 className="mt-2 text-xl">
                  **** 4821
                </h3>
              </div>

              <div>
                <p className="text-white/30">Status</p>
                <h3 className="mt-2 text-xl">
                  Active
                </h3>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Stats */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1600px] justify-between border-t border-white/10 px-10 py-10">
        <div>
          <h3 className="text-4xl font-thin">99.99%</h3>
          <p className="mt-2 text-white/40">System Uptime</p>
        </div>

        <div>
          <h3 className="text-4xl font-thin">$2.5B+</h3>
          <p className="mt-2 text-white/40">Processed Volume</p>
        </div>

        <div>
          <h3 className="text-4xl font-thin">24/7</h3>
          <p className="mt-2 text-white/40">Global Access</p>
        </div>

        <div>
          <h3 className="text-4xl font-thin">256-bit</h3>
          <p className="mt-2 text-white/40">Encryption</p>
        </div>
      </div>

    </div>
  );
};

export default Home;