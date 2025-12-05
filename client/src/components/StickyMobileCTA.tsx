import { Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const SMS_URL = "sms:+14076351021?body=Hi%2C%20I%27d%20like%20to%20schedule%20an%20appointment%20with%20Empathy%20Health%20Clinic.";

export default function StickyMobileCTA() {
  const handleCallClick = () => {
    trackEvent("phone_click", "conversion", "sticky_bar", "3868488751");
  };

  const handleTextClick = () => {
    trackEvent("click_text_us", "engagement", "sticky_bar");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-gradient-to-t from-background via-background to-transparent pb-4 pt-6 px-4">
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-primary text-primary-foreground border border-primary-border h-14 text-base font-semibold shadow-lg"
            data-testid="button-sticky-appointment"
            asChild
          >
            <a href="/request-appointment">Request Appointment</a>
          </Button>
          <Button 
            variant="outline"
            className="h-14 px-5 shadow-lg"
            data-testid="button-sticky-text"
            asChild
          >
            <a 
              href={SMS_URL} 
              className="flex items-center"
              onClick={handleTextClick}
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </Button>
          <Button 
            variant="outline"
            className="h-14 px-5 shadow-lg"
            data-testid="button-sticky-call"
            asChild
          >
            <a 
              href="tel:3868488751" 
              className="flex items-center"
              onClick={handleCallClick}
            >
              <Phone className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
