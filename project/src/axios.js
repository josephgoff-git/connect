import axios from "axios";
import Cookies from 'js-cookie';
import { API_URL } from './config';

let headers = {}
if (Cookies.get('accessToken')) {
    headers = {'Authorization': `Bearer ${Cookies.get('accessToken')}`}
}

export const makeRequest = axios.create({
    baseURL: API_URL,
    headers: {
        common: headers
    }
});