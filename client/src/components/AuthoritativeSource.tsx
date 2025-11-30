import { ExternalLink } from "lucide-react";

interface AuthoritativeSourceProps {
  source: "NIMH" | "APA" | "NIH" | "MayoClinic" | "SAMHSA" | "CDC" | "WHO";
  topic?: string;
  className?: string;
}

const SOURCE_INFO: Record<string, { name: string; url: string; description: string }> = {
  NIMH: {
    name: "National Institute of Mental Health",
    url: "https://www.nimh.nih.gov",
    description: "Leading federal agency for research on mental disorders"
  },
  APA: {
    name: "American Psychiatric Association",
    url: "https://www.psychiatry.org",
    description: "Professional organization of psychiatrists"
  },
  NIH: {
    name: "National Institutes of Health",
    url: "https://www.nih.gov",
    description: "Nation's medical research agency"
  },
  MayoClinic: {
    name: "Mayo Clinic",
    url: "https://www.mayoclinic.org",
    description: "Nonprofit medical practice and research group"
  },
  SAMHSA: {
    name: "Substance Abuse and Mental Health Services Administration",
    url: "https://www.samhsa.gov",
    description: "Agency leading public health efforts on behavioral health"
  },
  CDC: {
    name: "Centers for Disease Control and Prevention",
    url: "https://www.cdc.gov",
    description: "National public health agency"
  },
  WHO: {
    name: "World Health Organization",
    url: "https://www.who.int",
    description: "United Nations agency for international public health"
  }
};

export default function AuthoritativeSource({ source, topic, className = "" }: AuthoritativeSourceProps) {
  const info = SOURCE_INFO[source];
  if (!info) return null;

  return (
    <div className={`flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border/50 text-sm ${className}`}>
      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
      <div>
        <span className="text-muted-foreground">Source: </span>
        <a 
          href={info.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
          data-testid={`link-source-${source.toLowerCase()}`}
        >
          {info.name}
        </a>
        {topic && (
          <span className="text-muted-foreground"> - {topic}</span>
        )}
      </div>
    </div>
  );
}

export function AuthoritativeSourcesBlock({ 
  sources, 
  className = "",
  variant = "default"
}: { 
  sources: { source: AuthoritativeSourceProps["source"]; topic?: string }[];
  className?: string;
  variant?: "default" | "section";
}) {
  const content = (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Medical References
      </h3>
      {sources.map((s, idx) => (
        <AuthoritativeSource key={idx} source={s.source} topic={s.topic} />
      ))}
    </div>
  );

  if (variant === "section") {
    return (
      <section className={`py-8 mt-8 border-t ${className}`}>
        {content}
      </section>
    );
  }

  return <div className={className}>{content}</div>;
}
