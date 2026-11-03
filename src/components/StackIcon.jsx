import React from "react";

// Line icons for non-brand nodes (stroke follows the node colour).
const paths = {
  prompt: (
    <>
      <rect x='3' y='4' width='18' height='16' rx='3' />
      <path d='m7 9 3 3-3 3M12.5 15H17' />
    </>
  ),
  webhook: <path d='M13 2 4 14h7l-1 8 9-12h-7l1-8z' />,
  agents: (
    <>
      <rect x='4' y='8' width='16' height='12' rx='4' />
      <path d='M12 8V4M9 4h6M9.5 13v1.5M14.5 13v1.5M2 13v3M22 13v3' />
    </>
  ),
  outcome: (
    <>
      <circle cx='12' cy='12' r='9' />
      <path d='m8 12.5 2.8 2.8L16.5 9.5' />
    </>
  ),
};

/**
 * Round badge for a stack node: the brand logo when there is one,
 * otherwise a line icon tinted with the node colour.
 */
const StackIcon = ({ node, size = 28, className = "" }) => {
  const inner = Math.round(size * 0.6);
  return (
    <span
      className={`grid place-items-center rounded-full shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: node.logo ? "rgba(255,255,255,0.06)" : `${node.color}26`,
        boxShadow: `inset 0 0 0 1px ${node.color}88`,
        color: node.color,
      }}
    >
      {node.logo ? (
        <img
          src={node.logo}
          alt=''
          width={inner}
          height={inner}
          draggable='false'
          style={{ width: inner, height: inner }}
          className='object-contain pointer-events-none select-none'
        />
      ) : (
        <svg
          viewBox='0 0 24 24'
          width={inner}
          height={inner}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          {paths[node.icon]}
        </svg>
      )}
    </span>
  );
};

export default StackIcon;
