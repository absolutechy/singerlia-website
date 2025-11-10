import { Button, SearchBar } from "@/components/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserOneAvatar from "@/assets/images/common/user1.png";
import UserTwoAvatar from "@/assets/images/common/user2.png";
import UserThreeAvatar from "@/assets/images/common/user3.png";
import UserFourAvatar from "@/assets/images/common/user4.png";
import { Dot } from "lucide-react";
import { useNavigate } from "react-router";
import SocialIcons from "./SocialIcons";
import VerifiedArtistsLogo from "./VerifiedArtists";

const users = [
  { id: 1, src: UserOneAvatar, alt: "@user1", fallback: "U1" },
  { id: 2, src: UserTwoAvatar, alt: "@user2", fallback: "U2" },
  { id: 3, src: UserThreeAvatar, alt: "@user3", fallback: "U3" },
  { id: 4, src: UserFourAvatar, alt: "@user4", fallback: "U4" },
];

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="px-5">
      <SearchBar
        onSearch={(data) => {
          const params = new URLSearchParams();
          if (data.singerName) params.set("s", data.singerName);
          if (data.date) params.set("date", data.date);
          // You can expand to pass city/duration/pricing if needed
          navigate(`/search?${params.toString()}`);
        }}
      />
      <div className="flex flex-col lg:flex-row gap-y-3 items-center justify-center mt-5 lg:mt-10 gap-x-5 outfit">
        <Button
          variant="default"
          size="large"
          className="!text-primary bg-white border border-primary mt-4 lg:mt-0"
        >
          See How It Works
        </Button>
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 mt-4 lg:mt-0">
          {users.map((user) => (
            <Avatar key={user.id} className="w-10 h-10" >
              <AvatarImage src={user.src} alt="@shadcn"  />
              <AvatarFallback>{user.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex flex-col lg:flex-row gap-x-2 items-center mt-4">
        <span>10.5k active users</span>
        <Dot size={40}/>
        <span>Trusted by customers worldwide</span>
        </div>
      </div>
      <SocialIcons />
      <VerifiedArtistsLogo />
    </div>
  );
};

export default Hero;
