import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export const cityList = createAsyncThunk<any, { name: string }>(
    'city/list',
    async (payload) => {
        try {
            const response = await axiosIns.get('/auto-fill/city', {
                params: { name: payload.name }
            });
            return { response: response.data }; 
        } catch (error: any) {
            toast.error("An error occurred");
        }
    }
);

export const districtList = createAsyncThunk<any, { name?: string; cityIds?: number }>('district/list',
    async (payload) => {
        try {
            const response = await axiosIns.get('/auto-fill/district', {
                params: {
                    name: payload.name,
                    cityIds: payload.cityIds
                }
            });
            return { response: response.data };
        } catch (error: any) {
            toast.error("An error occurred");
        }
    });

export const salaryList = createAsyncThunk<any>(
    'salary/list',
    async () => {
        return axiosIns.get('/auto-fill/salary')
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const jobTypeList = createAsyncThunk<any>(
    'job-type/list',
    async () => {
        return axiosIns.get('/auto-fill/job-type', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const experienceList = createAsyncThunk<any>(
    'experience/list',
    async () => {
        return axiosIns.get('/auto-fill/year-experience', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const positionList = createAsyncThunk<any>(
    'position/list',
    async () => {
        return axiosIns.get('/auto-fill/position', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const industryList = createAsyncThunk<any>(
    'industry/list',
    async () => {
        return axiosIns.get('/auto-fill/industry')
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const educationList = createAsyncThunk<any>(
    'education/list',
    async () => {
        return axiosIns.get('/auto-fill/education')
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const contracTypeList = createAsyncThunk<any>(
    'job-type/list',
    async () => {
        return axiosIns.get('/auto-fill/contract-type', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const skillList = createAsyncThunk<any>(
    'skill/list',
    async () => {
        return axiosIns.get('/auto-fill/skill', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);