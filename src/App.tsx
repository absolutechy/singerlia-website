import { Header } from "@/components/common";
import AppRouter from "@/router/AppRouter";
import landingBgImage from "@/assets/images/common/landingtopbg.png";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <>
      <Toaster position="top-right" style={{ background: 'white', borderRadius: "20px" }} />
      <ScrollToTop />
      <div
        className="w-full pt-40 lg:pt-48 space-y-8 bg-cover bg-center h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
        style={{
          backgroundImage: `url(${landingBgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <Header />
        <AppRouter />
        <Footer />
      </div>
    </>
  );
};

export default App;
