import { useState } from "react";
import { UserContext } from "./user-context";

import useSWR from "swr";
import axios from "axios";
import useSWRMutation from "swr/mutation";

axios.defaults.baseURL = "https://693e775f12c964ee6b6d71d4.mockapi.io/api/v1";
const API_URL = "/users";

// --- Fetchers
const api = {
  add: async (url, { arg }) => axios.post(url, arg),
  update: async (url, { arg }) => {
    const { id, ...data } = arg;
    return axios.put(`${url}/${id}`, data);
  },
  delete: async (url, { arg: id }) => axios.delete(`${url}/${id}`),
};

export function UserProvider({ children }) {
  // --- States
  const [filter, setFilter] = useState({ role: "", status: "", search: "" });
  const [sort, setSort] = useState({ sortBy: "", order: "" });
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });

  function cleanParams(obj) {
    const clean = {};
    Object.keys(obj).forEach((key) => {
      if (
        obj[key] !== "" &&
        obj[key] !== "all" &&
        obj[key] !== null &&
        obj[key] !== undefined
      ) {
        clean[key] = obj[key];
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
      const params = cleanParams({ ...filter, ...sort, ...pagination });
      return axios.get(url, { params: params });
    }
  );

  // --- Data Fetching without pagination
  const { data: allUsers } = useSWR(
    [API_URL, filter, sort],
    ([url, filter, sort]) => {
      const params = cleanParams({ ...filter, ...sort });
      return axios.get(url, { params: params });
    }
  );
  // --- Mutations
  const addMutation = useSWRMutation(API_URL, api.add);
  const updateMutation = useSWRMutation(API_URL, api.update);
  const deleteMutation = useSWRMutation(API_URL, api.delete);

  // --- Helper
  const create = async (formData, onSuccess) => {
    try {
      await addMutation.trigger(formData);
      mutate();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error("Failed to create user", e);
    }
  };
  const update = async (dataWithId, onSuccess) => {
    try {
      await updateMutation.trigger(dataWithId);
      mutate();
      if (onSuccess) onSuccess();
    } catch (e) {
      console.log("Failed to update user", e);
    }
  };
  const remove = async (id, onSuccess) => {
    try {
      await deleteMutation.trigger(id);
      mutate();
      alert("are you sure to delete this user?");
      if (onSuccess) onSuccess();
    } catch (e) {
      console.log("Failed to delete user", e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        data: {
          users: users?.data,
          allUsers: allUsers?.data,
          isLoading,
          total: allUsers?.data?.length || 0,
        },
        state: { filter, sort, pagination },
        actions: {
          setFilter,
          setSort,
          setPage: (page) => setPagination((prev) => ({ ...prev, page })),
          setLimit: (limit) => setPagination((prev) => ({ ...prev, limit })),
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
