import "./PieChart.css";

type Segment = { value: number; color: string };

const PieChart: React.FC<{ data: Segment[] }> = ({ data }) => {
    let current = 0;
    const gradient = data
        .map((seg) => {
            const start = current;
            current += seg.value;
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
