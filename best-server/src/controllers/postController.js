// CRUD 로직
const pool = require('../models/dbPool')

exports.createPost = async (req, res) => {
    console.log('createPost 들어옴...');
    try {
        const { writer, title, content } = req.body;
        console.log(`Request Body: writer: ${writer}, title: ${title}, content: ${content}`);

        const postData = { writer, title, content };
        const sql = `INSERT INTO posts (writer, title, content) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(sql, [writer, title, content]);
        console.log('Insert Result: ', result);
        res.status(201).json({
            message: 'Post created succesfully',
            postId: result.insertId
        })
    } catch (error) {
        console.error('createPost error: ', error)
        req.status(500).json({ message: 'Server Error: ' + error.message })
    }
}