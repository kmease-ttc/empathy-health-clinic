import LandingPageTemplate from "@/components/LandingPageTemplate";
import { psychiatristForDepressionNearMeConfig } from "@/config/landingPageConfigs";
import ReviewSchema, { PAGE_TESTIMONIALS } from "@/components/ReviewSchema";

export default function PsychiatristForDepressionNearMe() {
  return (
    <>
      <LandingPageTemplate config={psychiatristForDepressionNearMeConfig} />
      <ReviewSchema 
        reviews={PAGE_TESTIMONIALS["psychiatrist-for-depression-near-me"]} 
        pageIdentifier="psychiatrist-for-depression-near-me" 
      />
    </>
  );
}
