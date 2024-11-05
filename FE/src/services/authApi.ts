import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

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