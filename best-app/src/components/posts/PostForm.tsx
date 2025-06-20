import { useRef, type ChangeEvent, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap"
import { usePostStore } from "../../stores/PostStore";
import { usePostFormStore } from "../../stores/PostFormStore";
import { apiCreatePost } from "../../api/PostApi";

const PostForm: React.FC = () => {
    const { formData, setFormData, resetForm } = usePostFormStore();
    const fetchPostList = usePostStore(s => s.fetchPostList);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ [name]: value });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.files) // e.target.files ==> FileList {0:File, 1:File, 2: File...}
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ newFile: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("writer", formData.writer);
            form.append("title", formData.title);
            form.append("content", formData.content);
            if (formData.newFile) {
                form.append("file", formData.newFile);
            }
            await apiCreatePost(form);
            await fetchPostList();
            // alert("게시글이 등록되었습니다.");
            resetForm();
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("서버 요청 중 에러:", error);
            alert("서버 요청 중 오류 발생: " + (error as Error).message);
        }
    };


    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="writer">
                    <Form.Label>Writer</Form.Label>
                    <Form.Control
                        type="text"
                        name="writer"
                        onChange={handleChange}
                        value={formData.writer}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        onChange={handleChange}
                        value={formData.title}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="content">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="content"
                        onChange={handleChange}
                        value={formData.content}
                    />
                </Form.Group>

                <Form.Group controlId="file">
                    <Form.Label>File</Form.Label>
                    <Form.Control
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    작성
                </Button>
            </Form>

        </>
    )
}
export default PostForm;