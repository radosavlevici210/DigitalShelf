
import * as React from "react"
import RcSwitch from 'rc-switch'
import 'rc-switch/assets/index.css'
import { cn } from "@/lib/utils"

interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
  size?: 'small' | 'default'
}

const Switch = React.forwardRef<HTMLElement, SwitchProps>(
  ({ className, size = 'default', ...props }, ref) => (
    <RcSwitch
      ref={ref as any}
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        size === 'small' && 'rc-switch-small',
        className
      )}
      {...props}
    />
  )
)
Switch.displayName = "Switch"

export { Switch }
