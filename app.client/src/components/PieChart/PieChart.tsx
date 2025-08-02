import "./PieChart.css";

type Segment = { value: number; color: string };

const PieChart: React.FC<{ data: Segment[] }> = ({ data }) => {
    const total = data.reduce((sum, seg) => sum + seg.value, 0);
    let current = 0;

    const gradient = data
        .map((seg) => {
            const start = current;
            const percent = total > 0 ? (seg.value / total) * 100 : 0;
            current += percent;
            return `${seg.color} ${start}% ${current}%`;
        })
        .join(", ");

    return (
        <div
            className="pie-chart"
            style={{ background: `conic-gradient(${gradient})` }}
        ></div>
    );
};

export default PieChart;
