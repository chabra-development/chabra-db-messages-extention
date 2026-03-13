// message-renderer.tsx

import type { Message } from "@prisma/client";
import { AudioPlayer } from "@/components/audio-player";
import { ContactInterative } from "@/contacts/contact-interative";
import { ContactInterativeList } from "@/contacts/contact-interative-list";
import { ContactMediaImage } from "@/contacts/contact-media-image";
import { ContactImageResponse } from "@/contacts/contact-media-image-response";
import { ContactMediaSticker } from "@/contacts/contact-media-sticker";
import { ContactMediaVideo } from "@/contacts/contact-media-video";
import { ContactMessage } from "@/contacts/contact-message";
import { ContactPhoneCard } from "@/contacts/contact-phone-card";
import { ContactPhoneCardResponse } from "@/contacts/contact-phone-card-response";
import { ContactReplyToSelectResponse } from "@/contacts/contact-reply-to-select";
import { ContactReplyToText } from "@/contacts/contact-reply-to-text";
import { ContactScopeAvaliation } from "@/contacts/contact-scope-avaliation";
import { ContactScopeTextResponse } from "@/contacts/contact-scope-text-response";
import { SystemInfoAlert } from "@/contacts/system-info-alert";
import { renderEmoji } from "@/functions/render-emoji";
import { isSafePublicUrl } from "@/functions/validate-url";
import {
  isLimeContactPayload,
  isLimeEmojiReaction,
  isLimeInteractiveButton,
  isLimeInteractiveList,
  isLimeInteractiveMessage,
  isLimeMediaContent,
  isLimeReplyToContact,
  isLimeReplyToInteractive,
  isLimeReplyToMedia,
  isLimeReplyToSelect,
  isLimeReplyToText,
  isLimeSelectContent,
  isLimeTicketContent,
} from "@/guards/lime-thread-messages.guards";
import { ContactMessageWithLink } from "./contact-message-with-link";

export type MessageRendererProps = {
  message: Pick<Message, "id" | "direction" | "content" | "sentAt" | "status">;
};

export const MessageRenderer = ({ message }: MessageRendererProps) => {
  const { id, direction, content, sentAt } = message;

  const isSent = direction === "SENT";

  // ── TEXT ──────────────────────────────────────────────
  if (typeof content === "string") {
    return isSafePublicUrl(content) ? (
      <ContactMessageWithLink
        date={sentAt}
        content={content}
        direction={direction}
      />
    ) : (
      <ContactMessage date={sentAt} content={content} direction={direction} />
    );
  }

  // ── TICKET ────────────────────────────────────────────
  if (isLimeTicketContent(content)) {
    return (
      <SystemInfoAlert
        storageDate={content.storageDate}
        team={content.team ?? "Default"}
      />
    );
  }

  // ── EMOJI ─────────────────────────────────────────────
  if (isLimeEmojiReaction(content)) {
    return (
      <ContactMessage
        date={sentAt}
        direction={direction}
        content={renderEmoji(content.emoji)}
      />
    );
  }

  // ── CONTACT ───────────────────────────────────────────
  if (isLimeContactPayload(content)) {
    return (
      <ContactPhoneCard content={content} date={sentAt} direction={direction} />
    );
  }

  // ── MEDIA ─────────────────────────────────────────────
  if (isLimeMediaContent(content)) {
    if (content.type === "audio/ogg") {
      return (
        <AudioPlayer url={content.uri} date={sentAt} direction={direction} />
      );
    }
    if (content.type.includes("video/mp4")) {
      return (
        <ContactMediaVideo
          date={sentAt}
          direction={direction}
          uri={content.uri}
        />
      );
    }
    if (content.type.includes("image/jpeg")) {
      return (
        <ContactMediaImage
          id={id}
          date={sentAt}
          direction={direction}
          uri={content.uri}
          type={content.type}
        />
      );
    }
    if (content.type.includes("sticker/webp")) {
      return (
        <ContactMediaSticker
          date={sentAt}
          direction={direction}
          uri={content.uri}
          type={content.type}
        />
      );
    }
  }

  // ── SELECT ────────────────────────────────────────────
  if (isLimeSelectContent(content) && !content.scope && isSent) {
    return (
      <ContactScopeAvaliation
        content={content}
        date={sentAt}
        direction={direction}
      />
    );
  }

  // ── INTERACTIVE (OUTBOUND) ────────────────────────────
  if (isLimeInteractiveMessage(content)) {
    if (isLimeInteractiveList(content.interactive)) {
      return (
        <ContactInterativeList
          date={sentAt}
          direction={direction}
          sections={content.interactive.action.sections}
          title={content.interactive.body.text}
        />
      );
    }
    if (isLimeInteractiveButton(content.interactive)) {
      return (
        <ContactInterative
          title={content.interactive.body.text}
          buttons={content.interactive.action.buttons}
          date={sentAt}
          direction={direction}
        />
      );
    }
  }

  // ── REPLY TO INTERACTIVE ──────────────────────────────
  if (isLimeReplyToInteractive(content)) {
    return (
      <>
        <ContactScopeTextResponse
          date={sentAt}
          direction={direction}
          title={content.replied.value}
          content={content}
        />
        {isLimeInteractiveList(content.inReplyTo.value.interactive) &&
          isSent && (
            <ContactInterativeList
              title={content.inReplyTo.value.interactive.body.text}
              sections={content.inReplyTo.value.interactive.action.sections}
              date={sentAt}
              direction={direction}
            />
          )}
        {isLimeInteractiveButton(content.inReplyTo.value.interactive) &&
          isSent && (
            <ContactInterative
              title={content.inReplyTo.value.interactive.body.text}
              buttons={content.inReplyTo.value.interactive.action.buttons}
              date={sentAt}
              direction={direction}
            />
          )}
      </>
    );
  }

  // ── REPLY TO TEXT ─────────────────────────────────────
  if (isLimeReplyToText(content)) {
    return (
      <ContactReplyToText
        date={sentAt}
        direction={direction}
        title={content.replied.value}
        response={content.inReplyTo.value}
      />
    );
  }

  // ── REPLY TO SELECT ───────────────────────────────────
  if (isLimeReplyToSelect(content)) {
    return (
      <ContactReplyToSelectResponse
        date={sentAt}
        direction={direction}
        response={content.inReplyTo.value.text}
        title={content.replied.value}
      />
    );
  }

  // ── REPLY TO MEDIA ────────────────────────────────────
  if (isLimeReplyToMedia(content)) {
    return (
      <ContactImageResponse
        date={sentAt}
        direction={direction}
        uri={content.inReplyTo.value.uri}
        type={content.inReplyTo.value.type}
        response={content.replied.value}
        id={content.inReplyTo.id}
      />
    );
  }

  // ── REPLY TO CONTACT ──────────────────────────────────
  if (isLimeReplyToContact(content)) {
    return (
      <ContactPhoneCardResponse
        date={sentAt}
        direction={direction}
        response={content.inReplyTo.value.name}
        title={content.replied.value}
      />
    );
  }

  return null;
};
