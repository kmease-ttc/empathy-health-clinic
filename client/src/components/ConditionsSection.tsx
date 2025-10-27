import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export default function ConditionsSection() {
  const conditions = [
    "Anxiety disorders, such as generalized anxiety disorder (GAD), social anxiety disorder (SAD) or phobias",
    "Depression and depressive disorders",
    "Personality disorders, such as antisocial personality disorder (ASPD) or borderline personality disorder (BPD)",
    "Conditions on the schizophrenia spectrum, such as schizoaffective disorders"
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-card">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-center mb-6">
          Trusted Therapist & Psychiatrist Orlando for All Mental Health Needs
        </h2>
        <p className="text-lg md:text-xl text-center text-muted-foreground mb-12 max-w-4xl mx-auto">
          Our mental health clinic providers specialize in over 150 conditions and disorders. In addition to traditional, one-on-one sessions, we also offer couples therapy to help address relationship and communication issues.
        </p>
        
        <div className="max-w-3xl mx-auto mb-12">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
            We can help you treat and manage the following:
          </h3>
          <ul className="space-y-4">
            {conditions.map((condition, index) => (
              <li key={index} className="flex gap-3" data-testid={`condition-${index}`}>
                <span className="text-primary mt-1">•</span>
                <span className="text-base text-foreground leading-relaxed">{condition}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="px-8 py-6 text-lg rounded-full"
            data-testid="button-call-clinic"
            onClick={() => console.log('Call clicked: 386-848-8751')}
          >
            <Phone className="w-5 h-5 mr-2" />
            386-848-8751
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg rounded-full"
            data-testid="button-book-appointment"
            onClick={() => console.log('Book appointment clicked')}
          >
            Book an Appointment
          </Button>
        </div>
      </div>
    </section>
  );
}
