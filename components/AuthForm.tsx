"use client";

import { register, signin } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Input from "./Input";
import Card from "./Card";
import Link from "next/link";
import Button from "./Button";

const registerContent = {
  linkUrl: "/signin",
  linkText: "Already have an account?",
  header: "Create a new account",
  subHeader: "Just a few things to get started",
  buttonText: "Register",
};

const signinContent = {
  linkUrl: "/register",
  linkText: "Don't have an account?",
  header: "Welcome back!",
  subHeader: "Enter your credentials to access your account",
  buttonText: "Sign in",
};

const initial = { email: "", password: "", firstName: "", lastName: "" };

type AuthMode = "register" | "signin";
interface AuthFormProps {
  mode: AuthMode;
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [formState, setFormState] = useState({ ...initial });
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "register") {
      await register(formState);
    } else {
      await signin(formState);
    }

    setFormState(initial);
    router.replace("/home");
  };

  const content = mode === "register" ? registerContent : signinContent;

  return (
    <Card>
      <div className="w-full">
        <div className="text-center">
          <h2 className="text-3xl mb-2 text-black">{content.header}</h2>
          <p className="text-lg text-black/25">{content.subHeader}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="py-10 w-full">
        {mode === "register" && (
          <div className="flex mb-8 justify-between">
            <div className="pr-2">
              <div className="text-lg mb-4 ml-2 text-black/50">First Name</div>
              <Input
                required
                placeholder="First Name"
                value={formState.firstName}
                className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
                onChange={(e) =>
                  setFormState((s) => ({ ...s, firstName: e.target.value }))
                }
              />
            </div>
            <div className="pr-2">
              <div className="text-lg mb-4 ml-2 text-black/50">Last Name</div>
              <Input
                required
                placeholder="Last Name"
                value={formState.firstName}
                className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
                onChange={(e) =>
                  setFormState((s) => ({ ...s, lastName: e.target.value }))
                }
              />
            </div>
          </div>
        )}
        <div className="mb-8">
          <div className="text-lg mb-4 ml-2 text-black/50">Email</div>
          <Input
            required
            type="email"
            placeholder="Email"
            value={formState.email}
            className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
            onChange={(e) =>
              setFormState((s) => ({ ...s, email: e.target.value }))
            }
          />
        </div>
        <div className="mb-8">
          <div className="text-lg mb-4 ml-2 text-black/50">Password</div>
          <Input
            required
            type="password"
            placeholder="Password"
            value={formState.password}
            className="border-solid border-gray border-2 px-6 py-2 text-lg rounded-3xl w-full"
            onChange={(e) =>
              setFormState((s) => ({ ...s, password: e.target.value }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span>
              <Link
                prefetch
                href={content.linkUrl}
                className="text-blue-600 font-bold"
              >
                {content.linkText}
              </Link>
            </span>
          </div>
          <div>
            <Button type="submit" intent="secondary">
              {content.buttonText}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default AuthForm;
