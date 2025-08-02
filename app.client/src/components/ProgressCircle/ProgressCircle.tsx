import "./ProgressCircle.css";

type ProgressCircleProps = {
    value: number; // 0–100
    size?: number; // optional, default 100px
    thickness?: number; // optional, default 10px
};

const ProgressCircle = ({
    value,
    size = 100,
    thickness = 10,
}: ProgressCircleProps) => {
    return (
        <div
            className="progress-circle"
            style={
                {
                    "--value": value,
                    "--size": `${size}px`,
                    "--thickness": `${thickness}px`,
                } as React.CSSProperties
            }
        />
    );
};

export default ProgressCircle;
