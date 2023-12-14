import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import React from "react";

export default function UserAvatar() {
  const { user } = useUser();

  return (
    <div>
      <Avatar className="h-12 w-12">
        <AvatarImage src={user?.imageUrl} />
      </Avatar>
    </div>
  );
}
