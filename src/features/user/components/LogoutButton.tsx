import { logout } from "@/app/features/user/actions/logout";
import Button from "@/components/Button";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" className="w-full text-sm">
        Logout
      </Button>
    </form>
  );
}
