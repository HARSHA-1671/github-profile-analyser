import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
} from "chart.js";
import { Bar, Radar } from "react-chartjs-2";
import { titleCase } from "../utils/formatters";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip
);

export function CategoryRadar({ scores }) {
  const labels = Object.keys(scores || {}).map(titleCase);
  const values = Object.values(scores || {}).map((value) => Math.round(value));

  return (
    <div className="panel-card chart-panel compact-radar">
      <div className="panel-heading">
        <h3>Category Radar</h3>
        <p>Five dimensions blended into an overall portfolio score.</p>
      </div>
      <div className="chart-canvas">
        <Radar
          data={{
            labels,
            datasets: [
              {
                label: "Score",
                data: values,
                fill: true,
                backgroundColor: "rgba(95, 241, 188, 0.2)",
                borderColor: "#5ff1bc",
                pointBackgroundColor: "#fff2c7",
                pointBorderColor: "#5ff1bc"
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                suggestedMin: 0,
                suggestedMax: 100,
                angleLines: { color: "rgba(255, 255, 255, 0.12)" },
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                pointLabels: { color: "#f7f1d7", font: { size: 11 } },
                ticks: {
                  backdropColor: "transparent",
                  color: "rgba(247, 241, 215, 0.65)",
                  font: { size: 10 }
                }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }}
        />
      </div>
    </div>
  );
}

export function LanguageBar({ languages }) {
  const entries = Object.entries(languages || {}).slice(0, 6);

  return (
    <div className="panel-card chart-panel compact-bars">
      <div className="panel-heading">
        <h3>Language Distribution</h3>
        <p>Weighted by repository size to show where the portfolio clusters.</p>
      </div>
      <div className="chart-canvas">
        <Bar
          data={{
            labels: entries.map(([label]) => label),
            datasets: [
              {
                label: "Share",
                data: entries.map(([, value]) => value),
                backgroundColor: ["#5ff1bc", "#ffd36b", "#7dcfff", "#ff8b8b", "#d8a8ff", "#ffe7a3"],
                borderRadius: 10,
                maxBarThickness: 28
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: {
                ticks: { color: "#f7f1d7", font: { size: 11 } },
                grid: { display: false }
              },
              y: {
                ticks: {
                  color: "#f7f1d7",
                  callback: (value) => `${value}%`,
                  font: { size: 10 }
                },
                grid: { color: "rgba(255, 255, 255, 0.08)" }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
