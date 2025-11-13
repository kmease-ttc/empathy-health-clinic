import type { LandingPageConfig } from "@/types/landingPage";
import heroImage from "@assets/stock_images/professional_healthc_955227e9.jpg";
import { FileText, Brain, Shield, Award, Calendar, Video, MessageCircle, Users, CheckCircle, Heart } from "lucide-react";

export const psychiatricEvaluationConfig: LandingPageConfig = {
  seo: {
    title: "Psychiatric Evaluation Orlando FL | Mental Health Assessment | Same-Week Appointments",
    description: "Expert psychiatric evaluations in Orlando by board-certified psychiatrists. Comprehensive mental health assessments for accurate diagnosis and treatment planning. Same-week appointments, telehealth available. Most insurance accepted. Call 386-848-8751.",
    keywords: ["psychiatric evaluation orlando", "psych evaluation near me", "mental evaluation orlando", "psychological testing orlando", "psychiatric assessment orlando fl", "mental health evaluation orlando", "psychiatrist evaluation orlando"],
    canonicalPath: "/psychiatric-evaluation-orlando",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "Psychiatrist"],
    "name": "Psychiatric Evaluation Orlando FL - Empathy Health Clinic",
    "description": "Comprehensive psychiatric evaluations in Orlando, FL by board-certified psychiatrists.",
    "url": "https://empathyhealthclinic.com/psychiatric-evaluation-orlando",
    "telephone": "+1-386-848-8751",
    "email": "providers@empathyhealthclinic.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2281 Lee Rd Suite 102",
      "addressLocality": "Winter Park",
      "addressRegion": "FL",
      "postalCode": "32810",
      "addressCountry": "US"
    },
    "medicalSpecialty": "Psychiatry"
  },
  hero: {
    title: "Psychiatric Evaluation in Orlando, FL",
    subtitle: "Comprehensive mental health assessments by board-certified psychiatrists. Accurate diagnosis, personalized treatment planning, and same-week appointments available. In-person and telehealth options. Most insurance accepted.",
    ctaPrimary: "Schedule Evaluation",
    ctaSecondary: "Call 386-848-8751",
    heroImage: heroImage,
  },
  proofBar: {
    googleRating: 4.8,
    showVerifiedBadge: true,
    highlights: ["Same-Week Appointments Available", "Telehealth & In-Person Options"],
  },
  location: {
    title: "Orlando Metro Location",
    address: "2281 Lee Rd Suite 102",
    city: "Winter Park",
    state: "FL",
    zip: "32810",
    phone: "3868488751",
    phoneDisplay: "386-848-8751",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM\nTelehealth & in-person available",
    mapUrl: "https://maps.google.com/?q=2281+Lee+Rd+Suite+102+Winter+Park+FL+32810",
  },
  content: {
    mainHeading: "Comprehensive Psychiatric Evaluations in Orlando",
    introduction: [
      "A comprehensive psychiatric evaluation is the first step toward understanding and improving your mental health. At Empathy Health Clinic, our board-certified psychiatrists in Orlando provide thorough, compassionate mental health assessments that form the foundation for effective treatment.",
      "Whether you're seeking help for the first time or looking for a second opinion, our Orlando psychiatric evaluations provide accurate diagnoses and personalized treatment recommendations. We serve patients throughout Orlando, Winter Park, Altamonte Springs, and surrounding areas with both in-person and telehealth appointments.",
      "Same-week appointments are typically available, because we understand that when you're ready to seek help, waiting weeks or months isn't an option."
    ],
    conditionsHeading: "Conditions We Evaluate & Diagnose",
    conditions: [
      { name: "Anxiety & Panic Disorders" },
      { name: "Depression & Mood Disorders" },
      { name: "ADHD", description: "Adult & Adolescent" },
      { name: "Bipolar Disorder" },
      { name: "OCD & Obsessive Disorders" },
      { name: "PTSD & Trauma Disorders" },
      { name: "Eating Disorders" },
      { name: "Personality Disorders" },
      { name: "Schizophrenia & Psychotic Disorders" },
      { name: "Substance Use Disorders" },
    ],
    servicesHeading: "What's Included in Your Evaluation",
    services: [
      {
        icon: FileText,
        title: "Comprehensive Symptom Review",
        description: "Detailed discussion of your current symptoms, when they started, and how they impact your daily life."
      },
      {
        icon: Brain,
        title: "Mental Status Examination",
        description: "Professional assessment of your mood, thought patterns, cognitive function, and overall mental state."
      },
      {
        icon: Shield,
        title: "Accurate Diagnosis & Treatment Plan",
        description: "Clear explanation of your condition based on DSM-5 criteria with personalized treatment recommendations."
      },
    ],
    whyChooseHeading: "Why Choose Empathy Health Clinic?",
    whyChoosePoints: [
      {
        icon: Award,
        title: "Board-Certified Psychiatrists",
        description: "All evaluations conducted by psychiatrists board-certified by the American Board of Psychiatry and Neurology, ensuring the highest diagnostic accuracy."
      },
      {
        icon: Calendar,
        title: "Same-Week Appointments",
        description: "Unlike many Orlando psychiatry practices with months-long wait times, we typically offer same-week appointments for new patient evaluations."
      },
      {
        icon: Video,
        title: "Telehealth & In-Person Options",
        description: "Choose the evaluation format that works best for you. Our HIPAA-compliant telehealth platform provides the same thorough assessment as in-person visits."
      },
    ],
  },
  faqs: [
    {
      question: "How long does a psychiatric evaluation take?",
      answer: "Initial psychiatric evaluations typically last 45-60 minutes. This gives your psychiatrist adequate time to thoroughly understand your symptoms, history, and needs, and to develop an effective treatment plan."
    },
    {
      question: "Do I need a referral for a psychiatric evaluation?",
      answer: "No referral is required to schedule a psychiatric evaluation. You can call our office directly at 386-848-8751. However, some insurance plans may require a referral for coverage, so check with your insurance provider."
    },
    {
      question: "Will I get a prescription at my first appointment?",
      answer: "If medication is recommended as part of your treatment plan, your psychiatrist can prescribe it during your first evaluation. Prescriptions are sent electronically to your preferred pharmacy the same day."
    },
    {
      question: "How much does a psychiatric evaluation cost in Orlando?",
      answer: "Cost depends on your insurance coverage. We accept most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, and Humana. We'll verify your benefits before your appointment. For self-pay patients, please call for pricing."
    },
  ],
  sidebar: {
    formHeading: "Schedule Your Evaluation",
    formSubheading: "Same-week appointments available. Most insurance accepted.",
    formType: "psychiatric_evaluation",
    quickLinks: [
      { href: "/psychiatrist-orlando", label: "Psychiatrist Orlando" },
      { href: "/adhd-psychiatrist-orlando", label: "ADHD Psychiatrist Orlando" },
      { href: "/anxiety-psychiatrist-orlando", label: "Anxiety Psychiatrist Orlando" },
      { href: "/medication-management-orlando", label: "Medication Management Orlando" },
      { href: "/telepsychiatry-orlando", label: "Telepsychiatry Orlando" },
    ],
  },
  analytics: {
    pageName: "Psychiatric Evaluation Orlando Page",
    conversionCategory: "psychiatric_eval",
  },
};

