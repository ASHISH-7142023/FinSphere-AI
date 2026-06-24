"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { currency } from "@/lib/utils";

type UtilityTab = "mobile" | "electricity" | "water" | "dth" | "gas" | "fastag" | "upi-qr";

interface UtilitiesHubViewProps {
  initialTab?: UtilityTab;
}

export default function UtilitiesHubView({ initialTab = "mobile" }: UtilitiesHubViewProps) {
  const [activeTab, setActiveTab] = useState<UtilityTab>(initialTab);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);

  // Water Bill State
  const [waterProvider, setWaterProvider] = useState("Delhi Jal Board (DJB)");
  const [waterConsumerId, setWaterConsumerId] = useState("");
  const [waterDue] = useState(2450);
  const [waterVerified, setWaterVerified] = useState(false);
  const [waterAutoPay, setWaterAutoPay] = useState(true);

  // Electricity State
  const [elecProvider, setElecProvider] = useState("BESCOM (Bengaluru)");
  const [elecConsumerId, setElecConsumerId] = useState("");
  const [elecDue] = useState(4890);
  const [elecVerified, setElecVerified] = useState(false);

  // Mobile Recharge State
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileOperator, setMobileOperator] = useState("Jio");
  const [mobileCircle, setMobileCircle] = useState("Karnataka");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(599);

  // DTH State
  const [dthOperator, setDthOperator] = useState("Tata Play");
  const [dthSubscriberId, setDthSubscriberId] = useState("");
  const [dthPack, setDthPack] = useState(450);

  // Gas Booking State
  const [gasOperator, setGasOperator] = useState("Indane Gas");
  const [gasConsumerId, setGasConsumerId] = useState("");

  // FASTag State
  const [vehicleNo, setVehicleNo] = useState("");
  const [fastagBank, setFastagBank] = useState("HDFC Bank");
  const [fastagAmount, setFastagAmount] = useState(500);

  const tabs: Array<{ id: UtilityTab; label: string; icon: string }> = [
    { id: "mobile", label: "Mobile Recharge", icon: "smartphone" },
    { id: "electricity", label: "Electricity Bill", icon: "bolt" },
    { id: "water", label: "Water Bill", icon: "water_drop" },
    { id: "dth", label: "DTH Connection", icon: "tv" },
    { id: "gas", label: "Gas Booking", icon: "local_gas_station" },
    { id: "fastag", label: "FASTag Hub", icon: "directions_car" },
    { id: "upi-qr", label: "Scan & Pay", icon: "qr_code_scanner" },
  ];

  const triggerPayment = (amount: number) => {
    setSuccessAmount(amount);
    setPaymentSuccess(true);
  };

  const handleReset = () => {
    setPaymentSuccess(false);
    setSuccessAmount(0);
  };

  return (
    <div className="space-y-6">
      
      {/* View Title Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display-lg text-3xl font-extrabold tracking-tight">Payments & Utilities Hub</h2>
          <p className="text-on-surface-variant text-sm mt-0.5">Secure, real-time bill management powered by FinSphere engine.</p>
        </div>
      </div>

      {/* Tabs navigation list */}
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 pb-2 no-scrollbar bg-surface-container-low/40 p-2 rounded-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                handleReset();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-primary text-background border-primary shadow-lg shadow-primary/20 scale-[0.98]"
                  : "bg-white/5 text-on-surface-variant hover:text-white border-transparent hover:bg-white/10"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Payment Success View Overlay */}
      {paymentSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-3xl border border-primary/30 max-w-lg mx-auto text-center space-y-6 bg-gradient-to-b from-primary/5 to-transparent"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto animate-bounce">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">check</span>
          </div>
          <div>
            <h3 className="font-headline-md text-2xl font-bold text-white">Payment Successful!</h3>
            <p className="text-on-surface-variant text-sm mt-1">Transaction ID: TXN{Math.floor(Math.random() * 899999 + 100000)}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 max-w-sm mx-auto">
            <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Amount Paid</p>
            <p className="text-3xl font-bold text-primary mt-1">{currency(successAmount)}</p>
          </div>
          <div className="flex gap-4 max-w-xs mx-auto">
            <button onClick={handleReset} className="w-full py-2.5 btn-emerald-gradient rounded-xl font-bold text-xs">
              Done
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          
          {/* Main utility forms area */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {activeTab === "water" && (
              <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">water_drop</span>
                    Water Dues Lookup
                  </h3>
                  <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-3 py-0.5 rounded-full uppercase tracking-wider font-bold">Live Status</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Select Board</label>
                    <select
                      value={waterProvider}
                      onChange={(e) => setWaterProvider(e.target.value)}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    >
                      <option>Delhi Jal Board (DJB)</option>
                      <option>Bangalore Water Supply (BWSSB)</option>
                      <option>Maharashtra Jeevan Pradhikaran</option>
                      <option>UP Jal Nigam</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Consumer Connection ID</label>
                    <div className="relative">
                      <input
                        value={waterConsumerId}
                        onChange={(e) => setWaterConsumerId(e.target.value)}
                        placeholder="e.g. 100984729"
                        className="w-full bg-[#0e1511] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                      />
                      <button
                        onClick={() => setWaterVerified(!!waterConsumerId)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">search_check</span>
                      </button>
                    </div>
                  </div>
                </div>

                {waterVerified && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Consumer Account Name</p>
                      <p className="text-base font-bold text-white mt-0.5">Ashish Demo Account</p>
                      <p className="text-xs text-on-surface-variant mt-1">Delhi Jal Board Office Sector 9</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant">Outstanding Due</p>
                      <p className="text-2xl font-bold text-primary mt-1">{currency(waterDue)}</p>
                      <button
                        onClick={() => triggerPayment(waterDue)}
                        className="mt-3 px-5 py-2 btn-emerald-gradient rounded-lg font-bold text-xs"
                      >
                        Pay Due Bill
                      </button>
                    </div>
                  </motion.div>
                )}
                
                {/* Consumption Trends */}
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-bold text-sm text-on-surface mb-4">Consumption History Trends (kL)</h4>
                  <div className="h-40 flex items-end justify-between gap-2 px-2">
                    {[12, 15, 18, 14, 22, 19].map((kl, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full bg-white/5 h-28 rounded-md flex items-end relative overflow-hidden group-hover:border-primary/20 border border-transparent">
                          <div
                            className="w-full bg-primary/20 hover:bg-primary/45 rounded-b-md transition-colors"
                            style={{ height: `${(kl / 25) * 100}%` }}
                          ></div>
                          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {kl}kL
                          </span>
                        </div>
                        <span className="text-[10px] text-on-surface-variant uppercase font-medium">Month {i+1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "electricity" && (
              <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Electricity Bill Center
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Select Board</label>
                    <select
                      value={elecProvider}
                      onChange={(e) => setElecProvider(e.target.value)}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    >
                      <option>BESCOM (Bengaluru)</option>
                      <option>TATA Power (Delhi)</option>
                      <option>MSEDCL (Maharashtra)</option>
                      <option>Adani Electricity</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Consumer Account Number</label>
                    <div className="relative">
                      <input
                        value={elecConsumerId}
                        onChange={(e) => setElecConsumerId(e.target.value)}
                        placeholder="e.g. 556738927"
                        className="w-full bg-[#0e1511] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                      />
                      <button
                        onClick={() => setElecVerified(!!elecConsumerId)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">search_check</span>
                      </button>
                    </div>
                  </div>
                </div>

                {elecVerified && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Consumer Account Name</p>
                      <p className="text-base font-bold text-white mt-0.5">Ashish Demo Residence</p>
                      <p className="text-xs text-on-surface-variant mt-1">Meter ID: MTR-98847-B</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant">Current Bill Due</p>
                      <p className="text-2xl font-bold text-primary mt-1">{currency(elecDue)}</p>
                      <button
                        onClick={() => triggerPayment(elecDue)}
                        className="mt-3 px-5 py-2.5 btn-emerald-gradient rounded-lg font-bold text-xs"
                      >
                        Proceed to Pay
                      </button>
                    </div>
                  </motion.div>
                )}
                
                <div className="pt-4 border-t border-white/5">
                  <h4 className="font-bold text-sm text-on-surface mb-3">Recent Bill Invoices</h4>
                  <div className="divide-y divide-white/5 text-xs">
                    <div className="py-3 flex justify-between">
                      <span className="text-on-surface-variant">May 2026 Invoice</span>
                      <span className="font-bold text-white">{currency(4120)} (Paid)</span>
                    </div>
                    <div className="py-3 flex justify-between">
                      <span className="text-on-surface-variant">April 2026 Invoice</span>
                      <span className="font-bold text-white">{currency(3890)} (Paid)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "mobile" && (
              <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">smartphone</span>
                    Mobile recharge plans
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Mobile Number</label>
                    <input
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Operator</label>
                    <select
                      value={mobileOperator}
                      onChange={(e) => setMobileOperator(e.target.value)}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    >
                      <option>Jio</option>
                      <option>Airtel</option>
                      <option>Vi (Vodafone Idea)</option>
                      <option>BSNL</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Circle</label>
                    <select
                      value={mobileCircle}
                      onChange={(e) => setMobileCircle(e.target.value)}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    >
                      <option>Karnataka</option>
                      <option>Delhi NCR</option>
                      <option>Maharashtra</option>
                      <option>Tamil Nadu</option>
                    </select>
                  </div>
                </div>

                {mobileNumber.length >= 10 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 pt-4 border-t border-white/5"
                  >
                    <h4 className="font-bold text-sm text-on-surface">Popular Plans</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { price: 299, validity: "28 Days", data: "1.5 GB/day" },
                        { price: 599, validity: "56 Days", data: "2 GB/day + OTT" },
                        { price: 799, validity: "84 Days", data: "2 GB/day" },
                      ].map((plan) => (
                        <div
                          key={plan.price}
                          onClick={() => setSelectedPlan(plan.price)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            selectedPlan === plan.price
                              ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                              : "bg-white/5 border-white/5 hover:border-white/15"
                          }`}
                        >
                          <div className="flex justify-between items-baseline">
                            <span className="text-xl font-bold text-white">{currency(plan.price)}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase font-semibold">{plan.validity}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-2 font-medium">{plan.data}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerPayment(plan.price);
                            }}
                            className="mt-4 w-full py-1.5 bg-primary text-background rounded-lg font-bold text-xs hover:scale-102"
                          >
                            Recharge
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "dth" && (
              <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tv</span>
                    DTH Recharge Portal
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Operator</label>
                    <select
                      value={dthOperator}
                      onChange={(e) => setDthOperator(e.target.value)}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    >
                      <option>Tata Play</option>
                      <option>Dish TV</option>
                      <option>Airtel Digital TV</option>
                      <option>Sun Direct</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Subscriber ID</label>
                    <input
                      value={dthSubscriberId}
                      onChange={(e) => setDthSubscriberId(e.target.value)}
                      placeholder="e.g. 884739281"
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {dthSubscriberId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-4"
                  >
                    <h4 className="font-bold text-sm text-white">Select Package Pack</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "Super Family Pack", price: 350, desc: "240 Channels (50 HD)" },
                        { name: "Mega Ultra Premium HD", price: 650, desc: "450 Channels (120 HD)" },
                      ].map((pkg) => (
                        <div
                          key={pkg.price}
                          onClick={() => setDthPack(pkg.price)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                            dthPack === pkg.price
                              ? "bg-primary/10 border-primary"
                              : "bg-surface border-white/5"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{pkg.name}</p>
                            <p className="text-[10px] text-on-surface-variant mt-1">{pkg.desc}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{currency(pkg.price)}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerPayment(pkg.price);
                              }}
                              className="mt-2 px-3 py-1 bg-primary text-background rounded font-bold text-[10px]"
                            >
                              Pay
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "gas" && (
              <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">local_gas_station</span>
                    Gas Booking & Cylinder Bills
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Operator</label>
                    <select
                      value={gasOperator}
                      onChange={(e) => setGasOperator(e.target.value)}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    >
                      <option>Indane Gas</option>
                      <option>HP Gas</option>
                      <option>Bharat Gas</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Consumer/LPG ID</label>
                    <input
                      value={gasConsumerId}
                      onChange={(e) => setGasConsumerId(e.target.value)}
                      placeholder="e.g. 22334455"
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {gasConsumerId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
                  >
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase font-semibold">Booking Cylinder Details</p>
                      <p className="text-base font-bold text-white mt-1">LPG Refill Cylinder (14.2 kg)</p>
                      <p className="text-[10px] text-on-surface-variant">Distributor: FinSphere Gas Services Ltd</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-on-surface-variant">Refill Cost</p>
                      <p className="text-xl font-bold text-primary mt-1">{currency(1053)}</p>
                      <button
                        onClick={() => triggerPayment(1053)}
                        className="mt-3 px-5 py-2 btn-emerald-gradient rounded-lg font-bold text-xs"
                      >
                        Book & Pay
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "fastag" && (
              <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">directions_car</span>
                    FASTag Hub
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Vehicle Number</label>
                    <input
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                      placeholder="e.g. KA51MD1234"
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Issuer Bank</label>
                    <select
                      value={fastagBank}
                      onChange={(e) => setFastagBank(e.target.value)}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    >
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>SBI FASTag</option>
                      <option>Paytm Payments Bank</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-on-surface-variant font-semibold">Recharge Amount</label>
                    <input
                      type="number"
                      value={fastagAmount}
                      onChange={(e) => setFastagAmount(Number(e.target.value))}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {vehicleNo.length >= 8 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center gap-4"
                  >
                    <div>
                      <p className="text-xs text-on-surface-variant">Car Details Verified</p>
                      <p className="text-base font-bold text-white mt-1">{vehicleNo}</p>
                      <p className="text-[10px] text-on-surface-variant">FASTag ID: FTG-887483-KA</p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => triggerPayment(fastagAmount)}
                        className="px-5 py-2.5 btn-emerald-gradient rounded-lg font-bold text-xs"
                      >
                        Recharge FASTag
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === "upi-qr" && (
              <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline-md text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
                    Scan & Pay UPI Portal
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-4 animate-pulse">qr_code_scanner</span>
                    <p className="text-xs font-bold text-white">Camera Simulator Active</p>
                    <p className="text-[10px] text-on-surface-variant mt-1 text-center max-w-xs leading-relaxed">
                      Place merchant/UPI QR code inside camera frame during live deployment tests.
                    </p>
                    <button
                      onClick={() => triggerPayment(1250)}
                      className="mt-6 px-5 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-bold transition-all"
                    >
                      Simulate Scan Success (₹1,250)
                    </button>
                  </div>

                  <div className="flex flex-col items-center text-center p-6 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
                    <p className="text-xs font-bold text-white mb-4">Your Dynamic FinSphere UPI QR</p>
                    
                    <div className="w-40 h-40 bg-white p-3 rounded-2xl flex items-center justify-center relative shadow-xl">
                      {/* Generates a neat mockup QR code vector */}
                      <svg className="w-full h-full text-background" viewBox="0 0 100 100">
                        <path d="M0,0 h30 v10 h-20 v20 h-10 z M70,0 h30 v30 h-10 v-20 h-20 z M0,70 h10 v20 h20 v10 h-30 z M70,100 h30 v-30 h-10 v20 h-20 z" fill="currentColor"></path>
                        <rect x="15" y="15" width="20" height="20" fill="currentColor"></rect>
                        <rect x="65" y="15" width="20" height="20" fill="currentColor"></rect>
                        <rect x="15" y="65" width="20" height="20" fill="currentColor"></rect>
                        <rect x="45" y="45" width="10" height="10" fill="currentColor"></rect>
                        <rect x="65" y="65" width="10" height="10" fill="currentColor"></rect>
                        <rect x="55" y="75" width="10" height="15" fill="currentColor"></rect>
                        <rect x="75" y="55" width="15" height="10" fill="currentColor"></rect>
                      </svg>
                    </div>

                    <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-4">UPI VPA Address</p>
                    <p className="text-xs text-primary font-bold">demo@finsphere</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right sidebar details */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Auto-pay control */}
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">autorenew</span>
                <h4 className="font-bold text-sm text-on-surface">Auto-Pay Smart Settings</h4>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                Enable auto-debit triggers for verified utilities to prevent late payment penalty charges.
              </p>
              
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs font-semibold text-white">Water &amp; Electricity Autopay</span>
                <button
                  onClick={() => setWaterAutoPay(!waterAutoPay)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    waterAutoPay ? "bg-primary" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      waterAutoPay ? "translate-x-6" : "translate-x-1"
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            {/* Simulated timeline logs */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h4 className="font-bold text-sm text-on-surface">Timeline History log</h4>
              <div className="space-y-4 text-xs">
                <div className="flex gap-3 border-l-2 border-primary/30 pl-4 relative pb-1">
                  <div className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-bold text-white">Water Bill Auto-Pay Triggered</p>
                    <p className="text-on-surface-variant text-[10px] mt-0.5">₹2,450 debited successfully • June 12</p>
                  </div>
                </div>
                <div className="flex gap-3 border-l-2 border-primary/10 pl-4 relative">
                  <div className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                  <div>
                    <p className="font-bold text-white">Electricity Bill Verified</p>
                    <p className="text-on-surface-variant text-[10px] mt-0.5">No outstanding payments left • June 05</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
