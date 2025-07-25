import Card from "./Card";
import SidebarLink, { LinkItem } from "./SidebarLink";

const links: LinkItem[] = [
  { id: 1, label: "Home", icon: "Grid", link: "/home" },
  { id: 2, label: "Calendar", icon: "Calendar", link: "/calendar" },
  { id: 3, label: "Profile", icon: "User", link: "/user" },
  { id: 4, label: "Setting", icon: "Settings", link: "#" },
];

const Sidebar = () => {
  return (
    <Card className="flex md:flex-col flex-row h-full justify-around md:mr-6 mr-3 mt-3 md:mt-0 max-h-24 md:max-h-full">
      {links.map((link) => (
        <SidebarLink key={link.id} link={link} />
      ))}
    </Card>
  );
};

export default Sidebar;
