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

export const apiCreatePost = async (data: FormData): Promise<Post> => {
    const response = await axiosInstance.post('/posts', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data as Post;
};