import { MapPin } from "lucide-react";

interface ServiceAreasProps {
  variant?: "inline" | "block" | "compact";
  className?: string;
  areas?: string[];
}

const DEFAULT_AREAS = [
  "Orlando",
  "Winter Park", 
  "Lake Nona",
  "UCF Area",
  "Downtown Orlando",
  "Altamonte Springs",
  "Maitland",
  "Casselberry",
  "Lake Mary",
  "Sanford"
];

export default function ServiceAreas({ 
  variant = "block", 
  className = "",
  areas = DEFAULT_AREAS
}: ServiceAreasProps) {
  if (variant === "inline") {
    return (
      <p className={`text-muted-foreground ${className}`} data-testid="service-areas-inline">
        <MapPin className="inline-block h-4 w-4 mr-1 text-primary" />
        Serving patients in {areas.slice(0, -1).join(", ")}, and {areas[areas.length - 1]}.
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`} data-testid="service-areas-compact">
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-sm text-muted-foreground">
          Serving: {areas.join(" • ")}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-muted/50 border rounded-lg p-6 ${className}`} data-testid="service-areas-block">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Service Areas</h3>
      </div>
      <p className="text-muted-foreground mb-4">
        Our board-certified psychiatrists proudly serve patients throughout Central Florida:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {areas.map((area) => (
          <div 
            key={area}
            className="bg-background border rounded-md px-3 py-2 text-sm text-center text-foreground"
            data-testid={`service-area-${area.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {area}
          </div>
        ))}
      </div>
    </div>
  );
}
