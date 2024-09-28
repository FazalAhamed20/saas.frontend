import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AppDispatch } from '../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../redux/actions/InventoryActions';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Order {
  _id: string;
  name: string;
  category: string;
  billQuantity: number;
  price:number;
  createdAt: string;
}

interface GroupedOrders {
  [key: string]: Order[];
}

const RecentOrders: React.FC = () => {
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrders>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const { darkMode } = useTheme();
  const dispatch: AppDispatch = useDispatch();
  const userId = useSelector((state: any) => state?.auth?.user?.user?.UserId);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await dispatch(fetchOrders(userId));
        groupOrdersByMinute(response.payload.data);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };

    fetchRecentOrders();
  }, [dispatch, userId]);

  const groupOrdersByMinute = (orders: Order[]) => {
    const grouped = orders.reduce((acc: GroupedOrders, order: Order) => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});
    setGroupedOrders(grouped);
  };

  const orderTimes = Object.keys(groupedOrders).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orderTimes.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={`w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow-md rounded-lg p-4`}>
      <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
      {currentOrders.map((dateTime) => (
        <div key={dateTime} className="mb-6">
          <h3 className="text-lg font-medium mb-2">{dateTime}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  {['Name', 'Category', 'Quantity','Price'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {groupedOrders[dateTime].map((order: Order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{order.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.billQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">₹{order.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          } ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span>Page {currentPage} of {Math.ceil(orderTimes.length / ordersPerPage)}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastOrder >= orderTimes.length}
          className={`px-4 py-2 rounded ${
            darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
          } ${indexOfLastOrder >= orderTimes.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RecentOrders;