import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export const updateCompany = createAsyncThunk<any, FormData>(
    'company/update',
    async (formData) => {
        return axiosIns.patch('/company', formData, {
            includeToken: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const getListCompany = createAsyncThunk<any>(
    'company/getList',
    async () => {
        return axiosIns.get('/company/all')
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const getCompany = createAsyncThunk<any>(
    'company/getCompany',
    async () => {
        return axiosIns.get('/company', {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const getBoardCompany = createAsyncThunk<any>(
    'company/getBoardCompany',
    async () => {
        return axiosIns.get('/company/board', {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const getCompanyDetails = createAsyncThunk<any, any>(
    'company/getCompany',
    async (companyId) => {
        return axiosIns.get(`/company/${companyId}`)
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);