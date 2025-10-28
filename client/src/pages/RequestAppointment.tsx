import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LongContactForm from "@/components/LongContactForm";

export default function RequestAppointment() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Schedule Your Appointment
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Take the first step toward better mental health. Complete this brief form and we'll contact you within 24 hours.
              </p>
            </div>
            <LongContactForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
