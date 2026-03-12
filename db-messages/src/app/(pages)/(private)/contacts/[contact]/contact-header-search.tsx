import { CaledarRange } from "@/components/caledar-range"
import { SearchInput } from "@/components/seach-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { Calendar, Images, Search } from "lucide-react"
import { AccordeonSheetContact } from "./accordion-sheet-contact"

export const ContactHeaderSearch = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"}>
                    <Search className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-card">
                <SheetHeader className="flex-row items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size={"icon"}
                                variant="outline"
                            >
                                <Calendar />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="-translate-x-10 bg-card"
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <CaledarRange />
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <SheetTitle>
                        Pesquisar mensagens
                    </SheetTitle>
                </SheetHeader>
                <div className="px-4">
                    <SearchInput className="rounded-full" />
                </div>
                <Separator />
                <Card className="mx-4">
                    <CardHeader>
                        <CardTitle>
                            <div className="flex items-center gap-2">
                                <Images />
                                Medias, links e docs
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AccordeonSheetContact />
                    </CardContent>
                </Card>
            </SheetContent>
        </Sheet>
    )
}
