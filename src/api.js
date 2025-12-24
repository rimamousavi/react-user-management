
class UserService {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async getUsers(page, limit, filters, sort) {
    console.log(sort);

    try {
      const url = new URL(this.apiUrl);
      if (limit !== "all") {
     
        if (page) url.searchParams.append("page", page);

        if (limit) url.searchParams.append("limit", limit);
      }

      filters = filters || {};
      if (filters.search) url.searchParams.append("search", filters.search);

      if (filters.role) url.searchParams.append("role", filters.role);

      if (filters.status) url.searchParams.append("status", filters.status);

      if (sort && sort.sortBy) {
        url.searchParams.append("sortBy", sort.sortBy);

        if (sort.order) {
          url.searchParams.append("order", sort.order);
        }
      }

      const response = await fetch(url.toString());

      const users = await response.json();

      const countUrl = new URL(this.apiUrl);

      if (filters.search)
        countUrl.searchParams.append("search", filters.search);

      if (filters.role) countUrl.searchParams.append("role", filters.role);

      if (filters.status)
        countUrl.searchParams.append("status", filters.status);

      const allUsersResponse = await fetch(countUrl.toString());

      const allUsers = await allUsersResponse.json();

      const totalCount = Array.isArray(allUsers) ? allUsers.length : 0;

      return { users, totalCount };

    } catch (error) {

      console.error("Error fetching users:", error);

      return { users: [], totalCount: 0 };
    }
  }

  async findUserById(userId) {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async addUser(userData) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: "DELETE",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}
const API_URL="https://693e775f12c964ee6b6d71d4.mockapi.io/api/v1/users";
export const userService= new UserService(API_URL);