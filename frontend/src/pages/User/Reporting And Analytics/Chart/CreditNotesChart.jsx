import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

const CreditNotesChart = () => {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [chartData, setChartData] = useState({
    categories: [],
    series: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch credit notes data from the API
  const fetchCreditNotesData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;

      const response = await fetch('http://localhost:8001/api/creditNotes/viewAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const dataRes = await response.json();
        const data = dataRes.notes;
        const userCreditNotes = data.filter((creditNote) => creditNote.userId === userId);
        const transformedData = processCreditNotesData(userCreditNotes);

        setChartData(transformedData);
        setLoading(false);
      } else {
        throw new Error('Failed to fetch credit note data');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Process the data to fit the chart format (only creditNoteID, total, and invoiceNumber)
  const processCreditNotesData = (data) => {
    const categories = [];
    const totalData = [];
    const invoiceNumberData = [];

    // Iterate through the data and map it to the chart format
    data.forEach((creditNote) => {
      categories.push(creditNote.creditNoteID);
      totalData.push(creditNote.invoiceDetails.total);
      invoiceNumberData.push(creditNote.invoiceDetails.invoiceNumber);
    });

    return {
      categories,
      series: [
        {
          name: '',
          data: totalData,
        },
      ],
      invoiceNumbers: invoiceNumberData,
    };
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchCreditNotesData();
  }, []);

  // Update chart data based on the selected time period
  useEffect(() => {
    if (timePeriod === 'monthly') {
      // Process the data for monthly (if needed)
    } else if (timePeriod === 'weekly') {
      // Process the data for weekly (if needed)
    } else if (timePeriod === 'yearly') {
      // Process the data for yearly (if needed)
    }
  }, [timePeriod]);

  // Options for the ApexCharts
  const options = {
    series: chartData.series,
    chart: {
      type: 'bar',
      height: '100%',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 0,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      title: {
        text: '₹(thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ['#397568'],
    tooltip: {
      y: {
        formatter: function (val, { seriesIndex, dataPointIndex }) {
          // Custom tooltip format to display both 'total' and 'invoiceNumber'
          return `₹ ${val} (Total Amount) <br> Invoice Number :- ${chartData.invoiceNumbers[dataPointIndex]}`;
        },
      },
    },
  };

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-4 sm:mb-0">Credit Notes Overview</h2>

        {/* Dropdown for selecting Time Period */}
        <div className="flex items-center w-full sm:w-auto">
          <label className="block font-medium mr-4">Select:</label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="w-full sm:w-48 px-2 py-2 border rounded-lg"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div id="chart">
        <ApexCharts options={options} series={options.series} type="bar" height="350" />
      </div>
    </div>
  );
};

export default CreditNotesChart;
