import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';



const Footer: React.FC= () => {
  const [email, setEmail] = useState('');
  const { darkMode } = useTheme();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log('Signed up with email:', email);
    setEmail('');
  };

  return (
    <footer className={`mt-16 py-12 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4">InventoryPro</h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Streamline your inventory management with our cutting-edge solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                <Facebook size={24} />
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                <Twitter size={24} />
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                <Instagram size={24} />
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
                <Linkedin size={24} />
              </a>
            </div>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li><a href="#" className="hover:underline">Home</a></li>
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Services</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>123 Inventory Street</li>
              <li>Stockton, CA 95206</li>
              <li>Email: info@inventorypro.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-grow px-3 py-2 rounded-l-md focus:outline-none ${
                    darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
                required
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-r-md ${
                    darkMode
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
        <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'} text-center`}>
          <p>&copy; 2024 InventoryPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;