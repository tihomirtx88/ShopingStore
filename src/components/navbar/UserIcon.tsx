import { currentUser } from "@clerk/nextjs/server"
import { LuUser } from "react-icons/lu";

export default async function UserIcon() {
  const user = await currentUser();
  const profileImage = user?.imageUrl;

  if (profileImage) {
    return <img src={profileImage} className="w-6 h-6 rounded-full object-cover"/>
  }
  return (
    <LuUser className="w-6 h-6 bg-primary rounded-full text-white"/>
  )
}
