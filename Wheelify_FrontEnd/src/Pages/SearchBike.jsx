import SearchForm from "../components/SearchBike/SearchForm.jsx";
import PopularBikes from "../components/LandingPage/PopularBikesSection.jsx";
import Services from "../components/LandingPage/Services.jsx";
import HowItWorks from "../components/LandingPage/HowItWorksSection.jsx";

function SearchBike() {
  return (
    <>
      <SearchForm />
      <PopularBikes />
      <Services />
      <HowItWorks />
    </>
  );
}

export default SearchBike;
