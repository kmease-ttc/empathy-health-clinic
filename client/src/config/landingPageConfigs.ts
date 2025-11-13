import type { LandingPageConfig } from "@/types/landingPage";
import heroImage from "@assets/stock_images/professional_healthc_955227e9.jpg";
import { FileText, Brain, Shield, Award, Calendar, Video, MessageCircle, Users, CheckCircle, Heart, DollarSign, CreditCard } from "lucide-react";

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

// Medicare Therapy Orlando
export const medicareTherapyOrlandoConfig: LandingPageConfig = {
  seo: {
    title: "Medicare Therapy Orlando FL | Therapist Accepting Medicare Part B | Same-Week Appointments",
    description: "Therapy services in Orlando, FL accepting Medicare Part B. Licensed therapists provide CBT, EMDR, trauma therapy, and more. Same-week appointments, in-person and telehealth. Call 386-848-8751 to verify Medicare coverage.",
    keywords: ["medicare therapy orlando", "therapist accepts medicare orlando", "medicare counseling orlando", "medicare part b therapy orlando", "medicare mental health orlando"],
    canonicalPath: "/medicare-therapy-orlando",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "name": "Medicare Therapy Orlando FL - Empathy Health Clinic",
    "description": "Therapy services in Orlando accepting Medicare Part B coverage.",
    "url": "https://empathyhealthclinic.com/medicare-therapy-orlando",
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
    title: "Medicare Therapy Services in Orlando",
    subtitle: "Licensed mental health counselors and therapists accepting Medicare Part B in Orlando, FL. Evidence-based therapy including CBT, EMDR, and trauma-focused counseling. Same-week appointments for Medicare beneficiaries. Call to verify your coverage.",
    ctaPrimary: "Verify Medicare Coverage",
    ctaSecondary: "Call 386-848-8751",
    heroImage: heroImage,
  },
  proofBar: {
    googleRating: 4.8,
    showVerifiedBadge: true,
    highlights: ["Medicare Part B Accepted", "Same-Week Appointments"],
  },
  location: {
    title: "Orlando Metro Location",
    address: "2281 Lee Rd Suite 102",
    city: "Winter Park",
    state: "FL",
    zip: "32810",
    phone: "3868488751",
    phoneDisplay: "386-848-8751",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM\nMedicare appointments available",
    mapUrl: "https://maps.google.com/?q=2281+Lee+Rd+Suite+102+Winter+Park+FL+32810",
  },
  content: {
    mainHeading: "Therapy Services Accepting Medicare in Orlando",
    introduction: [
      "Finding a qualified therapist who accepts Medicare Part B can be challenging in Orlando. At Empathy Health Clinic, our licensed mental health counselors (LMHC) and clinical social workers (LCSW) provide evidence-based therapy services covered by Medicare Part B for eligible beneficiaries.",
      "Medicare Part B covers outpatient mental health services, including individual therapy and counseling. Our therapists specialize in treating anxiety, depression, grief, trauma, and adjustment disorders common among older adults. We accept Medicare assignment, which means we accept the Medicare-approved amount as full payment.",
    ],
    conditionsHeading: "Conditions We Treat with Medicare Coverage",
    conditions: [
      { name: "Depression in Older Adults" },
      { name: "Anxiety & Worry" },
      { name: "Grief & Bereavement" },
      { name: "Chronic Illness Adjustment" },
      { name: "Caregiver Stress" },
      { name: "Life Transitions & Retirement" },
      { name: "Isolation & Loneliness" },
      { name: "PTSD & Trauma" },
    ],
    servicesHeading: "Therapy Services Covered by Medicare",
    services: [
      {
        icon: Brain,
        title: "Cognitive Behavioral Therapy (CBT)",
        description: "Evidence-based approach helping you identify and change negative thought patterns. Particularly effective for depression and anxiety in older adults."
      },
      {
        icon: Heart,
        title: "Grief & Bereavement Counseling",
        description: "Compassionate support for processing loss and adjusting to life changes. Specialized therapy for seniors dealing with loss of spouse, friends, or independence."
      },
      {
        icon: Video,
        title: "Telehealth Therapy (Medicare Covered)",
        description: "Medicare covers telehealth mental health services. Attend therapy from home using your computer, tablet, or smartphone with secure video calls."
      },
    ],
    whyChooseHeading: "Why Choose Our Medicare Therapy Services?",
    whyChoosePoints: [
      {
        icon: CreditCard,
        title: "Medicare Assignment Accepted",
        description: "We accept Medicare assignment, meaning we accept the Medicare-approved amount as full payment. You'll typically only pay your Part B deductible and 20% coinsurance."
      },
      {
        icon: Award,
        title: "Licensed, Experienced Therapists",
        description: "All our therapists are licensed mental health counselors (LMHC) or licensed clinical social workers (LCSW) with experience treating older adults and Medicare patients."
      },
      {
        icon: Calendar,
        title: "Flexible Scheduling",
        description: "Same-week appointments typically available for Medicare beneficiaries. Daytime appointments and telehealth options for convenience and accessibility."
      },
    ],
  },
  faqs: [
    {
      question: "Does Medicare cover therapy in Orlando?",
      answer: "Yes. Medicare Part B covers outpatient mental health services including individual therapy and counseling sessions. You typically pay 20% of the Medicare-approved amount after meeting your Part B deductible."
    },
    {
      question: "How many therapy sessions does Medicare cover per year?",
      answer: "Medicare Part B doesn't limit the number of therapy sessions, as long as they're medically necessary and ordered by your doctor. Your therapist will work with you and Medicare to ensure your treatment is covered."
    },
    {
      question: "Do I need a referral for Medicare therapy?",
      answer: "Original Medicare doesn't require a referral for outpatient mental health services. However, if you have a Medicare Advantage plan, check with your specific plan as they may require referrals."
    },
    {
      question: "Can I use telehealth for therapy with Medicare?",
      answer: "Yes! Medicare covers telehealth mental health services. You can attend therapy sessions from home using video calls, which is especially convenient for seniors with mobility issues or transportation challenges."
    },
  ],
  sidebar: {
    formHeading: "Verify Your Medicare Coverage",
    formSubheading: "Our billing team will check your Medicare Part B coverage and explain your costs.",
    formType: "medicare_therapy",
    quickLinks: [
      { href: "/therapist-orlando", label: "Orlando Therapist" },
      { href: "/medicare-psychiatrist-orlando", label: "Medicare Psychiatrist" },
      { href: "/mental-health-clinic-orlando", label: "Mental Health Clinic" },
    ],
  },
  analytics: {
    pageName: "Medicare Therapy Orlando Page",
    conversionCategory: "medicare_therapy",
  },
};

