import type { ComponentProps } from "react";

export function stringToHTML(
	html: string,
	props?: ComponentProps<"div">
) {
	const normalizedHTML = html.replace(/\n/g, "<br />");

	return (
		<div
			dangerouslySetInnerHTML={{ __html: normalizedHTML }}
			{...props}
		/>
	);
}
