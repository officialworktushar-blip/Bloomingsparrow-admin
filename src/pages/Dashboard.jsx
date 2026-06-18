import { useEffect, useState } from 'react';
import { Users, IndianRupee, ShoppingBag, ArrowUpRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('https://api.bloomingsparrow.com/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-slate-500">Here is what's happening with your store today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Orders (Paid)</p>
              <h3 className="text-3xl font-bold text-slate-900">{metrics.totalOrders}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl">
              <ShoppingBag size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight size={16} className="mr-1" /> 12%
            </span>
            <span className="text-slate-400 ml-2">vs last month</span>
          </div>
        </div>
        
        {/* Total Revenue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-emerald-50 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold text-slate-900">₹{metrics.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <IndianRupee size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <TrendingUp size={16} className="mr-1" /> 8.4%
            </span>
            <span className="text-slate-400 ml-2">vs last month</span>
          </div>
        </div>
        
        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-purple-50 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-slate-900">{metrics.totalUsers}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-600 rounded-xl">
              <Users size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div className="relative z-10 mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 font-medium">
              <ArrowUpRight size={16} className="mr-1" /> 3.2%
            </span>
            <span className="text-slate-400 ml-2">vs last month</span>
          </div>
        </div>
      </div>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 p-8 rounded-2xl shadow-lg relative overflow-hidden text-white">
        {/* Decorative background vectors */}
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
            <polygon points="0,100 100,0 100,100" />
          </svg>
        </div>
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase mb-3">
            System Status: Online
          </div>
          <h3 className="text-2xl font-bold mb-2">Welcome to your Admin Portal</h3>
          <p className="text-indigo-100 max-w-2xl leading-relaxed">
            This dashboard gives you a high-level overview of Blooming Sparrow's metrics. From here you can track sales performance, manage incoming orders, and oversee your product catalog in real-time.
          </p>
          <div className="mt-6 flex gap-4">
            <button className="px-5 py-2.5 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
              View Recent Orders
            </button>
            <button className="px-5 py-2.5 bg-indigo-800/50 border border-indigo-500/30 text-white font-medium rounded-lg hover:bg-indigo-800 transition-colors">
              Manage Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
