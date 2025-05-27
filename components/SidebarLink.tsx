"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Grid, Settings, User } from "react-feather";

const icons = { Settings, User, Grid, Calendar };

type IconName = keyof typeof icons;

export interface LinkItem {
  id: number;
  label: string;
  icon: IconName;
  link: string;
}

interface SidebarLinkProps {
  link: LinkItem;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ link }) => {
  const pathname = usePathname();
  const isActive = pathname === link.link;
  const Icon = icons[link.icon];

  return (
    <Link href={link.link} className="w-full flex justify-center items-center">
      <Icon
        size={40}
        className={clsx(
          "stroke-gray-400 hover:stroke-violet-600 transition duration-200 ease-in-out",
          isActive && "stroke-violet-600"
        )}
      />
    </Link>
  );
};

export default SidebarLink;
