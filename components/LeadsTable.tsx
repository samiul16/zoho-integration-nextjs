/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function LeadsTable() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    Company: "",
    Email: "",
  });

  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    const json = await res.json();
    if (res.ok) setLeads(json.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreate = async () => {
    await fetch("/api/leads", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    setOpen(false);
    fetchLeads();
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Leads
        </Typography>
        <div>
          <IconButton onClick={fetchLeads}>
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ ml: 2, borderRadius: 2 }}
          >
            New Lead
          </Button>
        </div>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Company</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((l: any) => (
              <TableRow key={l.id} hover>
                <TableCell>
                  {l.First_Name} {l.Last_Name}
                </TableCell>
                <TableCell>{l.Email}</TableCell>
                <TableCell>{l.Company}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AnimatePresence>
        {open && (
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            className="flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Box
                sx={{
                  width: 400,
                  bgcolor: "white",
                  p: 4,
                  borderRadius: 3,
                  boxShadow: 24,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Create New Lead
                </Typography>
                <TextField
                  fullWidth
                  label="First Name"
                  margin="normal"
                  onChange={(e) =>
                    setFormData({ ...formData, First_Name: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  margin="normal"
                  onChange={(e) =>
                    setFormData({ ...formData, Last_Name: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Company"
                  margin="normal"
                  onChange={(e) =>
                    setFormData({ ...formData, Company: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Email"
                  margin="normal"
                  onChange={(e) =>
                    setFormData({ ...formData, Email: e.target.value })
                  }
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, py: 1.5 }}
                  onClick={handleCreate}
                >
                  Save Lead
                </Button>
              </Box>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </Paper>
  );
}
