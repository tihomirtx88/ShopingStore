import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: `
          bg-primary text-primary-foreground 
          hover:bg-[hsl(var(--primary)/0.9)] 
          active:scale-[0.98] 
          shadow-sm hover:shadow-md
        `,
        destructive: `
          bg-destructive text-destructive-foreground 
          hover:bg-[hsl(var(--destructive)/0.9)] 
          active:scale-[0.98]
          shadow-sm hover:shadow-md
        `,
       outline: `
          border border-black dark:border-white
          bg-background 
          text-foreground 
          hover:bg-[hsl(var(--accent)/0.3)] 
          dark:hover:bg-[hsl(var(--accent)/0.2)]
          active:scale-[0.98]
        `,
        secondary: `
          bg-secondary text-secondary-foreground 
          hover:bg-[hsl(var(--secondary)/0.8)] 
          active:scale-[0.98]
        `,
        ghost: `
          text-foreground 
          hover:bg-[hsl(var(--accent)/0.4)] 
          dark:hover:bg-[hsl(var(--accent)/0.3)] 
          active:scale-[0.98]
        `,
        link: `
          text-primary underline-offset-4 
          hover:underline hover:text-[hsl(var(--primary)/0.8)]
        `,
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
