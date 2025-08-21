import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/product/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      console.log('Updated Product:', updatedProduct);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/update`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditProduct(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
              <img className="w-12" src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() =>
                    setEditProduct(editProduct?._id === item._id ? null : item)
                  }
                  className="border font-bold py-1 px-3 rounded transition duration-300"
                  style={{
                    backgroundColor: '#E6F0FF',
                    borderColor: '#4A90E2',
                    color: '#4A90E2',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#276FBF';
                    e.target.style.color = '#276FBF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#4A90E2';
                    e.target.style.color = '#4A90E2';
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProduct(item._id)}
                  className="border font-bold py-1 px-3 rounded transition duration-300"
                  style={{
                    backgroundColor: '#ffebf5',
                    borderColor: '#C586A5',
                    color: '#C586A5',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#a0567d';
                    e.target.style.color = '#a0567d';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#C586A5';
                    e.target.style.color = '#C586A5';
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            {editProduct?._id === item._id && (
              <div className="p-4 border bg-gray-50">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProduct({ ...editProduct, id: editProduct._id });
                  }}
                >
                  <div className="mb-2">
                    <label>Price:</label>
                    <input
                      type="number"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1 border"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Stock:</label>
                    <input
                      type="number"
                      value={editProduct.stock}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          stock: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1 border"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Expiry Date:</label>
                    <input
                      type="date"
                      value={editProduct.expiryDate.split('T')[0]}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          expiryDate: e.target.value,
                        })
                      }
                      className="w-full px-2 py-1 border"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Quantity:</label>
                    <input
                      type="text"
                      value={editProduct.quantity.join(', ')}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          quantity: e.target.value
                            .split(',')
                            .map((q) => q.trim()),
                        })
                      }
                      className="w-full px-2 py-1 border"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Bestseller:</label>
                    <input
                      type="checkbox"
                      checked={editProduct.bestseller}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          bestseller: e.target.checked,
                        })
                      }
                      className="ml-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="border font-bold py-1 px-3 rounded transition duration-300"
                      style={{
                        backgroundColor: '#E6F0FF',
                        borderColor: '#4A90E2',
                        color: '#4A90E2',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#276FBF';
                        e.target.style.color = '#276FBF';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#4A90E2';
                        e.target.style.color = '#4A90E2';
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditProduct(null)}
                      className="border font-bold py-1 px-3 rounded transition duration-300"
                      style={{
                        backgroundColor: '#ffebf5',
                        borderColor: '#C586A5',
                        color: '#C586A5',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#a0567d';
                        e.target.style.color = '#a0567d';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = '#C586A5';
                        e.target.style.color = '#C586A5';
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default List;