const pool = require('../models/dbPool');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

exports.createUser = async (req, res) => {
    const { name, email, passwd, role } = req.body;

    if (!name || !email || !passwd) {
        return res.status(400).json({ result: 'fail', message: '이름, 이메일, 비밀번호는 필수 항목입니다' });
    }

    const sql = `INSERT INTO members(name, email, passwd, role) VALUES(?, ?, ?, ?)`;

    try {
        const hashedPass = await bcrypt.hash(passwd, 10);
        const [result] = await pool.execute(sql, [name, email, hashedPass, role]);

        if (result.affectedRows > 0) {
            return res.status(201).json({
                result: 'success',
                message: '회원가입이 완료되었습니다.',
                data: {
                    insertId: result.insertId
                }
            });
        } else {
            return res.json({ result: 'fail', message: '회원정보 등록 실패' });
        }
    } catch (error) {
        console.error('error: ', error);
        return res.status(500).json({
            result: 'fail',
            message: '서버 처리 중 오류가 발생했습니다.'
        });
    }
};

exports.checkEmailDuplicate = async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ result: 'fail', message: '이메일은 필수사항입니다.' })
    }

    try {
        const [result] = await pool.query('SELECT COUNT(*) AS count FROM members WHERE email = ?', [email])
        const existingEmailCount = result[0].count;
        if (existingEmailCount > 0) {
            return res.json({ result: 'fail', message: '이미 사용 중인 이메일입니다.' });
        } else {
            return res.json({ result: 'success', message: '사용 가능한 이메일입니다.' });
        }
    } catch (error) {
        return res.status(500).json({ result: 'fail', message: '서버 오류가 발생했습니다.' });
    }
};