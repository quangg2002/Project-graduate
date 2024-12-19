import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";

export const getAllNotification = createAsyncThunk<any>(
    'notification/getAll',
    async () => {
        return axiosIns.get(`/notifications`, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const markNotificationsAsRead = createAsyncThunk<any, any>(
    'notification/read',
    async (id) => {
        return axiosIns.patch(`/notifications/mark-read/${id}`, null, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const markAllNotificationsAsRead = createAsyncThunk<any>(
    'notification/readAll',
    async () => {
        return axiosIns.patch(`/notifications/mark-read`, null, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
)

export const deleteNotification = createAsyncThunk<any, number>(
    'notification/delete',
    async (id) => {
        return axiosIns.delete(`/notifications/${id}`, {
            includeToken: true,
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
)