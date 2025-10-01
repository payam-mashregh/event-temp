// upto/backend/src/modules/auth/auth.service.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../users/user.model');

const login = async (username, password) => {
  const user = await userModel.findByUsername(username);
  if (!user) {
    throw new Error('نام کاربری یا رمز عبور نامعتبر است');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('نام کاربری یا رمز عبور نامعتبر است');
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // --- START: MODIFICATION ---
  // هش پسورد را همینجا حذف می‌کنیم
  const { password_hash, ...userWithoutPassword } = user;

  // و آبجکت تمیز شده را برمی‌گردانیم
  return { token, user: userWithoutPassword };
  // --- END: MODIFICATION ---
};

module.exports = {
  login,
};