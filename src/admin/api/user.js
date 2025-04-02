import useSWR from "swr";
import axios from "axios";
import { API_ROUTES } from "../utils/APIs";

const fetcher = ([url, token]) =>
     axios.get(url, { headers: { Authorization: token } }).then((res) => res.data);

export const useGetAllUser = (token) => {
    const { data, error } = useSWR(token ? [API_ROUTES.USER,token] : null, fetcher);
    return {
        users: data,
        isLoading: !error && !data,
        isError: error,
    };
};
