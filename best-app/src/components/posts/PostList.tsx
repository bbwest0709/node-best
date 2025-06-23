import { Link } from "react-router-dom";
import { usePostStore } from "../../stores/PostStore";
import { useEffect } from "react";

const PostList: React.FC = () => {
    const fetchPostList = usePostStore(s => s.fetchPostList)
    const postList = usePostStore(s => s.postList)
    const totalCount = usePostStore(s => s.totalCount)
    const totalPages = usePostStore(s => s.totalPages)
    const page = usePostStore(s => s.page)
    const setPage = usePostStore(s => s.setPage)

    const isImageFile = (filename: string) => {
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);
    };

    useEffect(() => {
        fetchPostList(page);
    }, [page])

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-end mb-4 fw-semibold text-secondary fs-5">
                총 게시글 수: {totalCount} 개, {page} page / {totalPages} pages
            </div>
            {postList.map((post) => (
                <div className="card mb-3 shadow-sm p-3" key={post.id}>
                    <div className="row g-3 align-items-center"> {/* g-3로 칸 사이 간격 */}
                        <div className="col-md-3">
                            <img
                                src={
                                    post.file && isImageFile(post.file)
                                        ? `http://localhost:7777/uploads/${post.file}`
                                        : `http://localhost:7777/images/no_image.png`
                                }
                                alt={post.title}
                                className="postImage"
                            />
                        </div>
                        <div
                            className="col-md-9 d-flex flex-column justify-content-between px-4" // ms-4 제거, px-4 유지
                            style={{ minHeight: '150px' }} // height 대신 minHeight 권장
                        >
                            {/* 상단: 제목 + 작성자 */}
                            <div className="d-flex align-items-center mb-2">
                                <Link
                                    to={`/posts/${post.id}`}
                                    className="text-decoration-none flex-grow-1"
                                    style={{ fontSize: '1.8rem', fontWeight: '600' }}
                                >
                                    {post.title}
                                </Link>
                                <small className="text-muted ms-3">작성자: {post.writer}</small>
                            </div>
                            {/* 하단: 날짜 */}
                            <small className="text-muted align-self-end">Posted on {post.wdate}</small>
                        </div>
                    </div>
                </div>

            ))}

            {/* 페이지 네비게이션 자리 */}
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    {/* 페이지 번호 및 이전/다음 버튼 넣기 */}

                    <div className="text-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                            <button key={n} className={`btn ${n === page ? 'btn-primary' : 'btn-outline-primary'}  mx-1`} onClick={() => setPage(n)}>
                                {n}
                            </button>
                        ))}
                    </div>

                </ul>
            </nav>
        </div>
    )
}
export default PostList;