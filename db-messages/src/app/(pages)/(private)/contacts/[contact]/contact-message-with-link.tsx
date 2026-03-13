"use client";

import { format } from "date-fns";
import { z } from "zod";
import { LinkPreviewCard } from "@/components/link-preview-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const URL_REGEX = /https?:\/\/[^\s]+/g;

const VALID_TLDS = new Set([
  "com",
  "br",
  "net",
  "org",
  "io",
  "dev",
  "app",
  "co",
  "ai",
  "edu",
  "gov",
  "info",
  "biz",
  "xyz",
  "me",
  "us",
  "uk",
  "de",
  "fr",
  "es",
  "it",
  "ca",
  "au",
  "jp",
]);

export const safeUrlSchema = z.string().refine((value) => {
  try {
    const url = new URL(value);

    // protocolo
    if (!["http:", "https:"].includes(url.protocol)) return false;

    const hostname = url.hostname.toLowerCase();

    // bloquear localhost
    if (hostname === "localhost") return false;

    // bloquear IP privado
    if (
      /^10\./.test(hostname) ||
      /^192\.168\./.test(hostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname) ||
      /^127\./.test(hostname)
    ) {
      return false;
    }

    // deve ter ponto
    if (!hostname.includes(".")) return false;

    const parts = hostname.split(".");
    const tld = parts[parts.length - 1];

    // validar TLD
    if (!VALID_TLDS.has(tld)) return false;

    return true;
  } catch {
    return false;
  }
}, "Invalid or unsafe URL");

function parseMessageContent(content: string) {
  const parts: { type: "text" | "link"; value: string }[] = [];
  const urls: string[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(URL_REGEX.source, "g");

  while ((match = regex.exec(content)) !== null) {
    const candidate = match[0];

    const validation = safeUrlSchema.safeParse(candidate);

    if (!validation.success) {
      continue;
    }

    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        value: content.slice(lastIndex, match.index),
      });
    }

    parts.push({ type: "link", value: candidate });
    urls.push(candidate);

    lastIndex = match.index + candidate.length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      value: content.slice(lastIndex),
    });
  }

  return {
    parts,
    urls: Array.from(new Set(urls)),
  };
}

export const ContactMessageWithLink = ({
  direction,
  content,
  date,
}: {
  direction: string;
  content: string;
  date: Date;
}) => {
  const { parts, urls } = parseMessageContent(content);

  const isSent = direction === "SENT";

  return (
    <Card
      className={cn(
        "max-w-1/2 w-full text-sm py-2 gap-2",
        isSent
          ? "ml-auto bg-message rounded-tr-none"
          : "mr-auto bg-muted rounded-tl-none",
      )}
    >
      {urls.length > 0 && (
        <CardContent className="pb-0 px-2 space-y-2">
          {urls.map((url) => (
            <LinkPreviewCard key={url} url={url} />
          ))}
        </CardContent>
      )}
      <CardHeader className="px-3 py-1">
        <CardTitle className="text-sm font-normal leading-relaxed wrap-break-word whitespace-pre-wrap truncate">
          {parts.map((part, i) =>
            part.type === "link" ? (
              <a
                key={i}
                href={part.value}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "underline underline-offset-2 transition-colors",
                  isSent
                    ? "text-primary-foreground/90 hover:text-primary-foreground"
                    : "text-primary hover:text-primary/80",
                )}
              >
                {part.value}
              </a>
            ) : (
              <span key={i}>{part.value}</span>
            ),
          )}
        </CardTitle>
      </CardHeader>
      <CardFooter className="px-3 pt-0">
        <CardDescription className="ml-auto">
          {format(new Date(date), "HH:mm")}
        </CardDescription>
      </CardFooter>
    </Card>
  );
};
