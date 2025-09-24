import React from "react";
import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = React.PropsWithChildren<{}>;

const SidebarWrapper = ({ children }: Props) => {
  return (
    <div className="w-full h-full p-4 flex flex-col lg:flex-row gap-4">
      <DesktopNav />
      <main className="h-[calc(100% - 80px)] lg:h-full w-full flex flex-col gap-4">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default SidebarWrapper;
