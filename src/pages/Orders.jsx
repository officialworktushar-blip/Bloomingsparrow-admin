import { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.bloomingsparrow.com';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Fetch user's orders to get details of this specific order
      const res = await fetch(`${API_URL}/api/admin/users/${order.user_id}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const specificOrder = data.find(o => o.id === order.id);
        setOrderDetails(specificOrder);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleStatusChange = async (e) => {
    if (!selectedOrder) return;
    const newStatus = e.target.value;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrderDetails(prev => ({ ...prev, status: newStatus }));
        setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Management</h2>
          <p className="mt-1 text-sm text-slate-500">View and track all customer orders across the store.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      #{String(order.id).slice(0,8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{order.customer_name}</div>
                      <div className="text-sm text-slate-500">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${order.status === 'paid' || order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors whitespace-nowrap"
                      >
                        View / Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalItems={orders.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start w-full">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Order Details: #{String(selectedOrder?.id).slice(0,8)}
                    </h3>
                    <div className="mt-4">
                      {loadingDetails ? (
                        <div className="flex justify-center my-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                      ) : orderDetails ? (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Customer</p>
                              <p className="text-sm">{selectedOrder.customer_name}</p>
                              <p className="text-sm text-gray-500">{selectedOrder.customer_email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Payment ID</p>
                              <p className="text-sm font-mono">{orderDetails.razorpay_order_id || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Status</p>
                              <select 
                                value={orderDetails.status}
                                onChange={handleStatusChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {orderDetails.shipping_address && (
                            <div className="border border-gray-200 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                              <p className="text-sm text-gray-600">
                                {orderDetails.shipping_address.street}, {orderDetails.shipping_address.city},<br/>
                                {orderDetails.shipping_address.state} - {orderDetails.shipping_address.pincode}<br/>
                                Phone: {orderDetails.shipping_address.number}
                              </p>
                            </div>
                          )}

                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <h4 className="font-semibold text-gray-900 bg-gray-50 px-4 py-2 border-b">Items</h4>
                            <div className="divide-y divide-gray-200">
                              {orderDetails.items?.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4">
                                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                                    <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden">
                                      {item.image && <img src={`${API_URL}/${item.image}`} alt={item.title} className="h-full w-full object-cover" />}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    ₹{item.price}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 text-right">
                              <span className="text-sm font-medium text-gray-700">Total Amount: </span>
                              <span className="text-lg font-bold text-gray-900">₹{selectedOrder.amount}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Details not found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
