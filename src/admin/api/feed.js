import useSWR from "swr";
import axios from "axios";
import { API_ROUTES } from "../utils/APIs";

const fetcher = ([url, token]) =>
    axios.get(url, { headers: { Authorization: token } }).then((res) => res.data);

export const useGetAllFeed = (token) => {
    const { data, error,mutate } = useSWR(token ? [API_ROUTES.FEED,token] : null, fetcher);
    return {
        feeds: data,
        isFeedLoading: !error && !data,
        isError: error,
        mutate,
    };
};
