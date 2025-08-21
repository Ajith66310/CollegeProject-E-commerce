import { toast } from "react-toastify";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {

  const currency = '₹';
  const delivery_fee = 60;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('')
  const navigate = useNavigate();
  
  const addToCart = async (itemId, quantity, productQuantity) => {
    const product = products.find((p) => p._id === itemId);
    if (!product) {
      toast.error("Product not found.");
      return;
    }
  
    // Calculate the total quantity of the product in the cart
    let totalInCart = 0;
    if (cartItems[itemId]) {
      for (const size in cartItems[itemId]) {
        totalInCart += cartItems[itemId][size];
      }
    }
  
    // Check if adding the new quantity exceeds the available stock
    if (totalInCart + productQuantity > product.stock) {
      toast.error("Not enough stock available.");
      return;
    }
  
    let cartData = structuredClone(cartItems);
  
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
  
    cartData[itemId][quantity] = (cartData[itemId][quantity] || 0) + productQuantity;
  
    setCartItems(cartData);
  
    // Update the stock in the products array
    const updatedProducts = products.map((p) => {
      if (p._id === itemId) {
        return { ...p, stock: p.stock - productQuantity };
      }
      return p;
    });
    setProducts(updatedProducts);
  
    if (token) {
      try {
        await axios.post(`${import.meta.env.backendUrl}/api/cart/add`, { itemId, quantity, productQuantity }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {

    let totalCount = 0;

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item]
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  }
  
  // update product Quantity
  const updateQuantity = async (itemId, quantity, productQuantity) => {
    const product = products.find((p) => p._id === itemId);
    if (!product) {
      toast.error("Product not found.");
      return;
    }
  
    if (productQuantity > product.stock) {
      toast.error("Not enough stock available.");
      return;
    }
  
    let cartData = structuredClone(cartItems);
    cartData[itemId][quantity] = productQuantity;
    setCartItems(cartData);
  
    if (token) {
      try {
        await axios.post(`${import.meta.env.backendUrl}/api/cart/update`, { itemId, quantity, productQuantity }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item]
          }
        } catch (error) {

        }
      }
    }
    return totalAmount;
  }


  const getProductsData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.backendUrl}/api/product/list`)
      if (response.data.success) {
        setProducts(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(`${import.meta.env.backendUrl}/api/cart/get` , {}, { headers: { token } })
      if (response.data.success) {
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  useEffect(() => {
    getProductsData()
  }, [token])

  useEffect(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
      getUserCart(localStorage.getItem('token'))
    }
  }, [token])

  const value = {
    products, currency, delivery_fee,
    showSearch, setShowSearch, search, setSearch,
    cartItems, addToCart, setCartItems,
    getCartCount, updateQuantity,
    getCartAmount,setProducts,
    navigate, 
    setToken, token, 
  }
  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}
export default ShopContextProvider;