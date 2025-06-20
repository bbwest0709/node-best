/**
 * postStore : post 목록 조회, 단건 조회, 삭제 관리 (서버 통신 로직 중심)
 * postFormStore : post 작성/수정에 필요한 폼 입력 상태 관리 (UI 상태 관리)
 */
import { create } from "zustand"
import type { Post } from "../components/posts/types/Post"
import { apiFetchPostList } from "../api/PostApi";

interface PostState {
    postList: Post[];
    totalCount: number;

    fetchPostList: () => Promise<void>;
}

export const usePostStore = create<PostState>((set) => ({
    postList: [],
    totalCount: 0,

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
    }

}))