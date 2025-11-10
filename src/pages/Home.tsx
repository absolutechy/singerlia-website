import {
  Hero,
  Artists,
  HowItWorks,
  Genre,
  Welcome,
  WhySingerlia,
  MissionGrowth,
  PartyExperience,
  ContactSection,
  Reviews,
  PostReviewCTA,
} from "@/components/pageComponents/Home";

const Home = () => {
  return (
    <div>
      <Hero />
      <Artists />
      <HowItWorks />
      <Genre />
      <Welcome />
      <WhySingerlia />
      <MissionGrowth />
      <PartyExperience />
      <ContactSection />
      <Reviews />
      <PostReviewCTA />
    </div>
  );
};

export default Home;
