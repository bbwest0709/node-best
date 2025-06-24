const pool = require('../models/dbPool');
const fs = require('fs');
const path = require('path');

exports.getUserList = async (req, res) => {

    const sql = `SELECT id, name, email, role, DATE_FORMAT(indate, '%Y-%m-%d %h:%i:%s') AS indate FROM members ORDER BY id DESC`

    try {
        const [result] = await pool.execute(sql)
        res.status(200).json({
            result: 'success',
            message: 'User list retrieved',
            data: result
        });
    } catch (error) {
        console.error('getUserList error:', error)
        res.status(500).json({ result: 'fail', message: error.message });
    }
}