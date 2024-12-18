import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";

export const jobCreate = createAsyncThunk<any, any>(
    'job/create',
    async (info) => {
        return axiosIns.post('/job', info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);


export const jobUpdate = createAsyncThunk<any, any>(
    'job/update',
    async ({ id, info }) => {
        return axiosIns.patch(`/job/${id}`, info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const jobGetAll = createAsyncThunk<any>(
    'job/getAll',
    async () => {
        return axiosIns.get('/job', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const jobGetWithCompany = createAsyncThunk<any>(
    'job/getJobWithComapany',
    async () => {
        return axiosIns.get(`/job/with-company`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const jobDetails = createAsyncThunk<any, any>(
    'job/details',
    async (id) => {
        return axiosIns.get(`/job/${id}`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Delete job
export const jobDelete = createAsyncThunk<any, number>(
    'job/delete',
    async (id) => {
        return axiosIns.delete(`/job/${id}`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const jobRecommend = createAsyncThunk<any>(
    'job/recommend',
    async (id) => {
        return axiosIns.get(`/job-recommend`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const getFullJobById = async (id: number) => {
    return axiosIns.get(`/job/full-job/${id}`)
        .then(response => response.data)
        .catch(error => { });
}

interface JobSearchRequest {
    searchQuery?: string;
    city?: number;
    industryIds?: number[];
    positionIds?: number[];
    experienceIds?: number[];
    educationIds?: number[];
    jobTypeIds?: number[];
    contractTypeIds?: number[];
}


export const jobSearch = createAsyncThunk<any, JobSearchRequest>(
    'job/search',
    async (request) => {
        let industryIdsParam;
        let positionIdsParam;
        let experienceIdsParam;
        let jobTypeIdsParam;
        let educationIdsParam;
        let contractTypeIdsParam;

        console.log(request)

        if (request.industryIds.length > 0) {
            industryIdsParam = request.industryIds.join(',');
        } else {
            industryIdsParam = null;
        }

        if (request.positionIds.length > 0) {
            positionIdsParam = request.positionIds.join(',');
        } else {
            positionIdsParam = null;
        }

        if (request.experienceIds.length > 0) {
            experienceIdsParam = request.experienceIds.join(',');
        } else {
            experienceIdsParam = null;
        }

        if (request.educationIds.length > 0) {
            educationIdsParam = request.educationIds.join(',');
        } else {
            educationIdsParam = null;
        }

        if (request.jobTypeIds.length > 0) {
            jobTypeIdsParam = request.jobTypeIds.join(',');
        } else {
            jobTypeIdsParam = null;
        }

        if (request.contractTypeIds.length > 0) {
            contractTypeIdsParam = request.contractTypeIds.join(',');
        } else {
            contractTypeIdsParam = null;
        }

        return axiosIns.get('/job/search', {
            params: {
                searchQuery: request.searchQuery,
                city: request.city,
                industryIds: industryIdsParam,
                positionIds: positionIdsParam,
                experienceIds: experienceIdsParam,
                educationIds: educationIdsParam,
                jobTypeIds: jobTypeIdsParam,
                contractTypeIds: contractTypeIdsParam,
            },
        })
            .then(response => { return { response: response.data } })
            .catch(error => { console.error(error); });
    }
);