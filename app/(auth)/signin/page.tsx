import AuthForm from "@/app/features/user/components/AuthForm";
import Credentials from "@/app/features/user/components/Credentials";

export default function Signin() {
  return (
    <div className="m-3">
      <AuthForm mode="signin" />
      <Credentials />
    </div>
  );
}
