
import Carousel from "@/components/common/Carousel";
import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";

export default function Home() {
  const images: string[] = [
    "https://images.pexels.com/photos/27054236/pexels-photo-27054236/free-photo-of-a-motorcycle-parked-on-the-side-of-a-road.jpeg",
    "https://images.pexels.com/photos/18802955/pexels-photo-18802955/free-photo-of-kids-playing-soccer.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/27054236/pexels-photo-27054236/free-photo-of-a-motorcycle-parked-on-the-side-of-a-road.jpeg",
    "https://images.pexels.com/photos/18802955/pexels-photo-18802955/free-photo-of-kids-playing-soccer.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    // Add more image paths as needed
  ];

  return (
    <>
      <Header />
      <div className=" pt-7">
        <Carousel images={images} />
        {/* <SearchBar /> */}
      </div>
    </>
  );
}
