import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export const PaymentChart = () => {
  const [view, setView] = useState("weekly"); 
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;

  // Fetch all invoices and expenses data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all invoices
        const invoicesResponse = await fetch("http://localhost:8001/api/invoice/viewAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!invoicesResponse.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const invoicesDataRes = await invoicesResponse.json();
        const invoicesData = invoicesDataRes.invoices || [];
        const filteredInvoicesData = invoicesData.filter(invoice => invoice.userId == userId);
        setInvoices(filteredInvoicesData);

        // Fetch all expenses
        const expensesResponse = await fetch("http://localhost:8001/api/expenses/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!expensesResponse.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const expensesDataRes = await expensesResponse.json();
        const expensesData = expensesDataRes.res || [];
        const filteredExpensesData = expensesData.filter(expense => expense.userId == userId);
        setExpenses(filteredExpensesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate income and expenses data based on the selected view
  const calculateData = () => {
    const categories = getCategories();
    const income = new Array(categories.length).fill(0);
    const expensesData = new Array(categories.length).fill(0);

    // Calculate income (invoices)
    if (Array.isArray(invoices)) {
      invoices.forEach((invoice) => {
        const date = new Date(invoice.createdAt);
        if (isNaN(date)) {
          console.error("Invalid date in invoice:", invoice.date); 
          return;
        }
        const index = getCategoryIndex(date, view);
        if (index !== -1) {
          income[index] += invoice.total || 0; 
        }
      });
    }

    // Calculate expenses
    if (Array.isArray(expenses)) {
      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        if (isNaN(date)) {
          console.error("Invalid date in expense:", expense.date); 
          return;
        }
        const index = getCategoryIndex(date, view);
        if (index !== -1) {
          expensesData[index] += expense.amount || 0;
        }
      });
    }
    console.log("Income Data:", income);
    console.log("Expenses Data:", expensesData);

    return { income, expenses: expensesData };
  };

  // Get the index of the category for a given date and view
  const getCategoryIndex = (date, view) => {
    switch (view) {
      case "weekly":
        return date.getDay(); 
      case "monthly":
        const week = Math.floor((date.getDate() - 1) / 7);
        return week < 5 ? week : 4; 
      case "yearly":
        return date.getMonth();
      default:
        return -1;
    }
  };

  // Define categories based on the selected view
  const getCategories = () => {
    switch (view) {
      case "weekly":
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      case "monthly":
        return ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      case "yearly":
        return [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      default:
        return [];
    }
  };

  const { income, expenses: expensesData } = calculateData();

  const options = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        columnWidth: "30%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    grid: {
      row: {
        colors: ["#fff", "#f2f2f2"],
      },
    },
    xaxis: {
      labels: {
        rotate: -45,
      },
      categories: getCategories(),
      tickPlacement: "on",
    },
    yaxis: {
      title: {
        text: "Amount (USD)",
      },
    },
    fill: {
      type: "solid",
      colors: ["#397568", "#285249"],
    },
  };

  const series = [
    {
      name: "Income",
      data: income,
    },
    {
      name: "Expenses",
      data: expensesData,
    },
  ];

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl dark:text-[#76797e] font-bold mb-4">Income and Expenses</h1>

      {/* Dropdown to select view */}
      <div className="mb-4">
        <label className="mr-2 font-medium ">View:</label>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="px-4 py-2 border  rounded-lg "
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Chart */}
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default PaymentChart;