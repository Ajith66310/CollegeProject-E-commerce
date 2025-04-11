import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Home = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  // const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    setFilterProducts(productsCopy);
  };

  useEffect(() => {
    setFilterProducts(products);
  }, [products]);

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* Category filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"
            } sm:block lg:hidden`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Vegetables"}
                onChange={toggleCategory}
              />
              Vegetables
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Fruits"}
                onChange={toggleCategory}
              />
              Fruits
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Spices"}
                onChange={toggleCategory}
              />
              Spices
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Snacks"}
                onChange={toggleCategory}
              />
              Snacks
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Icecream"}
                onChange={toggleCategory}
              />
              Icecream
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Drinks"}
                onChange={toggleCategory}
              />
              Drinks
            </p>
          </div>
        </div>

        {/* Dropdown for large screens */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            Select Categories
          </button>
          {showFilter && (
            <div className="absolute bg-white border border-gray-300 mt-2 w-48 z-10">
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700 p-3">
                <p className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Vegetables"}
                    onChange={toggleCategory}
                  />
                  Vegetables
                </p>
                <p className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Fruits"}
                    onChange={toggleCategory}
                  />
                  Fruits
                </p>
                <p className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Spices"}
                    onChange={toggleCategory}
                  />
                  Spices
                </p>
                <p className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Snacks"}
                    onChange={toggleCategory}
                  />
                  Snacks
                </p>
                <p className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Icecream"}
                    onChange={toggleCategory}
                  />
                  Icecream
                </p>
                <p className="flex gap-2">
                  <input
                    className="w-3"
                    type="checkbox"
                    value={"Drinks"}
                    onChange={toggleCategory}
                  />
                  Drinks
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Side */}
      <div className="flex-1 ">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"PRODUCTS"} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavant">Sort by: Relavant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>
        {/* Map Products */}
        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
