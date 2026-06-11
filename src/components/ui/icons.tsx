import { type SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaultProps = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconHome = ({ size = 20, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export const IconServices = ({ size = 20, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const IconSupport = ({ size = 20, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

export const IconHistory = ({ size = 20, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const IconTech = ({ size = 40, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props} stroke="#00A86B">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
    <path d="M9 9l2 2 4-4" />
  </svg>
);

export const IconElectric = ({ size = 40, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props} stroke="#00A86B">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const IconCleaning = ({ size = 40, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props} stroke="#00A86B">
    <path d="M3 22V12l9-9 9 9v10H3z" />
    <path d="M9 22V16h6v6" />
    <path d="M8 9h.01M12 6h.01M16 9h.01" />
  </svg>
);

export const IconPlumbing = ({ size = 40, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props} stroke="#00A86B">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const IconPainting = ({ size = 40, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props} stroke="#00A86B">
    <path d="M19 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
    <path d="M3 9l9 13 9-13" />
  </svg>
);

export const IconSearch = ({ size = 18, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const IconUser = ({ size = 22, ...props }: IconProps) => (
  <svg {...defaultProps(size)} {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const IconLogo = ({ size = 22, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2L2 19h4l6-10 6 10h4L12 2z" />
    <path d="M7.5 15h9l-1.5-2.5h-6L7.5 15z" opacity="0.4" />
  </svg>
);
