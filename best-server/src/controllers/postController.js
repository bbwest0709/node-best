// CRUD 로직
const pool = require('../models/dbPool')

exports.createPost = async (req, res) => {
    console.log('createPost 들어옴...');
    try {
        const { writer, title, content } = req.body;
        console.log(`Request Body: writer: ${writer}, title: ${title}, content: ${content}`);

        const sql = `INSERT INTO posts (writer, title, content) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(sql, [writer, title, content]);
        console.log('Insert Result: ', result);
        res.status(201).json({
            message: 'Post created succesfully',
            postId: result.insertId
        })
    } catch (error) {
        console.error('createPost error: ', error)
        res.status(500).json({ message: 'Server Error: ' + error.message })
    }
}

exports.listPost = async (req, res) => {
    try {
        const listSql = `SELECT id, title, content, writer, attach, wdate FROM posts ORDER BY id DESC;`
        const countSql = `SELECT COUNT(id) as totalCount FROM posts`
        const [posts] = await pool.query(listSql)
        const [[{ totalCount }]] = await pool.query(countSql)
        console.log(posts, totalCount)
        res.status(200).json({
            totalCount,
            postList: posts,
        })
    } catch (error) {
        console.error('listPost error : ', error)
        res.status(500).json({ message: 'Server Error: ' + error.message })
    }
}