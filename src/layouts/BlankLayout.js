import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import { Stack } from "@mui/material";
import AlertMsg from "../components/AlertMsg";

function BlankLayout() {
  return (
    <Stack minHeight="100vh">
      <AlertMsg />

      <Outlet />
    </Stack>
  );
}

export default BlankLayout;
