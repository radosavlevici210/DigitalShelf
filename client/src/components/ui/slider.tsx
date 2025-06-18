
import * as React from "react"
import RcSlider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { cn } from "@/lib/utils"

interface SliderProps {
  value?: number | number[]
  defaultValue?: number | number[]
  min?: number
  max?: number
  step?: number
  onChange?: (value: number | number[]) => void
  className?: string
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)}>
      <RcSlider
        {...props}
        trackStyle={{ backgroundColor: '#3b82f6' }}
        handleStyle={{
          borderColor: '#3b82f6',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        railStyle={{ backgroundColor: '#e5e7eb' }}
      />
    </div>
  )
)
Slider.displayName = "Slider"

export { Slider }
