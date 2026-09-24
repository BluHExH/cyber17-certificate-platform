import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white mb-4">Contact</h1>
          <p className="text-[var(--muted)] mb-8">
            For certificate-related inquiries or organizational partnership, reach out via the channels below.
          </p>
          <div className="glass rounded-xl p-6 space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">Email</p>
              <p className="text-white">contact@cyber17.official</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Verification Support</p>
              <p className="text-white">verify@cyber17.official</p>
            </div>
            <div>
              <p className="text-[var(--muted)]">Social</p>
              <p className="text-white">@Cyber17Official (placeholder)</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
