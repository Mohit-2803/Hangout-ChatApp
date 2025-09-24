import { Card } from "@/components/ui/card";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  imageUrl?: string;
  name: string;
};

const Header = ({ imageUrl, name }: Props) => {
  return (
    <Card className="w-full flex flex-row items-center px-4 py-3 justify-between border-b rounded-none sticky top-0 bg-card z-10">
      <div className="flex items-center gap-3">
        <Link className="block lg:hidden" href="/conversations">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10 border-2 border-primary/10">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-medium text-sm md:text-base">{name}</h2>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-xs text-muted-foreground">Online now</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Phone className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Search messages</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Block user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default Header;
