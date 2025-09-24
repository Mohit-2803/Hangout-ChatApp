"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/useNavigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const DesktopNav = () => {
  const paths = useNavigation();
  const { isLoaded } = useAuth();

  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <div className="flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </Link>
        <nav>
          <ul className="flex flex-col items-center gap-4">
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
                      <TooltipContent>
                        <p>{path.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        {!isLoaded ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <UserButton />
        )}
      </div>
    </Card>
  );
};

export default DesktopNav;
