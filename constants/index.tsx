import { House, UsersRound } from "lucide-react";

export const LEFT_MENU = [
  {
    title: "홈",
    url: "/folders",
    icon: <House size={18} />,
  },
  {
    title: "공유중",
    url: "/folders?filter=share",
    icon: <UsersRound size={18} />,
  },
];
