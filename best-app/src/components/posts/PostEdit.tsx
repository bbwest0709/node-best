import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { usePostStore } from '../../stores/PostStore';
import { usePostFormStore } from '../../stores/PostFormStore';
import type { FormEvent, ChangeEvent } from 'react';
import { apiUpdatePost } from '../../api/postApi';

const PostEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const post = usePostStore(s => s.post);
    const fetchPostById = usePostStore(s => s.fetchPostById);
    const { resetForm, formData, setFormData } = usePostFormStore();


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target; // e.target.name , e.target.value
        setFormData({ [name]: value })
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {// 파일을 첨부했다면
            setFormData({ newFile: e.target.files[0] })
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { writer, title, content, newFile } = formData;
        // 유효성 체크
        if (!title.trim()) {
            alert('제목을 입력하세요')
            return;
        }
        if (!writer.trim()) {
            alert('작성자 이메일 입력하세요')
            return;
        }

        // 파일 업로드할 때는 FormData 객체 사용 전송 'multipart/form-data'
        try {
            console.log('new File: ', newFile)

            const data = new FormData();
            data.append("writer", writer)
            data.append("title", title)
            data.append("content", content)
            if (newFile) {
                data.append("file", newFile)
            }

            await apiUpdatePost(data, id!);
            alert('수정 성공')
            navigate('/posts')
        } catch (error) {
            alert('수정 실패: ' + (error as Error).message);
        }
    }

    const handleReset = () => {
        resetForm();
    }

    const fetchAndSet = async () => {
        if (id) {
            await fetchPostById(id) // post state setting
        }
    }

    useEffect(() => {
        fetchAndSet();
        return () => resetForm() // amount될 때 자동으로 호출되는 cleanup 함수
    }, [id])

    useEffect(() => {
        if (post) {
            setFormData({
                writer: post.writer || '',
                title: post.title || '',
                content: post.content || '',
                file: post.file || '',
                newFile: null
            });
        }
    }, [post]);

    return (
        <div className="row my-1">
            <div className="col-md-8 mx-auto p-3">
                <h1 className="text-center my-5">게시글 수정</h1>

                <form>
                    {/* 제목 */}
                    <div className="mb-3">
                        <label className="form-label">제목</label>
                        <input
                            className="form-control my-2"
                            placeholder="제목을 입력하세요"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 작성자 */}
                    <div className="mb-3">
                        <label className="form-label">작성자</label>
                        <input
                            className="form-control my-2"
                            placeholder="작성자 이름"
                            name="writer"
                            value={formData.writer}
                            onChange={handleChange}
                        />
                    </div>

                    {/* 내용 */}
                    <div className="mb-3">
                        <label className="form-label">내용</label>
                        <textarea
                            className="form-control my-2"
                            rows={6}
                            placeholder="내용을 입력하세요"
                            name='content'
                            value={formData.content}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* 첨부파일 */}
                    <div className="mb-3">
                        <label className="form-label">첨부파일</label>
                        <input className="form-control" type="file" name="file" onChange={handleFileChange} />
                        {formData.file && (
                            <div className="mt-2 text-muted">
                                <img
                                    src={`http://localhost:7777/uploads/${formData.file}`}
                                    alt={formData.file}
                                    style={{ width: '120px' }}
                                />
                                <div>현재 파일: {formData.file}</div>
                            </div>
                        )}
                    </div>

                    {/* 버튼들 */}
                    <div className="text-center">
                        <button className="btn btn-primary mx-1 px-3 btn-sm" onClick={handleSubmit}>
                            글수정
                        </button>
                        <button className="btn btn-warning mx-1 px-3 btn-sm" onClick={handleReset}>
                            다시쓰기
                        </button>
                        <button className="btn btn-secondary mx-1 px-3 btn-sm" onClick={() => {
                            navigate(`/posts`)
                        }}>
                            글 목록
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default PostEdit
