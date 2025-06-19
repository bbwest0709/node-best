import { Link } from "react-router-dom";

const PostList: React.FC = () => {
    return (
        <div className="post-list">
            <h3>총 개시글 수: 개</h3>
            <div className="d-flex-my-3 p-3" style={{ backgroundColor: '#efefef', borderRadius: 10 }}>
                <div style={{ width: '25%' }}>
                    <img />
                </div>
                <div className="flex-grow-1 ms-3">
                    <h4>작성자
                        <br />
                        <small>
                            <i>Posted on 날짜</i>
                        </small>
                    </h4>
                    <Link to={`/posts/100`}>
                        <h2>제목</h2>
                    </Link>

                </div>
            </div>
            {/* 페이지 네비게이션 자리 */}
            <div>

            </div>
        </div>
    )
}

export default PostList;