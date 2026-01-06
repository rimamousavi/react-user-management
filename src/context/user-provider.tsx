import { useState, ReactNode } from "react";
import { UserContext } from "./user-context";

import useSWR from "swr";
import axios from "axios";
import useSWRMutation from "swr/mutation";

axios.defaults.baseURL = "http://localhost:3000";
const API_URL = "/users";

interface User {
  id: string | number;
  [key: string]: unknown;
}

interface FilterState {
  role: string;
  status: string;
  search: string;
}

interface SortState {
  sortBy: string;
  order: string;
}

interface PaginationState {
  page: number;
  limit: number;
}

interface UserProviderProps {
  children: ReactNode;
}

// --- Fetchers ---
const api = {
  add: async (url: string, { arg }: { arg: Omit<User, "id"> }) =>
    axios.post(url, arg),

  update: async (url: string, { arg }: { arg: User }) => {
    const { id, ...data } = arg;
    return axios.patch(`${url}/${id}`, data);
  },

  delete: async (url: string, { arg: id }: { arg: string | number }) =>
    axios.delete(`${url}/${id}`),
};

export function UserProvider({ children }: UserProviderProps) {
  // --- States
  const [filter, setFilter] = useState<FilterState>({
    role: "",
    status: "",
    search: "",
  });
  const [sort, setSort] = useState<SortState>({ sortBy: "", order: "" });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 5,
  });

  // Helper to remove empty keys from params
  function cleanParams(obj: Record<string, unknown>) {
    const clean: Record<string, unknown> = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (
        value !== "" &&
        value !== "all" &&
        value !== null &&
        value !== undefined
      ) {
        clean[key] = value;
      }
    });
    return clean;
  }

  // --- Data Fetching with pagination
  const {
    data: users,
    isLoading,
    mutate,
  } = useSWR(
    [API_URL, filter, sort, pagination],
    ([url, filter, sort, pagination]) => {
      const params = cleanParams({ ...filter, ...sort });
      const apiParams = {
        ...params,
        _page: pagination.page,
        _per_page: pagination.limit || 1000,
      };
      return axios.get(url, { params: apiParams });
    }
  );

  // --- Data Fetching without pagination (for 'allUsers' list)
  const { data: allUsers } = useSWR(
    [API_URL, filter, sort],
    ([url, filter, sort]) => {
      const params = cleanParams({ ...filter, ...sort });
      const apiParams = {
        ...params,
        _per_page: 1000,
      };
      return axios.get(url, { params: apiParams });
    }
  );

  // --- Mutations
  const addMutation = useSWRMutation(API_URL, api.add);
  const updateMutation = useSWRMutation(API_URL, api.update);
  const deleteMutation = useSWRMutation(API_URL, api.delete);

  // --- Helper Functions
  const create = async (formData: Omit<User, "id">, onSuccess?: () => void) => {
    try {
      await addMutation.trigger(formData);
      mutate();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Failed to create user", e);
    }
  };

  const update = async (dataWithId: User, onSuccess?: () => void) => {
    try {
      await updateMutation.trigger(dataWithId);
      mutate();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.log("Failed to update user", e);
    }
  };

  const remove = async (id: string | number, onSuccess?: () => void) => {
    try {
      if (window.confirm("Are you sure you want to delete this user?")) {
        await deleteMutation.trigger(id);
        mutate();
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      console.log("Failed to delete user", e);
    }
  };

  console.log("allUsers:", allUsers);

  return (
    <UserContext.Provider
      value={{
        data: {
          users: users?.data?.data,
          allUsers: allUsers?.data,
          isLoading,
          total: allUsers?.data?.length || 0,
        },
        state: { filter, sort, pagination },
        actions: {
          setFilter,
          setSort,
          setPage: (page: number) =>
            setPagination((prev) => ({ ...prev, page })),
          setLimit: (limit: string | number) =>
            setPagination((prev) => ({ ...prev, limit: Number(limit) })),
          create,
          update,
          remove,
          refresh: mutate,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
