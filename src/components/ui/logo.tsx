import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { SacredEmblem } from "@/components/quest/SacredEmblem";

const containerVariants = cva(
  "relative inline-block transition-all duration-300",
  {
    variants: {
      size: {
        small: "w-32 h-32",
        medium: "w-56 h-56",
        large: "w-96 h-96",
      },
      effect: {
        static: "",
        glow: "drop-shadow-[0_0_20px_rgba(244,197,66,0.55)] drop-shadow-[0_0_40px_rgba(244,197,66,0.45)]",
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
}

const SIZE_PX: Record<NonNullable<LogoProps["size"]>, number> = {
  small: 128,
  medium: 224,
  large: 384,
};

export const Logo = ({ size = "medium", effect, className, onClick }: LogoProps) => {
  const px = SIZE_PX[size];

  return (
    <div
      className={cn(
        containerVariants({ size, effect }),
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <SacredEmblem size={px} />
    </div>
  );
};
