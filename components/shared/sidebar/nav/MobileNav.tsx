"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useConversation } from "@/hooks/useConversation";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const MobileNav = () => {
  const paths = useNavigation();
  const { isLoaded } = useAuth();

  const { isActive } = useConversation();

  if (isActive) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 w-[calc(100%-32px)] flex items-center h-16 p-2 lg:hidden">
      <nav className="w-full">
        <ul className="flex justify-evenly items-center">
          {paths.map((path, id) => {
            return (
              <li key={id} className="relative">
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger className="relative">
                      <Button
                        size={"icon"}
                        variant={path.active ? "default" : "outline"}
                        className="cursor-pointer"
                      >
                        {path.icon}
                      </Button>
                      {path.count && path.count > 0 ? (
                        <Badge
                          variant={"destructive"}
                          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {path.count}
                        </Badge>
                      ) : null}
                    </TooltipTrigger>
                  </Tooltip>
                </Link>
              </li>
            );
          })}
          <li>
            <ThemeToggle />
          </li>
          <li>
            {!isLoaded ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <UserButton />
            )}
          </li>
        </ul>
      </nav>
    </Card>
  );
};

export default MobileNav;
