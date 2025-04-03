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
  const backendUrl = 'http://localhost:4000'
  const VITE_RAZORPAY_KEY_ID = "rzp_test_uLqCSSHPx5VBho"
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('')
  const navigate = useNavigate();
  const addToCart = async (itemId, quantity) => {

    if (!quantity) {
      toast.error('Select Product Quantity')
      return;
    } else {
      toast.success("Product added to cart")
    }

    let cartData = structuredClone(cartItems)

    if (!cartData[itemId] || typeof cartData[itemId] !== 'object') {
      cartData[itemId] = {}; // Ensure cartData[itemId] is an object
    }


    if (cartData[itemId][quantity]) {
      cartData[itemId][quantity] += 1
    }
    else {
      cartData[itemId][quantity] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', { itemId, quantity }, { headers: { token } })
      } catch (error) {
        toast.error(error.message)
      }
    }

  }

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
    let cartData = structuredClone(cartItems);
    cartData[itemId][quantity] = productQuantity;
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, quantity, productQuantity }, { headers: { token } })
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
    }
  }

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
      const response = await axios.get(backendUrl + '/api/product/list')
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
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } })
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
    getCartAmount,
    navigate, backendUrl,
    setToken, token, VITE_RAZORPAY_KEY_ID
  }
  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}
export default ShopContextProvider;