import {  Package, BarChart2, DollarSign, TrendingUp } from 'lucide-react';
import { Player } from "@lottiefiles/react-lottie-player";
import { useTheme } from '../context/ThemeContext';
import { useCallback, useEffect, useState } from 'react';
import { fetchAllItem } from '../redux/actions/InventoryActions';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/Store';

import Footer from './Footer';
import AdminDashboard from './AdminDashboard';

const ShopkeeperInventoryHomepage = () => {
    const { darkMode } = useTheme();
    const [products, setProducts] = useState<any[]>([]); 
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [lowStockCount, setLowStockCount] = useState<number>(0);
  
    const userId = useSelector((state: any) => state?.auth?.user?.user?.UserId);
    const isAdmin = useSelector((state: any) => state?.auth?.user?.user?.isAdmin);
    const dispatch: AppDispatch = useDispatch();
  
    const fetchAllProduct = useCallback(async () => {
      const response = await dispatch(fetchAllItem({ userId }));
      if (response.payload?.success) {
        const fetchedProducts = response.payload.data?.data;
        setProducts(fetchedProducts);
  
        let totalQty = 0;
        let totalVal = 0;
        let lowStock = 0;
        console.log(fetchedProducts);
        
        fetchedProducts.forEach((product: any) => {
            console.log(product.quantity);
            
          totalQty += parseInt(product.quantity);
          totalVal += parseInt(product.quantity) * parseInt(product.price);
  
          if (product.quantity < 20) {
            lowStock += 1;
          }
        });
        
        setTotalProducts(totalQty);
        setTotalValue(totalVal);
        setLowStockCount(lowStock);
      }
    }, [dispatch, userId]);
  
    useEffect(() => {
      fetchAllProduct();
    }, [fetchAllProduct]);

   

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        {isAdmin ? (
            <AdminDashboard/>
        ):(

        
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Inventory <span className="text-blue-500">Overview</span></h2>
          <p className="text-xl mb-6 text-blue-500">Get a quick glance at your inventory status</p>
          <Player
              autoplay
              loop
              src="https://lottie.host/8b96b5f1-d1d9-470c-8ec0-ae3404c88eb0/cYr3b6uVkU.json" 
              style={{ height: "30%", width: "30%" }}
            />
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<Package className="w-8 h-8 text-blue-500" />}
            title="Total Products"
            value={products?.length}
          />
          <StatCard
            icon={<BarChart2 className="w-8 h-8 text-green-500" />}
            title="Total Quantity"
            value={totalProducts}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-yellow-500" />}
            title="Low Stock Items"
            value={lowStockCount}
          />
          <StatCard
            icon={<DollarSign className="w-8 h-8 text-purple-500" />}
            title="Total Value"
            value={`₹${totalValue}`}
          />
        </section>

      

       
        <section className="mb-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
          <Player
              autoplay
              loop
              src="https://lottie.host/a2bf7195-6a5b-437c-a491-07f619ba170b/vXri96nvzc.json" 
              style={{ height: "80%", width: "80%" }}
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h2 className="text-2xl font-bold mb-4">About <span className="text-blue-500">Inventory Pro</span></h2>
            <p className="text-lg mb-4 ">
              Inventory Pro is your all-in-one solution for efficient inventory management. With our powerful tools and intuitive interface, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 ">
              <li>Track product quantities in real-time</li>
              <li>Set up automated reordering</li>
              <li>Generate detailed reports and analytics</li>
              <li>Integrate with your e-commerce platforms</li>
              <li>Optimize stock levels to reduce costs</li>
            </ul>
          </div>
        </section>
      </main>
        )}

      <Footer/>
    </div>
  );
};

const StatCard = ({ icon, title, value }:any) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="text-lg font-semibold ml-2">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-co">{value}</p>
  </div>
);

export default ShopkeeperInventoryHomepage;