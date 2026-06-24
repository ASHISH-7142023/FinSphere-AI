import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#070b09] text-[#e0e3df] p-6 text-center">
      <h2 className="text-4xl font-extrabold text-white mb-2">404 - Page Not Found</h2>
      <p className="text-[#a0a5a1] text-base mb-6">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-2.5 bg-[#00c896] text-[#003828] font-bold text-xs rounded-xl hover:brightness-110 transition-all">
        Go Home
      </Link>
    </div>
  );
}