// Medicare Psychiatrist Orlando
export const medicarePsychiatristOrlandoConfig: LandingPageConfig = {
  seo: {
    title: "Medicare Psychiatrist Orlando FL | Psychiatry Accepting Medicare Part B | Medication Management",
    description: "Board-certified psychiatrists in Orlando accepting Medicare Part B. Psychiatric evaluations, medication management, and mental health treatment for seniors. Same-week appointments. Call 386-848-8751 to verify Medicare coverage.",
    keywords: ["medicare psychiatrist orlando", "psychiatrist accepts medicare orlando", "medicare mental health orlando", "medicare medication management orlando"],
    canonicalPath: "/medicare-psychiatrist-orlando",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "Psychiatrist"],
    "name": "Medicare Psychiatrist Orlando FL - Empathy Health Clinic",
    "description": "Board-certified psychiatrists in Orlando accepting Medicare Part B for psychiatric care.",
    "url": "https://empathyhealthclinic.com/medicare-psychiatrist-orlando",
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
    title: "Medicare Psychiatrist in Orlando, FL",
    subtitle: "Board-certified psychiatrists accepting Medicare Part B in Orlando. Comprehensive psychiatric evaluations, medication management, and ongoing care for depression, anxiety, and other mental health conditions. Same-week appointments for Medicare beneficiaries.",
    ctaPrimary: "Verify Medicare Coverage",
    ctaSecondary: "Call 386-848-8751",
    heroImage: heroImage,
  },
  proofBar: {
    googleRating: 4.8,
    showVerifiedBadge: true,
    highlights: ["Medicare Part B Accepted", "Board-Certified Psychiatrists"],
  },
  location: {
    title: "Orlando Metro Location",
    address: "2281 Lee Rd Suite 102",
    city: "Winter Park",
    state: "FL",
    zip: "32810",
    phone: "3868488751",
    phoneDisplay: "386-848-8751",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM\nMedicare appointments available",
    mapUrl: "https://maps.google.com/?q=2281+Lee+Rd+Suite+102+Winter+Park+FL+32810",
  },
  content: {
    mainHeading: "Psychiatry Services Accepting Medicare in Orlando",
    introduction: [
      "Medicare Part B covers medically necessary psychiatric services including evaluations, medication management, and follow-up care. Our board-certified psychiatrists in Orlando accept Medicare assignment and provide comprehensive mental health care for seniors and Medicare beneficiaries.",
      "We specialize in treating depression, anxiety, bipolar disorder, and other mental health conditions common in older adults. Our psychiatrists understand the unique challenges of mental health in aging, including medication interactions, cognitive changes, and chronic illness management.",
    ],
    conditionsHeading: "Psychiatric Conditions We Treat",
    conditions: [
      { name: "Depression in Older Adults" },
      { name: "Anxiety Disorders" },
      { name: "Bipolar Disorder" },
      { name: "Dementia-Related Behavioral Issues" },
      { name: "Sleep Disorders" },
      { name: "Chronic Pain & Mental Health" },
      { name: "Post-Stroke Depression" },
    ],
    servicesHeading: "Medicare-Covered Psychiatric Services",
    services: [
      {
        icon: FileText,
        title: "Psychiatric Evaluations",
        description: "Comprehensive mental health assessments covered by Medicare Part B. Includes diagnostic evaluation, mental status examination, and treatment planning."
      },
      {
        icon: Brain,
        title: "Medication Management",
        description: "Careful monitoring and adjustment of psychiatric medications with attention to drug interactions, side effects, and coordination with other medical providers."
      },
      {
        icon: Video,
        title: "Telehealth Psychiatry",
        description: "Medicare covers telehealth psychiatric appointments. See your psychiatrist from home for evaluations, medication management, and follow-up care."
      },
    ],
    whyChooseHeading: "Why Choose Our Medicare Psychiatry Services?",
    whyChoosePoints: [
      {
        icon: CreditCard,
        title: "Medicare Assignment Accepted",
        description: "We accept Medicare assignment, billing Medicare directly and accepting their approved amount. You pay only your Part B deductible and 20% coinsurance."
      },
      {
        icon: Award,
        title: "Board-Certified Psychiatrists",
        description: "All our psychiatrists are board-certified by the American Board of Psychiatry and Neurology with experience treating Medicare-age patients and complex medical conditions."
      },
      {
        icon: Shield,
        title: "Coordinated Care",
        description: "We coordinate with your primary care doctor and other specialists to ensure comprehensive care, especially important when managing multiple medications and conditions."
      },
    ],
  },
  faqs: [
    {
      question: "Does Medicare cover psychiatrist visits in Orlando?",
      answer: "Yes. Medicare Part B covers psychiatric evaluations, medication management, and follow-up appointments with psychiatrists. You typically pay 20% of the Medicare-approved amount after meeting your Part B deductible."
    },
    {
      question: "Will Medicare cover my psychiatric medications?",
      answer: "Medicare Part D covers most psychiatric medications. We'll work with your Part D plan to prescribe covered medications and help with prior authorizations if needed."
    },
    {
      question: "How often can I see a psychiatrist with Medicare?",
      answer: "Medicare covers as many psychiatrist visits as are medically necessary. Initially, you might see your psychiatrist monthly for medication management, then quarterly once stable."
    },
    {
      question: "Do you accept Medicare Advantage plans?",
      answer: "Yes, we accept many Medicare Advantage plans in addition to Original Medicare. Call our office to verify we're in-network with your specific Medicare Advantage plan."
    },
  ],
  sidebar: {
    formHeading: "Verify Your Medicare Coverage",
    formSubheading: "Our billing team will check your Medicare Part B coverage and explain your costs.",
    formType: "medicare_psychiatrist",
    quickLinks: [
      { href: "/psychiatrist-orlando", label: "Psychiatrist Orlando" },
      { href: "/medicare-therapy-orlando", label: "Medicare Therapy" },
      { href: "/medication-management-orlando", label: "Medication Management" },
    ],
  },
  analytics: {
    pageName: "Medicare Psychiatrist Orlando Page",
    conversionCategory: "medicare_psychiatrist",
  },
};

