import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    monthlyIncome: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const expenseSchema: z.ZodObject<{
    amount: z.ZodCoercedNumber<unknown>;
    category: z.ZodEnum<{
        Food: "Food";
        Travel: "Travel";
        Shopping: "Shopping";
        Bills: "Bills";
        Entertainment: "Entertainment";
        Education: "Education";
        Health: "Health";
        Other: "Other";
    }>;
    description: z.ZodString;
    date: z.ZodString;
}, z.core.$strip>;
export declare const budgetSchema: z.ZodObject<{
    category: z.ZodEnum<{
        Food: "Food";
        Travel: "Travel";
        Shopping: "Shopping";
        Bills: "Bills";
        Entertainment: "Entertainment";
        Education: "Education";
        Health: "Health";
        Other: "Other";
    }>;
    limitAmount: z.ZodCoercedNumber<unknown>;
    month: z.ZodString;
}, z.core.$strip>;
export declare const goalSchema: z.ZodObject<{
    title: z.ZodString;
    targetAmount: z.ZodCoercedNumber<unknown>;
    currentAmount: z.ZodCoercedNumber<unknown>;
    targetDate: z.ZodString;
}, z.core.$strip>;
export declare const investmentSchema: z.ZodObject<{
    assetType: z.ZodEnum<{
        Other: "Other";
        Stock: "Stock";
        "Mutual Fund": "Mutual Fund";
        SIP: "SIP";
        Gold: "Gold";
        Crypto: "Crypto";
    }>;
    name: z.ZodString;
    investedAmount: z.ZodCoercedNumber<unknown>;
    currentValue: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export declare const creditProfileSchema: z.ZodObject<{
    utilization: z.ZodCoercedNumber<unknown>;
    paymentHistory: z.ZodCoercedNumber<unknown>;
    creditAge: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
