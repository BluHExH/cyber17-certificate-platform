import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center px-4">
          <p className="text-6xl font-bold text-[var(--primary)] mb-4">404</p>
          <h1 className="text-2xl font-semibold text-white mb-2">Page Not Found</h1>
          <p className="text-[var(--muted)] mb-8">The requested page does not exist.</p>
          <Link href="/" className="px-5 py-2.5 rounded-lg bg-[var(--primary)] text-[#05080f] font-medium">
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
