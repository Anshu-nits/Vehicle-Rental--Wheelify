import HeroSection from "../components/LandingPage/HeroSection.jsx";
import Services from "../components/LandingPage/Services.jsx";
import HowItWorks from "../components/LandingPage/HowItWorksSection.jsx";
import FAQ from "../components/LandingPage/Faq.jsx";
import ContactUs from "../components/LandingPage/ContactUs.jsx";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="reviews">
        <Services />
      </section>
      <section id="about-us">
        <FAQ />
      </section>
      <section id="contact-us">
        <ContactUs />
      </section>
    </>
  );
}

export default LandingPage;