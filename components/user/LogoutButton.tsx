import { logout } from "@/app/actions/logout";
import Button from "../Button";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" className="text-red-600 hover:underline text-sm">
        Logout
      </Button>
    </form>
  );
}
