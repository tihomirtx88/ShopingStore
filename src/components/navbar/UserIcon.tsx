import { currentUser } from "@clerk/nextjs/server"
import { LuUser } from "react-icons/lu";

export default async function UserIcon() {
  const user = await currentUser();
  const profileImage = user?.imageUrl;

 if (profileImage) {
    return (
      <img
        src={profileImage}
        alt="User profile"
        className="w-6 h-6 rounded-full object-cover border-2 border-gray-300 dark:border-white"
      />
    );
  }
  return (
    <LuUser
      className="w-6 h-6 bg-primary rounded-full text-white border-2 border-gray-300 dark:border-white"
    />
  );
}
