import axios from "axios";
import { baseUrl } from "./baseUrl";

export const AxiosCall = async ({ method, endpoint, requestBody, headerData, isFormData }) => {
    try {
        const baseURL = baseUrl + endpoint
        const requestConfig = {
            method,
            url: baseURL,
            data: requestBody
        }
        if (headerData) {
            const token = localStorage.getItem('token')
            requestConfig.headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
            }
        }
        const response = await axios(requestConfig)
        return response
    } catch (error) {
        return error
    }
}