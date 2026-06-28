"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Institution {
  id: string;
  name: string;
  status: "Active" | "Failed";
  lastUpdate: string;
  icon: string;
}

export default function SettingsView({ session, onUpdateUser }: { session: any; onUpdateUser?: (updatedUser: any) => void }) {
  // Profile state
  const [name, setName] = useState(session?.user?.name || "Alex Sterling");
  const [email, setEmail] = useState(session?.user?.email || "alex.sterling@sphere.ai");
  const [phone, setPhone] = useState("+1 (555) 012-3456");
  const [monthlyIncome, setMonthlyIncome] = useState(session?.user?.monthlyIncome || 150000);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // Security toggles
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [aiPrivacy, setAiPrivacy] = useState(true);

  // Notification toggles
  const [pushActive, setPushActive] = useState(true);
  const [emailActive, setEmailActive] = useState(true);
  const [aiRiskActive, setAiRiskActive] = useState(true);

  // Connected institutions
  const [institutions, setInstitutions] = useState<Institution[]>([
    { id: "1", name: "Chase Private Client", status: "Active", lastUpdate: "2 mins ago", icon: "account_balance" },
    { id: "2", name: "Amex Centurion", status: "Active", lastUpdate: "15 mins ago", icon: "credit_card" },
  ]);

  // Modal and toast states
  const [showAddInstModal, setShowAddInstModal] = useState(false);
  const [newInstName, setNewInstName] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser && session) {
      onUpdateUser({
        ...session.user,
        name,
        email,
        monthlyIncome: Number(monthlyIncome),
      });
    }
    setIsEditingDetails(false);
    triggerToast("Profile details updated successfully!");
  };

  const handleAddInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim()) return;
    const newInst: Institution = {
      id: Math.random().toString(),
      name: newInstName,
      status: "Active",
      lastUpdate: "Just now",
      icon: "account_balance",
    };
    setInstitutions([...institutions, newInst]);
    setNewInstName("");
    setShowAddInstModal(false);
    triggerToast(`Connected to ${newInst.name} successfully!`);
  };

  const handleDeleteInst = (id: string, name: string) => {
    setInstitutions(institutions.filter((item) => item.id !== id));
    triggerToast(`Disconnected ${name}.`);
  };

  const handleRefreshInst = (id: string, name: string) => {
    setInstitutions(
      institutions.map((item) =>
        item.id === id ? { ...item, lastUpdate: "Just now" } : item
      )
    );
    triggerToast(`Sync complete for ${name}.`);
  };

  const handleLogoutAll = () => {
    const conf = window.confirm("Are you sure you want to log out from all sessions?");
    if (conf) {
      localStorage.removeItem("finsphere.session");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-[100] glass-card border border-primary/30 p-4 rounded-2xl flex items-center gap-3 text-primary text-sm font-bold shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined">info</span>
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-xl">account_circle</span>
          <h3 className="font-headline-md text-base font-bold text-white uppercase tracking-wider">Profile &amp; Account</h3>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 flex-col md:flex-row text-center md:text-left">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 flex items-center justify-center overflow-hidden shadow-lg shadow-primary/20">
                  <img
                    alt="Alex Sterling"
                    className="w-full h-full object-cover rounded-full"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_6Q8o1zL1GZ3pWJm-QkS-q0gQ8l0L0a0J2d0J3b0K0e-F0i0_7j0w0z0y=w200-h200-c"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuDO2FaJfvGpOekFmomir5p4x0E5ckM30273TKxvOZ0dR-h_ckiZ3iLPjMa0gHu-efQJrkqp--G3KxSyD38ZNVJDF2StNkq38yGDnOgU2Ib0Qqr5Otqk6jWaTaZYF8ChVVgQoB73vsVhB2ija4ejZoV3MWoXrX-JoToEdf-G4rd0BsQIjL-SQWAYPHxIF2VqXvASjs8qEF_so1ccYyeNp-K0muIqsoDeOliTWBhlllpQ9ogbxhY7cge8Ul7JZcxOsjIoJyyLFEnYBbYP";
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingDetails(true)}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-background border-4 border-[#070b09] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h4 className="text-xl font-extrabold text-white">{name}</h4>
                  <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Platinum Elite
                  </span>
                </div>
                <p className="text-on-surface-variant text-xs mt-1 font-medium flex items-center justify-center md:justify-start gap-1.5">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {email}
                </p>
                <p className="text-on-surface-variant text-xs mt-0.5 font-medium flex items-center justify-center md:justify-start gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-sm">phone</span>
                  {phone}
                </p>
                <p className="text-on-surface-variant text-xs mt-0.5 font-medium flex items-center justify-center md:justify-start gap-1.5 font-mono">
                  <span className="material-symbols-outlined text-sm">payments</span>
                  Monthly Salary: ₹{Number(monthlyIncome).toLocaleString()}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingDetails(true)}
              className="px-5 py-2 border border-white/10 hover:bg-white/5 rounded-xl font-semibold text-xs text-white transition-all shadow-sm active:scale-95"
            >
              Edit Details
            </button>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-xl">verified_user</span>
          <h3 className="font-headline-md text-base font-bold text-white uppercase tracking-wider">Security &amp; Privacy</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Two Factor */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-300">
            <div className="space-y-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">lock</span>
              <h4 className="font-bold text-sm text-white">Two-Factor Auth</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Secure your account with multi-layer verification codes.
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${twoFactor ? "text-primary" : "text-on-surface-variant/40"}`}>
                {twoFactor ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setTwoFactor(!twoFactor);
                  triggerToast(twoFactor ? "Two-Factor Auth deactivated." : "Two-Factor Auth activated.");
                }}
                className={`w-12 h-6 rounded-full relative p-0.5 border border-white/10 transition-colors ${twoFactor ? "bg-primary" : "bg-white/5"}`}
              >
                <div className={`w-4.5 h-4.5 bg-[#0e1511] rounded-full transition-transform duration-300 ${twoFactor ? "translate-x-6" : "translate-x-0"}`}></div>
              </button>
            </div>
          </div>

          {/* Biometrics */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-300">
            <div className="space-y-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">fingerprint</span>
              <h4 className="font-bold text-sm text-white">Biometric Login</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Use FaceID or TouchID for instant, secure access.
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${biometric ? "text-primary" : "text-on-surface-variant/40"}`}>
                {biometric ? "Active" : "Inactive"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setBiometric(!biometric);
                  triggerToast(biometric ? "Biometric login disabled." : "Biometric login enabled.");
                }}
                className={`w-12 h-6 rounded-full relative p-0.5 border border-white/10 transition-colors ${biometric ? "bg-primary" : "bg-white/5"}`}
              >
                <div className={`w-4.5 h-4.5 bg-[#0e1511] rounded-full transition-transform duration-300 ${biometric ? "translate-x-6" : "translate-x-0"}`}></div>
              </button>
            </div>
          </div>

          {/* AI Privacy Mode */}
          <div className="glass-card rounded-3xl p-5 border border-white/5 flex flex-col justify-between h-full hover:border-primary/20 transition-all duration-300">
            <div className="space-y-2 mb-6">
              <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
              <h4 className="font-bold text-sm text-white">AI Privacy Mode</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                End-to-end encryption for all AI-driven insights.
              </p>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${aiPrivacy ? "text-primary" : "text-on-surface-variant/40"}`}>
                {aiPrivacy ? "Secured" : "Unsecured"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAiPrivacy(!aiPrivacy);
                  triggerToast(aiPrivacy ? "AI Privacy mode deactivated." : "AI Privacy mode fully secured.");
                }}
                className={`w-12 h-6 rounded-full relative p-0.5 border border-white/10 transition-colors ${aiPrivacy ? "bg-primary" : "bg-white/5"}`}
              >
                <div className={`w-4.5 h-4.5 bg-[#0e1511] rounded-full transition-transform duration-300 ${aiPrivacy ? "translate-x-6" : "translate-x-0"}`}></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Connected Institutions */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-xl">account_balance</span>
            <h3 className="font-headline-md text-base font-bold text-white uppercase tracking-wider">Connected Institutions</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAddInstModal(true)}
            className="text-primary font-bold text-xs hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            Add New
          </button>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-on-surface-variant border-b border-white/5 font-semibold">
                  <th className="pb-3 px-4">Institution</th>
                  <th className="pb-3 px-4">Sync Status</th>
                  <th className="pb-3 px-4">Last Update</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {institutions.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-on-surface-variant/70 text-lg">{item.icon}</span>
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 text-primary font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant font-medium">{item.lastUpdate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-3 text-on-surface-variant">
                        <button
                          type="button"
                          onClick={() => handleRefreshInst(item.id, item.name)}
                          className="hover:text-primary transition-colors flex items-center"
                          title="Sync Connection"
                        >
                          <span className="material-symbols-outlined text-base">sync</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInst(item.id, item.name)}
                          className="hover:text-error transition-colors flex items-center"
                          title="Disconnect"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Subscription Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-xl">loyalty</span>
          <h3 className="font-headline-md text-base font-bold text-white uppercase tracking-wider">Subscription Management</h3>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-primary/45 relative shadow-xl shadow-primary/5 bg-[#0b120f] overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-3xl font-extrabold text-white">Platinum Tier</h3>
                <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">
                  You are currently on our most exclusive plan. Enjoy unlimited AI processing power, priority node access, and 24/7 concierge support.
                </p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex gap-2">
                  <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">bolt</span></span>
                  <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">deployed_code</span></span>
                  <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined text-sm">shield</span></span>
                </div>
                <span className="text-[11px] text-on-surface-variant font-semibold">
                  Next billing date: Oct 12, 2024 (₹499.00/mo)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 shrink-0 w-full lg:w-auto justify-between lg:justify-end">
              <span className="material-symbols-outlined text-primary/35 text-[96px] hidden md:block">workspace_premium</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => triggerToast("Direct limits control currently handled via private key dashboard.")}
                  className="px-5 py-2.5 bg-primary text-background font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  Manage Limits
                </button>
                <button
                  type="button"
                  onClick={() => alert("Subscriptions details: Free Core, Pro (₹499/mo), and Platinum Elite (₹1,499/mo). Consult plans inside general pricing tab.")}
                  className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-on-surface font-semibold text-xs rounded-xl transition-all"
                >
                  Compare Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <h3 className="font-headline-md text-base font-bold text-white uppercase tracking-wider">Notification Preferences</h3>
        </div>

        <div className="glass-card rounded-3xl p-6 space-y-5 border border-white/5">
          {/* Push */}
          <div className="flex items-center justify-between py-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <div>
              <p className="font-bold text-sm text-white">Push Notifications</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Real-time alerts for market movements and AI signals.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPushActive(!pushActive);
                triggerToast(pushActive ? "Push alerts disabled." : "Push alerts enabled.");
              }}
              className={`w-12 h-6 rounded-full relative p-0.5 border border-white/10 transition-colors ${pushActive ? "bg-primary" : "bg-white/5"}`}
            >
              <div className={`w-4.5 h-4.5 bg-[#0e1511] rounded-full transition-transform duration-300 ${pushActive ? "translate-x-6" : "translate-x-0"}`}></div>
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between py-1 border-b border-white/5 pb-4 last:border-0 last:pb-0">
            <div>
              <p className="font-bold text-sm text-white">Email Summaries</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Daily and weekly digest of your portfolio performance.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailActive(!emailActive);
                triggerToast(emailActive ? "Email summaries disabled." : "Email summaries enabled.");
              }}
              className={`w-12 h-6 rounded-full relative p-0.5 border border-white/10 transition-colors ${emailActive ? "bg-primary" : "bg-white/5"}`}
            >
              <div className={`w-4.5 h-4.5 bg-[#0e1511] rounded-full transition-transform duration-300 ${emailActive ? "translate-x-6" : "translate-x-0"}`}></div>
            </button>
          </div>

          {/* AI Risk */}
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-bold text-sm text-white">AI Risk Alerts</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">High-priority warnings when AI detects potential risk shifts.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setAiRiskActive(!aiRiskActive);
                triggerToast(aiRiskActive ? "AI Risk warnings disabled." : "AI Risk warnings enabled.");
              }}
              className={`w-12 h-6 rounded-full relative p-0.5 border border-white/10 transition-colors ${aiRiskActive ? "bg-primary" : "bg-white/5"}`}
            >
              <div className={`w-4.5 h-4.5 bg-[#0e1511] rounded-full transition-transform duration-300 ${aiRiskActive ? "translate-x-6" : "translate-x-0"}`}></div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 text-xs">
        <button
          type="button"
          onClick={handleLogoutAll}
          className="text-error hover:underline flex items-center gap-1.5 font-semibold group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">logout</span>
          Log out from all sessions
        </button>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              setName(session?.user?.name || "Alex Sterling");
              setEmail(session?.user?.email || "alex.sterling@sphere.ai");
              setPhone("+1 (555) 012-3456");
              triggerToast("Changes discarded.");
            }}
            className="text-on-surface-variant hover:text-white font-semibold transition-colors py-2 px-4"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={() => triggerToast("All system changes saved successfully!")}
            className="px-6 py-2.5 bg-primary text-background font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/10"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditingDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setIsEditingDetails(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md p-6 rounded-3xl z-10 relative space-y-4 border border-white/10"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white text-base">Edit Profile Details</h3>
              <button onClick={() => setIsEditingDetails(false)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Monthly Salary (INR)</label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-background font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Save Details
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add Connected Institution Modal */}
      {showAddInstModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setShowAddInstModal(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md p-6 rounded-3xl z-10 relative space-y-4 border border-white/10"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white text-base">Connect New Institution</h3>
              <button onClick={() => setShowAddInstModal(false)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddInstitution} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Bank or Card Issuer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fidelity Investments, HSBC Bank"
                  value={newInstName}
                  onChange={(e) => setNewInstName(e.target.value)}
                  className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-background font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Link Secure Connection
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
