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

export const apiFetchPostById = async (id: string): Promise<Post | null> => {
    const response = await axiosInstance.get(`/posts/${id}`);
    const data = response.data;
    return data ? (data as Post) : null;
}

export const apiDeletePost = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/posts/${id}`)
}

export const apiUpdatePost = async (data: FormData, id: string): Promise<void> => {
    const response = await axiosInstance.put(`/posts/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
}
