import "./PieChart.css";

type LegendItem = { label: string; color: string };

const PieLegend: React.FC<{ items: LegendItem[] }> = ({ items }) => {
    return (
        <div className="pie-legend">
            {items.map((item) => (
                <div key={item.label} className="legend-item">
                    <span
                        className="legend-color"
                        style={{ backgroundColor: item.color }}
                    ></span>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default PieLegend;
