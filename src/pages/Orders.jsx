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
  const [orderModalMode, setOrderModalMode] = useState('view');

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

  const handleViewOrder = async (order, mode = 'view') => {
    setSelectedOrder(order);
    setOrderModalMode(mode);
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

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      shipping_address: {
        ...(prev.shipping_address || {}),
        [name]: value
      }
    }));
  };

  const saveOrderDetails = async () => {
    if (!selectedOrder) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          status: orderDetails.status,
          shipping_address: orderDetails.shipping_address 
        })
      });
      if (res.ok) {
        setOrders((orders || []).map(o => o.id === selectedOrder.id ? { ...o, status: orderDetails.status } : o));
        closeModal();
      } else {
        alert('Failed to update order details');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating order details');
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
                (paginatedOrders || []).map((order) => (
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
                        {(order.status || '').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order, 'view')}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors whitespace-nowrap"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleViewOrder(order, 'edit')}
                          className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md transition-colors whitespace-nowrap"
                        >
                          Edit
                        </button>
                      </div>
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
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={closeModal}></div>
            <div className="relative inline-block w-full max-w-4xl bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="w-full">
                  <div className="mt-3 text-left w-full">
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
                              {orderModalMode === 'edit' ? (
                                <select 
                                  name="status"
                                  value={orderDetails.status}
                                  onChange={handleDetailChange}
                                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="paid">Paid</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              ) : (
                                <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
                                  ${orderDetails.status === 'paid' || orderDetails.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 
                                    orderDetails.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {(orderDetails.status || '').toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                            {orderModalMode === 'edit' ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700">Street</label>
                                  <input type="text" name="street" value={orderDetails.shipping_address?.street || ''} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700">City</label>
                                  <input type="text" name="city" value={orderDetails.shipping_address?.city || ''} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700">State</label>
                                  <input type="text" name="state" value={orderDetails.shipping_address?.state || ''} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700">Pincode</label>
                                  <input type="text" name="pincode" value={orderDetails.shipping_address?.pincode || ''} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700">Phone Number</label>
                                  <input type="text" name="number" value={orderDetails.shipping_address?.number || ''} onChange={handleAddressChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600">
                                {orderDetails.shipping_address ? (
                                  <>
                                    {orderDetails.shipping_address.street}, {orderDetails.shipping_address.city},<br/>
                                    {orderDetails.shipping_address.state} - {orderDetails.shipping_address.pincode}<br/>
                                    Phone: {orderDetails.shipping_address.number}
                                  </>
                                ) : 'Not provided'}
                              </p>
                            )}
                          </div>

                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <h4 className="font-semibold text-gray-900 bg-gray-50 px-4 py-2 border-b">Items</h4>
                            <div className="divide-y divide-gray-200">
                              {(Array.isArray(orderDetails.items) ? orderDetails.items : []).map((item, idx) => (
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
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse">
                {orderModalMode === 'edit' && (
                  <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:w-auto sm:text-sm" onClick={saveOrderDetails}>
                    Save Changes
                  </button>
                )}
                <button type="button" className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm" onClick={closeModal}>
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
