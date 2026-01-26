import { lazy, Suspense } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteHeader from "@/components/SiteHeader";
import HeroSection, { heroImage } from "@/components/HeroSection";
import ReviewsAndBadges from "@/components/ReviewsAndBadges";
import TrustFactors from "@/components/TrustFactors";
import InsuranceSection from "@/components/InsuranceSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import ApproachSection from "@/components/ApproachSection";
import ComparisonSection from "@/components/ComparisonSection";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import OrganizationSchema from "@/components/OrganizationSchema";
import { 
  Stethoscope, Heart, Frown, Pill, Brain, Activity
} from "lucide-react";

const TeamSection = lazy(() => import("@/components/TeamSection"));
const ConditionsSection = lazy(() => import("@/components/ConditionsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const LocationSection = lazy(() => import("@/components/LocationSection"));

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Empathy Health Clinic | Psychiatry Clinic in Orlando FL"
        description="Leading psychiatry clinic in Orlando, FL. Board-certified psychiatrists, same-week appointments, medication management & counseling. Serving Orlando, Winter Park & Central Florida. Most insurance accepted."
        keywords={["psychiatry clinic orlando", "psychiatrist Orlando", "orlando psychiatry clinic", "mental health clinic Orlando FL", "therapy Orlando", "psychiatric services Orlando", "anxiety treatment Orlando", "depression treatment Orlando"]}
        canonicalPath="/"
        preloadImage={heroImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": ["MedicalClinic", "Psychiatrist", "LocalBusiness"],
          "@id": "https://empathyhealthclinic.com/#organization",
          "name": "Empathy Health Clinic",
          "alternateName": "Empathy Health",
          "description": "Mental health clinic providing psychiatric services, therapy, and medication management serving Orlando and Winter Park, Florida.",
          "url": "https://empathyhealthclinic.com",
          "telephone": "+13868488751",
          "email": "providers@empathyhealthclinic.com",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "2281 Lee Rd Suite 102",
            "addressLocality": "Winter Park",
            "addressRegion": "FL",
            "postalCode": "32810",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 28.59544,
            "longitude": -81.36537
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              "opens": "09:00",
              "closes": "17:00"
            }
          ],
          "areaServed": [
            {
              "@type": "City",
              "name": "Winter Park",
              "containedInPlace": {
                "@type": "State",
                "name": "Florida"
              }
            },
            {
              "@type": "City",
              "name": "Orlando",
              "containedInPlace": {
                "@type": "State",
                "name": "Florida"
              }
            },
            {
              "@type": "City",
              "name": "Lake Mary",
              "containedInPlace": {
                "@type": "State",
                "name": "Florida"
              }
            },
            {
              "@type": "City",
              "name": "Altamonte Springs",
              "containedInPlace": {
                "@type": "State",
                "name": "Florida"
              }
            }
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Mental Health Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Psychiatric Evaluation"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Medication Management"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Therapy Services"
                }
              }
            ]
          },
          "sameAs": [
            "https://www.facebook.com/profile.php?id=100083226165903",
            "https://x.com/clinicempathy12",
            "https://www.instagram.com/empathyhealthfl/?hl=en",
            "https://www.tiktok.com/@empathy.health.cl",
            "https://www.linkedin.com/company/empathy-health-clinic/",
            "https://www.youtube.com/@EmpathyHealthClinic"
          ]
        }}
      />
      <OrganizationSchema />
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ReviewsAndBadges />

        {/* Core Services Section - Reduced to 6 key items */}
        <section className="py-16 bg-gradient-to-b from-orange-50/50 to-orange-100/30 dark:from-orange-950/20 dark:to-orange-900/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-4">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Board-certified psychiatrists serving Orlando, Winter Park, and Central Florida. Same-week appointments available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/services" className="group" data-testid="link-medication-management">
                <div className="flex items-center gap-4 p-6 bg-white dark:bg-card rounded-2xl border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 h-full" data-testid="card-medication-management">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Pill className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">Medication Management</h3>
                    <p className="text-sm text-muted-foreground">Expert psychiatric medication care</p>
                  </div>
                </div>
              </Link>

              <Link href="/anxiety-therapy" className="group" data-testid="link-anxiety-treatment">
                <div className="flex items-center gap-4 p-6 bg-white dark:bg-card rounded-2xl border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 h-full" data-testid="card-anxiety-treatment">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">Anxiety Treatment</h3>
                    <p className="text-sm text-muted-foreground">Anxiety & panic disorder care</p>
                  </div>
                </div>
              </Link>

              <Link href="/depression-counseling" className="group" data-testid="link-depression-treatment">
                <div className="flex items-center gap-4 p-6 bg-white dark:bg-card rounded-2xl border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 h-full" data-testid="card-depression-treatment">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Frown className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">Depression Treatment</h3>
                    <p className="text-sm text-muted-foreground">Evidence-based depression care</p>
                  </div>
                </div>
              </Link>

              <Link href="/ptsd-psychiatrist-orlando" className="group" data-testid="link-ptsd-treatment">
                <div className="flex items-center gap-4 p-6 bg-white dark:bg-card rounded-2xl border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 h-full" data-testid="card-ptsd-treatment">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">PTSD Treatment</h3>
                    <p className="text-sm text-muted-foreground">Specialized trauma therapy</p>
                  </div>
                </div>
              </Link>

              <Link href="/adhd-psychiatrist-orlando" className="group" data-testid="link-adhd-treatment">
                <div className="flex items-center gap-4 p-6 bg-white dark:bg-card rounded-2xl border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 h-full" data-testid="card-adhd-treatment">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">ADHD Treatment</h3>
                    <p className="text-sm text-muted-foreground">Focus & attention management</p>
                  </div>
                </div>
              </Link>

              <Link href="/bipolar-disorder-treatment-orlando" className="group" data-testid="link-bipolar-treatment">
                <div className="flex items-center gap-4 p-6 bg-white dark:bg-card rounded-2xl border border-black/5 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.08)] hover:scale-[1.02] transition-all duration-200 h-full" data-testid="card-bipolar-treatment">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary">Bipolar Disorder</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive mood stabilization</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Link href="/services">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-view-all-services">
                  View All Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <InsuranceSection />
        
        <section className="py-16 bg-card">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-4">
                Why Choose Empathy Health Clinic
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trusted mental health care with a commitment to excellence and compassion
              </p>
            </div>
            <TrustFactors />
          </div>
        </section>

        <AboutSection />
        <ApproachSection />
        <ComparisonSection />

        <Suspense fallback={<div className="min-h-[1600px] py-16 bg-background" />}>
          <TestimonialsSection />
          <TeamSection />
          <ConditionsSection />
          <FAQSection />
          <LocationSection />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
