import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, LogOut, Package, ChevronRight, Users as UsersIcon, LifeBuoy } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10 border-r border-slate-100`}>
        <div 
          className={`p-6 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} cursor-pointer`}
          onClick={() => setIsCollapsed(!isCollapsed)}
          title="Toggle Sidebar"
        >
          <img src="/logo.png" alt="Logo" className="h-10 w-10 shrink-0 object-contain mix-blend-multiply" />
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">Blooming Sparrow</h1>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Admin Portal</p>
            </div>
          )}
        </div>
        
        <div className={`flex-1 overflow-y-auto py-6 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {!isCollapsed && <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 whitespace-nowrap">Main Menu</p>}
          <nav className="space-y-1.5">
            <Link 
              to="/" 
              title={isCollapsed ? 'Dashboard' : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <LayoutDashboard size={20} className={location.pathname === '/' ? 'text-indigo-100' : 'text-slate-400'} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">Dashboard</span>}
              </div>
              {!isCollapsed && location.pathname === '/' && <ChevronRight size={16} className="text-indigo-300" />}
            </Link>

            <Link 
              to="/orders" 
              title={isCollapsed ? 'Orders' : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/orders' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <ShoppingBag size={20} className={location.pathname === '/orders' ? 'text-indigo-100' : 'text-slate-400'} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">Orders</span>}
              </div>
              {!isCollapsed && location.pathname === '/orders' && <ChevronRight size={16} className="text-indigo-300" />}
            </Link>

            <Link 
              to="/products" 
              title={isCollapsed ? 'Products' : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/products' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <Package size={20} className={location.pathname === '/products' ? 'text-indigo-100' : 'text-slate-400'} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">Products</span>}
              </div>
              {!isCollapsed && location.pathname === '/products' && <ChevronRight size={16} className="text-indigo-300" />}
            </Link>

            <Link 
              to="/users" 
              title={isCollapsed ? 'Users' : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/users' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <UsersIcon size={20} className={location.pathname === '/users' ? 'text-indigo-100' : 'text-slate-400'} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">Users</span>}
              </div>
              {!isCollapsed && location.pathname === '/users' && <ChevronRight size={16} className="text-indigo-300" />}
            </Link>

            <Link 
              to="/support" 
              title={isCollapsed ? 'Support' : ''}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-xl transition-all duration-200 ${location.pathname === '/support' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <LifeBuoy size={20} className={location.pathname === '/support' ? 'text-indigo-100' : 'text-slate-400'} />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">Support</span>}
              </div>
              {!isCollapsed && location.pathname === '/support' && <ChevronRight size={16} className="text-indigo-300" />}
            </Link>
          </nav>
        </div>

        <div className={`p-4 border-t border-slate-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={handleLogout} 
            title={isCollapsed ? 'Sign Out' : ''}
            className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-3'} py-3 w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors font-medium group`}
          >
            <LogOut size={20} className="text-red-400 group-hover:text-red-600 transition-colors shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        {/* Subtle top gradient */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>
        <div className="p-8 w-full relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
