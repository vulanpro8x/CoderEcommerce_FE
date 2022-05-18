import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TitleStyle } from "../../theme/customizations/TitleStyle";
import { fCurrency, fNumber } from "../../utils/numberFormat";
import {
  removeProductCart,
  updateCart,
  updateQuantityProductCart,
} from "./cartSlice";
const ButtonStyled = styled(Button)(({ theme }) => ({
  borderRadius: "50%",
  border: "1px solid",
  width: 30,
  minWidth: 30,
  height: 30,
  zIndex: 999,
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "_id",
    numeric: false,
    disablePadding: true,
    label: "Product",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price ($)",
  },
  {
    id: "pricesale",
    numeric: true,
    disablePadding: false,
    label: "Price Sale ($)",
  },
  {
    id: "quantity",
    numeric: true,
    disablePadding: false,
    label: "Quantity (pcs)",
  },
  {
    id: "total",
    numeric: true,
    disablePadding: false,
    label: "Total ($)",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.cart);
  const { numSelected, selected, setSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" alignItems="center" sx={{ flex: "1 1 100%" }}>
          <TitleStyle>
            <LocalMallIcon sx={{ width: "35px", height: "35px" }} />
            <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
              Cart
            </Typography>
          </TitleStyle>
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton
            loading={isLoading}
            onClick={() => {
              dispatch(
                removeProductCart({
                  productId: selected,
                })
              );
              setSelected([]);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default function CartDetail() {
  const { products, isLoading, cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n.productId._id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selected.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (title) => selected.indexOf(title) !== -1;

  // Avoid a layout jump when reaching the last page with empty products.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

  const calSubTotal = products.reduce(
    (acc, curr, index, arr) => {
      acc.subTotal = acc.subTotal + curr.productId.priceSale * curr.quantity;
      acc.shipping = acc.shipping + curr.productId.shipping * curr.quantity;
      if (index === arr.length - 1) {
        acc.subTotal = acc.subTotal / arr.length;
        acc.shipping = acc.shipping / arr.length;
        acc.total = acc.subTotal + (acc.subTotal * 10) / 100 + acc.shipping;
      }
      return acc;
    },
    { subTotal: 0, shipping: 0, total: 0 }
  );

  useEffect(() => {
    const cartUpdate = {
      ...cart,
      payment: { ...cart.payment, total: { ...calSubTotal, tax: 10 } },
    };
    dispatch(updateCart(cartUpdate));
  }, [dispatch]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={selected}
          setSelected={setSelected}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={products?.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 products.slice().sort(getComparator(order, orderBy)) */}
              {products &&
                stableSort(products, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.productId._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => {
                          handleClick(event, row.productId._id);
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.productId._id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          sx={{ p: 1 }}
                          width="500px"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Box sx={{ maxWidth: "100px", height: "100%" }}>
                              <img
                                src={row?.productId?.imageUrls?.[0]}
                                style={{ width: "100%", height: "100%" }}
                              />
                            </Box>
                            <Typography
                              component={Link}
                              to={`/detail/${row.productId._id}`}
                              variant="subtitle2"
                              color="initial"
                            >
                              {row.productId.title}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" color="initial">
                            {fCurrency(row.productId.price)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle1" color="initial">
                            {fCurrency(row.productId.priceSale)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            spacing={1}
                          >
                            <ButtonStyled
                              onClick={(event) => {
                                event.stopPropagation();

                                dispatch(
                                  updateQuantityProductCart({
                                    productId: row.productId._id,
                                    action: false,
                                  })
                                );
                              }}
                              disabled={row.quantity === 1}
                            >
                              <ArrowDownwardIcon />
                            </ButtonStyled>
                            <Typography variant="subtitle1" color="initial">
                              {fNumber(row.quantity)}
                            </Typography>
                            <ButtonStyled
                              onClick={(event) => {
                                event.stopPropagation();
                                dispatch(
                                  updateQuantityProductCart({
                                    productId: row.productId._id,
                                    action: true,
                                  })
                                );
                              }}
                            >
                              <ArrowUpwardIcon />
                            </ButtonStyled>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          {fCurrency(row.quantity * row.productId.priceSale)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}