/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

export default function Sidebar({ activeTab, setActiveTab }: any) {
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
        {items.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              selected={activeTab === item}
              onClick={() => setActiveTab(item)}
              sx={{
                borderRadius: 2,
                my: 0.5,
                "&.Mui-selected": { bgcolor: "#4f46e5" },
              }}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
