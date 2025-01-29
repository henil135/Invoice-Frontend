import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import ManageSalespersonsPopup from "./ManageSalespersonsPopup";
import Swal from "sweetalert2";
import { ThreeDots } from 'react-loader-spinner';

const InvoiceForm = () => {
  const { state } = useLocation();
  const selectedTemplate = state?.selectedTemplate;
  const color = state?.color;
  const font = state?.font;
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [invoiceData, setInvoiceData] = useState({
    templateId: selectedTemplate + 1,
    color: color,
    font: font,
    invoiceDate: formatDate(new Date()),
    dueDate: "",
    customer: "",
    customerName: "",
    salesperson: "",
    salespersonName: "",
    currency: "",
    billingAddress: "",
    shippingAddress: "",
    items: [{ item: "", quantity: 1, tax: 0, price: 0, total: 0 }],
    freightCharges: 0,
    freightTax: 0,
    terms: "",
    image: null,
  });
  const [customers, setCustomers] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  // useEffect(() => {
  //   if (searchTerm.trim() === "") {
  //     setFilteredItems(items);
  //   } else {
  //     setFilteredItems(
  //       items.filter(
  //         (item) =>
  //           item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //           item.qrCode.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }
  // }, [searchTerm, items]);
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => {
          const name = item.name || ""; // Default to an empty string if undefined
          const qrCode = item.qrCode || ""; // Default to an empty string if undefined
          return (
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qrCode.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }
  }, [searchTerm, items]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await fetch("http://localhost:8001/api/customer/viewCustomers", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const customerData = await customerResponse.json();
        const filteredCustomers = customerData.filter(customer => customer.userId == userId);
        setCustomers(filteredCustomers);

        const itemResponse = await fetch("http://localhost:8001/api/item/getallitem", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const itemData = await itemResponse.json();

        const filteredItems = itemData.filter(item => item.userId == userId);
        setItems(filteredItems);

        const salespersonResponse = await fetch("http://localhost:8001/api/salespersons/getallsalespersone", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const salespersonData = await salespersonResponse.json();
        const filteredSalespersons = salespersonData.filter(salesperson => salesperson?.userId?._id == userId);
        setSalespersons(filteredSalespersons);

        if (id) {
          // Fetching single invoice data if in edit mode
          const invoiceResponse = await fetch(`http://localhost:8001/api/invoice/ViewById/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const invoiceDatares = await invoiceResponse.json();
          const invoiceData = invoiceDatares.invoice;

          // Fetch customer to set the billing and shipping addresses if not provided in the response
          const selectedCustomer = customers.find(cust => cust._id === invoiceData.customer);
          const billingAddress = selectedCustomer?.addresses
            .filter(address => address.billingAddress)
            .map(address => `${address.billingAddress.attention}, ${address.billingAddress.address}, ${address.billingAddress.city}`)
            .join(" ") || invoiceData.billingAddress;

          const shippingAddress = selectedCustomer?.addresses
            .filter(address => address.shippingAddress)
            .map(address => `${address.shippingAddress.attention}, ${address.shippingAddress.address}, ${address.shippingAddress.city}`)
            .join(" ") || invoiceData.shippingAddress;

          setInvoiceData(prev => ({
            ...prev,
            ...invoiceData,
            billingAddress,
            shippingAddress,
            currency: selectedCustomer?.currency || invoiceData.currency,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id, token]);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle dynamic item changes (item, quantity, price)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    if (field === "item") {
      const selectedItem = items.find((item) => item._id === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          item: selectedItem._id, // Ensure _id is assigned here
          price: selectedItem.price || 0,
          tax: selectedItem.defaultTaxRates || 0,
          total:
            updatedItems[index].quantity * selectedItem.price +
            (updatedItems[index].quantity * selectedItem.price * selectedItem.defaultTaxRates) / 100,
        };
      }
    } else {
      updatedItems[index][field] = value;
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].price +
        (updatedItems[index].quantity * updatedItems[index].price * updatedItems[index].tax) / 100;
    }
    setInvoiceData((prev) => ({ ...prev, items: updatedItems }));
  };


  // Add new item row
  const handleAddItem = () => {
    setInvoiceData((prevData) => ({
      ...prevData,
      items: [
        ...prevData.items,
        { item: '', quantity: 0, price: 0, tax: 0, total: 0 }, // Default new item
      ],
    }));
  };

  // Remove item row
  const handleRemoveItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData((prev) => ({ ...prev, items: updatedItems }));
  };

  // Handle customer selection
  const handleCustomerSelect = (e) => {
    const selectedCustomer = customers.find((cust) => cust.displayName === e.target.value);
    const billingAddress = selectedCustomer?.addresses
      .filter((address) => address.billingAddress)
      .map((address) => `${address.billingAddress.attention}, ${address.billingAddress.address}, ${address.billingAddress.city}`)
      .join(" ");
    const shippingAddress = selectedCustomer?.addresses
      .filter((address) => address.shippingAddress)
      .map((address) => `${address.shippingAddress.attention}, ${address.shippingAddress.address}, ${address.shippingAddress.city}`)
      .join(" ");

    setInvoiceData((prev) => ({
      ...prev,
      customer: selectedCustomer?._id,
      customerName: selectedCustomer?.displayName,
      currency: selectedCustomer?.currency,
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
    }));
  };

  // Handle salesperson selection
  const handleSalespersonSelect = (e) => {
    const selectedSalesperson = salespersons.find((sp) => sp.name === e.target.value);
    setInvoiceData((prev) => ({
      ...prev,
      salesperson: selectedSalesperson?._id,
      salespersonName: selectedSalesperson?.name,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInvoiceData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validationErrors = {};

    // Validate customer selection
    if (!invoiceData.customer) {
      validationErrors.customer = "Customer is required.";
    }

    // Validate at least one item with valid quantity and price
    const invalidItems = invoiceData.items.some(item => !item.item || item.quantity <= 0 || item.price <= 0);
    if (invalidItems) {
      validationErrors.items = "All items must have valid item, quantity, and price.";
    }

    // Validate due date
    if (!invoiceData.dueDate || new Date(invoiceData.dueDate) <= new Date()) {
      validationErrors.dueDate = "Due date must be in the future.";
    }

    // Validate terms
    if (!invoiceData.terms || invoiceData.terms === "Select a Terms") {
      validationErrors.terms = "Terms are required.";
    }

    // If there are validation errors, set them and do not submit the form
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    // Proceed with form submission if no errors
    const formData = new FormData();

    // Append primitive values to FormData
    formData.append("templateId", invoiceData.templateId || 1);
    formData.append("color", invoiceData.color || 'purple');
    formData.append("font", invoiceData.font || 'font-sans');
    formData.append("createdBy", invoiceData.createdBy);
    formData.append("invoiceDate", new Date());
    formData.append("dueDate", invoiceData.dueDate);
    formData.append("customer", invoiceData.customer);
    formData.append("customerName", invoiceData.customerName);
    formData.append("salesperson", invoiceData.salesperson);
    formData.append("salespersonName", invoiceData.salespersonName);
    formData.append("freightTax", invoiceData.freightTax);
    formData.append("freightCharges", invoiceData.freightCharges);
    formData.append("terms", invoiceData.terms);

    // Append items array to FormData
    invoiceData.items.forEach((item, index) => {
      const itemId = item.item;
      formData.append(`items[${index}][item]`, itemId);
      formData.append(`items[${index}][quantity]`, item.quantity);
      formData.append(`items[${index}][price]`, item.price);
      formData.append(`items[${index}][tax]`, item.tax);
      formData.append(`items[${index}][total]`, item.total);
    });

    // Append image file if it exists
    if (invoiceData.image) {
      formData.append("image", invoiceData.image);
    }

    // Determine the endpoint and method based on whether it's an update or create operation
    const endpoint = id
      ? `http://localhost:8001/api/invoice/updateById/${id}`
      : "http://localhost:8001/api/invoice/create";
    const method = id ? "PUT" : "POST";
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        // Display success pop-up with SweetAlert2
        Swal.fire({
          icon: 'success',
          title: id ? 'Invoice Updated.' : 'Invoice Added.',
          text: 'Your invoice has been saved successfully!',
        }).then(() => {
          navigate("/user/invoice");
        });
      } else {
        setErrors({ general: result.message || "Error submitting invoice." });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Error submitting invoice data." });
    } finally {
      setLoading(false);
    }
  };


  // Render customer dropdown
  const renderCustomerDropdown = () => (
    <select
      name="customerName"
      value={invoiceData.customerName}
      onChange={(e) => {
        if (e.target.value === "addCustomer") {
          navigate('/user/customers/customer-form');
        } else {
          handleCustomerSelect(e);
        }
      }}
      className="w-full p-2 border rounded me-2"
    >
      <option value="" disabled>Select a customer</option>
      {customers.map((customer) => (
        <option key={customer._id} value={customer.displayName}>
          {customer.displayName}
        </option>
      ))}
      <option value="addCustomer" className="bg-[#438A7A] text-white">Add Customer</option>
    </select>
  );


  // Render salesperson dropdown
  const renderSalespersonDropdown = () => (
    <select
      name="salespersonName"
      value={invoiceData.salespersonName}
      onChange={(e) => {
        if (e.target.value === "addSalesperson") {
          setIsPopupOpen(true);
        } else {
          handleSalespersonSelect(e);
        }
      }}
      className="w-full p-2 border rounded md:ms-2"
    >
      <option value="" disabled>Select a salesperson</option>
      {salespersons.map((salesperson) => (
        <option key={salesperson._id} value={salesperson.name}>
          {salesperson.name}
        </option>
      ))}
      <option value="addSalesperson" className="bg-[#438A7A] text-white">Add Salesperson</option>
    </select>
  );

  // Render item dropdown
  const renderItemDropdown = (index) => (
    <div className="relative">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Item or QR Code"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300 mb-2"
        onFocus={() => {
          setActiveIndex(index);
          setShowDropdown(true);
        }}
        onBlur={() => setTimeout(() => {
          if (activeIndex === index) {
            setShowDropdown(false);
          }
        }, 100)}
      />

      {/* Dropdown */}
      {showDropdown && activeIndex === index && (
        <div className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
          <ul>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    handleItemChange(index, "item", item._id);
                    setSearchTerm(`${item.name} || ${item.qrCode}`);
                    setShowDropdown(false);
                  }}
                >
                  {item.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No items found</li>
            )}
            <li
              className="px-4 py-2 bg-[#438A7A] text-white cursor-pointer hover:bg-[#366e63]"
              onClick={() => {
                navigate('/user/itemsForm');
              }}
            >
              Add Item
            </li>
          </ul>
        </div>
      )}
    </div>
  );

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Calculate grand total
  const grandTotal = (invoiceData.items || []).reduce((total, item) => total + item.total, 0);

  return (
    <>
      <div className="p-4 m-3 rounded-lg bg-white">
        <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>
        <form onSubmit={handleSubmit}>
          {/* Invoice Details Section */}
          <div className="mb-8 p-8 rounded-lg border">
            <h2 className="block text-lg font-medium mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="templateId"
                placeholder="Invoice Number"
                value={invoiceData.templateId}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                disabled
                hidden
              />
              <div>
                <label htmlFor="">Start Date</label>
                <input
                  type=""
                  name="invoiceDate"
                  value={invoiceData.invoiceDate}
                  // onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-2"
                />
              </div>
              <div>
                <label htmlFor="">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={invoiceData.dueDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded mt-2"
                />
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8 p-8 rounded-lg border">
            <h2 className="block text-lg font-medium mb-4">Customer Information</h2>
            <div className="flex flex-wrap items-center mb-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm mb-2">Customer</label>
                {renderCustomerDropdown()}
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm mb-2">Salesperson</label>
                {renderSalespersonDropdown()}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-2">
                <div>
                  <input
                    type="text"
                    name="currency"
                    placeholder="Currency"
                    value={invoiceData.currency}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-3 bg-transparent"
                    disabled
                  />
                </div>
                <div>
                  <div className="">
                    <input
                      type="text"
                      name="billingAddress"
                      placeholder="Billing Address"
                      value={invoiceData.billingAddress}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded mt-3 bg-transparent"
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name="shippingAddress"
                    placeholder="Shipping Address"
                    value={invoiceData.shippingAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-3 bg-transparent"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="mb-8 p-8 rounded-lg border">
  <h2 className="block text-lg font-medium mb-4">Item Details</h2>
  {(invoiceData.items || []).map((item, index) => (
    <div key={`item-${index}`} className="flex flex-wrap gap-4 mb-4">
      <div className="w-full sm:w-[26%]">
        <label className="block text-sm mb-2">Item</label>
        {renderItemDropdown(index)}
      </div>
      <div className="w-full sm:w-1/6">
        <label className="block text-sm mb-2">Quantity</label>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="w-full sm:w-1/6">
        <label className="block text-sm mb-2">Rate</label>
        <input
          type="number"
          value={item.price}
          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="w-full sm:w-1/6">
        <label className="block text-sm mb-2">Tax (%)</label>
        <input
          type="number"
          value={item.tax}
          onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
          className="w-full p-2 border rounded"
          disabled
        />
      </div>
      <div className="w-full sm:w-1/6">
        <label className="block text-sm mb-2">Total</label>
        <input
          type="number"
          value={item.total}
          className="w-full p-2 border rounded"
          disabled
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={() => handleRemoveItem(index)}
          className="text-red-500"
        >
          <MdDeleteForever size={30} />
        </button>
      </div>
    </div>
  ))}
  <div className="mb-4 text-lg font-semibold text-end">
    <label>Grand Total: </label>
    <span>₹{grandTotal.toFixed(2)}</span>
  </div>
  <button
    type="button"
    onClick={handleAddItem}
    className="bg-[#438A7A] text-white p-2 rounded"
  >
    Add Item
  </button>
</div>


          {/* Terms and Attachment */}
          <div className="mb-8 p-8 rounded-lg border">
            <h2 className="block text-lg font-medium mb-4">Additional Information</h2>
            <div className="flex flex-wrap items-center mb-4">
              <div className="w-full sm:w-1/2 mb-2">
                <label className="block text-sm mb-2">Freight Charges</label>
                <input
                  type="number"
                  name="freightCharges"
                  value={invoiceData.freightCharges}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded me-2"
                />
              </div>
              <div className="w-full sm:w-1/2 mb-2">
                <label className="block text-sm mb-2">Freight Tax (%)</label>
                <input
                  type="number"
                  name="freightTax"
                  value={invoiceData.freightTax}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded md:ms-2"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm mb-2">Terms</label>
                <select
                  name="terms"
                  value={invoiceData.terms}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded me-2"
                >
                  <option value="Due on Receipt">Select a Terms</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                </select>
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm mb-2">Upload Logo</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded md:ms-2"
                />
              </div>
            </div>
          </div>

          {/* Error messages */}
          {errors.general && (
            <div className="mb-4 text-red-500">{errors.general}</div>
          )}

          {/* Show loader when submitting */}
          {loading && (
            <div className="flex justify-center items-center">
              <ThreeDots
                height="50"
                width="50"
                radius="9"
                color="#438A7A"
                ariaLabel="three-dots-loading"
                visible={true}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/user/invoices")}
              className="bg-gray-300 text-black p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#438A7A] text-white p-2 rounded"
            >
              {id ? "Update Invoice" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <ManageSalespersonsPopup
              onClose={closePopup}
            />
          </div>
        </div>
      )}
    </>
  );

};

export default InvoiceForm;
