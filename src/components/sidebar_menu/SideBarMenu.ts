import { Dashboard as DashboardIcon } from "@mui/icons-material";
import GroupIcon from '@mui/icons-material/Group';
import { MenuItem } from "@/types/MenuItemType";
import ListIcon from '@mui/icons-material/List';

export const MenuItems: MenuItem[] = [
  {
    icon: DashboardIcon,
    label: "Bảng điều khiển",
    path: "/admin/dashboard",
    role: ["admin", "user"],
  },
  {
    icon: GroupIcon,
    label: "Người dùng",
    path: "",
    children: [
      {
        icon:ListIcon,
        label: "Danh sách",
        path: "/admin/manage_users",
        role: ["admin"],
      },
    //   {
    //     label: "Menu con 2",
    //     path: "/parent/child2",
    //     role: ["user"],
    //   },
    ],
  },
  {
    icon: DashboardIcon,
    label: "Sản phẩm",
    path: "/admin/manage_product",
    role: ["admin", "user"],
  },
];
