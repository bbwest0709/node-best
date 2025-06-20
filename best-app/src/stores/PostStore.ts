/**
 * postStore : post 목록 조회, 단건 조회, 삭제 관리 (서버 통신 로직 중심)
 * postFormStore : post 작성/수정에 필요한 폼 입력 상태 관리 (UI 상태 관리)
 */
import { create } from "zustand"
import type { Post } from "../components/posts/types/Post"
import { apiFetchPostList, apiFetchPostById, apiDeletePost } from "../api/postApi";

interface PostState {
    postList: Post[];
    totalCount: number;
    post: Post | null;

    fetchPostList: () => Promise<void>;
    fetchPostById: (id: string) => Promise<void>;
    deletePost: (id: string) => Promise<boolean>;
}

export const usePostStore = create<PostState>((set) => ({
    postList: [],
    totalCount: 0,
    post: null,

    fetchPostList: async () => {
        try {
            const data = await apiFetchPostList();
            set({
                postList: data.data,
                totalCount: data.totalCount
            });
        } catch (error) {
            alert('목록 조회 실패: ' + (error as Error).message)
        }
    },
    fetchPostById: async (id) => {
        try {
            const post = await apiFetchPostById(id);
            set({ post })
        } catch (error) {
            alert('상세 조회 실패: ' + (error as Error).message)
        }
    },
    deletePost: async (id) => {
        try {
            await apiDeletePost(id);
            set({ post: null })
            return true;
        } catch (error) {
            alert('삭제 실패: ' + (error as Error).message)
            return false;
        }
    },

}))