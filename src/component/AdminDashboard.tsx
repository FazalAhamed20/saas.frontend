
import { ReactTyped } from "react-typed";
import { Player } from "@lottiefiles/react-lottie-player";
import { useTheme } from '../context/ThemeContext';


const AdminDashboard = () => {

    const { darkMode } = useTheme();
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-500">
            <ReactTyped
              strings={['Inventory Management', 'Stock Control', 'Asset Tracking']}
              typeSpeed={40}
              backSpeed={50}
              loop
            />
          </h1>
       
        </div>
    

     
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        

       
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg mb-8`}>
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/2">
            <Player
            autoplay
            loop
            src="https://lottie.host/c4e00ee9-1841-4178-8db6-515a25bee321/WcMPGqyFCe.json" 
            style={{ height: "80%", width: "80%" }}
          />
            </div>
            <div className="sm:w-1/2 p-6">
            <Player
            autoplay
            loop
            src="https://lottie.host/97e02383-157a-44e8-82b0-2402650cbc2e/JoeUJg1Qhz.json" 
            style={{ height: "40%", width: "40%" }}
          />
              <h2 className="text-2xl font-bold mb-4">Inventory  <span className="text-blue-500">Overview </span></h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Get a comprehensive view of your inventory status, including stock levels, reorder points, and item locations.
                Easily identify trends and make data-driven decisions to optimize your inventory management.
              </p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                <a href="/admintable">Go to inventory</a>
                
              </button>
            </div>
          </div>
        </div>

       
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden sm:rounded-lg`}>
          <div className="flex flex-col sm:flex-row-reverse">
            <div className="sm:w-1/2">
            <Player
            autoplay
            loop
            src="https://lottie.host/f519fb44-a7e2-4dfd-ab2a-fa6f616b6736/CNdNOGB7wK.json" 
            style={{ height: "80%", width: "80%" }}
          />
            </div>
            <div className="sm:w-1/2 p-6">
              <h2 className="text-2xl font-bold mb-4">Supplier <span className="text-blue-500">Management </span></h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Streamline your supplier relationships with our integrated supplier management system. 
                Track performance, manage contracts, and automate reordering processes to ensure a smooth supply chain.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              <a href="/admintable">Manage inventory</a>
              </button>
              <Player
            autoplay
            loop
            src="https://lottie.host/66267a81-99ff-4c18-a4f3-417d5bc24504/CvJ6GcAl4p.json" 
            style={{ height: "40%", width: "40%" }}
          />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;