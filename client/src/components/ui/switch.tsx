import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked ?? defaultChecked ?? false);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleToggle = () => {
      if (disabled) return;
      const newValue = !isChecked;
      setIsChecked(newValue);
      onChange?.(newValue);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
          isChecked ? "bg-blue-600" : "bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out",
            isChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }
)
Switch.displayName = "Switch"

export { Switch }