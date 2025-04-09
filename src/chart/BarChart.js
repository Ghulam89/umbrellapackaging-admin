import React, { useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; // Import Chart.js components

// Register the necessary components
Chart.register(...registerables);

const BarChart = () => {
  const chartRef = useRef(null);

  // Define your data for the bar chart
  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        label: 'Monthly Data',
        data: [23, 32, 44, 45, 50, 5, 60, 65, 70, 75, 80, 100, 140],
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
        borderColor: '#5A56E9', // Border color
        borderWidth: 1, // Border width of the bars
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Allow the chart to resize
    scales: {
      x: {
        grid: {
          display: false, // Hide horizontal grid lines (X-axis)
        },
      },
      y: {
        grid: {
          display: true, // Show vertical grid lines (Y-axis)
        },
        beginAtZero: true, // Start Y-axis at 0
      },
    },
    plugins: {
      datalabels: {
        display: false, // Disable datalabels (optional)
      },
    },
  };

  return (
    <div className="w-full">
      <div className="h-[500px] border shadow-md p-10 rounded-[10px] w-full bg-white">
        <div className="flex justify-between items-center mb-4">
          {/* You can add any header or additional content here */}
        </div>
        <div className="h-[400px] w-full">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
