
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { MenuItem } from '@/types/MenuItemType';



export const MenuItems: MenuItem[] = [
    {
        // icon: <DashboardIcon />,
        label: "Bảng điều khiển",
        path: "/admin/dashboard",
        role: ["admin", "user"] // Ví dụ về role
    },
    {
        label: "Người dùng",
        path: "/admin/manage_users",
        children: [
            {
                label: "Menu con 1",
                path: "/parent/child1",
                role: ["admin"]
            },
            {
                label: "Menu con 2",
                path: "/parent/child2",
                role: ["user"]
            }
        ]
    },
    {
        // icon: <DashboardIcon />,
        label: "Sản phẩm",
        path: "/admin/manage_product",
        role: ["admin", "user"] // Ví dụ về role
    },
];