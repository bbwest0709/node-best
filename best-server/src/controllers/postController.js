// CRUD 로직
const pool = require('../models/dbPool')

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
        const listSql = `SELECT id, title, content, writer, attach file, DATE_FORMAT(wdate, '%Y-%m-%d') wdate FROM posts ORDER BY id DESC`
        const countSql = `SELECT COUNT(id) as totalCount FROM posts`
        const [posts] = await pool.query(listSql)
        const [[{ totalCount }]] = await pool.query(countSql)
        console.log(posts, totalCount)
        res.status(200).json({
            data: posts,
            totalCount
        })
    } catch (error) {
        console.error('listPost error : ', error)
        res.status(500).json({ message: 'Server Error: ' + error.message })
    }
}