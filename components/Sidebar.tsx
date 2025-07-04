import Card from "./Card";
import SidebarLink, { LinkItem } from "./SidebarLink";

const links: LinkItem[] = [
  { id: 1, label: "Home", icon: "Grid", link: "/home" },
  { id: 2, label: "Calendar", icon: "Calendar", link: "/calendar" },
  { id: 3, label: "Profile", icon: "User", link: "/profile" },
  { id: 4, label: "Setting", icon: "Settings", link: "/setting" },
];

const Sidebar = () => {
  return (
    <Card className="flex flex-col h-full justify-around mr-6">
      {links.map((link) => (
        <SidebarLink key={link.id} link={link} />
      ))}
    </Card>
  );
};

export default Sidebar;
