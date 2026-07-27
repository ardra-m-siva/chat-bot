import axios from "axios";
import { baseUrl } from "./baseUrl";

export default async function AxiosCall(method, endpoint, requestBody, headerData, isFormData) {
    try {
        const baseURL = baseUrl + endpoint
        const requestConfig = {
            method,
            url: baseURL,
            data: requestBody,
            withCredentials: true
        }
        if (headerData) {
            // const token = localStorage.getItem('token')
            requestConfig.headers = {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
            }
        }
        const response = await axios(requestConfig)
        return response
    } catch (error) {
        if (error.response.status == 401) {
            console.error('Unauthorized access')
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return error
    }
}