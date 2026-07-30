interface PupilProps {
  size?: string;
  maxDistance?: number;
  pupilColor?: string;
}

export default function Pupil({
  size = "12px",
  maxDistance = 5,
  pupilColor = "black",
}: PupilProps) {
  return (
    <div
      className="pupil"
      data-max-distance={maxDistance}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: pupilColor,
        flexShrink: 0,
        willChange: "transform",
      }}
    />
  );
}
