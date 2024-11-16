import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";

export const favoriteJobCreate = createAsyncThunk<any, any>(
    'favoriteJob/update',
    async (id) => {
        return axiosIns.post(`/favorite-job/${id}`, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const getFavoriteJob = createAsyncThunk<any>(
    'favoriteJob/get',
    async () => {
        return axiosIns.get(`/favorite-job`, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);