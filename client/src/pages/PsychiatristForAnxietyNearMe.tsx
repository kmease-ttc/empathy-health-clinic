import LandingPageTemplate from "@/components/LandingPageTemplate";
import { psychiatristForAnxietyNearMeConfig } from "@/config/landingPageConfigs";
import ReviewSchema, { PAGE_TESTIMONIALS } from "@/components/ReviewSchema";

export default function PsychiatristForAnxietyNearMe() {
  return (
    <>
      <LandingPageTemplate config={psychiatristForAnxietyNearMeConfig} />
      <ReviewSchema 
        reviews={PAGE_TESTIMONIALS["psychiatrist-for-anxiety-near-me"]} 
        pageIdentifier="psychiatrist-for-anxiety-near-me" 
      />
    </>
  );
}
