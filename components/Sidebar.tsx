"use client";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  const items = ["Leads", "Accounts", "Contacts"];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <Typography
        variant="h6"
        sx={{ p: 2, fontWeight: "bold", color: "#6366f1" }}
      >
        ZOHO CRM
      </Typography>
      <List>
        {items.map((item) => {
          // Construct the path for this item (e.g., "/leads")
          const path = `/${item.toLowerCase()}`;

          return (
            <ListItem key={item} disablePadding>
              <ListItemButton
                // Check if current pathname matches the item path
                selected={pathname === path}
                onClick={() => router.push(path)}
                sx={{
                  borderRadius: 2,
                  my: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "#4f46e5 !important",
                    "&:hover": { bgcolor: "#4f46e5" },
                  },
                }}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
