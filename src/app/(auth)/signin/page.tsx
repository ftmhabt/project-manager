import AuthForm from "features/user/components/AuthForm";
import Credentials from "features/user/components/Credentials";

export default function Signin() {
  return (
    <div className="m-3">
      <AuthForm mode="signin" />
      <Credentials />
    </div>
  );
}
