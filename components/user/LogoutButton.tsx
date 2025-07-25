import { logout } from "@/app/actions/logout";
import Button from "../Button";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" className="w-full text-sm">
        Logout
      </Button>
    </form>
  );
}
