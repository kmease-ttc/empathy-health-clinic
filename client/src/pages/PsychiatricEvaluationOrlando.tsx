import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2, MapPin, Phone, Clock, Star, CheckCircle, Brain, Shield, Calendar, FileText, Users, Video, Clock3 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import InsuranceSection from "@/components/InsuranceSection";
import ReviewsAndBadges from "@/components/ReviewsAndBadges";
import VerifiedOnBadge from "@/components/VerifiedOnBadge";
import HeroBackground from "@/components/HeroBackground";
import ShortContactForm from "@/components/ShortContactForm";
import heroImage from "@assets/stock_images/professional_healthc_955227e9.jpg";
import { trackEvent } from "@/lib/analytics";

export default function PsychiatricEvaluationOrlando() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "Psychiatrist"],
    "name": "Psychiatric Evaluation Orlando FL - Empathy Health Clinic",
    "description": "Comprehensive psychiatric evaluations in Orlando, FL by board-certified psychiatrists. Same-week appointments, telehealth available. Expert mental health assessments for anxiety, depression, ADHD, and more. Most insurance accepted.",
    "url": "https://empathyhealthclinic.com/psychiatric-evaluation-orlando",
    "telephone": "+1-386-848-8751",
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
    "areaServed": [
      { "@type": "City", "name": "Orlando" },
      { "@type": "City", "name": "Winter Park" },
      { "@type": "City", "name": "Altamonte Springs" },
      { "@type": "City", "name": "Lake Mary" }
    ],
    "medicalSpecialty": "Psychiatry",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Psychiatric Evaluation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalTest",
            "name": "Comprehensive Psychiatric Evaluation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalTest",
            "name": "ADHD Assessment"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "MedicalTest",
            "name": "Depression & Anxiety Screening"
          }
        }
      ]
    }
  };

  const handlePhoneClick = () => {
    trackEvent('phone_click', 'conversion', 'Psychiatric Evaluation Orlando Page', '386-848-8751');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Psychiatric Evaluation Orlando FL | Mental Health Assessment | Same-Week Appointments"
        description="Expert psychiatric evaluations in Orlando by board-certified psychiatrists. Comprehensive mental health assessments for accurate diagnosis and treatment planning. Same-week appointments, telehealth available. Most insurance accepted. Call 386-848-8751."
        keywords={["psychiatric evaluation orlando", "psych evaluation near me", "mental evaluation orlando", "psychological testing orlando", "psychiatric assessment orlando fl", "mental health evaluation orlando", "psychiatrist evaluation orlando"]}
        canonicalPath="/psychiatric-evaluation-orlando"
        jsonLd={jsonLd}
      />
      <SiteHeader />
      <main className="flex-1">
        <HeroBackground imageSrc={heroImage}>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-sans font-bold mb-4 text-white" data-testid="text-hero-title">
            Psychiatric Evaluation in Orlando, FL
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-3xl" data-testid="text-hero-description">
            Comprehensive mental health assessments by board-certified psychiatrists. Accurate diagnosis, personalized treatment planning, and same-week appointments available. In-person and telehealth options. Most insurance accepted.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              asChild 
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid="button-hero-cta"
              onClick={() => trackEvent('psychiatric_eval_hero_cta', 'conversion', 'Psychiatric Evaluation Orlando Page')}
            >
              <a href="#contact-form">Schedule Evaluation</a>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30"
              data-testid="button-hero-phone"
              onClick={handlePhoneClick}
            >
              <a href="tel:386-848-8751">Call 386-848-8751</a>
            </Button>
          </div>
        </HeroBackground>

        {/* Key Benefits Bar */}
        <section className="py-8 bg-card border-b">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-semibold text-foreground">4.8</span>
                <span className="text-sm text-muted-foreground">Google Reviews</span>
              </div>
              <div className="hidden lg:block h-6 w-px bg-border" />
              <VerifiedOnBadge />
              <div className="hidden lg:block h-6 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                <span>Same-Week Appointments Available</span>
              </div>
              <div className="hidden lg:block h-6 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm text-foreground">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Telehealth & In-Person Options</span>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Contact Banner */}
        <section className="py-8 bg-primary/5 border-y">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3" data-testid="location-info">
                <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Orlando Metro Location</h3>
                  <p className="text-sm text-muted-foreground">
                    2281 Lee Rd Suite 102<br />
                    Winter Park, FL 32810<br />
                    (Convenient to all of Orlando)
                  </p>
                  <a 
                    href="https://maps.google.com/?q=2281+Lee+Rd+Suite+102+Winter+Park+FL+32810" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 inline-block"
                    data-testid="link-directions"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3" data-testid="contact-info">
                <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Call or Text</h3>
                  <a 
                    href="tel:386-848-8751" 
                    className="text-lg font-bold text-primary hover:underline"
                    data-testid="link-phone"
                    onClick={handlePhoneClick}
                  >
                    386-848-8751
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Same-week evaluations available
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3" data-testid="hours-info">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Office Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri: 9:00 AM - 6:00 PM<br />
                    Telehealth & in-person available
                  </p>
                  <p className="text-sm text-primary mt-1 font-medium">
                    <CheckCircle2 className="h-4 w-4 inline mr-1" />
                    Accepting new patients
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Section */}
        <InsuranceSection />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              
              <section>
                <h2 className="text-3xl font-sans font-bold text-foreground mb-6">
                  Comprehensive Psychiatric Evaluations in Orlando
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed mb-4">
                    A comprehensive psychiatric evaluation is the first step toward understanding and improving your mental health. At Empathy Health Clinic, our board-certified psychiatrists in Orlando provide thorough, compassionate mental health assessments that form the foundation for effective treatment.
                  </p>
                  <p className="text-foreground leading-relaxed mb-4">
                    Whether you're seeking help for the first time or looking for a second opinion, our Orlando psychiatric evaluations provide accurate diagnoses and personalized treatment recommendations. We serve patients throughout Orlando, Winter Park, Altamonte Springs, and surrounding areas with both in-person and telehealth appointments.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Same-week appointments are typically available, because we understand that when you're ready to seek help, waiting weeks or months isn't an option.
                  </p>
                </div>
              </section>

              <section className="bg-primary/5 p-6 rounded-lg border">
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  What's Included in a Psychiatric Evaluation?
                </h2>
                <div className="space-y-4">
                  <p className="text-foreground">
                    Your initial psychiatric evaluation typically lasts 45-60 minutes and includes:
                  </p>
                  <ul className="space-y-3 text-foreground">
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Comprehensive Symptom Review</strong> - Detailed discussion of your current symptoms, when they started, and how they impact your daily life
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Medical & Mental Health History</strong> - Review of previous treatments, medications, hospitalizations, and family mental health history
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Mental Status Examination</strong> - Professional assessment of your mood, thought patterns, cognitive function, and overall mental state
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Accurate Diagnosis</strong> - Clear explanation of your condition based on DSM-5 criteria
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Personalized Treatment Plan</strong> - Tailored recommendations including medication options, therapy referrals, lifestyle modifications, and follow-up schedule
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Time for Your Questions</strong> - Opportunity to ask about your diagnosis, treatment options, medication side effects, and prognosis
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Conditions We Evaluate & Diagnose
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed mb-4">
                    Our Orlando psychiatrists conduct evaluations for a wide range of mental health conditions:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <ul className="space-y-2 text-foreground">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Anxiety & Panic Disorders</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Depression & Mood Disorders</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>ADHD (Adult & Adolescent)</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Bipolar Disorder</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>OCD & Obsessive Disorders</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-foreground">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>PTSD & Trauma Disorders</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Eating Disorders</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Personality Disorders</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Schizophrenia & Psychotic Disorders</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>Substance Use Disorders</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Why Choose Empathy Health Clinic for Your Psychiatric Evaluation?
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-card rounded-lg border">
                    <Brain className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">Board-Certified Psychiatrists</h3>
                      <p className="text-muted-foreground">
                        All evaluations conducted by psychiatrists board-certified by the American Board of Psychiatry and Neurology, ensuring the highest diagnostic accuracy and treatment recommendations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-card rounded-lg border">
                    <Calendar className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">Same-Week Appointments</h3>
                      <p className="text-muted-foreground">
                        We understand urgency matters in mental health care. Unlike many Orlando psychiatry practices with months-long wait times, we typically offer same-week appointments for new patient evaluations.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-card rounded-lg border">
                    <Video className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">Telehealth & In-Person Options</h3>
                      <p className="text-muted-foreground">
                        Choose the evaluation format that works best for you. Our HIPAA-compliant telehealth platform provides the same thorough assessment as in-person visits, from anywhere in Florida.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-card rounded-lg border">
                    <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-2">Most Insurance Accepted</h3>
                      <p className="text-muted-foreground">
                        We accept Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, Humana, and many other major insurance plans. We'll verify your coverage and benefits before your appointment.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  What Happens After Your Evaluation?
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed mb-4">
                    After your comprehensive psychiatric evaluation, you'll leave with:
                  </p>
                  <ul className="space-y-2 text-foreground mb-4">
                    <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> <span>A clear understanding of your diagnosis and what it means</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> <span>A personalized treatment plan tailored to your needs and goals</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> <span>Medication prescriptions if appropriate (sent directly to your pharmacy)</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> <span>Therapy referrals for counseling support if recommended</span></li>
                    <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" /> <span>Follow-up appointment scheduled for ongoing medication management</span></li>
                  </ul>
                  <p className="text-foreground leading-relaxed">
                    Follow-up medication management appointments are typically scheduled 2-4 weeks after your initial evaluation, then monthly or as needed once your treatment is stabilized.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Frequently Asked Questions About Psychiatric Evaluations
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">How long does a psychiatric evaluation take?</h3>
                    <p className="text-muted-foreground">
                      Initial psychiatric evaluations typically last 45-60 minutes. This gives your psychiatrist adequate time to thoroughly understand your symptoms, history, and needs, and to develop an effective treatment plan.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Do I need a referral for a psychiatric evaluation?</h3>
                    <p className="text-muted-foreground">
                      No referral is required to schedule a psychiatric evaluation. You can call our office directly at 386-848-8751. However, some insurance plans may require a referral for coverage, so check with your insurance provider.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Will I get a prescription at my first appointment?</h3>
                    <p className="text-muted-foreground">
                      If medication is recommended as part of your treatment plan, your psychiatrist can prescribe it during your first evaluation. Prescriptions are sent electronically to your preferred pharmacy the same day.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">How much does a psychiatric evaluation cost in Orlando?</h3>
                    <p className="text-muted-foreground">
                      Cost depends on your insurance coverage. We accept most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, and Humana. We'll verify your benefits before your appointment. For self-pay patients, please call for pricing.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Can I do my psychiatric evaluation via telehealth?</h3>
                    <p className="text-muted-foreground">
                      Yes! We offer secure, HIPAA-compliant telehealth evaluations throughout Florida. Many patients prefer the convenience of a virtual evaluation from home, and the diagnostic quality is equivalent to in-person visits.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">What should I bring to my psychiatric evaluation?</h3>
                    <p className="text-muted-foreground">
                      Bring your insurance card, photo ID, a list of current medications (including dosages), and any previous psychiatric or medical records if available. It's also helpful to write down your symptoms and questions beforehand.
                    </p>
                  </div>
                </div>
              </section>

            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <div className="bg-card rounded-lg border p-6" id="contact-form">
                  <h2 className="text-2xl font-sans font-bold text-foreground mb-4">Schedule Your Evaluation</h2>
                  <p className="text-muted-foreground mb-6">
                    Same-week appointments available. Most insurance accepted.
                  </p>
                  <ShortContactForm formType="psychiatric_evaluation" />
                </div>

                <div className="bg-primary/5 rounded-lg border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <Link href="/psychiatrist-orlando" className="block text-sm text-primary hover:underline">
                      Psychiatrist Orlando
                    </Link>
                    <Link href="/adhd-psychiatrist-orlando" className="block text-sm text-primary hover:underline">
                      ADHD Psychiatrist Orlando
                    </Link>
                    <Link href="/anxiety-psychiatrist-orlando" className="block text-sm text-primary hover:underline">
                      Anxiety Psychiatrist Orlando
                    </Link>
                    <Link href="/medication-management-orlando" className="block text-sm text-primary hover:underline">
                      Medication Management Orlando
                    </Link>
                    <Link href="/telepsychiatry-orlando" className="block text-sm text-primary hover:underline">
                      Telepsychiatry Orlando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewsAndBadges />
      </main>
      <SiteFooter />
    </div>
  );
}
