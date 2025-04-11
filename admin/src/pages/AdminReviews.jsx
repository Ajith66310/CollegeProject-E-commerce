import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminReviews = ({token}) => {
  const [products, setProducts] = useState([]);

  const fetchProductsWithReviews = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/product/list");
      const products = res.data.products || res.data;
      setProducts(products.filter(product => product.reviews && product.reviews.length > 0));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDeleteReview = async (productId, reviewId) => {
    
    try {
    
      await axios.post(`http://localhost:4000/api/product/${productId}/review/remove`, {
        productId,
        reviewId
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
        ,
      });

      // Update UI
      setProducts(prev =>
        prev.map(p =>
          p._id === productId
            ? { ...p, reviews: p.reviews.filter(r => r._id !== reviewId) }
            : p
        )
      );
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  useEffect(() => {
    fetchProductsWithReviews();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Product Reviews</h2>
      {products.map(product => (
        <div key={product._id} className="mb-6 p-4 border rounded-lg shadow">
           <img
            src={product.image[0]} // Display the first image of the product
            alt={product.name}
            className="w-16 h-16 object-cover rounded"
          />
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {product.reviews.map(review => (
            <div key={review._id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="text-sm"><strong>{review.username}</strong>: {review.review}</p>
                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDeleteReview(product._id, review._id)}
                className="border font-bold py-1 px-3 rounded transition duration-300"
                style={{
                  backgroundColor: "#ffebf5",
                  borderColor: "#C586A5",
                  color: "#C586A5",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "#a0567d";
                  e.target.style.color = "#a0567d";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#C586A5";
                  e.target.style.color = "#C586A5";
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminReviews;
