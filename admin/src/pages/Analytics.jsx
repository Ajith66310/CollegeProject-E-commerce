import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Analytics() {
  const [data, setData] = useState({ totalProducts: 0, totalUsers: 0, totalRevenue: 0, salesData: [] });

  useEffect(() => {
    axios.get(backendUrl + "/api/analytics")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching analytics data:", error));
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h2 className="text-lg font-semibold">Products in Stock</h2>
          <p className="text-2xl font-bold">{data.totalProducts}</p>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold">{data.totalUsers}</p>
        </div>

        <div className="bg-white p-4 shadow-md rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">₹{data.totalRevenue}</p>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 md:p-6 shadow-md rounded-lg overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4 text-center md:text-left">Sales Revenue Over Time</h2>
        <div className="w-full flex justify-center">
          <LineChart width={800} height={400} data={data.salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#4CAF50" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}
