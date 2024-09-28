import React from 'react';
import { motion } from 'framer-motion';
import {  Package, BarChart2, Users, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Player } from "@lottiefiles/react-lottie-player";
import { ReactTyped } from "react-typed";
import Footer from './Footer';
import { Link } from 'react-router-dom';

const InventoryLandingPage: React.FC = () => {
    const { darkMode } = useTheme();
  const features = [
    { icon: Package, title: 'Stock Management', description: 'Keep track of your inventory in real-time' },
    { icon: BarChart2, title: 'Analytics', description: 'Gain insights with powerful reporting tools' },
    { icon: Users, title: 'Multi-user Access', description: 'Collaborate with your team seamlessly' },
    { icon: Settings, title: 'Customization', description: 'Tailor the system to your specific needs' },
  ];
  const sentence = "Transform your inventory management today!";

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
  

      <main className="container mx-auto px-4 py-12">
        <motion.section 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Streamline Your Inventory Management</h2>
          <p className="text-xl md:text-2xl mb-8">Efficient. Intuitive. Powerful.</p>
          <motion.button 
            className={`px-6 py-3 rounded-full text-lg font-semibold ${
                darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={'/signup'}>
            Get Started
            </Link>
            
          </motion.button>
        </motion.section>

        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <feature.icon size={48} className="mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className={`${darkMode? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section 
          className="flex flex-col md:flex-row items-center gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="w-full md:w-1/2">
          <Player
              autoplay
              loop
              src="https://lottie.host/8fbf51de-8cbd-418a-831b-1b63aecf118a/Nzwtithw9o.json" 
              style={{ height: "80%", width: "80%" }}
            />
           
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {sentence.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </h2>
            <p className={`text-lg mb-6 ${darkMode? 'text-gray-300' : 'text-gray-600'}`}>
              Our cutting-edge inventory management system provides real-time insights, streamlines your operations, and boosts your bottom line.
            </p>
            <motion.button 
              className={`px-6 py-3 rounded-full text-lg font-semibold ${
                darkMode ? 'bg-green-500 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'
              } text-white transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                 <Link to={'/signup'}>
                 Learn More
            </Link>
             
            </motion.button>
          </div>
        </motion.section>

        <motion.section 
          className="flex flex-col md:flex-row items-center gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Boost Your:
            </h2>
            <div className="text-2xl md:text-3xl font-semibold mb-6 h-20 md:h-24">
              <ReactTyped
                strings={[
                  'Efficiency',
                  'Accuracy',
                  'Profitability',
                  'Customer Satisfaction'
                ]}
                typeSpeed={40}
                backSpeed={50}
                loop
                className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
              />
            </div>
            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              InventoryPro empowers businesses to optimize their inventory processes, 
              leading to improved performance across all key metrics.
            </p>
            <motion.button 
              className={`px-6 py-3 rounded-full text-lg font-semibold ${
                darkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-purple-600 hover:bg-purple-700'
              } text-white transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
                 <Link to={'/signup'}>
                 Start Optimizing
            </Link>
             
            </motion.button>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
          <Player
              autoplay
              loop
              src="https://lottie.host/e8c75b79-29c6-47e2-b1e9-194aade83c01/cspxxfGPGk.json" 
              style={{ height: "80%", width: "80%" }}
            />
          </div>
        </motion.section>
      </main>
      <Footer />
      
    </div>
  );
};

export default InventoryLandingPage;