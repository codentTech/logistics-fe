import React from 'react';

import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const graphdata = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  datasets: [
    {
      label: 'Revenue Paid',
      data: [900, 1600, 1900, 1700, 920, 460, 900, 752, 1900, 1850, 1682, 1662],
      backgroundColor: '#4F46E5',
      stack: 'Stack 0',
      barPercentage: 0.6,
      borderRadius: 10,
      categoryPercentage: 0.4
    },
    {
      label: 'Revenue',
      data: [900, 1600, 1900, 1700, 920, 460, 900, 752, 1900, 1850, 1682, 1662],
      backgroundColor: '#999DC7',
      stack: 'Stack 0',
      barPercentage: 0.6,
      borderRadius: 10,
      categoryPercentage: 0.4
    },
    {
      label: 'Expenditure Paid',
      data: [800, 1500, 1800, 2000, 950, 400, 800, 652, 1800, 1750, 1582, 1562],
      backgroundColor: '#D41026',
      stack: 'Stack 1',
      barPercentage: 0.6,
      borderRadius: 10,
      categoryPercentage: 0.4
    },
    {
      label: 'Expenditure',
      data: [800, 1500, 1800, 2000, 950, 400, 800, 652, 1800, 1750, 1582, 1562],
      backgroundColor: '#F2ADB7',
      stack: 'Stack 1',
      barPercentage: 0.6,
      borderRadius: 10,
      categoryPercentage: 0.4
    }
  ]
};

const graphoptions = {
  indexAxis: 'x',
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true, // Make the legend items round
        fontFamily: 'DM Sans', // Set the font family
        font: {
          size: 14, // Set the font size
          weight: '500',
          color: '#121D32'
        },
        padding: 24
      },
      margin: {
        top: 24 // Set the margin top to 24px
      },
      itemMargin: 16 // Set the gap between legend items to 16px
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        borderDash: [4, 4] // Make the lines dashed
      }
    },
    y: {
      grid: {
        display: true,
        borderDash: [4, 4] // Make the lines dashed
      }
    }
  }
};

export default function BarGraph() {
  return <Bar data={graphdata} options={graphoptions} />;
}
