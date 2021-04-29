const jwt = require('jsonwebtoken');
const User = require('../schema/user');
require('dotenv').config();

// module.exports < 이렇게 export했다가 오지게 에러나서
// 이렇게 수정함

exports.authMiddlesware = (req, res, next) => {
   try {
      const { authorization } = req.headers;
      const [tokenType, tokenValue] = authorization.split(" ");

      if (tokenType !== 'Bearer') {
         res.status(400).send({
            err: "로그인 후 이용 가능한 기능입니다.",
         });
         return;
      }
      const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);
      User.findOne({ userId: userId }).then((user) => {
         res.locals.user = user;
         next();
      });
   } catch (error) {
      res.json({
         mss: 'not_login'
      });
      return;
   }
};
