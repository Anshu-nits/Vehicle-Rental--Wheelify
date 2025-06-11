import HeroSection from "../components/LandingPage/HeroSection.jsx";
import PopularBikes from "../components/LandingPage/PopularBikesSection.jsx";
import Services from "../components/LandingPage/Services.jsx";
import HowItWorks from "../components/LandingPage/HowItWorksSection.jsx";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <PopularBikes />
      <Services />
      <HowItWorks />
    </>
  );
}

export default LandingPage;
