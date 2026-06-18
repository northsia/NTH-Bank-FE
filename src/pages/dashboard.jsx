import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { api } from "../api.jsx";

// ── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === "success"
      ? "border-green-500/30 text-green-400"
      : type === "error"
      ? "border-red-500/30 text-red-400"
      : "border-white/20 text-white/80";

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3
        rounded-2xl border bg-black px-5 py-3 shadow-xl backdrop-blur-md
        animate-[fadeUp_0.3s_ease] ${colors}`}
      style={{ minWidth: 280, maxWidth: 420 }}
    >
      {type === "success" && (
        <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
        </svg>
      )}
      {type === "error" && (
        <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
        </svg>
      )}
      <span className="text-sm leading-snug">{message}</span>
      <button onClick={onClose} className="ml-auto opacity-40 hover:opacity-80 transition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// ── Skeleton ───────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div
    className={`rounded-xl bg-white/[0.06] animate-pulse ${className}`}
  />
);

// ── Spinner ────────────────────────────────────────────────────────────────
const Spinner = ({ size = 18, className = "" }) => (
  <svg
    className={`animate-spin ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// ── Dashboard ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);

  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  const [nthUid, setNthUid] = useState("");
  const [username, setUsername] = useState("");

  const [balance, setBalance] = useState(null);   // null = loading
  const [status, setStatus] = useState("");

  const [transactions, setTransactions] = useState(null); // null = loading
  const [sendLoading, setSendLoading] = useState(false);

  const [meLoading, setMeLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [toast, setToast] = useState(null); // { message, type }

  const amountLimit = 100000.0;

  const showToast = (message, type = "info") => setToast({ message, type });
  const closeToast = () => setToast(null);

  // ── Send ──────────────────────────────────────────────────────────────
  const SendLogic = () => {
    if (amount > amountLimit) {
      showToast(`Transfer amount exceeds the limit of $${amountLimit.toLocaleString()}`, "error");
      return;
    }
    if (amount <= 0) {
      showToast("Transfer amount must be greater than zero", "error");
      return;
    }
    if (receiverId === "") {
      showToast("Receiver ID cannot be empty", "error");
      return;
    }
    if (receiverId === nthUid) {
      showToast("You cannot send money to yourself", "error");
      return;
    }

    setSendLoading(true);

    fetch(api + "/api/v1/nth/bank/transfer/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to_nth_uid: receiverId,
        amount: amount,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw data;
        if (data.success) {
          showToast(`Transfer successful! Transaction ID: ${data.transaction_id}`, "success");
          setBalance(data.sender_balance);
          setReceiverId("");
          setAmount("");
          setShowModal(false);
        }
        return data;
      })
      .catch((error) => {
        showToast(error.detail || error.message || "An error occurred during transfer.", "error");
      })
      .finally(() => setSendLoading(false));
  };

  // ── JWT ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { window.location.href = "/login"; return; }
    try {
      const decoded = jwtDecode(token);
      setNthUid(decoded.nth_uid);
      setUsername(decoded.username);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  // ── GET ME ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    setMeLoading(true);
    fetch(api + "/api/v1/nth/account/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setBalance(data.account.balance);
        setStatus(data.account.status);
        setUsername(data.user.username);
        setNthUid(data.user.nth_uid);
      })
      .catch(() => showToast("Failed to load account data.", "error"))
      .finally(() => setMeLoading(false));
  }, [token]);

  // ── HISTORY ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) return;
    setHistoryLoading(true);
    fetch(api + "/api/v1/nth/account/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch(() => showToast("Failed to load transaction history.", "error"))
      .finally(() => setHistoryLoading(false));
  }, [token]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 mx-auto max-w-[1400px] px-10 py-16">

        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-[0.4em]">NTH BANK</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="rounded-full bg-white px-8 py-3 text-black transition hover:scale-105"
            >
              Send Money
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="rounded-full border border-white/20 px-6 py-3 text-white/60 transition hover:scale-105 hover:border-white/40 hover:text-white flex items-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* BALANCE */}
        <div className="mt-16 rounded-[40px] border border-white/10 bg-white/[0.03] p-10 backdrop-blur-3xl">
          <p className="text-white/40">Available Balance</p>
          {meLoading ? (
            <div className="mt-3 flex items-center gap-3">
              <Skeleton className="h-14 w-64" />
            </div>
          ) : (
            <h2 className="mt-3 text-6xl font-thin">
              ${Number(balance ?? 0).toLocaleString()}
            </h2>
          )}
        </div>

        {/* CONTENT */}
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">

          {/* HISTORY */}
          <div className="rounded-[40px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">
            <h3 className="mb-6 text-xl font-light tracking-[0.2em]">TRANSACTIONS</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {historyLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[76px] w-full" />
                  ))}
                </>
              ) : !transactions || transactions.length === 0 ? (
                <div className="text-center py-8 text-white/40">
                  No transactions found
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4"
                  >
                    <div>
                      <p className="font-medium">
                        {tx.direction === "incoming" ? "Received Transfer" : "Sent Transfer"}
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-white/50">{tx.status}</p>
                    </div>
                    <div
                      className={
                        tx.direction === "incoming"
                          ? "text-green-400 text-lg font-semibold"
                          : "text-red-400 text-lg font-semibold"
                      }
                    >
                      {tx.direction === "incoming" ? "+" : "-"}
                      {Number(tx.amount).toLocaleString()} $
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACCOUNT INFO */}
          <div className="rounded-[40px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-3xl">
            <h3 className="text-xl font-light tracking-[0.2em]">ACCOUNT INFO</h3>
            {meLoading ? (
              <div className="mt-6 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-48" />
                ))}
              </div>
            ) : (
              <div className="mt-6 space-y-4 text-white/60">
                <p>Identity: {nthUid}</p>
                <p>Status: {status}</p>
                <p>Security: High</p>
                <p>Account Holder: {username}</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="w-[400px] rounded-[30px] border border-white/10 bg-black p-8">
            <h2 className="text-xl font-light tracking-[0.2em]">SEND MONEY</h2>

            <div className="mt-6 space-y-4">
              <input
                type="text"
                placeholder="Receiver NTH UID"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                disabled={sendLoading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none disabled:opacity-40"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={sendLoading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none disabled:opacity-40"
              />

              <button
                onClick={SendLogic}
                disabled={sendLoading}
                className="w-full rounded-xl bg-white py-3 text-black transition hover:scale-105
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                  flex items-center justify-center gap-2"
              >
                {sendLoading ? (
                  <>
                    <Spinner size={16} className="text-black" />
                    <span>Processing…</span>
                  </>
                ) : (
                  "Confirm"
                )}
              </button>

              <button
                onClick={() => { if (!sendLoading) setShowModal(false); }}
                disabled={sendLoading}
                className="w-full text-white/40 disabled:opacity-30 transition hover:text-white/60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}

      {/* Keyframe for toast animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;