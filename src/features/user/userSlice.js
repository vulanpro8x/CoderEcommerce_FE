import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { cloudinaryUpload } from "../../utils/cloudinary";

const initialState = {
  isLoading: false,
  error: null,
  updatedProfile: null,
  selectedUser: null,
  users: [],
  totalPage: 0,
  totalUsers: 0,
  currentPage: 1,
  filters: {},
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const updatedUser = action.payload;
      state.updatedProfile = updatedUser;
    },
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.selectedUser = action.payload;
    },
    deactiveUserSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    updateUserSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.totalUsers = action.payload.totalResults;
      state.users = action.payload.results;
      state.currentPage = action.payload.page;
    },
    handleChangeUserFilters(state, action) {
      state.isLoading = false;
      state.error = null;
      state.filters = { ...state.filters, ...action.payload };
    },
    handleClearUserFilters(state) {
      state.isLoading = false;
      state.error = null;
      state.filters = {};
    },
  },
});

export default slice.reducer;
export const {
  startLoading,
  hasError,
  updateUserProfileSuccess,
  getUserSuccess,
  getUserListSuccess,
  deactiveUserSuccess,
  updateUserSuccess,
  handleChangeUserFilters,
  handleClearUserFilters,
} = slice.actions;

export const updateUserProfile =
  ({
    userId,
    name,
    email,
    password,
    phone,
    address,
    avatarUrl,
    role,
    creditCards,
  }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const data = {
        name,
        email,
        password,
        phone,
        address,
        avatarUrl,
        role,
        creditCards,
      };
      if (!password) delete data.password;
      if (avatarUrl instanceof File) {
        const imageUrl = await cloudinaryUpload(avatarUrl);
        data.avatarUrl = imageUrl;
      }
      const response = await apiService.put(`/users/me/update`, { ...data });
      dispatch(updateUserProfileSuccess(response.data));
      dispatch(getCurrentUserProfile());
      toast.success("Update Profile successfully");
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export const getUser = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiService.get(`/users/${id}`);
    dispatch(getUserSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    toast.error(error.message);
  }
};

export const getCurrentUserProfile = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiService.get("/users/me");
    dispatch(updateUserProfileSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const getUserList = (filters) => async (dispatch, getState) => {
  dispatch(startLoading());
  try {
    filters = { ...filters, ...getState().user.filters };

    const response = await apiService.get("/users", { params: filters });
    dispatch(getUserListSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deactiveUser = (id, filters) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const repsonse = await apiService.delete(`/users/delete/${id}`);
    if (repsonse) {
      dispatch(deactiveUserSuccess());
      dispatch(getUserList(filters));
    }
    toast.success("You are deactive user sucessfully!");
  } catch (error) {
    dispatch(hasError(error));
    toast.error(error.message);
  }
};

export const updateUser = (id, updateContent, filters) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const repsonse = await apiService.put(`/users/update/${id}`, {
      ...updateContent,
    });
    if (repsonse) {
      dispatch(updateUserSuccess());

      dispatch(getUserList(filters));

      toast.success("You are updated user sucessfully!");
    }
  } catch (error) {
    dispatch(hasError(error));
    toast.error(error.message);
  }
};
