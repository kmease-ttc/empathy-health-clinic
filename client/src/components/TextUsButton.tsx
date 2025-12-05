import { useState, useEffect } from "react";
import { MessageSquare, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { trackEvent } from "@/lib/analytics";

interface TextUsButtonProps {
  variant?: "default" | "outline" | "ghost" | "hero";
  size?: "default" | "sm" | "lg" | "icon";
  location?: string;
  className?: string;
  showLabel?: boolean;
  phoneNumber?: string;
  prefillMessage?: string;
}

const DEFAULT_PHONE = "4076351021";
const DEFAULT_PHONE_DISPLAY = "(407) 635-1021";
const DEFAULT_PREFILL = "Hi, I'd like to schedule an appointment with Empathy Health Clinic.";

export default function TextUsButton({
  variant = "outline",
  size = "default",
  location = "unknown",
  className = "",
  showLabel = true,
  phoneNumber = DEFAULT_PHONE,
  prefillMessage = DEFAULT_PREFILL,
}: TextUsButtonProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const smsUrl = `sms:+1${phoneNumber}?body=${encodeURIComponent(prefillMessage)}`;

  const handleClick = (e: React.MouseEvent) => {
    trackEvent("click_text_us", "engagement", location);

    if (!isMobile) {
      e.preventDefault();
      setIsDialogOpen(true);
    }
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(DEFAULT_PHONE_DISPLAY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  const heroClasses = variant === "hero" 
    ? "bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30" 
    : "";

  return (
    <>
      <Button
        variant={variant === "hero" ? "outline" : variant}
        size={size}
        className={`${heroClasses} ${className}`}
        asChild={isMobile}
        onClick={isMobile ? undefined : handleClick}
        data-testid={`button-text-us-${location}`}
      >
        {isMobile ? (
          <a href={smsUrl} onClick={() => trackEvent("click_text_us", "engagement", location)}>
            <MessageSquare className="w-4 h-4" />
            {showLabel && <span className="ml-2">Text Us</span>}
          </a>
        ) : (
          <span className="flex items-center">
            <MessageSquare className="w-4 h-4" />
            {showLabel && <span className="ml-2">Text Us</span>}
          </span>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Text Us to Schedule
            </DialogTitle>
            <DialogDescription>
              Send us a text message to schedule an appointment or ask a question.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Text us at</p>
                <p className="text-xl font-semibold text-foreground">{DEFAULT_PHONE_DISPLAY}</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyNumber}
                data-testid="button-copy-phone"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Texts are monitored during business hours (Mon-Fri, 9am-6pm) for scheduling and general questions only.
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                If this is an emergency, please call 911 or go to the nearest emergency room.
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              For your privacy, please do not include detailed medical information in text messages.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
