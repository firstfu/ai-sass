import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface BotAvatarProps {
  src: string;
}

export default function BotAvatar({ src }: BotAvatarProps) {
  return (
    <div>
      <Avatar className="h-12 w-12">
        <AvatarImage src={src} />
      </Avatar>
    </div>
  );
}
