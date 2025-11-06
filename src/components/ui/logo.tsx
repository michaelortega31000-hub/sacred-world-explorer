import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import logoGlow from "@/assets/logo-glow.png";
import logoMain from "@/assets/sacredworld-logo-new.png";

const logoVariants = cva(
  "transition-all duration-300 object-contain",
  {
    variants: {
      size: {
        small: "w-8 h-8",
        medium: "w-16 h-16",
        large: "w-32 h-32",
      },
      effect: {
        static: "",
        glow: "drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)] animate-pulse",
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
              "absolute inset-0 opacity-60 blur-sm animate-pulse"
            )}
            aria-hidden="true"
          />
          <img
            src={logoGlow}
            alt=""
            className={cn(
              logoVariants({ size }),
              "absolute inset-0 opacity-40 blur-md animate-pulse"
            )}
            aria-hidden="true"
            style={{ animationDelay: "0.5s" }}
          />
        </>
      )}
    </div>
  );
};
