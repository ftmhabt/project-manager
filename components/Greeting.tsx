import { getUserFromCookie } from "@/lib/auth";
import Card from "./Card";
import Link from "next/link";

const getData = async () => {
  const user = await getUserFromCookie();
  return user;
};

const Greeting = async () => {
  const user = await getData();

  return (
    <Card className="w-full py-4 relative">
      <div className="mb-4">
        <h1 className="text-3xl text-gray-700 font-bold mb-4">
          Hello, {user?.firstName}!
        </h1>
        <h4 className="text-xl text-gray-400">
          Check your daily tasks and schedule
        </h4>
      </div>

      <Link
        href="/calendar"
        className="block w-1/3 rounded-3xl font-bold hover:scale-110 active:scale-100 transition duration-200 ease-in-out bg-violet-500 text-white border-transparent hover:bg-violet-600 text-xlg py-4 px-8"
      >
        {/* eslint-disable-next-line react/no-unescaped-entities*/}
        Today's Schedule
      </Link>
    </Card>
  );
};

export default Greeting;
