import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";

export const followCompany = createAsyncThunk<any, any>(
    'follow-company/create',
    async (companyId) => {
        return axiosIns.post(`/follow-company/${companyId}`, null, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const getFollowCompany = createAsyncThunk<any>(
    'follow-company/get',
    async () => {
        return axiosIns.get(`/follow-company/list`, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);
