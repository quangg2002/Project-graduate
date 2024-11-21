import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns"; // Sử dụng instance axiosIns

export const getEmployer = createAsyncThunk<any>(
    'employer/get',
    async () => {
      return axiosIns.get('/employer', {
        includeToken: true
      }).then(response => { return { response: response.data } })
        .catch(error => { })
    }
  );

export const updateEmployer = createAsyncThunk<any, FormData>(
    'employer/update',
    async (formData) => {
        return axiosIns.patch('/employer', formData, {
            includeToken: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);
