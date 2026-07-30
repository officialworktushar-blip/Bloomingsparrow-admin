import { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import { X, Pencil, Trash2, Upload } from 'lucide-react';
import Swal from 'sweetalert2';

const MAX_IMAGES = 4;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [formData, setFormData] = useState({
    id: '', title: '', category: '', category_label: '', price: '', 
    images: [], description: '', material: '', dimensions: '', origin: '', artisan: '', order: 0
  });

  const API_URL = import.meta.env.VITE_API_URL || 'https://api.bloomingsparrow.com';

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setFormData({
        ...product,
        images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
        order: product.order ?? 0
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: '', title: '', category: '', category_label: '', price: '', 
        images: [], description: '', material: '', dimensions: '', origin: '', artisan: '', order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';
    
    setUploadingIndex(index);
    const uploadData = new FormData();
    uploadData.append('image', file);
    
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${API_URL}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });
      
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => {
          const newImages = [...(prev.images || [])];
          newImages[index] = data.imageUrl;
          return { ...prev, images: newImages };
        });
      } else {
        const errData = await res.json();
        Swal.fire('Error', `Image upload failed: ${errData.error || res.statusText}`, 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error uploading image', 'error');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      while (newImages.length < MAX_IMAGES) newImages.push(null);
      const cleaned = newImages.filter(Boolean);
      return { ...prev, images: cleaned.length > 0 ? cleaned : [] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = isEditing 
        ? `${API_URL}/api/admin/products/${formData.id}`
        : `${API_URL}/api/admin/products`;
      
      const method = isEditing ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        images: formData.images.filter(Boolean)
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts(); // Refresh the list
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Product ${isEditing ? 'updated' : 'added'} successfully!`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire('Error', 'Failed to save product', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'An error occurred', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          fetchProducts();
          Swal.fire({
            title: 'Deleted!',
            text: 'Your product has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          Swal.fire('Error', 'Failed to delete product', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'An error occurred while deleting', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Product Catalog</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your inventory, pricing, and product details.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                          {(product.images?.[0] || product.image) ? (
                            <img src={`${API_URL}/${product.images?.[0] || product.image}`} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-300 font-bold text-xs">IMG</div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-slate-900">{product.title}</div>
                          <div className="text-sm text-slate-500 max-w-xs truncate">{product.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {product.category_label || product.category || 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-mono text-slate-600">
                      {product.order ?? '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        In Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="cursor-pointer p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-900 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="cursor-pointer p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-900 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
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
          totalItems={products.length} 
          itemsPerPage={itemsPerPage} 
          onPageChange={setCurrentPage} 
        />
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-slate-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Product ID</label>
                  <input required name="id" value={formData.id} onChange={handleChange} disabled={isEditing} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 text-sm" placeholder="e.g. r1" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Product Name" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Category Slug</label>
                  <input required name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="e.g. rogan-art" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Category Label</label>
                  <input name="category_label" value={formData.category_label || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="e.g. Rogan Art" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Price (String)</label>
                  <input required name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="e.g. ₹4,500" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Images (max {MAX_IMAGES})</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: MAX_IMAGES }).map((_, i) => {
                      const imgUrl = formData.images?.[i];
                      return (
                        <div key={i} className="relative aspect-square rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden group">
                          {imgUrl ? (
                            <>
                              <img
                                src={`${API_URL}/${imgUrl}`}
                                alt={`Product image ${i + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'flex'; }}
                              />
                              <div className="hidden absolute inset-0 items-center justify-center text-xs text-slate-400 bg-slate-50">Not Found</div>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(i)}
                                className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(i, e)}
                                className="hidden"
                              />
                              {uploadingIndex === i ? (
                                <span className="text-xs animate-pulse text-indigo-500">Uploading...</span>
                              ) : (
                                <>
                                  <Upload size={18} />
                                  <span className="text-[10px] font-medium">Slot {i + 1}</span>
                                </>
                              )}
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400">Click a slot to upload. First image is the thumbnail.</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Display Order</label>
                  <input type="number" min="0" name="order" value={formData.order} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="0" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea rows="3" name="description" value={formData.description || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Material</label>
                  <input name="material" value={formData.material || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Dimensions</label>
                  <input name="dimensions" value={formData.dimensions || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Origin</label>
                  <input name="origin" value={formData.origin || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Artisan</label>
                  <input name="artisan" value={formData.artisan || ''} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">
                  {isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
