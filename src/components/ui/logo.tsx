import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import logoGlow from "@/assets/sacredworld-logo-official.png";
import logoMain from "@/assets/sacredworld-logo-official.png";

const containerVariants = cva(
  "relative inline-block rounded-full overflow-hidden transition-all duration-300",
  {
    variants: {
      size: {
        small: "w-32 h-32",
        medium: "w-56 h-56",
        large: "w-96 h-96",
      },
      effect: {
        static: "",
        glow: "drop-shadow-[0_0_20px_rgba(244,197,66,0.75)] drop-shadow-[0_0_40px_rgba(244,197,66,0.75)]",
        pulse: "animate-pulse",
      },
    },
    defaultVariants: {
      size: "medium",
      effect: "static",
    },
  }
);

export interface LogoProps extends VariantProps<typeof containerVariants> {
  className?: string;
  onClick?: () => void;
  variant?: "main" | "icon";
}

export const Logo = ({
  size,
  effect,
  className,
  onClick,
  variant = "icon",
}: LogoProps) => {
  const logoSrc = variant === "main" ? logoMain : logoGlow;

  return (
    <div
      className={cn(
        containerVariants({ size, effect }),
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <img
        src={logoSrc}
        alt="Sacred World Logo"
        className="w-full h-full object-contain object-center scale-[1.45]"
      />
    </div>
  );
};
