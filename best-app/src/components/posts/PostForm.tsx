import { Button, Form } from "react-bootstrap"

const PostForm: React.FC = () => {
    return (
        <>
            <Form>
                <Form.Group controlId="writer">
                    <Form.Label>Writer</Form.Label>
                    <Form.Control type="text" name="writer" required />
                </Form.Group>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="title" required />
                </Form.Group>
                <Form.Group controlId="content">
                    <Form.Label>Content</Form.Label>
                    <Form.Control as="textarea" name="content" />
                </Form.Group>
                <Form.Group controlId="file">
                    <Form.Label>File</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    )
}
export default PostForm;