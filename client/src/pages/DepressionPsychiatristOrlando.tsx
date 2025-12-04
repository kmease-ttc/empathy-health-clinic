import LandingPageTemplate from "@/components/LandingPageTemplate";
import { depressionPsychiatristOrlandoConfig } from "@/config/landingPageConfigs";
import ReviewSchema, { PAGE_TESTIMONIALS } from "@/components/ReviewSchema";

export default function DepressionPsychiatristOrlando() {
  return (
    <>
      <LandingPageTemplate config={depressionPsychiatristOrlandoConfig} />
      <ReviewSchema 
        reviews={PAGE_TESTIMONIALS["depression-psychiatrist-orlando"]} 
        pageIdentifier="depression-psychiatrist-orlando" 
      />
    </>
  );
}
