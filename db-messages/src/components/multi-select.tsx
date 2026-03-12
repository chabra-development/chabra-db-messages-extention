import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue
} from "@/components/ui/combobox"
import { useState } from "react"

type MultiSelectProps = {
    items: string[]
    onValueChange?: (value: string[]) => void
}

export const MultiSelect = ({ items, onValueChange }: MultiSelectProps) => {

    const [value, setValue] = useState<string[]>([])

    return (
        <Combobox
            items={items}
            multiple
            value={value}
            onValueChange={onValueChange ?? setValue}
        >
            <ComboboxChips className="w-2/3 min-w-0">
                <ComboboxValue>
                    {
                        value.map((item) => (
                            <ComboboxChip
                                key={item}
                                className={"bg-background"}
                            >
                                {item}
                            </ComboboxChip>
                        ))
                    }
                </ComboboxValue>
                <ComboboxChipsInput placeholder="pesquisar por filas" />
            </ComboboxChips>
            <ComboboxContent className={"w-full"}>
                <ComboboxEmpty>
                    Sem listas emcontradas com esse nome
                </ComboboxEmpty>
                <ComboboxList className="space-y-1">
                    {items.map((item) => (
                        <ComboboxItem key={item} value={item}>
                            {item}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}