"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface RewardItem {
  id: string;
  title: string;
  desc: string;
  category: "Luxury Travel" | "Tech Elite" | "Lifestyle";
  badgeColor: string;
  valLabel: string;
  value: string;
  bgUrl: string;
  claimed: boolean;
}

export default function RewardsOffersView() {
  const [fscCoins, setFscCoins] = useState(84320);
  const [claimedCashback, setClaimedCashback] = useState(1248.5);
  const [referrals] = useState(3);
  const [copied, setCopied] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState<RewardItem | null>(null);

  const [rewards, setRewards] = useState<RewardItem[]>([
    {
      id: "1",
      title: "Skybound Private Charters",
      desc: "Get 15% cashback on all private jet bookings across the globe.",
      category: "Luxury Travel",
      badgeColor: "text-primary bg-primary/20 border-primary/40",
      valLabel: "Cashback",
      value: "15%",
      bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU2WB8clS4Q4kJH2tAF2P5YgveoEy2m3_hqtBXseISJeei6Kd_Nhe5U_fIQEn1rs8HRKzPU8AsSyGeZz1INswZdV61UMkRVyLPBPtObb10xkp0ch4Ws_cNPsqYPOb5NH2l-s2_O9IjKZ9EmRs1Gg9BRfxnNZO9h2HLJ-m9fbQMww8i5k5nQeX1EKBhqjwsrux3eRLOnlYdht2G8X9XOEmVlM4mZj8Nk83P19msmgf1ZV2OVIlWv68Mjx-8_AAyGBsoE_MgK1uTyoA1",
      claimed: false,
    },
    {
      id: "2",
      title: "Neural Hardware Pro",
      desc: "Exclusive early access and ₹40,000 off the new FinSphere Workstation.",
      category: "Tech Elite",
      badgeColor: "text-tertiary bg-tertiary/20 border-tertiary/40",
      valLabel: "Savings",
      value: "₹40,000",
      bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBzHaQxPKf9DDexnSMrClYr4kze2RtdJ7ntP8QmznpwGOSxLsZuBgukJxh9I7_LXIMWhAfOOT3eKpVqqBw6cME1Y6xF8ei-lXOGqqvjlmaZUl0_MMuhEs7q2LLG8bjKFexlZ_-5rRpPkv9WiqeR3ZukKZMJgPl4wjVm9TUtvu-wyxi80Gwq2TWBeEjUD6OxNWQ60cVwSm5d0lC25HcsdmuCKc3e721ri5Ncrn_gIzkPaEoEpagFNVJGuesQw6FvRQAIm-jMGEHsCIID",
      claimed: false,
    },
    {
      id: "3",
      title: "Aura Wellness Retreats",
      desc: "Priority booking and complimentary concierge service at Aura centers.",
      category: "Lifestyle",
      badgeColor: "text-secondary bg-secondary-container/50 border-white/10",
      valLabel: "Tier Perks",
      value: "Priority",
      bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEtY1NmNlb2OGuf2cI1mmcjFpMKOUp_GkuWGxqtoMGHVedMfOQL3ADpy7YLf3RRjJYMe_NFkip106XEtCH0ysrOs7RTaXqX-3sJ5h9IaueeaaAwhhrWsHXd7Ey2onp_RBtgWrPbK6Z1AelSL0cGtMtdRE46_7T5zdXvkiB5X8s-8lcfNG06k0sSQE_PkptvgnzSKS78_MV_zK_d9rR-7vEhzTqrC0W-Wwlkj9CpT8RgNoSQuUKBASqK-6BaJBJrMkKNLKLkRzJy-OA",
      claimed: false,
    },
  ]);

  const [activities, setActivities] = useState([
    { title: "Michelin Dining Credit", type: "Cashback", val: "+₹16,000.00", time: "Claimed 2 days ago", icon: "restaurant", color: "text-primary bg-primary/10" },
    { title: "FSC Conversion", type: "Redeemed", val: "-5,000 FSC", time: "Oct 12, 2023", icon: "toll", color: "text-tertiary bg-tertiary/10" },
    { title: "First Class Upgrade", type: "Applied", val: "Verified", time: "Oct 05, 2023", icon: "flight_takeoff", color: "text-secondary bg-secondary/10" },
  ]);

  const copyReferralLink = () => {
    navigator.clipboard.writeText("finsphere.ai/r/elite_7281");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimReward = (item: RewardItem) => {
    setShowRedeemModal(item);
  };

  const confirmRedeem = (id: string, cost = 5000) => {
    setRewards((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, claimed: true };
        }
        return r;
      })
    );

    // Add activity log
    const target = rewards.find((r) => r.id === id);
    if (target) {
      setActivities((prev) => [
        {
          title: target.title,
          type: "Claimed",
          val: target.value,
          time: "Just now",
          icon: target.category === "Luxury Travel" ? "flight_takeoff" : target.category === "Tech Elite" ? "laptop_mac" : "spa",
          color: target.category === "Luxury Travel" ? "text-primary bg-primary/10" : "text-tertiary bg-tertiary/10",
        },
        ...prev,
      ]);
    }

    setFscCoins((prev) => Math.max(0, prev - cost));
    setShowRedeemModal(null);
  };

  const handleExecuteOptimization = () => {
    setFscCoins((prev) => Math.max(0, prev - 10000));
    setClaimedCashback((prev) => prev + 450);
    setActivities((prev) => [
      {
        title: "AI Optimization Sweep",
        type: "Cashback Swap",
        val: "+₹37,000.00",
        time: "Just now",
        icon: "auto_awesome",
        color: "text-primary bg-primary/10",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight">Rewards &amp; Offers Hub</h2>
          <p className="text-on-surface-variant text-base">Earn FinSphere Coins and claim exclusive luxury partner credits.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Available Cashback Balance</p>
          <h3 className="font-headline-md text-3xl font-extrabold text-primary mt-1">${claimedCashback.toFixed(2)}</h3>
        </div>
      </div>

      {/* Hero cards row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FSC Coins */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline-md text-lg text-primary font-bold">FinSphere Coins Balance</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Your loyalty capital value.</p>
              </div>
              <span className="text-[10px] bg-tertiary/10 border border-tertiary/30 text-tertiary px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                Multiplier: 2.5x
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-extrabold text-white">{fscCoins.toLocaleString()}</span>
              <span className="text-sm text-on-surface-variant uppercase font-bold tracking-wider">FSC</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => {
              if (fscCoins < 10000) {
                alert("Redemption requires at least 10,000 FSC!");
                return;
              }
              setFscCoins(prev => prev - 10000);
              setClaimedCashback(prev => prev + 100);
              alert("FSC Coin Redemption Successful! Converted 10,000 FSC to ₹8,000.00 Cashback balance credit.");
            }} className="px-5 py-2.5 bg-primary text-background font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shadow-primary/10">
              <span className="material-symbols-outlined text-sm font-bold">redeem</span>
              Redeem for Assets
            </button>
            <button onClick={() => alert("FSC Valuation Trend: Coins valuation has increased by +12.4% this quarter, backed by partner sponsorship liquidity.")} className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-on-surface font-semibold text-xs rounded-xl transition-all">
              View Valuation Trends
            </button>
          </div>
        </div>

        {/* Milestone referrals */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border-dashed border border-tertiary/30">
          <div>
            <h3 className="font-headline-md text-base text-tertiary font-bold mb-1">Referrals Milestone</h3>
            <p className="text-on-surface-variant text-xs leading-relaxed mb-4">Invite 1 more connection to unlock Platinum Perks.</p>
            
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/5">
                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-tertiary transition-all duration-1000" style={{ width: `${(referrals / 4) * 100}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                <span>{referrals} Invites</span>
                <span className="text-tertiary">4 / Platinum Unlock</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-lg">person_add</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Invite Link</p>
                <p className="text-xs text-white truncate font-semibold">finsphere.ai/r/elite_7281</p>
              </div>
              <button onClick={copyReferralLink} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">{copied ? "done" : "content_copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Offers section */}
      <section className="space-y-4">
        <h3 className="font-headline-md text-xl font-bold text-white">Exclusive Elite Offers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-primary/20 flex flex-col justify-between">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${item.bgUrl}')` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                  <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-headline-md text-base font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-on-surface-variant text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
              
              <div className="p-5 pt-0 flex justify-between items-center border-t border-white/5 mt-4">
                <div className="flex flex-col">
                  <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-semibold">{item.valLabel}</span>
                  <span className="text-base font-bold text-primary">{item.value}</span>
                </div>
                <button
                  disabled={item.claimed}
                  onClick={() => handleClaimReward(item)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    item.claimed
                      ? "bg-white/5 text-on-surface-variant cursor-not-allowed border border-white/5"
                      : "bg-white/5 border border-white/10 hover:bg-primary hover:text-background hover:border-primary"
                  }`}
                >
                  {item.claimed ? "Claimed" : "Redeem Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity logs & optimizer */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Claimed Activity */}
        <div className="glass-card rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-base text-white">Recent Rewards History</h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {activities.map((act, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${act.color}`}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {act.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-xs text-white">{act.title}</h5>
                  <p className="text-[10px] text-on-surface-variant">{act.time}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-primary">{act.val}</span>
                  <p className="text-[9px] text-on-surface-variant">{act.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI optimizer */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full"></div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <h4 className="font-bold text-sm text-white">AI Reward Optimizer Recommendation</h4>
            </div>
            
            <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-xl italic text-xs text-on-surface-variant leading-relaxed">
              "Redeeming 10,000 FSC coins for cashback index rewards yields approximately 12.4% more savings compared to lifestyle travel catalog vouchers this week."
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg">
                <span className="text-on-surface-variant">Redeem Value Option</span>
                <span className="text-primary font-bold">98.2% Efficiency</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg">
                <span className="text-on-surface-variant">Projected Cashback Profit</span>
                <span className="text-tertiary font-bold">+₹37,000 Saved</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExecuteOptimization}
            className="w-full py-3 bg-primary text-background font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-6"
          >
            Execute FSC Auto-Rebalance
            <span className="material-symbols-outlined text-sm font-bold">bolt</span>
          </button>
        </div>
      </section>

      {/* Claim Offer Confirmation Modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setShowRedeemModal(null)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-sm p-6 rounded-3xl z-10 relative text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <span className="material-symbols-outlined text-2xl font-bold">redeem</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Claim Offer Voucher?</h3>
              <p className="text-xs text-on-surface-variant mt-1">This will deduct 5,000 FSC from your balance.</p>
            </div>
            
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-xs text-left">
              <p className="font-bold text-white">{showRedeemModal.title}</p>
              <p className="text-on-surface-variant mt-1 leading-relaxed">{showRedeemModal.desc}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRedeemModal(null)}
                className="flex-1 py-2.5 bg-white/5 rounded-xl text-xs font-semibold hover:bg-white/10 text-on-surface"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmRedeem(showRedeemModal.id)}
                className="flex-1 py-2.5 btn-emerald-gradient rounded-xl font-bold text-xs"
              >
                Confirm Redeem
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
