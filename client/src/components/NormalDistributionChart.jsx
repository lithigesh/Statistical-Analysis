// client/src/components/NormalDistributionChart.jsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const NormalDistributionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg shadow-inner text-gray-500">
        No data to display. Adjust parameters and click "Generate".
      </div>
    );
  }

  const chartData = {
    labels: data.map(point => point.x.toFixed(2)),
    datasets: [
      {
        label: 'Probability Density Function (PDF)',
        data: data.map(point => point.y),
        borderColor: 'rgb(136, 132, 216)',
        backgroundColor: 'rgba(136, 132, 216, 0.1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#4a5568',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2d3748',
        bodyColor: '#2d3748',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `PDF: ${context.parsed.y.toFixed(4)}`;
          },
          title: function(context) {
            return `x: ${context[0].label}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Value (x)',
          color: '#4a5568',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#4a5568',
          maxTicksLimit: 10,
        },
        grid: {
          color: '#e0e0e0',
          drawBorder: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Probability Density f(x)',
          color: '#4a5568',
          font: {
            size: 12,
          },
        },
        ticks: {
          color: '#4a5568',
          callback: function(value) {
            return value.toFixed(3);
          },
        },
        grid: {
          color: '#e0e0e0',
          drawBorder: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default NormalDistributionChart;