// Psychologist Orlando
export const psychologistOrlandoConfig: LandingPageConfig = {
  seo: {
    title: "Psychologist Orlando FL | Licensed Clinical Psychologists | Testing & Therapy | Insurance Accepted",
    description: "Licensed clinical psychologists in Orlando, FL providing psychological testing, therapy, and assessments. ADHD testing, autism evaluations, neuropsychological testing, CBT, and more. Same-week appointments. Most insurance accepted. Call 386-848-8751.",
    keywords: ["psychologist orlando", "clinical psychologist orlando fl", "psychological testing orlando", "adhd testing orlando", "neuropsychologist orlando"],
    canonicalPath: "/psychologist-orlando",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "Psychologist"],
    "name": "Psychologist Orlando FL - Empathy Health Clinic",
    "description": "Licensed clinical psychologists providing testing and therapy in Orlando, FL.",
    "url": "https://empathyhealthclinic.com/psychologist-orlando",
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
    "medicalSpecialty": "Psychology"
  },
  hero: {
    title: "Licensed Psychologists in Orlando, FL",
    subtitle: "Comprehensive psychological services including diagnostic testing, therapy, and assessments. Our licensed clinical psychologists provide ADHD evaluations, autism assessments, neuropsychological testing, and evidence-based therapy. Same-week appointments available.",
    ctaPrimary: "Schedule Appointment",
    ctaSecondary: "Call 386-848-8751",
    heroImage: heroImage,
  },
  proofBar: {
    googleRating: 4.8,
    showVerifiedBadge: true,
    highlights: ["Licensed Clinical Psychologists", "Comprehensive Testing Available"],
  },
  location: {
    title: "Orlando Metro Location",
    address: "2281 Lee Rd Suite 102",
    city: "Winter Park",
    state: "FL",
    zip: "32810",
    phone: "3868488751",
    phoneDisplay: "386-848-8751",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM\nPsychological testing & therapy available",
    mapUrl: "https://maps.google.com/?q=2281+Lee+Rd+Suite+102+Winter+Park+FL+32810",
  },
  content: {
    mainHeading: "Comprehensive Psychology Services in Orlando",
    introduction: [
      "Whether you need psychological testing, diagnostic assessment, or therapy, our licensed clinical psychologists in Orlando provide comprehensive, evidence-based mental health services. We specialize in complex diagnostic evaluations and provide expert psychological testing for ADHD, autism, learning disabilities, and neuropsychological conditions.",
      "Our psychologists work collaboratively with psychiatrists and therapists at Empathy Health Clinic to provide integrated mental health care. This means if you need both psychological testing and medication management, we can coordinate your care seamlessly.",
    ],
    conditionsHeading: "Psychological Services We Provide",
    conditions: [
      { name: "ADHD Testing & Diagnosis" },
      { name: "Autism Spectrum Evaluations" },
      { name: "Learning Disability Assessments" },
      { name: "Neuropsychological Testing" },
      { name: "IQ & Cognitive Testing" },
      { name: "Personality Assessments" },
      { name: "Pre-Surgical Psychological Evaluations" },
    ],
    servicesHeading: "Our Psychology Services",
    services: [
      {
        icon: FileText,
        title: "Psychological Testing & Assessment",
        description: "Comprehensive testing batteries for ADHD, autism, learning disabilities, and cognitive functioning. Includes standardized tests, clinical interviews, and detailed diagnostic reports."
      },
      {
        icon: Brain,
        title: "Therapy & Counseling",
        description: "Evidence-based psychotherapy including CBT, DBT, and other approaches. Our psychologists provide individual therapy for adults, adolescents, and couples."
      },
      {
        icon: Award,
        title: "Diagnostic Evaluations",
        description: "Complex diagnostic assessments when diagnosis is unclear or multiple conditions may be present. Expert evaluation by doctoral-level psychologists."
      },
    ],
    whyChooseHeading: "Why Choose Our Orlando Psychologists?",
    whyChoosePoints: [
      {
        icon: Award,
        title: "Doctoral-Level Psychologists",
        description: "All our psychologists hold doctoral degrees (Ph.D. or Psy.D.) and are licensed by the Florida Board of Psychology. Specialized training in psychological testing and assessment."
      },
      {
        icon: CheckCircle,
        title: "Comprehensive Testing",
        description: "We use the latest validated psychological tests and assessment tools. Detailed written reports provided for schools, employers, disability claims, or personal use."
      },
      {
        icon: Users,
        title: "Integrated Care Model",
        description: "Our psychologists work alongside psychiatrists and therapists, allowing for comprehensive care. If testing reveals ADHD, for example, you can see a psychiatrist for medication in the same clinic."
      },
    ],
  },
  faqs: [
    {
      question: "What's the difference between a psychologist and a psychiatrist?",
      answer: "Psychologists have doctoral degrees (Ph.D. or Psy.D.) and specialize in psychological testing and therapy but cannot prescribe medication. Psychiatrists are medical doctors (M.D. or D.O.) who can prescribe medication and provide medical treatment. At our clinic, both work together for comprehensive care."
    },
    {
      question: "Does insurance cover psychological testing in Orlando?",
      answer: "Many insurance plans cover psychological testing when medically necessary. ADHD testing, autism evaluations, and neuropsychological assessments are often covered. We'll verify your coverage before scheduling testing."
    },
    {
      question: "How long does ADHD testing take?",
      answer: "Comprehensive ADHD testing typically takes 2-4 hours spread across one or two appointments. This includes clinical interviews, standardized tests, computerized attention tests, and questionnaires. You'll receive a detailed written report with diagnostic conclusions and treatment recommendations."
    },
    {
      question: "Can psychologists prescribe medication in Florida?",
      answer: "No, psychologists in Florida cannot prescribe medication. However, our psychologists work closely with our psychiatrists. If psychological testing reveals a condition that may benefit from medication (like ADHD), we can schedule you with a psychiatrist in the same clinic."
    },
  ],
  sidebar: {
    formHeading: "Schedule Psychology Services",
    formSubheading: "Psychological testing, therapy, and assessments available. Most insurance accepted.",
    formType: "psychologist",
    quickLinks: [
      { href: "/psychiatrist-orlando", label: "Psychiatrist Orlando" },
      { href: "/therapist-orlando", label: "Therapist Orlando" },
      { href: "/adhd-psychiatrist-orlando", label: "ADHD Testing" },
    ],
  },
  analytics: {
    pageName: "Psychologist Orlando Page",
    conversionCategory: "psychologist",
  },
};

