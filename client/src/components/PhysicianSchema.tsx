import { useEffect } from "react";
import type { TeamMember } from "@shared/schema";

interface PhysicianSchemaProps {
  teamMember: TeamMember;
}

export default function PhysicianSchema({ teamMember }: PhysicianSchemaProps) {
  useEffect(() => {
    if (!teamMember) {
      return;
    }

    const baseUrl = window.location.origin;
    
    const physicianSchema = {
      "@context": "https://schema.org",
      "@type": ["Person", "Physician"],
      "name": teamMember.name,
      "hasCredential": {
        "@type": "EducationalOccupationalCredential",
        "name": teamMember.credentials,
        "credentialCategory": "MedicalCredential"
      },
      "image": teamMember.image,
      "url": `${baseUrl}/team/${teamMember.slug}`,
      "description": teamMember.bio,
      "medicalSpecialty": teamMember.specialties.split(',').map(s => s.trim()),
      "affiliation": {
        "@type": ["MedicalOrganization", "LocalBusiness"],
        "name": "Empathy Health Clinic",
        "url": baseUrl,
        "telephone": "+1-386-848-8751",
        "priceRange": "$$",
        "image": `${baseUrl}/attached_assets/stock_images/peaceful_green_fores_98e1a8d8.jpg`,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 28.5983,
          "longitude": -81.3492
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "17:00"
          }
        ],
        "sameAs": [
          "https://www.facebook.com/empathyhealthclinic",
          "https://www.instagram.com/empathyhealthclinic",
          "https://www.linkedin.com/company/empathyhealthclinic"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2281 Lee Rd Suite 102",
          "addressLocality": "Winter Park",
          "addressRegion": "FL",
          "postalCode": "32810",
          "addressCountry": "US"
        }
      },
      "knowsAbout": teamMember.specialties.split(',').map(s => s.trim())
    };

    let script = document.querySelector('script[type="application/ld+json"][data-schema="physician"]');
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', 'physician');
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(physicianSchema);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [teamMember]);

  return null;
}
