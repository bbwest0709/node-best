const pool = require("../models/dbPool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 에러 응답을 일관되게 처리하는 유틸리티 함수
const errorResponse = (status, message) => ({
  result: "fail",
  message,
  status,
});

// 비밀번호 검증 함수
const validatePassword = async (inputPassword, storedPassword) => {
  const isMatch = await bcrypt.compare(inputPassword, storedPassword);
  if (!isMatch) {
    throw errorResponse(400, "이메일 또는 비밀번호가 잘못되었습니다.");
  }
};

// JWT 토큰 생성
const generateTokens = (user) => {
  const payload = { email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "3d" });
  return { accessToken, refreshToken };
};

// email 로 사용자 id 조회
async function getUserIdByEmail(email) {
  const sql = `SELECT id FROM members WHERE email = ?`;
  const [result] = await pool.execute(sql, [email]);

  if (result.length === 0) {
    throw errorResponse(404, "사용자를 찾을 수 없습니다.");
  }

  return result[0].id;
}

// 로그인 처리 함수
exports.login = async (req, res) => {
  const { email, passwd } = req.body;

  if (!email || !passwd) {
    return res
      .status(400)
      .json(errorResponse(400, "이메일과 비밀번호를 입력하세요."));
  }

  const sql = `SELECT * FROM members WHERE email = ?`;

  try {
    const [rows] = await pool.execute(sql, [email]);
    if (rows.length === 0) {
      return res
        .status(400)
        .json(errorResponse(400, "이메일 또는 비밀번호가 잘못되었습니다."));
    }

    const user = rows[0];

    try {
      await validatePassword(passwd, user.passwd);
    } catch (err) {
      return res.status(400).json(err);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const sql2 = `UPDATE members SET refreshtoken=? WHERE id=?`;
    await pool.query(sql2, [refreshToken, user.id]);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
    });

    return res
      .status(200)
      .set("Authorization", `Bearer ${accessToken}`)
      .json({
        result: "success",
        message: "로그인 성공",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken,
          refreshToken,
        },
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "서버 오류가 발생했습니다."));
  }
};

// 로그아웃 처리 함수
exports.logout = async (req, res) => {
  const email = req.authUser.email;

  useAuthStore.getState().logout();
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  const sql = `UPDATE members SET refreshtoken = NULL WHERE email=?`;
  const [result] = await pool.query(sql, [email]);

  if (result.affectedRows === 0) {
    return res.status(400).json({ result: "fail", message: "유효하지 않은 사용자입니다" });
  }

  return res.status(200).json({
    result: "success",
    message: "로그아웃 성공",
  });
};

// 리프레시 토큰 검증 및 액세스 토큰 재발급
exports.refreshVerify = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;  // 쿠키에서 리프레시 토큰을 가져옴
    if (!refreshToken) {
      return res.status(400).json({ result: "fail", message: "리프레시 토큰이 필요합니다" });
    }

    // DB에 저장된 리프레시 토큰과 비교
    const sql2 = `SELECT refreshtoken FROM members WHERE id = ?`;
    const [rows] = await pool.execute(sql2, [req.authUser.id]);

    if (rows.length === 0 || rows[0].refreshtoken !== refreshToken) {
      return res.status(403).json({ result: "fail", message: "유효하지 않은 리프레시 토큰입니다" });
    }

    // 리프레시 토큰 검증
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          result: "fail",
          message: "리프레시 토큰이 만료되었거나 유효하지 않습니다",
        });
      }

      const userPayload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      // 새로운 액세스 토큰 생성
      const newAccessToken = jwt.sign(userPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: "1h" });

      res.json({ result: "success", accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      result: "fail",
      message: "리프레시 토큰 검증 중 에러: " + error.message,
    });
  }
};

// 로그인한 사용자 정보 조회
exports.getAuthenticUser = async (req, res) => {
  res.json(req.authUser);
};

// 마이페이지
exports.mypage = async (req, res) => {
  try {
    if (!req.authUser) {
      return res
        .status(404)
        .json({ result: "fail", message: "로그인해야 이용 가능해요" });
    }

    const { email } = req.authUser;  // 이메일로 조회
    const userId = await getUserIdByEmail(email);  // 이메일로 ID 조회

    const sql = `SELECT * FROM members WHERE id=?`;
    const [result] = await pool.query(sql, [userId]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ result: "fail", message: "회원이 아닙니다" });
    }

    const { passwd: _, ...userData } = result[0];
    return res
      .status(200)
      .json({
        result: "success",
        message: `${userData.name}님의 MyPage입니다`,
        data: userData,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "fail", message: "DB Error : " + error });
  }
};
