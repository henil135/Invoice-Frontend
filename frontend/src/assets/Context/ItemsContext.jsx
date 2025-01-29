import React, { createContext, useContext, useState } from "react";

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Executive Office Desk",
      sku: "Item 1 sku",
      type: "Goods",
      stock: 50,
      rate: "₹5765.00",
    },
    {
      id: 2,
      name: "Dining Table and Chairs Set",
      sku: "Item 2 sku",
      type: "Goods",
      stock: 120,
      rate: "₹8887.00",
    },
    {
      id: 3,
      name: "Smartphone X200",
      sku: "Item 3 sku",
      type: "Furniture",
      stock: 50,
      rate: "$899.99",
    },
    {
      id: 4,
      name: "Cotton T-Shirt",
      sku: "Item 4 sku",
      type: "Apparel",
      stock: 120,
      rate: "$19.99",
    },
    {
      id: 5,
      name: "Blender Pro 3000",
      sku: "Item 5 sku",
      type: "Home Appliance",
      stock: 30,
      rate: "$120.00",
    },
    {
      id: 6,
      name: "Organic Face Cream",
      sku: "Item 6 sku",
      type: "Beauty",
      stock: 100,
      rate: "$35.50",
    },
    {
      id: 7,
      name: "Car Vacuum Cleaner",
      sku: "Item 7 sku",
      type: "Toys",
      stock: 100,
      rate: "$25.00",
    },
    {
      id: 8,
      name: "Gaming Laptop GX15",
      sku: "Item 8 sku",
      type: "Gaming",
      stock: 25,
      rate: "$1,200.00",
    },
    {
      id: 9,
      name: "Adjustable Dumbbells",
      sku: "Item 9 sku",
      type: "Fitness",
      stock: 60,
      rate: "$199.99",
    },
    {
      id: 10,
      name: "Building Blocks Set",
      sku: "Item 10 sku",
      type: "Toys",
      stock: 100,
      rate: "$25.00",
    },  
  ]);

  const updateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  return (
    <ItemsContext.Provider value={{ items, setItems, updateItem }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  return useContext(ItemsContext);
};
