"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { currency } from "@/lib/utils";

interface BillPaymentDetailProps {
  isOpen: boolean;
  onClose: () => void;
  billType: "electricity" | "water" | "gas" | "dth" | "fastag";
  providerName: string;
  consumerId: string;
  dueAmount: number;
  dueDate: string;
  onPaymentSuccess: (amount: number) => void;
}

export default function BillPaymentDetail({
  isOpen,
  onClose,
  billType,
  providerName,
  consumerId,
  dueAmount,
  dueDate,
  onPaymentSuccess,
}: BillPaymentDetailProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "netbanking">("upi");
  const [isPaying, setIsPaying] = useState(false);

  if (!isOpen) return null;

  // Calculate detailed items
  const baseUsage = Math.round(dueAmount * 0.9);
  const serviceFee = 12.50;
  const latePenalty = dueAmount > 3000 ? 50.00 : 5.00;
  const cashback = -Math.round(dueAmount * 0.05 * 100) / 100;
  const totalPayable = baseUsage + serviceFee + latePenalty + cashback;

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      onPaymentSuccess(totalPayable);
      onClose();
    }, 1500);
  };

  const getIcon = () => {
    switch (billType) {
      case "electricity": return "bolt";
      case "water": return "water_drop";
      case "gas": return "local_gas_station";
      case "dth": return "tv";
      case "fastag": return "directions_car";
      default: return "receipt";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 glass-card max-w-4xl w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
        >
          {/* Top Shimmer Header Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-400 to-primary/20"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full z-20"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          {/* Left Column: Billing Details & AI Audit */}
          <div className="md:col-span-7 p-6 md:p-8 space-y-6 border-r border-white/5">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">{getIcon()}</span>
                </div>
                <div>
                  <h3 className="font-headline-lg text-lg font-bold text-white tracking-tight uppercase capitalize">{billType} Bill</h3>
                  <p className="text-xs text-on-surface-variant">{providerName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Consumer Account Number</label>
                  <div className="relative">
                    <input
                      readOnly
                      value={consumerId || "N/A"}
                      className="w-full bg-surface-container-low border border-white/5 rounded-xl py-3 px-4 text-sm text-on-surface font-bold outline-none"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary text-sm font-bold">verified</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Billing Cycle</label>
                    <div className="bg-surface-container-low border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold text-white">
                      Current Period
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Due Date</label>
                    <div className="bg-surface-container-low border border-white/5 rounded-xl py-3 px-4 text-xs font-semibold text-error/90">
                      {dueDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Bill Audit */}
            <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                <span className="text-[10px] font-black uppercase tracking-widest">FinSphere AI Bill Audit</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <h4 className="font-bold text-sm text-white">Abnormal Surge Identified</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    This bill contains a consumption spike of <span className="text-error font-bold">+24%</span> compared to your standard rolling average. FinSphere recommends verified audit logging.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-surface-container-high flex flex-col items-center justify-center relative shrink-0">
                  <span className="text-[10px] font-bold text-error">+24%</span>
                  <span className="text-[8px] text-on-surface-variant uppercase">Spike</span>
                </div>
              </div>
            </div>

            {/* Payment History Log */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant">Past Transaction Logs</h4>
              <div className="space-y-2">
                <div className="glass-card p-3.5 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer text-xs">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">history</span>
                    <div>
                      <p className="font-bold text-white">Previous Invoice</p>
                      <p className="text-[10px] text-on-surface-variant">Paid via UPI • 1 month ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{currency(dueAmount * 0.85)}</p>
                    <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded font-extrabold uppercase">Success</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout & Summary */}
          <div className="md:col-span-5 p-6 md:p-8 bg-surface-container-low/30 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-headline-md text-lg font-bold text-white">Bill Checkout</h3>
              <div className="space-y-3.5 border-b border-white/5 pb-4 mb-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Base Consumption</span>
                  <span className="text-on-surface font-semibold">{currency(baseUsage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Fixed Service Charge</span>
                  <span className="text-on-surface font-semibold">{currency(serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Late Processing Fee</span>
                  <span className="text-error font-semibold">{currency(latePenalty)}</span>
                </div>
                <div className="flex justify-between items-center bg-primary/5 p-2 rounded-lg border border-primary/10 text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-xs font-semibold">percent</span>
                    <span className="text-primary font-bold">FinSphere Cash-back</span>
                  </div>
                  <span className="text-primary font-bold">{currency(cashback)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Total Payable</p>
                  <p className="font-display-lg text-2xl font-extrabold text-white mt-0.5">{currency(totalPayable)}</p>
                </div>
                <div className="text-right text-[11px] text-on-surface-variant">
                  Inclusive of taxes
                </div>
              </div>

              {/* UPI Methods */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Payment Interface</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("upi")}
                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedMethod === "upi"
                        ? "border-primary/50 bg-primary/5 text-primary"
                        : "border-white/10 hover:border-white/20 bg-white/5 text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">qr_code_2</span>
                    <span>UPI ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("netbanking")}
                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedMethod === "netbanking"
                        ? "border-primary/50 bg-primary/5 text-primary"
                        : "border-white/10 hover:border-white/20 bg-white/5 text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">account_balance</span>
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={handlePay}
                disabled={isPaying}
                className="w-full bg-primary hover:bg-primary/95 text-on-primary font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 text-xs disabled:opacity-55 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm font-bold">bolt</span>
                <span>{isPaying ? "PROCESSING..." : "PAY NOW WITH UPI"}</span>
              </button>
              <p className="text-[9px] text-center text-on-surface-variant uppercase tracking-widest">Secured by AES-256 Multi-layer AI Encryption</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
