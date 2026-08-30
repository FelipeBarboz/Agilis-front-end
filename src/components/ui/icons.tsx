import Image from "next/image";
import {
  Home,
  Wrench,
  Headphones,
  Clock,
  Search,
  User,
  Monitor,
  Zap,
  Sparkles,
  Droplets,
  PaintBucket,
  LayoutGrid,
  Store,
  Heart,
  Bell,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LogoProps = {
  size?: number;
  style?: React.CSSProperties;
  className?: string;
};

// ─── Ícones de navegação ──────────────────────────────────────────────────────

export const IconHome       = ({ size = 20, ...props }) => <Home       size={size} {...props} />;
export const IconServices   = ({ size = 20, ...props }) => <Wrench     size={size} {...props} />;
export const IconSupport    = ({ size = 20, ...props }) => <Headphones size={size} {...props} />;
export const IconHistory    = ({ size = 20, ...props }) => <Clock      size={size} {...props} />;
export const IconSearch     = ({ size = 18, ...props }) => <Search     size={size} {...props} />;
export const IconUser       = ({ size = 22, ...props }) => <User       size={size} {...props} />;
export const IconStore      = ({ size = 22, ...props }) => <Store      size={size} {...props} />;
export const IconFavorites  = ({ size = 22, ...props }) => <Heart      size={size} {...props} />;
export const IconBell       = ({ size = 20, ...props }) => <Bell       size={size} {...props} />;

// ─── Ícones de categoria ──────────────────────────────────────────────────────

export const IconAll        = ({ size = 40, ...props }) => <LayoutGrid  size={size} {...props} />;
export const IconTech       = ({ size = 40, ...props }) => <Monitor     size={size} {...props} />;
export const IconElectric   = ({ size = 40, ...props }) => <Zap         size={size} {...props} />;
export const IconCleaning   = ({ size = 40, ...props }) => <Sparkles    size={size} {...props} />;
export const IconPlumbing   = ({ size = 40, ...props }) => <Droplets    size={size} {...props} />;
export const IconPainting   = ({ size = 40, ...props }) => <PaintBucket size={size} {...props} />;

// ─── Logo ─────────────────────────────────────────────────────────────────────

export const IconLogo = ({ size = 22, className }: LogoProps) => (
  <span
    className={`inline-flex items-center justify-center rounded-md bg-primary overflow-hidden p-1 ${className ?? ""}`}
    style={{ width: size, height: size }}
  >
    <Image
      src="/img/side-bar-logo.png"
      alt="Agilis"
      width={size}
      height={size}
      className="object-contain"
    />
  </span>
);