/**
 * postStore : post 목록 조회, 단건 조회, 삭제 관리 (서버 통신 로직 중심)
 * postFormStore : post 작성/수정에 필요한 폼 입력 상태 관리 (UI 상태 관리)
 */
import { create } from "zustand"
import type { Post } from "../components/posts/types/Post"

interface PostState {
    postList: Post[];
    totalCount: number;

    fetchPostList: () => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
    postList: [],
    totalCount: 0,

    fetchPostList: async () => {
        // 
    }
}))