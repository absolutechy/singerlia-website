import ArtistBgText from "@/assets/images/common/Artistshd.png";
import SingerOne from "@/assets/images/common/Singer1.png";
import SingerTwo from "@/assets/images/common/Singer2.png";
import SingerThree from "@/assets/images/common/Singer3.png";
import Marquee from "react-fast-marquee";
import SingerCircle from "./SingerCircle";

const users = [
  { id: 1, src: SingerOne },
  { id: 2, src: SingerTwo },
  { id: 3, src: SingerThree },
  { id: 4, src: SingerOne },
  { id: 5, src: SingerTwo },
  { id: 6, src: SingerThree },
  { id: 7, src: SingerOne },
  { id: 8, src: SingerTwo },
  { id: 9, src: SingerThree },
  { id: 10, src: SingerOne },
  { id: 11, src: SingerTwo },
  { id: 12, src: SingerThree },
  { id: 13, src: SingerOne },
  { id: 14, src: SingerTwo },
  { id: 15, src: SingerThree },
  { id: 16, src: SingerOne },
  { id: 17, src: SingerTwo },
  { id: 18, src: SingerThree },
  { id: 19, src: SingerOne },
  { id: 20, src: SingerTwo },
];

const VerifiedArtists = () => {
  return (
    <div className="flex flex-col items-center p-4 lg:p-8">
      <div className="relative flex items-center justify-center">
        <img src={ArtistBgText} alt="Verified Artists" className="h-28 object-cover" />
        <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center">
          <h2 className="font-bold text-primary text-4xl sm:text-5xl lg:text-6xl">
            Verified Artists
          </h2>
        </div>
      </div>
      <span className="paragraph text-gray-500 mt-5">
        The finest artists – all in one platform.
      </span>

      <div className="mt-10 py-2 relative -mx-20 w-full">
        <Marquee gradient={true} speed={40} gradientWidth={50}>
          {users.map((user) => (
            <div key={user.id} className="px-1 lg:px-4">
              <SingerCircle imageUrl={user.src} />
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
};

export default VerifiedArtists;
