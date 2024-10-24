import { Icon } from "@iconify/react";

export const SIDENAV_ITEMS = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: (
      <Icon icon="lucide:square-dashed-mouse-pointer" width="24" height="24" />
    ),
  },
  {
    title: "Dasawisma",
    path: "/dasawisma",
    icon: <Icon icon="mdi:family" width="24" height="24" />,
  },
  {
    title: "Penduduk",
    path: "/penduduk",
    icon: <Icon icon="majesticons:community-line" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: "Keluarga", path: "/penduduk/keluarga" },
      { title: "Biodata", path: "/penduduk/biodata" },
      { title: "Kehamilan & Kematian", path: "/penduduk/kehamilan-kematian" },
      { title: "PUS", path: "/penduduk/pus" },
      { title: "WUS", path: "/penduduk/wus" },
    ],
  },
  {
    title: "Kegiatan Dasawisma",
    path: "/kegiatan",
    icon: <Icon icon="mdi:event-available-outline" width="24" height="24" />,
  },
  {
    title: "Manajemen",
    path: "/manajemen",
    icon: (
      <Icon
        icon="material-symbols:manage-accounts-outline-rounded"
        width="24"
        height="24"
      />
    ),
    submenu: true,
    subMenuItems: [{ title: "User", path: "/manajemen/user" }],
  },
];
