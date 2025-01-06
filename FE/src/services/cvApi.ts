import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export const genCv = createAsyncThunk<any, string>(
    'cv/gen',
    async (layout) => {
        return axiosIns.get(`/public/cv/gen?layout=${layout}`, {
            includeToken: true,
            responseType: "blob",
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const getCv = createAsyncThunk<any, string>(
    'cv/get',
    async (layout) => {
        return axiosIns.get(`/public/cv?layout=${layout}`, {
            includeToken: true,
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const getListCv = createAsyncThunk<any>(
    'cv/getListCv',
    async () => {
        return axiosIns.get('/public/cv/list-cv', {
            includeToken: true,
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const updateCv = createAsyncThunk<any, any>(
    'cv/update',
    async (info) => {
        return axiosIns.post(`/public/cv/update`, info, {
            includeToken: true,
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const updateAvatarCv = createAsyncThunk<any, FormData>(
    'cv/update',
    async (formData) => {
        return axiosIns.patch(`/public/cv/update-avatar`, formData, {
            includeToken: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);