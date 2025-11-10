import {
  Hero,
  Artists,
  HowItWorks,
  Genre,
  Welcome,
  WhySingerlia,
  MissionGrowth,
  PartyExperience,
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
      <Reviews />
      <PostReviewCTA />
    </div>
  );
};

export default Home;
