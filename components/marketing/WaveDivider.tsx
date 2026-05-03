export default function WaveDivider({
  topColor = '#FDF8F5',
  bottomColor = '#FFFFFF',
  flip = false,
}: {
  topColor?: string;
  bottomColor?: string;
  flip?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: bottomColor,
        marginTop: '-2px',
        lineHeight: 0,
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          width: '100%',
          transform: flip ? 'scaleY(-1)' : 'none',
        }}
        aria-hidden
      >
        <path
          d="M0,40 C180,80 360,0 540,40 C720,80 900,0 1080,40 C1260,80 1440,20 1440,40 L1440,0 L0,0 Z"
          fill={topColor}
        />
      </svg>
    </div>
  );
}
