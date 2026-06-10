import { useState } from 'react';
import Pagination from '../components/Pagination';

const Support = () => {
  // Mock Support Tickets
  const [tickets] = useState([
    { id: 'TKT-1029', user: 'Sarah Jenkins', email: 'sarah.j@example.com', subject: 'Late Delivery', status: 'Open', priority: 'High', date: '2026-06-10' },
    { id: 'TKT-1028', user: 'Raj Patel', email: 'raj.p@example.com', subject: 'Refund Request', status: 'In Progress', priority: 'Medium', date: '2026-06-09' },
    { id: 'TKT-1027', user: 'Maria Garcia', email: 'maria.g@example.com', subject: 'Product Enquiry: Rogan Art', status: 'Closed', priority: 'Low', date: '2026-06-08' },
    { id: 'TKT-1026', user: 'David Kim', email: 'dkim@example.com', subject: 'Damaged Item Received', status: 'Open', priority: 'High', date: '2026-06-08' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-rose-100 text-rose-800';
      case 'In Progress': return 'bg-amber-100 text-amber-800';
      case 'Closed': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-rose-600';
      case 'Medium': return 'text-amber-600';
      case 'Low': return 'text-emerald-600';
      default: return 'text-slate-600';
    }
  };

  const paginatedTickets = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support Tickets</h2>
          <p className="mt-1 text-sm text-slate-500">Manage customer inquiries and resolve issues.</p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{ticket.user}</div>
                    <div className="text-sm text-slate-500">{ticket.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                    {ticket.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {ticket.date ? new Date(ticket.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage} 
          totalItems={tickets.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default Support;
