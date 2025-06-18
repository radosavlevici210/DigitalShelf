
import * as React from "react"
import { cn } from "@/lib/utils"

interface TooltipProps {
  content: string
  children: React.ReactNode
  className?: string
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => {
  return (
    <div className={cn("relative inline-block group", className)}>
      {children}
      <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-sm text-white bg-gray-900 rounded-md whitespace-nowrap">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  )
}

export { Tooltip }
