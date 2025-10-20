import Artists from "@/components/pageComponents/Home/Artists";
import ContactSection from "@/components/pageComponents/Home/ContactSection";
import Genre from "@/components/pageComponents/Home/Genre";
import Hero from "@/components/pageComponents/Home/Hero";
import HowItWorks from "@/components/pageComponents/Home/HowItWorks";
import MissionGrowth from "@/components/pageComponents/Home/MissionGrowth";
import PartyExperience from "@/components/pageComponents/Home/PartyExperience";
import PostReviewCTA from "@/components/pageComponents/Home/PostReviewCTA";
import Reviews from "@/components/pageComponents/Home/Reviews";
import Welcome from "@/components/pageComponents/Home/Welcome";
import Why from "@/components/pageComponents/Home/Why";

const Home = () => {

  return (
    <div>
      <Hero />
      <Artists />
      <HowItWorks />
      <Genre />
      <Welcome />
      <Why />
      <MissionGrowth />
      <PartyExperience />
      <ContactSection />
      <Reviews />
      <PostReviewCTA />
    </div>
  );
};

export default Home;
