const jwt = require('jsonwebtoken');
const User = require('../schema/user');
require('dotenv').config();

module.exports = (req, res, next) => {
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
      User.findOne({ id: userId }).then((user) => {
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
