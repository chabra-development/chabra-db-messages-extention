"use client"

import { Aside } from "@/components/aside"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ReactNode } from "react"

interface ContactsLayoutWrapperProps {
    children: ReactNode
}

export function ContactsLayoutWrapper({
    children
}: ContactsLayoutWrapperProps) {
    return (
        <div className="w-full h-full overflow-hidden">
            <ResizablePanelGroup
                orientation="horizontal"
                className="size-full"
            >
                <ResizablePanel
                    defaultSize={"25%"}
                    minSize={"15%"}
                    maxSize={"40%"}
                    className="size-full"
                >
                    <Aside />
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel
                    defaultSize={"75%"}
                    minSize={"40%"}
                    maxSize={"85%"}
                    className="size-full"
                >
                    {children}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}