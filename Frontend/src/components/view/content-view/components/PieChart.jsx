import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ tokens }) => {
  const { theme } = useTheme();

  // Set border color and hover border color according to theme
  const isDark = theme === 'dark';
  const borderColor = isDark ? '#fff' : '#1f1f1f';
  const hoverBorderColor = isDark ? '#1f1f1f' : '#fff';

  const labels = tokens.map((t) => t.symbol || t.name);
  const dataValues = tokens.map((t) => t.portfolio_percentage);
  const backgroundColors = tokens.map((t) => t.color);

  const data = {
    labels,
    datasets: [
      {
        label: 'Portfolio Allocation',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        borderColor: borderColor,
        hoverBorderColor: hoverBorderColor,
        spacing: 2,
        offset: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const label = ctx.label || '';
            const value = ctx.formattedValue || '';
            return `${label}: ${value}%`;
          },
        },
        backgroundColor: isDark ? '#23272f' : '#fff',
        titleColor: isDark ? '#fff' : '#23272f',
        bodyColor: isDark ? '#fff' : '#23272f',
        borderColor: isDark ? '#444' : '#ddd',
        borderWidth: 1,
      },
      legend: {
        display: false,
        labels: {
          color: isDark ? '#fff' : '#23272f',
        },
      },
    },
  };

  return (
    <div className="md:w-[200px] md:h-[200px] h-[150px] relative opacity-70">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
