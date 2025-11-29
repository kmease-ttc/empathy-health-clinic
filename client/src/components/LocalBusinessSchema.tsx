import { useEffect } from "react";

interface LocalBusinessSchemaProps {
  city: string;
  serviceType: string;
  name: string;
  description: string;
  slug: string;
}

interface CityGeoData {
  latitude: number;
  longitude: number;
  postalCode: string;
}

const cityGeoCoordinates: Record<string, CityGeoData> = {
  "Orlando": { latitude: 28.5383, longitude: -81.3792, postalCode: "32801" },
  "Winter Park": { latitude: 28.5999, longitude: -81.3392, postalCode: "32789" },
  "Altamonte Springs": { latitude: 28.6611, longitude: -81.3656, postalCode: "32701" },
  "Lake Mary": { latitude: 28.7589, longitude: -81.3178, postalCode: "32746" },
  "Sanford": { latitude: 28.8029, longitude: -81.2731, postalCode: "32771" },
  "Maitland": { latitude: 28.6275, longitude: -81.3631, postalCode: "32751" },
  "Casselberry": { latitude: 28.6778, longitude: -81.3278, postalCode: "32707" },
  "Longwood": { latitude: 28.7028, longitude: -81.3384, postalCode: "32750" },
  "Oviedo": { latitude: 28.6700, longitude: -81.2081, postalCode: "32765" },
};

export default function LocalBusinessSchema({ 
  city, 
  serviceType, 
  name, 
  description,
  slug 
}: LocalBusinessSchemaProps) {
  useEffect(() => {
    const baseUrl = window.location.origin;
    
    const geoData = cityGeoCoordinates[city] || cityGeoCoordinates["Orlando"];
    
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["MedicalClinic", "Psychiatrist"],
      "@id": `${baseUrl}/locations/${slug}`,
      "name": `Empathy Health Clinic - ${city}`,
      "description": description,
      "url": `${baseUrl}/locations/${slug}`,
      "logo": `${baseUrl}/attached_assets/image_1761618219825.png`,
      "image": `${baseUrl}/attached_assets/stock_images/peaceful_green_fores_98e1a8d8.jpg`,
      "telephone": "+1-386-848-8751",
      "email": "providers@empathyhealthclinic.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "2281 Lee Rd Suite 102",
        "addressLocality": city,
        "addressRegion": "FL",
        "postalCode": geoData.postalCode,
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": geoData.latitude,
        "longitude": geoData.longitude
      },
      "areaServed": [
        {
          "@type": "City",
          "name": city,
          "containedInPlace": {
            "@type": "State",
            "name": "Florida"
          }
        },
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
          "name": "Altamonte Springs",
          "containedInPlace": {
            "@type": "State",
            "name": "Florida"
          }
        },
        {
          "@type": "City",
          "name": "Maitland",
          "containedInPlace": {
            "@type": "State",
            "name": "Florida"
          }
        },
        {
          "@type": "City",
          "name": "Casselberry",
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
        }
      ],
      "priceRange": "$$",
      "currenciesAccepted": "USD",
      "paymentAccepted": "Insurance, Credit Card, Cash",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
          ],
          "opens": "09:00",
          "closes": "17:00"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": serviceType === "psychiatry" ? "Psychiatric Services" : "Therapy & Counseling Services",
        "itemListElement": serviceType === "psychiatry" ? [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Psychiatric Evaluation"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Medication Management"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalTherapy",
              "name": "Mental Health Treatment"
            }
          }
        ] : [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalTherapy",
              "name": "Psychotherapy"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalTherapy",
              "name": "Cognitive Behavioral Therapy"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalTherapy",
              "name": "Individual Counseling"
            }
          }
        ]
      },
      "medicalSpecialty": "Psychiatric",
      "sameAs": [
        "https://www.facebook.com/profile.php?id=100083226165903",
        "https://x.com/clinicempathy12",
        "https://www.instagram.com/empathyhealthfl/?hl=en",
        "https://www.tiktok.com/@empathy.health.cl",
        "https://www.linkedin.com/company/empathy-health-clinic/",
        "https://www.youtube.com/@EmpathyHealthClinic"
      ]
    };

    let script = document.querySelector(`script[type="application/ld+json"][data-schema="local-business-${slug}"]`);
    
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-schema', `local-business-${slug}`);
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(localBusinessSchema);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [city, serviceType, name, description, slug]);

  return null;
}
