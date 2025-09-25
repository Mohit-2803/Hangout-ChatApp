import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { MessageSquare, Users, Ban, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const requestsCount = useQuery(api.requests.count);
  const groupInvitationsCount = useQuery(api.group.countGroupInvitations);

  const paths = useMemo(() => {
    return [
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageSquare />,
        active:
          pathname === "/conversations" ||
          pathname.startsWith("/conversations"),
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <Users />,
        active: pathname === "/friends" || pathname.startsWith("/friends"),
        count: requestsCount ?? undefined,
      },
      {
        name: "Notifications",
        href: "/notifications",
        icon: <Bell />,
        active:
          pathname === "/notifications" ||
          pathname.startsWith("/notifications"),
        count: groupInvitationsCount ?? undefined,
      },
      {
        name: "Blocked",
        href: "/blocked",
        icon: <Ban />,
        active: pathname === "/blocked",
      },
    ];
  }, [pathname, requestsCount, groupInvitationsCount]);

  return paths;
};
