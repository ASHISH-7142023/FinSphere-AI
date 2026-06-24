"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { currency } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  initials?: string;
  avatar?: string;
  type: "get" | "give";
  amount: number;
  lastActive: string;
}

interface Entry {
  id: string;
  contactId: string;
  type: "get" | "give";
  amount: number;
  remarks: string;
  date: string;
}

export default function MerchantKhataView() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Vardhman Textiles Ltd.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXNGRlAf8HTSGEjwn1O4758fMZGru56Iftsgeju8KvmcNRaP18HCjgoMQKh8haR9QYW2PcRi_FIXeFEuCzxuOH1lZr_ReZzf95FxDHclfPtn_o8XQAbeIxdiBpi7t1dZWnOu6uHZe6IasNCHdx8ofYuOA4FgQPz35Y0kA9Q44V9qpcGvmg4P0_iFkVHwAq1XcPa1ooMtJ38t0PhC4Se6MiJodfefSChN1nafVc3CmerqlF24DvnUvbN0qzb_-0itQDSZRrhJVS0wXc",
      type: "get",
      amount: 45200,
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Rajesh Khanna (Logistics)",
      initials: "RK",
      type: "give",
      amount: 12850,
      lastActive: "Yesterday",
    },
    {
      id: "3",
      name: "Apex Packaging Corp",
      initials: "AP",
      type: "get",
      amount: 18500,
      lastActive: "3 days ago",
    },
  ]);

  const [entries, setEntries] = useState<Entry[]>([
    { id: "101", contactId: "1", type: "get", amount: 30000, remarks: "Yarn delivery batch 4", date: "2026-06-23" },
    { id: "102", contactId: "1", type: "get", amount: 15200, remarks: "Transport charges reimbursed", date: "2026-06-24" },
    { id: "103", contactId: "2", type: "give", amount: 12850, remarks: "Settle logistics invoice #99", date: "2026-06-22" },
  ]);

  const [activeContactId, setActiveContactId] = useState<string>("1");
  const [formData, setFormData] = useState({
    amount: "",
    remarks: "",
    type: "get" as "get" | "give",
  });

  const [newContactName, setNewContactName] = useState("");
  const [newContactType, setNewContactType] = useState<"get" | "give">("get");
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  // Compute totals
  const totalGet = contacts.filter((c) => c.type === "get").reduce((acc, curr) => acc + curr.amount, 0);
  const totalGive = contacts.filter((c) => c.type === "give").reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalGet - totalGive;

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount))) return;

    const amt = Number(formData.amount);
    const newEntry: Entry = {
      id: Date.now().toString(),
      contactId: activeContactId,
      type: formData.type,
      amount: amt,
      remarks: formData.remarks || "No remarks",
      date: new Date().toISOString().split("T")[0] || "",
    };

    setEntries((prev) => [newEntry, ...prev]);

    // Update contacts list totals
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === activeContactId) {
          let finalAmount = c.amount;
          if (c.type === formData.type) {
            finalAmount += amt;
          } else {
            finalAmount -= amt;
            if (finalAmount < 0) {
              c.type = c.type === "get" ? "give" : "get";
              finalAmount = Math.abs(finalAmount);
            }
          }
          return { ...c, amount: finalAmount, lastActive: "Just now" };
        }
        return c;
      })
    );

    setFormData({ amount: "", remarks: "", type: "get" });
  };

  const handleAddContact = () => {
    if (!newContactName.trim()) return;
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newContactName,
      initials: newContactName
        .split(" ")
        .map((x) => x[0])
        .join("")
        .toUpperCase()
        .substring(0, 2),
      type: newContactType,
      amount: 0,
      lastActive: "Created now",
    };

    setContacts((prev) => [...prev, newContact]);
    setActiveContactId(newContact.id);
    setNewContactName("");
    setShowAddContactModal(false);
  };

  const handleSettleUp = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return { ...c, amount: 0, lastActive: "Settled up just now" };
        }
        return c;
      })
    );
    setEntries((prev) => prev.filter((e) => e.contactId !== contactId));
  };

  const activeContact = contacts.find((c) => c.id === activeContactId);
  const activeEntries = entries.filter((e) => e.contactId === activeContactId);

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight">Merchant Khata Ledger</h2>
          <p className="text-on-surface-variant text-base">Manage credit relations with real-time balance reconciliation.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-on-surface font-semibold text-xs hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-[18px]">download</span> Export Report
          </button>
          <button
            onClick={() => setShowAddContactModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-background font-bold text-xs hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span> Add New Contact
          </button>
        </div>
      </div>

      {/* Ledger Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-primary">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Total Net Balance</p>
          <div className="flex items-baseline gap-2">
            <h3 className="font-display-lg text-2xl font-bold text-primary">{currency(netBalance)}</h3>
            <span className="text-primary/60 font-semibold text-xs">{netBalance >= 0 ? "Receivable" : "Payable"}</span>
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-primary-container">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">You'll Get</p>
          <h3 className="font-display-lg text-2xl font-bold text-[#00c896]">{currency(totalGet)}</h3>
          <p className="text-[10px] text-on-surface-variant/60 mt-1">Across {contacts.filter((c) => c.type === "get" && c.amount > 0).length} active accounts</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border-l-4 border-error">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">You'll Give</p>
          <h3 className="font-display-lg text-2xl font-bold text-error">{currency(totalGive)}</h3>
          <p className="text-[10px] text-on-surface-variant/60 mt-1">To {contacts.filter((c) => c.type === "give" && c.amount > 0).length} trusted merchants</p>
        </div>
      </div>

      {/* Columns: Ledger Lists & Transaction Forms */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Side: Contact List */}
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white">Active Contacts</h4>
            <span className="text-xs text-on-surface-variant">Click name to view history</span>
          </div>
          
          <div className="space-y-3">
            {contacts.map((contact) => {
              const isActive = contact.id === activeContactId;
              return (
                <div
                  key={contact.id}
                  onClick={() => handleSelectContact(contact.id)}
                  className={`glass-card p-4 rounded-2xl flex items-center gap-4 cursor-pointer relative overflow-hidden group border transition-all ${
                    isActive ? "border-primary/40 bg-primary/[0.02]" : "border-white/5 hover:border-primary/20"
                  }`}
                >
                  {contact.avatar ? (
                    <img className="w-12 h-12 rounded-full object-cover border border-white/10" src={contact.avatar} alt={contact.name} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-sm text-on-surface-variant">
                      {contact.initials}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h5 className="font-bold text-sm text-white group-hover:text-primary transition-colors truncate">{contact.name}</h5>
                      <div className="text-right">
                        <p className={`text-[9px] uppercase font-bold tracking-wider ${contact.type === "get" ? "text-primary" : "text-error"}`}>
                          {contact.type === "get" ? "You'll Get" : "You'll Give"}
                        </p>
                        <p className={`font-bold text-sm ${contact.type === "get" ? "text-primary" : "text-error"}`}>
                          {currency(contact.amount)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[10px] text-on-surface-variant mt-1">Last active: {contact.lastActive}</p>
                    
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleSettleUp(contact.id)}
                          className="flex-1 py-1.5 rounded-lg bg-white/5 text-xs text-white hover:bg-primary hover:text-background font-bold transition-all"
                        >
                          Settle Up Balance
                        </button>
                        <button className="px-4 py-1.5 rounded-lg border border-white/10 hover:border-primary/40 text-xs font-semibold flex items-center gap-1 transition-all">
                          <span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Ledger Form and Entries history */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          
          {activeContact && (
            <>
              {/* Record Entry Form */}
              <div className="glass-card p-6 rounded-2xl space-y-4 border border-white/10">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                  New Entry: {activeContact.name}
                </h4>
                
                <form onSubmit={handleAddEntry} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type: "get" }))}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        formData.type === "get"
                          ? "bg-primary text-background border-primary"
                          : "bg-white/5 text-on-surface-variant border-transparent"
                      }`}
                    >
                      Credit (You Gave)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type: "give" }))}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        formData.type === "give"
                          ? "bg-error text-on-error border-error"
                          : "bg-white/5 text-on-surface-variant border-transparent"
                      }`}
                    >
                      Debit (You Got)
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Amount (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                      placeholder="₹5,000"
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Remarks / Bill Info</label>
                    <input
                      value={formData.remarks}
                      onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
                      placeholder="e.g. Yarn delivery packet 5"
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-background font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    Record Entry <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                </form>
              </div>

              {/* Transactions log entries list */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-sm text-white">Transaction Logs</h4>
                <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  {activeEntries.map((e) => (
                    <div key={e.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-white">{e.remarks}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{e.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${e.type === "get" ? "text-primary" : "text-error"}`}>
                          {e.type === "get" ? "+" : "-"}{currency(e.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {activeEntries.length === 0 && (
                    <p className="text-center py-6 text-xs text-on-surface-variant">No transaction entries found for this customer.</p>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setShowAddContactModal(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md p-6 rounded-3xl z-10 relative space-y-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-headline-md text-lg text-white font-bold">Add New Contact</h3>
              <button onClick={() => setShowAddContactModal(false)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-on-surface-variant font-semibold">Contact Name</label>
              <input
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="e.g. Apex Textiles Ltd"
                className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-on-surface-variant font-semibold">Default Relationship</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setNewContactType("get")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    newContactType === "get" ? "bg-primary text-background border-primary" : "bg-white/5 text-on-surface-variant border-transparent"
                  }`}
                >
                  Receivable (Credit)
                </button>
                <button
                  onClick={() => setNewContactType("give")}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    newContactType === "give" ? "bg-error text-on-error border-error" : "bg-white/5 text-on-surface-variant border-transparent"
                  }`}
                >
                  Payable (Debit)
                </button>
              </div>
            </div>

            <button
              onClick={handleAddContact}
              className="w-full py-3 bg-primary text-background font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all"
            >
              Create Account Ledger
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
