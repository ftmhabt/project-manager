import { getUserFromCookie } from "@/lib/auth";
import Button from "./Button";
import Card from "./Card";

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
      <div>
        {/* eslint-disable-next-line react/no-unescaped-entities*/}
        <Button size="large">Today's Schedule</Button>
      </div>
    </Card>
  );
};

export default Greeting;
