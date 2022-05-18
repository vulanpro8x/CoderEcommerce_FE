import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import { useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersDashboard } from "../../../features/dashboard/dashboardSlice";
import { fDate } from "../../../utils/formatTime";
import { fCurrency } from "../../../utils/numberFormat";
import { SeverityPill } from "../../severity-pill";

export default function LatestOrders(props) {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.dashboard);

  useEffect(() => {
    const filter = { sortBy: "createdAt.desc" };
    dispatch(getOrdersDashboard(filter));
  }, []);
  return (
    <Card>
      <CardHeader title="Latest Orders" />
      <PerfectScrollbar>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order Ref</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">
                <Tooltip enterDelay={300} title="Sort">
                  <TableSortLabel active direction="desc">
                    Date
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow hover key={order?._id}>
                <TableCell>{order?._id}</TableCell>
                <TableCell>{order?.userId?.name}</TableCell>
                <TableCell>
                  {order.createdAt && fDate(order.createdAt, "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {order.payment && fCurrency(order.payment.total.total)}
                </TableCell>
                <TableCell>
                  <SeverityPill
                    color={
                      (order?.status === "delivered" && "success") ||
                      (order?.status === "refunded" && "error") ||
                      "warning"
                    }
                  >
                    {order?.status}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PerfectScrollbar>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          p: 2,
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </Box>
    </Card>
  );
}