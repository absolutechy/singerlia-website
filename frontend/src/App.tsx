import { Header } from "@/components/common";
import AppRouter from "@/router/AppRouter";
import landingBgImage from "@/assets/images/landingtopbg.png";
import Footer from "./components/layout/Footer";


const App = () => {
  return (
    <>
    <div className="w-full pt-48 space-y-8 bg-cover bg-center h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
      style={{
        backgroundImage: `url(${landingBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}>
      <Header />
<<<<<<< HEAD
      <AppRouter />
      <Footer/>
=======
        <AppRouter />
>>>>>>> 6d7d0620216222355f874ecdffe5e4f8f04f902c
    </div>
        </>
  );
};

export default App;
