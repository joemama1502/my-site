// src/components/icons/LeafIcon.tsx
import React from "react";

const LeafIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M12 2C6.5 6 2 11 2 16c0 3.3 2.7 6 6 6 5 0 10-4.5 14-10C18.5 6.5 15 3.5 12 2z" />
  </svg>
);

export default LeafIcon;
