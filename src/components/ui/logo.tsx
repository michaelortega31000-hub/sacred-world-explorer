import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import logoGlow from "@/assets/logo-glow.png";
import logoMain from "@/assets/logo-v4.png";

const logoVariants = cva(
  "transition-all duration-300 object-contain",
  {
    variants: {
      size: {
        small: "w-32 h-32",
        medium: "w-56 h-56",
        large: "w-96 h-96",
      },
      effect: {
        static: "",
        glow: "drop-shadow-[0_0_20px_rgba(244,197,66,0.75)] drop-shadow-[0_0_40px_rgba(244,197,66,0.75)] scale-[1.45]",
        pulse: "animate-pulse",
      },
    },
    defaultVariants: {
      size: "medium",
      effect: "static",
    },
  }
);

export interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
  onClick?: () => void;
  variant?: "main" | "icon";
}

export const Logo = ({ 
  size, 
  effect, 
  className, 
  onClick,
  variant = "icon"
}: LogoProps) => {
  const logoSrc = variant === "main" ? logoMain : logoGlow;
  
  return (
    <div className={cn("relative inline-block", className)}>
      <img
        src={logoSrc}
        alt="Sacred World Logo"
        className={cn(
          logoVariants({ size, effect }),
          onClick && "cursor-pointer hover:scale-110"
        )}
        onClick={onClick}
      />
      {effect === "glow" && (
        <>
          <img
            src={logoGlow}
            alt=""
            className={cn(
              logoVariants({ size }),
              "absolute inset-0 opacity-60 blur-md scale-110"
            )}
            aria-hidden="true"
          />
          <img
            src={logoGlow}
            alt=""
            className={cn(
              logoVariants({ size }),
              "absolute inset-0 opacity-40 blur-xl scale-125"
            )}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
};
