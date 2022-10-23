import axios, { AxiosError } from "axios";
import API_PATHS from "~/constants/apiPaths";
import { Product, AvailableProduct } from "@commons/models/Product";
import { useQuery, useQueryClient, useMutation } from "react-query";
import React from "react";

export function useProducts() {
  return useQuery<AvailableProduct[], AxiosError>("products", async () => {
    const res = await axios.get<AvailableProduct[]>(API_PATHS.products);
    return res.data;
  });
}

export function useProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ["product", { id }],
    async () => {
      const res = await axios.get<AvailableProduct>(
        `${API_PATHS.products}/${id}`
      );
      return res.data;
    },
    { enabled: !!id }
  );
}

export function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("products", { exact: true }),
    []
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(["product", { id }], { exact: true }),
    []
  );
}

export function useUpsertProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.post<AvailableProduct>(API_PATHS.products, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}

export function useDeleteProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.products}/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
      },
    })
  );
}
