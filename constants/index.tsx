import { House, UsersRound } from "lucide-react";

export const LEFT_MENU = [
  {
    title: "홈",
    href: "/folders",
    match: {
      pathname: "/folders",
      filter: null,
    },
    icon: <House size={18} />,
  },
  {
    title: "공유중",
    href: "/folders?filter=share",
    match: {
      pathname: "/folders",
      filter: "share",
    },
    icon: <UsersRound size={18} />,
  },
];
