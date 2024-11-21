import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// cai any dau tien la kieu return, cai thu 2 la kieu payload
export const login = createAsyncThunk<any, { username: string, password: string }>(
    'authReducers/login',
    async (payload) => {
        return axiosIns.post('/auth/login', payload)
            .then(response => { 
                response.data?.success == true && toast.success('Chào mừng bạn đến với chúng tôi'); 
                return { 
                    response: response.data 
                } 
            })
            .catch(error => { { } });
    }
);

export const registerEmployee = createAsyncThunk<any, any>(
    'authReducers/registerEmployee',
    async (info) => {
        return axiosIns.post('/employee/create', info)
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const registerEmployer = createAsyncThunk<any, any>(
    'authReducers/registerEmployer',
    async (info) => {
        return axiosIns.post('/employer/create', info)
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const changePassword = createAsyncThunk<any, any>(
    'authReducers/changePassword',
    async (info) => {
        return axiosIns.post('/auth/change-password', info, {
            includeToken: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

    export const processForgotPassword = createAsyncThunk<any, any>(
        'authReducers/processForgotPassword',
        async (email) => {
            return axiosIns.post('/auth/forgot-password', email, {
                
            })
                .then(response => { return { response: response.data } })
                .catch(error => { });
        }
    );