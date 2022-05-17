// material
import { Container, Grid, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { REACT_APP_LIMIT } from "../app/config";
import PaginationBar from "../components/PaginationBar";
import ProductCartWidget from "../features/product/ProductCartWidget";
import ProductFilterSidebar from "../features/product/ProductFilterSidebar";
import ProductList from "../features/product/ProductList";
import ProductSidebar from "../features/product/ProductSidebar";
import { getAllProducts } from "../features/product/productSlice";
import ProductSort from "../features/product/ProductSort";
import useResponsive from "../hooks/useResponsive";

export default function SearchPage() {
  const upLg = useResponsive("up", "lg");
  let { totalPage } = useSelector((state) => state.product);
  const { id: categoryId } = useParams();
  const dispatch = useDispatch();

  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(1);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  useEffect(() => {
    let pagination = { page, limit: Number(REACT_APP_LIMIT) };
    // if (categoryId) {
    //   pagination = { ...pagination, categoryId };
    // }
    dispatch(getAllProducts(pagination));
  }, [dispatch, page]);

  return (
    <Container sx={{ mt: 5 }}>
      <Stack
        direction="row"
        flexWrap="wrap-reverse"
        alignItems="center"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mb: 5 }}
      >
        <ProductFilterSidebar
          isOpenFilter={openFilter}
          onOpenFilter={handleOpenFilter}
          onCloseFilter={handleCloseFilter}
        />
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {upLg && (
          <Grid item xs={3}>
            <ProductSidebar disableScrollBar={true} />
          </Grid>
        )}
        <Grid item xs={12} md={12} lg={9}>
          <Stack spacing={3}>
            <ProductList />
            <Stack alignItems="flex-end">
              <PaginationBar
                totalPage={+totalPage}
                setPage={setPage}
                page={+page}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <ProductCartWidget />
    </Container>
  );
}