export const therapistOrlandoConfig: LandingPageConfig = {
  seo: {
    title: "Therapist Orlando FL | Licensed Counselors Near You | Same-Week Appointments",
    description: "Find a licensed therapist in Orlando, FL. Expert CBT, DBT, EMDR therapy for anxiety, depression, trauma, and more. Same-week appointments, in-person & telehealth. Most insurance accepted. Call 386-848-8751.",
    keywords: ["therapist orlando", "therapist near me", "therapist orlando fl", "licensed therapist orlando", "counselor orlando", "therapy orlando fl", "orlando therapist", "therapists in orlando fl"],
    canonicalPath: "/therapist-orlando",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "Psychologist"],
    "name": "Therapist Orlando FL - Empathy Health Clinic",
    "description": "Licensed therapists in Orlando providing CBT, DBT, EMDR therapy for anxiety, depression, trauma, and couples counseling.",
    "url": "https://empathyhealthclinic.com/therapist-orlando",
    "telephone": "+1-386-848-8751",
    "email": "providers@empathyhealthclinic.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1155 Louisiana Ave Suite 202",
      "addressLocality": "Winter Park",
      "addressRegion": "FL",
      "postalCode": "32789",
      "addressCountry": "US"
    }
  },
  hero: {
    title: "Licensed Therapist in Orlando, FL",
    subtitle: "Expert counseling for anxiety, depression, trauma, relationships, and life transitions. Evidence-based CBT, DBT, and EMDR therapy. Same-week appointments available with flexible in-person and telehealth options. Most insurance accepted.",
    ctaPrimary: "Request Appointment",
    ctaSecondary: "Call 386-848-8751",
    heroImage: heroImage,
  },
  proofBar: {
    googleRating: 4.8,
    showVerifiedBadge: true,
    highlights: ["Same-Week Appointments", "In-Person & Telehealth"],
  },
  location: {
    title: "Our Orlando Location",
    address: "1155 Louisiana Ave Suite 202",
    city: "Winter Park",
    state: "FL",
    zip: "32789",
    phone: "3868488751",
    phoneDisplay: "386-848-8751",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM\nTelehealth & in-person available",
    mapUrl: "https://maps.google.com/?q=1155+Louisiana+Ave+Suite+202+Winter+Park+FL+32789",
  },
  content: {
    mainHeading: "Expert Therapy Services in Orlando",
    introduction: [
      "Finding the right therapist in Orlando can feel overwhelming. At Empathy Health Clinic, our licensed therapists provide evidence-based counseling tailored to your unique needs. Whether you're struggling with anxiety, depression, relationship issues, or life transitions, we're here to help.",
      "Our Orlando therapists are trained in the most effective therapeutic approaches, including Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), EMDR for trauma, and couples therapy. We create a safe, non-judgmental space where you can explore your thoughts and feelings, develop coping strategies, and work toward meaningful change.",
      "Same-week appointments are typically available for new clients. We offer both in-person sessions at our Winter Park office (convenient to Orlando) and secure telehealth appointments throughout Florida."
    ],
    conditionsHeading: "What We Treat",
    conditions: [
      { name: "Anxiety Disorders", description: "GAD, panic disorder, social anxiety, phobias" },
      { name: "Depression & Mood Issues" },
      { name: "Trauma & PTSD" },
      { name: "Relationship Problems" },
      { name: "Stress Management" },
      { name: "Life Transitions" },
      { name: "Grief & Loss" },
      { name: "Self-Esteem Issues" },
      { name: "Anger Management" },
      { name: "Eating Disorders" },
    ],
    servicesHeading: "Our Therapy Services",
    services: [
      {
        icon: Brain,
        title: "Cognitive Behavioral Therapy (CBT)",
        description: "Evidence-based approach helping you identify and change negative thought patterns and behaviors. Particularly effective for anxiety and depression."
      },
      {
        icon: Heart,
        title: "EMDR for Trauma",
        description: "Eye Movement Desensitization and Reprocessing (EMDR) is a powerful therapy for processing traumatic memories and reducing PTSD symptoms."
      },
      {
        icon: Users,
        title: "Couples & Relationship Therapy",
        description: "Strengthen your relationship through improved communication, conflict resolution, and emotional connection with your partner."
      },
      {
        icon: Video,
        title: "Telehealth Therapy",
        description: "Convenient online therapy sessions from the comfort of your Orlando home. Same quality care as in-person therapy with added flexibility."
      },
    ],
    whyChooseHeading: "Why Choose Our Orlando Therapists?",
    whyChoosePoints: [
      {
        icon: Award,
        title: "Licensed, Experienced Therapists",
        description: "All our therapists are licensed mental health counselors (LMHC) or licensed clinical social workers (LCSW) with years of experience helping Orlando residents."
      },
      {
        icon: CheckCircle,
        title: "Evidence-Based Approaches",
        description: "We use proven therapeutic methods backed by research, including CBT, DBT, EMDR, and solution-focused therapy tailored to your specific needs."
      },
      {
        icon: Calendar,
        title: "Flexible Scheduling",
        description: "Same-week appointments typically available. Evening and weekend slots offered to accommodate your work schedule."
      },
    ],
  },
  faqs: [
    {
      question: "How do I know if I need therapy?",
      answer: "If you're experiencing persistent sadness, anxiety, relationship problems, or difficulty coping with life stressors, therapy can help. You don't need to be in crisis to benefit from counseling - many people use therapy as a tool for personal growth and self-improvement."
    },
    {
      question: "What's the difference between a therapist and a psychiatrist?",
      answer: "Therapists (counselors, LMHCs, LCSWs) provide talk therapy and counseling but cannot prescribe medications. Psychiatrists are medical doctors who can prescribe medications and provide medical treatment. Many people benefit from seeing both - a therapist for counseling and a psychiatrist for medication management."
    },
    {
      question: "Do you offer in-person or online therapy in Orlando?",
      answer: "We offer both! You can choose in-person sessions at our Winter Park office (convenient to all of Orlando) or secure telehealth therapy from anywhere in Florida."
    },
    {
      question: "What insurance do you accept?",
      answer: "We accept most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, Humana, and more. Contact our office to verify your specific plan coverage."
    },
  ],
  sidebar: {
    formHeading: "Start Therapy Today",
    formSubheading: "Same-week appointments available. Most insurance accepted.",
    formType: "therapy",
    quickLinks: [
      { href: "/therapy", label: "Therapy Services" },
      { href: "/anxiety-therapy", label: "Anxiety Therapy" },
      { href: "/depression-counseling", label: "Depression Counseling" },
      { href: "/emdr-therapy", label: "EMDR Therapy" },
      { href: "/virtual-therapy", label: "Virtual Therapy" },
    ],
  },
  analytics: {
    pageName: "Therapist Orlando Page",
    conversionCategory: "therapist_orlando",
  },
};

