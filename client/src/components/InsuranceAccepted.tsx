import { Shield, Check } from "lucide-react";
import { Link } from "wouter";
import { SiBluemicrophones } from "react-icons/si";

interface InsuranceProvider {
  name: string;
  shortName: string;
  href: string;
}

interface InsuranceAcceptedProps {
  variant?: "badges" | "list" | "compact" | "hero";
  className?: string;
  showSchema?: boolean;
  limit?: number;
}

const INSURANCE_PROVIDERS: InsuranceProvider[] = [
  { name: "Blue Cross Blue Shield", shortName: "BCBS", href: "/psychiatrist-orlando-accepts-bcbs" },
  { name: "Aetna", shortName: "Aetna", href: "/psychiatrist-orlando-accepts-aetna" },
  { name: "Cigna", shortName: "Cigna", href: "/psychiatrist-orlando-accepts-cigna" },
  { name: "UMR", shortName: "UMR", href: "/psychiatrist-orlando-accepts-umr" },
  { name: "United Healthcare", shortName: "UHC", href: "/psychiatrist-orlando-accepts-united-healthcare" },
  { name: "Medicare", shortName: "Medicare", href: "/medicare-psychiatrist-orlando" },
  { name: "Tricare", shortName: "Tricare", href: "/insurance" },
  { name: "Oscar Health", shortName: "Oscar", href: "/insurance" },
];

export default function InsuranceAccepted({ 
  variant = "badges", 
  className = "",
  showSchema = true,
  limit
}: InsuranceAcceptedProps) {
  const providers = limit ? INSURANCE_PROVIDERS.slice(0, limit) : INSURANCE_PROVIDERS;

  const schemaScript = showSchema ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          "name": "Empathy Health Clinic",
          "insuranceAccepted": providers.map(p => p.name)
        })
      }}
    />
  ) : null;

  if (variant === "hero") {
    return (
      <>
        {schemaScript}
        <div className={`flex flex-wrap items-center gap-3 ${className}`} data-testid="insurance-hero">
          <Shield className="h-5 w-5 text-green-400" />
          <span className="text-white/90 font-medium">Insurance Accepted:</span>
          {providers.slice(0, 5).map((provider) => (
            <span 
              key={provider.name}
              className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-white/20"
              data-testid={`insurance-badge-${provider.shortName.toLowerCase()}`}
            >
              {provider.shortName}
            </span>
          ))}
          <Link 
            href="/insurance" 
            className="text-sm text-white/80 hover:text-white underline"
            data-testid="link-view-all-insurance"
          >
            + more
          </Link>
        </div>
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        {schemaScript}
        <div className={`flex items-center gap-2 text-sm ${className}`} data-testid="insurance-compact">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            Accepting: {providers.slice(0, 4).map(p => p.shortName).join(", ")}
            <Link href="/insurance" className="text-primary hover:underline ml-1">
              & more
            </Link>
          </span>
        </div>
      </>
    );
  }

  if (variant === "list") {
    return (
      <>
        {schemaScript}
        <div className={`space-y-2 ${className}`} data-testid="insurance-list">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Insurance Accepted</h3>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {providers.map((provider) => (
              <li key={provider.name} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <Link 
                  href={provider.href}
                  className="text-sm text-foreground hover:text-primary transition-colors"
                  data-testid={`link-insurance-${provider.shortName.toLowerCase()}`}
                >
                  {provider.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  return (
    <>
      {schemaScript}
      <div className={`bg-muted/30 border rounded-lg p-6 ${className}`} data-testid="insurance-badges">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Insurance We Accept</h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {providers.map((provider) => (
            <Link
              key={provider.name}
              href={provider.href}
              className="bg-background border rounded-md px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              data-testid={`link-insurance-badge-${provider.shortName.toLowerCase()}`}
            >
              {provider.name}
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Don't see your insurance? <Link href="/insurance" className="text-primary hover:underline">View all accepted plans</Link> or call (386) 848-8751 to verify coverage.
        </p>
      </div>
    </>
  );
}
