import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { backendUrl } from '../App';
import CountUp from './CountUp';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    productsByCategory: [],
    salesData: []
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/analytics`);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalytics();
  }, []);

  const categories = ['Fruits', 'Vegetables', 'Spices', 'Drinks', 'Icecream', 'Snacks'];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <CountUp to={analyticsData.totalProducts} className="text-2xl font-bold text-green-600" />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <CountUp to={analyticsData.totalUsers} className="text-2xl font-bold text-green-600" />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <span className="text-2xl font-bold text-green-600">₹<CountUp to={analyticsData.totalRevenue} /></span>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Products by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => {
            const productData = analyticsData.productsByCategory.find(item => item._id.toLowerCase() === category.toLowerCase());
            return (
              <div key={category} className="text-center">
                <h3 className="font-semibold">{category}</h3>
                <CountUp to={productData ? productData.count : 0} className="text-green-600 font-bold" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Sales Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analyticsData.salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#4CAF50" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;