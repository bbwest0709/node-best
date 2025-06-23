/**
 * postStore : post 목록 조회, 단건 조회, 삭제 관리 (서버 통신 로직 중심)
 * postFormStore : post 작성/수정에 필요한 폼 입력 상태 관리 (UI 상태 관리)
 */
import { create } from "zustand"
import type { Post } from "../components/posts/types/Post"
import { apiFetchPostList, apiFetchPostById, apiDeletePost } from "../api/postApi";

interface PostState {
    postList: Post[];
    totalCount: number; // 총 게시글 개수
    totalPages: number; // 총 페이지 개수
    page: number; // 현재 보여줄 페이지 번호
    size: number; // 한 페이지 당 보여줄 목록 개수
    post: Post | null;

    setPage: (page: number) => void; // 페이지 변경
    fetchPostList: () => Promise<void>;
    fetchPostById: (id: string) => Promise<void>;
    deletePost: (id: string) => Promise<boolean>;
}

export const usePostStore = create<PostState>((set, get) => ({
    postList: [],
    totalCount: 0,
    totalPages: 0,
    page: 1,
    size: 3,
    post: null,

    setPage: (newPage: number) => set({ page: newPage }),
    fetchPostList: async () => {
        const { page, size } = get(); // get() 함수로 page state 값 가져오기

        try {
            const data = await apiFetchPostList(page, size);
            set({
                postList: data.data,
                totalCount: data.totalCount,
                totalPages: data.totalPages,
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