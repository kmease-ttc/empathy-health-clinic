import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LongContactForm from "@/components/LongContactForm";

export default function RequestAppointment() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <LongContactForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