export const mentalHealthClinicConfig: LandingPageConfig = {
  seo: {
    title: "Mental Health Clinic Orlando FL | Psychiatry & Therapy | Empathy Health",
    description: "Comprehensive mental health clinic in Orlando, FL. Board-certified psychiatrists, licensed therapists, medication management, therapy for anxiety, depression, ADHD. Same-week appointments. Most insurance accepted. Call 386-848-8751.",
    keywords: ["mental health clinic orlando", "mental health clinic orlando fl", "psychiatric clinic orlando", "mental health center orlando", "orlando mental health clinic", "mental health services orlando"],
    canonicalPath: "/mental-health-clinic-orlando",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "name": "Mental Health Clinic Orlando FL - Empathy Health Clinic",
    "description": "Comprehensive mental health services including psychiatry and therapy in Orlando, FL.",
    "url": "https://empathyhealthclinic.com/mental-health-clinic-orlando",
    "telephone": "+1-386-848-8751",
    "email": "providers@empathyhealthclinic.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2281 Lee Rd Suite 102",
      "addressLocality": "Winter Park",
      "addressRegion": "FL",
      "postalCode": "32810",
      "addressCountry": "US"
    }
  },
  hero: {
    title: "Mental Health Clinic in Orlando, FL",
    subtitle: "Comprehensive psychiatric and therapy services for adults and adolescents. Board-certified psychiatrists, licensed therapists, medication management, and evidence-based counseling. Same-week appointments available with in-person and telehealth options.",
    ctaPrimary: "Schedule Appointment",
    ctaSecondary: "Call 386-848-8751",
    heroImage: heroImage,
  },
  proofBar: {
    googleRating: 4.8,
    showVerifiedBadge: true,
    highlights: ["Board-Certified Providers", "Same-Week Appointments", "Telehealth Available"],
  },
  location: {
    title: "Orlando Mental Health Clinic",
    address: "2281 Lee Rd Suite 102",
    city: "Winter Park",
    state: "FL",
    zip: "32810",
    phone: "3868488751",
    phoneDisplay: "386-848-8751",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM\nTelehealth & in-person available",
    mapUrl: "https://maps.google.com/?q=2281+Lee+Rd+Suite+102+Winter+Park+FL+32810",
  },
  content: {
    mainHeading: "Comprehensive Mental Health Care in Orlando",
    introduction: [
      "Empathy Health Clinic is a full-service mental health clinic serving Orlando, Winter Park, and surrounding areas. We provide integrated psychiatric and therapy services under one roof, making it easy to get comprehensive care for your mental health needs.",
      "Our Orlando mental health clinic combines board-certified psychiatrists for medication management with licensed therapists for counseling, creating a coordinated treatment approach that addresses all aspects of your wellbeing. Whether you need psychiatric evaluation, medication management, individual therapy, or couples counseling, we're here to help.",
      "We treat adults and adolescents for anxiety, depression, ADHD, bipolar disorder, trauma, and many other mental health conditions. Same-week appointments are typically available, and we offer both in-person and secure telehealth services."
    ],
    conditionsHeading: "Mental Health Conditions We Treat",
    conditions: [
      { name: "Anxiety & Panic Disorders" },
      { name: "Depression & Mood Disorders" },
      { name: "ADHD", description: "Children, teens, and adults" },
      { name: "Bipolar Disorder" },
      { name: "OCD" },
      { name: "PTSD & Trauma" },
      { name: "Eating Disorders" },
      { name: "Personality Disorders" },
      { name: "Schizophrenia" },
      { name: "Substance Use Support" },
    ],
    servicesHeading: "Our Mental Health Services",
    services: [
      {
        icon: Brain,
        title: "Psychiatry & Medication Management",
        description: "Board-certified psychiatrists provide psychiatric evaluations, medication management, and ongoing monitoring for optimal mental health treatment."
      },
      {
        icon: MessageCircle,
        title: "Individual Therapy",
        description: "Licensed therapists offer CBT, DBT, EMDR, and other evidence-based therapies for anxiety, depression, trauma, and personal growth."
      },
      {
        icon: Users,
        title: "Couples & Family Therapy",
        description: "Strengthen relationships through improved communication, conflict resolution, and emotional connection with trained relationship therapists."
      },
      {
        icon: Video,
        title: "Telehealth Services",
        description: "Access our full range of mental health services from anywhere in Florida through secure, HIPAA-compliant video appointments."
      },
    ],
    whyChooseHeading: "Why Choose Empathy Health Clinic?",
    whyChoosePoints: [
      {
        icon: Award,
        title: "Integrated Care Team",
        description: "Our psychiatrists and therapists work together to provide coordinated, comprehensive mental health care. If you need both medication and therapy, we make it easy to get both in one place."
      },
      {
        icon: Calendar,
        title: "Same-Week Appointments",
        description: "Unlike many Orlando mental health clinics with months-long wait times, we typically offer same-week appointments for new patients."
      },
      {
        icon: Shield,
        title: "Most Insurance Accepted",
        description: "We accept Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, Humana, and many other major insurance plans serving Orlando residents."
      },
    ],
  },
  faqs: [
    {
      question: "What services does your mental health clinic provide?",
      answer: "We provide comprehensive mental health services including psychiatric evaluations, medication management, individual therapy (CBT, DBT, EMDR), couples therapy, family therapy, ADHD testing, and telehealth appointments. Our board-certified psychiatrists and licensed therapists work together to provide integrated care."
    },
    {
      question: "Do I need a referral to come to your clinic?",
      answer: "No referral is required. You can call our Orlando mental health clinic directly at 386-848-8751 to schedule an appointment. However, some insurance plans may require a referral for coverage, so check with your insurance provider."
    },
    {
      question: "Can I see both a psychiatrist and a therapist at your clinic?",
      answer: "Yes! Many of our patients benefit from seeing both a psychiatrist for medication management and a therapist for counseling. Our integrated care model makes this convenient and ensures your providers communicate about your treatment."
    },
    {
      question: "What insurance plans do you accept?",
      answer: "We accept most major insurance plans including Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, Humana, and more. Contact our office to verify coverage for your specific plan."
    },
  ],
  sidebar: {
    formHeading: "Get Started Today",
    formSubheading: "Same-week appointments available. Most insurance accepted.",
    formType: "mental_health_clinic",
    quickLinks: [
      { href: "/psychiatrist-orlando", label: "Psychiatrist Orlando" },
      { href: "/therapist-orlando", label: "Therapist Orlando" },
      { href: "/psychiatric-evaluation-orlando", label: "Psychiatric Evaluation" },
      { href: "/anxiety-therapy", label: "Anxiety Therapy" },
      { href: "/adhd-psychiatrist-orlando", label: "ADHD Treatment" },
    ],
  },
  analytics: {
    pageName: "Mental Health Clinic Orlando Page",
    conversionCategory: "mental_health_clinic",
  },
};
