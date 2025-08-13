import Button from "components/Button";
import { logout } from "../actions/logout";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" className="w-full text-sm">
        Logout
      </Button>
    </form>
  );
}
