
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import Testimonials from "@/components/Testimonials";

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
      <div className=" pt-16">
        <Carousel images={images} />
        {/* <SearchBar /> */}
      </div>  
      <Testimonials/>    
      <Footer />
    </>
  );
}
