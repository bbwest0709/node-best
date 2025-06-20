//  Post 관련 api 요청을 서버에 보내는 모듈
import type { Post } from "../components/posts/types/Post";
import axiosInstance from "./axiosInstance";

export interface PostResponse {
    data: Post[];
    totalCount: number;
    // totalPages: number;
}

export const apiFetchPostList = async (): Promise<PostResponse> => {
    const response = await axiosInstance.get('/posts')
    return response.data; // { data: Post[], totalCount: number }
}