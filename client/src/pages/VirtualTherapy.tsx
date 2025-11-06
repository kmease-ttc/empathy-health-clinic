import { Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2, Monitor, Shield, Calendar, Clock, Video, Loader2, Phone, Star, CheckCircle, Users, Brain, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { TeamMember } from "@shared/schema";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEOHead from "@/components/SEOHead";
import TrustFactors from "@/components/TrustFactors";
import InsuranceSection from "@/components/InsuranceSection";
import VerifiedOnBadge from "@/components/VerifiedOnBadge";
import ReviewsAndBadges from "@/components/ReviewsAndBadges";
import heroImage from "@assets/stock_images/professional_healthc_955227e9.jpg";
import { trackEvent } from "@/lib/analytics";

const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));

export default function VirtualTherapy() {
  const { data: allTeamMembers, isLoading: loadingTeam } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  const { data: testimonials } = useQuery<{ id: string; name: string; rating: number; text: string; date: string; verified: boolean; }[]>({
    queryKey: ["/api/testimonials"],
  });

  // Filter out Dr. Glenn from virtual visits
  const teamMembers = allTeamMembers?.filter(member => member.slug !== 'dr-robert-glenn');
  const featuredMembers = teamMembers?.slice(0, 4);
  const featuredTestimonials = testimonials?.slice(0, 3);

  const handlePhoneClick = () => {
    trackEvent('phone_click', 'conversion', 'Virtual Therapy Page', '386-848-8751');
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "Virtual Psychiatry & Therapy Services - Empathy Health Clinic",
    "description": "Online psychiatry and therapy services throughout Florida. Secure telehealth appointments for medication management, therapy, and mental health treatment.",
    "provider": {
      "@type": "MedicalClinic",
      "name": "Empathy Health Clinic",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2281 Lee Rd Suite 102",
        "addressLocality": "Winter Park",
        "addressRegion": "FL",
        "postalCode": "32810"
      },
      "telephone": "386-848-8751"
    },
    "areaServed": "Florida"
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Virtual Psychiatry & Therapy Florida | Telehealth Mental Health"
        description="Online psychiatry and therapy throughout Florida. Secure telehealth appointments for medication management, counseling, and mental health treatment. Same-week availability. Most insurance accepted."
        keywords={["virtual psychiatry Florida", "telehealth psychiatry", "online therapy Florida", "virtual mental health", "telepsychiatry Orlando", "online psychiatrist Florida", "blue cross blue shield telehealth psychiatry", "cigna therapy online", "virtual EMDR therapy"]}
        canonicalPath="/virtual-therapy"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative py-20 px-4">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
          </div>
          <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/90 mb-4">
              <Monitor className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-6 text-white" data-testid="text-page-title">
              Virtual Psychiatry & Therapy Across Florida
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              Get professional mental health care from home. Secure, convenient telehealth appointments with licensed psychiatrists and therapists throughout Florida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg"
                data-testid="button-call-now-hero"
              >
                <a href="tel:3868488751" onClick={handlePhoneClick}>
                  <Phone className="h-5 w-5 mr-2" />
                  Call 386-848-8751
                </a>
              </Button>
              <Button 
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                data-testid="button-request-appointment-hero"
              >
                <Link href="/request-appointment">
                  Request Appointment
                </Link>
              </Button>
            </div>
          </div>
        </div>

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
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Serving All of Florida</span>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Section */}
        <InsuranceSection />

        {/* Services Section */}
        <section className="py-16 md:py-20 bg-card border-y">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-4">
                Comprehensive Virtual Mental Health Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Expert psychiatric and therapy services from the comfort of your home
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Stethoscope className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Virtual Psychiatry</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Psychiatric evaluations online</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Medication management & monitoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Depression & anxiety treatment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>ADHD diagnosis & management</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Online Therapy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Cognitive Behavioral Therapy (CBT)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>EMDR for trauma & PTSD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Stress & anxiety management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Grief & loss counseling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Telehealth Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>HIPAA-secure video platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Evening & weekend appointments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>No travel required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Same-week availability</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button 
                asChild
                size="lg"
                data-testid="button-view-all-services"
              >
                <Link href="/services">
                  View All Services
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-sans font-bold text-foreground mb-4">
                How Virtual Appointments Work
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple, secure, and effective telehealth in four easy steps
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Professional Mental Health Care from Anywhere in Florida
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed mb-4">
                    Empathy Health Clinic brings expert psychiatric care and therapy directly to you through secure telehealth appointments. Whether you're in Orlando, Miami, Tampa, Jacksonville, or anywhere in Florida, you can access the same high-quality mental health treatment from the comfort and privacy of your home.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Our virtual psychiatry and therapy services are just as effective as in-person visits, offering convenience without compromising quality of care. All sessions are conducted through HIPAA-compliant video platforms to protect your privacy and confidentiality.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Virtual Services We Offer
                </h2>
                <div className="prose prose-lg max-w-none">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Psychiatric Medication Management</strong> - Prescription and monitoring of psychiatric medications for depression, anxiety, ADHD, bipolar disorder, and more</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Online Therapy & Counseling</strong> - CBT, DBT, trauma therapy, grief counseling, and other evidence-based therapies</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Virtual EMDR Therapy</strong> - Trauma and PTSD treatment via secure telehealth</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>ADHD Evaluations</strong> - Comprehensive ADHD testing and diagnosis online</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Follow-Up Care</strong> - Ongoing psychiatric follow-ups and medication adjustments</span>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span><strong>Crisis Support</strong> - Urgent mental health consultations when you need help fast</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Benefits of Virtual Psychiatry & Therapy
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Save Time</h3>
                      <p className="text-sm text-muted-foreground">No commute, no waiting room. Log in from home, work, or anywhere.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Flexible Scheduling</h3>
                      <p className="text-sm text-muted-foreground">Evening and weekend appointments available</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Privacy & Comfort</h3>
                      <p className="text-sm text-muted-foreground">Receive care in the privacy of your own space</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg h-fit">
                      <Monitor className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">HIPAA Secure</h3>
                      <p className="text-sm text-muted-foreground">Fully encrypted, compliant video platform</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  How Virtual Appointments Work
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">1. Schedule Your Appointment</h3>
                    <p className="text-muted-foreground">Contact us by phone or complete the form below to schedule your virtual visit. We'll confirm your appointment time and send you secure video link instructions.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">2. Join from Any Device</h3>
                    <p className="text-muted-foreground">Use your smartphone, tablet, or computer. No special software needed - just click the secure link we provide.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">3. Meet with Your Provider</h3>
                    <p className="text-muted-foreground">Your psychiatrist or therapist will conduct your appointment just like an in-person visit - discussing symptoms, creating treatment plans, and answering questions.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">4. Follow-Up Care</h3>
                    <p className="text-muted-foreground">Prescriptions are sent electronically to your pharmacy. Schedule follow-ups as needed - all from the comfort of home.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Does insurance cover virtual psychiatry?</h3>
                    <p className="text-muted-foreground">Yes! Most insurance plans, including Blue Cross Blue Shield, Cigna, Aetna, and UnitedHealthcare, cover telehealth psychiatry and therapy services. Contact us to verify your benefits.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Can I get prescriptions through virtual visits?</h3>
                    <p className="text-muted-foreground">Absolutely. Our psychiatrists can prescribe and manage medications for depression, anxiety, ADHD, bipolar disorder, and other conditions during virtual appointments. Prescriptions are sent directly to your pharmacy.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Is virtual therapy as effective as in-person?</h3>
                    <p className="text-muted-foreground">Research shows that telehealth therapy and psychiatry are just as effective as in-person treatment for most conditions. Many patients prefer the convenience and comfort of virtual care.</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Who can I see for virtual appointments in Florida?</h3>
                    <p className="text-muted-foreground">All Florida residents can access our virtual psychiatry and therapy services. Our providers are licensed in Florida and available statewide.</p>
                  </div>
                </div>
              </section>

              <section id="virtual-visit">
                <h2 className="text-2xl font-sans font-bold text-foreground mb-4">
                  Start Your Virtual Visit
                </h2>
                <p className="text-muted-foreground mb-6">
                  Click on your provider's card below to enter their virtual waiting room. Make sure you have a scheduled appointment before joining.
                </p>
                
                {loadingTeam ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 mb-8">
                    {teamMembers?.map((member, index) => (
                      <a
                        key={member.id}
                        href={member.doxyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        data-testid={`link-provider-${index}`}
                        onClick={() => trackEvent('virtual_visit_click', 'conversion', 'Virtual Therapy Provider', member.name)}
                      >
                        <div
                          className="bg-card border rounded-lg hover-elevate transition-all duration-200 cursor-pointer flex gap-4 p-4"
                          data-testid={`provider-card-${index}`}
                        >
                          <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Avatar className="w-full h-full rounded-lg">
                              <AvatarImage 
                                src={member.image} 
                                alt={member.name} 
                                className="object-cover w-full h-full" 
                              />
                              <AvatarFallback className="text-2xl rounded-lg">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-sans font-bold text-foreground mb-1">
                              {member.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {member.credentials}
                            </p>
                            <span className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                              <Video className="h-4 w-4" />
                              Start Virtual Visit →
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="md:col-span-1 space-y-6">

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Related Services
                </h3>
                <div className="space-y-3">
                  <Link 
                    href="/emdr-therapy" 
                    className="block text-primary hover:underline underline-offset-2"
                    data-testid="link-emdr"
                  >
                    → Virtual EMDR Therapy
                  </Link>
                  <Link 
                    href="/adhd-treatment-winter-park" 
                    className="block text-primary hover:underline underline-offset-2"
                    data-testid="link-adhd"
                  >
                    → ADHD Treatment
                  </Link>
                  <Link 
                    href="/anxiety-therapy" 
                    className="block text-primary hover:underline underline-offset-2"
                    data-testid="link-anxiety"
                  >
                    → Anxiety Therapy
                  </Link>
                  <Link 
                    href="/depression-counseling" 
                    className="block text-primary hover:underline underline-offset-2"
                    data-testid="link-depression"
                  >
                    → Depression Counseling
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-sans font-bold text-foreground mb-3">
                Why Choose Empathy Health Clinic
              </h2>
              <p className="text-muted-foreground">
                Professional, secure telehealth mental health care
              </p>
            </div>
            <TrustFactors variant="compact" limit={4} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
