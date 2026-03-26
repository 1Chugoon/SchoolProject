function Star({fillPercent = 0, Size = 24, Color = "#FFD700"}) 
{
  const fill = Math.max(0, Math.min(1, fillPercent));
  return(
  <svg
    width={Size}
    height={Size}
    viewBox="0 0 24 24"
  >
    <defs>
      <clipPath id={`clip-${fill}`}>
        <rect x="0" y="0" width={24 * fill} height="24" />
      </clipPath>
    </defs>

    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 
              18.18 21.02 12 17.77 5.82 21.02 
              7 14.14 2 9.27 8.91 8.26 12 2"
      fill="none"
      stroke={Color}
      strokeWidth="1.2"
    />

    <polygon
      points="12 2 15.09 8.26 22 9.27 17 14.14 
              18.18 21.02 12 17.77 5.82 21.02 
              7 14.14 2 9.27 8.91 8.26 12 2"
      fill={Color}
      clipPath={`url(#clip-${fill})`}
    />
  </svg>
  )
};

export default Star;