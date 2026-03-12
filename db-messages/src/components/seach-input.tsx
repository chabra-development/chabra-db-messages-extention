'use client'

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { InputHTMLAttributes, forwardRef } from "react"

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
    onClear?: () => void
    isLoading?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    ({ value, onChange, onClear, isLoading, className, ...props }, ref) => {
        return (
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                
                <Input
                    ref={ref}
                    type="search"
                    value={value}
                    onChange={onChange}
                    className={cn("pl-9 pr-9", className)}
                    {...props}
                />
            </div>
        )
    }
)

SearchInput.displayName = "SearchInput"