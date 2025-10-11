import { Header } from "@/components/common"
import AppRouter from "@/router/AppRouter"
import landingBgImage from '@/assets/images/landingtopbg.png'

const App = () => {

  return (
    
    <div 
        className="w-full space-y-8 bg-cover bg-center min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
        style={{ backgroundImage: `url(${landingBgImage})`, backgroundSize: 'cover', backgroundPosition: 'top' }}
      >
      <Header />
      <AppRouter />
    </div>
  )
}

export default App