// Insurance-specific page factory helper
function createInsuranceTherapyConfig(
  insuranceName: string,
  urlSlug: string,
  specificBenefits: string[] = [],
): LandingPageConfig {
  return {
    seo: {
      title: `${insuranceName} Therapy Orlando FL | Therapist Accepting ${insuranceName} | Same-Week Appointments`,
      description: `Therapy services in Orlando, FL accepting ${insuranceName} insurance. Licensed therapists provide CBT, EMDR, trauma therapy, and more. In-network providers, same-week appointments. Call 386-848-8751 to verify ${insuranceName} coverage.`,
      keywords: [`${insuranceName.toLowerCase()} therapy orlando`, `therapist accepts ${insuranceName.toLowerCase()} orlando`, `${insuranceName.toLowerCase()} mental health orlando`],
      canonicalPath: `/${urlSlug}`,
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": ["MedicalBusiness", "LocalBusiness"],
      "name": `${insuranceName} Therapy Orlando FL - Empathy Health Clinic`,
      "description": `Therapy services in Orlando accepting ${insuranceName} insurance.`,
      "url": `https://empathyhealthclinic.com/${urlSlug}`,
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
      title: `${insuranceName} Therapy Services in Orlando`,
      subtitle: `Licensed mental health counselors and therapists accepting ${insuranceName} insurance in Orlando, FL. Evidence-based therapy including CBT, EMDR, and trauma-focused counseling. In-network providers with same-week appointments available.`,
      ctaPrimary: `Verify ${insuranceName} Coverage`,
      ctaSecondary: "Call 386-848-8751",
      heroImage: heroImage,
    },
    proofBar: {
      googleRating: 4.8,
      showVerifiedBadge: true,
      highlights: [`${insuranceName} In-Network`, "Same-Week Appointments"],
    },
    location: {
      title: "Orlando Metro Location",
      address: "2281 Lee Rd Suite 102",
      city: "Winter Park",
      state: "FL",
      zip: "32810",
      phone: "3868488751",
      phoneDisplay: "386-848-8751",
      hours: `Mon-Fri: 9:00 AM - 6:00 PM\n${insuranceName} appointments available`,
      mapUrl: "https://maps.google.com/?q=2281+Lee+Rd+Suite+102+Winter+Park+FL+32810",
    },
    content: {
      mainHeading: `Therapy Services Accepting ${insuranceName} in Orlando`,
      introduction: [
        `Finding a qualified therapist who accepts your ${insuranceName} insurance can be challenging. At Empathy Health Clinic, our licensed mental health counselors (LMHC) and clinical social workers (LCSW) are in-network providers for ${insuranceName}, making quality mental health care accessible and affordable.`,
        `We provide evidence-based therapy services covered by ${insuranceName} including individual therapy, couples counseling, and specialized treatments for anxiety, depression, trauma, and more. Our Orlando therapists understand ${insuranceName} benefits and will help you maximize your coverage.`,
      ],
      conditionsHeading: "Conditions We Treat",
      conditions: [
        { name: "Depression & Mood Disorders" },
        { name: "Anxiety & Panic Disorders" },
        { name: "PTSD & Trauma" },
        { name: "Relationship Issues" },
        { name: "Stress & Burnout" },
        { name: "Grief & Loss" },
        { name: "Life Transitions" },
        { name: "Self-Esteem Issues" },
      ],
      servicesHeading: `Therapy Services Covered by ${insuranceName}`,
      services: [
        {
          icon: Brain,
          title: "Cognitive Behavioral Therapy (CBT)",
          description: `Evidence-based approach helping you identify and change negative thought patterns. Covered by ${insuranceName} for anxiety, depression, and other conditions.`
        },
        {
          icon: Heart,
          title: "EMDR for Trauma",
          description: `Eye Movement Desensitization and Reprocessing (EMDR) is a powerful therapy for processing traumatic memories and reducing PTSD symptoms. ${insuranceName} typically covers EMDR therapy.`
        },
        {
          icon: Users,
          title: "Couples & Relationship Therapy",
          description: `Strengthen your relationship through improved communication and conflict resolution. Check your ${insuranceName} plan for couples therapy coverage.`
        },
        {
          icon: Video,
          title: "Telehealth Therapy",
          description: `Convenient online therapy sessions covered by ${insuranceName}. Same quality care as in-person therapy with added flexibility and convenience.`
        },
      ],
      whyChooseHeading: "Why Choose Our Therapists?",
      whyChoosePoints: [
        {
          icon: CreditCard,
          title: `${insuranceName} In-Network Provider`,
          description: `We're in-network with ${insuranceName}, which means lower out-of-pocket costs for you. We bill ${insuranceName} directly and handle all the paperwork.`
        },
        {
          icon: Award,
          title: "Licensed, Experienced Therapists",
          description: `All our therapists are licensed mental health counselors (LMHC) or licensed clinical social workers (LCSW) with years of experience treating ${insuranceName} patients.`
        },
        {
          icon: Calendar,
          title: "Flexible Scheduling",
          description: `Same-week appointments typically available for ${insuranceName} members. Evening and weekend slots offered to accommodate your work schedule.`
        },
      ],
    },
    faqs: [
      {
        question: `How do I use my ${insuranceName} insurance for therapy?`,
        answer: `Simply call our office at 386-848-8751 and mention you have ${insuranceName}. We'll verify your benefits, confirm coverage, and schedule your first appointment. We handle all billing and claims with ${insuranceName} directly.`
      },
      {
        question: `What's my copay with ${insuranceName}?`,
        answer: `Copays vary by ${insuranceName} plan. Most plans have copays between $10-$50 per therapy session. We'll check your specific plan and tell you your exact copay before your first appointment.`
      },
      {
        question: `Do I need a referral for therapy with ${insuranceName}?`,
        answer: `Most ${insuranceName} plans don't require a referral for outpatient mental health services, but some plans do. We'll check your specific plan requirements when you call to schedule.`
      },
      {
        question: `Does ${insuranceName} cover telehealth therapy?`,
        answer: `Yes, ${insuranceName} covers telehealth mental health services. You can attend therapy sessions from home using video calls, which many ${insuranceName} members find more convenient than in-person visits.`
      },
    ],
    sidebar: {
      formHeading: `Verify Your ${insuranceName} Coverage`,
      formSubheading: `Our billing team will check your ${insuranceName} benefits and confirm your copay.`,
      formType: `${urlSlug.replace(/-/g, '_')}`,
      quickLinks: [
        { href: "/therapist-orlando", label: "Orlando Therapist" },
        { href: "/mental-health-clinic-orlando", label: "Mental Health Clinic" },
        { href: "/anxiety-therapy", label: "Anxiety Therapy" },
      ],
    },
    analytics: {
      pageName: `${insuranceName} Therapy Orlando Page`,
      conversionCategory: urlSlug.replace(/-/g, '_'),
    },
  };
}

// UMR Therapy Orlando
export const umrTherapyOrlandoConfig: LandingPageConfig = createInsuranceTherapyConfig(
  "UMR",
  "therapist-accepts-umr"
);

// Oscar Health Therapy Orlando  
export const oscarHealthTherapyOrlandoConfig: LandingPageConfig = createInsuranceTherapyConfig(
  "Oscar Health",
  "therapist-accepts-oscar-health"
);

// Sunshine Health Therapy Orlando
export const sunshineHealthTherapyOrlandoConfig: LandingPageConfig = createInsuranceTherapyConfig(
  "Sunshine Health",
  "sunshine-health-therapy"
);
