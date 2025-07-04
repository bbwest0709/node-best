// CRUD 로직
const pool = require('../models/dbPool')
const fs = require('fs');
const path = require('path')

exports.createPost = async (req, res) => {
    console.log('createPost 들어옴...');
    try {
        const { writer, title, content } = req.body;
        console.log(`Request Body: writer: ${writer}, title: ${title}, content: ${content}`);

        // 첨부파일
        const file = req.file
        let fileName = null;
        if (file) {
            fileName = file.filename; // 실제 저장된 파일명이 들어음 -> DB 저장
        }

        const sql = `INSERT INTO posts (writer, title, content, attach) VALUES (?, ?, ?, ?)`;
        const [result] = await pool.execute(sql, [writer, title, content, fileName]);
        console.log('Insert Result: ', result);
        const newPost = { id: result.insertId, writer, title, content, file: fileName }
        res.status(201).json({
            message: 'Post created succesfully',
            postId: result.insertId,
            post: newPost
        })
    } catch (error) {
        console.error('createPost error: ', error)
        res.status(500).json({ message: 'Server Error: ' + error.message })
    }
}

exports.listPost = async (req, res) => {
    try {
        const size = 3; // 한 페이지 당 보여줄 목록 개수
        const page = parseInt(req.query.page || 1) // 현재 보여줄 페이지 번호
        const offset = (page - 1) * size


        const countSql = `SELECT COUNT(id) as totalCount FROM posts`
        const [[{ totalCount }]] = await pool.query(countSql)

        const totalPages = Math.ceil(totalCount / size)

        const listSql = `SELECT id, title, content, writer, attach AS file, DATE_FORMAT(wdate, '%Y-%m-%d') wdate FROM posts ORDER BY id DESC LIMIT ? OFFSET ?`
        const [posts] = await pool.query(listSql, [size, offset])
        console.log(posts, totalCount)
        res.status(200).json({
            data: posts,
            totalCount,
            totalPages
        })

    } catch (error) {
        console.error('listPost error : ', error)
        res.status(500).json({ message: 'Server Error: ' + error.message })
    }
}

exports.viewPost = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `SELECT id, writer, title, content, attach AS file, DATE_FORMAT(wdate, '%Y-%m-%d %H:%i:%s') AS wdate FROM posts WHERE id=?`;
        const [result] = await pool.query(sql, [id]);

        console.log(result);

        if (result.length === 0) {
            return res.status(404).json({ message: '해당 글은 없습니다.' });
        }

        const post = result[0];

        res.status(200).json(post);
    } catch (error) {
        console.error('viewPost error: ', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    const selectSql = `SELECT attach AS file FROM posts WHERE id=?`;
    try {
        const [postResult] = await pool.query(selectSql, [id]);

        if (postResult.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const fileName = postResult[0].file;

        // 게시글 삭제
        const deleteSql = `DELETE FROM posts WHERE id = ?`;
        const [deleteResult] = await pool.query(deleteSql, [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // 파일 삭제
        if (fileName) {
            const filePath = path.join(__dirname, '..', '..', 'public', 'uploads', fileName);
            console.log("Attempting to delete file at path:", filePath);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`File deleted at: ${filePath}`);
            } else {
                console.log(`File not found: ${filePath}`);
            }
        } else {
            console.log('첨부파일이 없으므로 파일 삭제를 건너뜁니다.');
        }

        res.status(200).json({ message: '게시글 삭제 성공' });

    } catch (error) {
        console.error('DELETE POST ERROR: ', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

exports.updatePost = async (req, res) => {
    const { id } = req.params;
    const { writer, title, content } = req.body;
    const newFile = req.file;

    try {
        const selectSql = `SELECT attach AS file FROM posts WHERE id = ?`
        const [postResult] = await pool.query(selectSql, [id])

        if (postResult.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const oldFileName = postResult[0].file;

        let updatedFileName = oldFileName;

        if (newFile) {
            updatedFileName = newFile.filename

            if (oldFileName) {
                const oldFilePath = path.join(__dirname, '..', '..', 'public', 'uploads', oldFileName)
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                    console.log(`기존 파일 삭제: ${oldFilePath}`);
                }
            }
        }

        const updateSql = `UPDATE posts SET writer = ?, title = ?, content = ?, attach = ? WHERE id = ?`
        const [updateResult] = await pool.execute(updateSql, [writer, title, content, updatedFileName, id])

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: '게시글 수정 실패' })
        }

        res.status(200).json({ message: '게시글 수정 성공' })
    } catch (error) {
        console.error('updatePost error: ', error);
        res.status(500).json({ message: '서버 오류: ' + error.message });
    }
}