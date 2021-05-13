import { logger } from '@utils/logger';
import jwt from 'express-jwt';
import jwtPermission from 'express-jwt-permissions';

export const verifyJwt = () =>
  jwt({
    secret: process.env.TOKEN_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256']
  });

export const isAuthenticated = async (req, res, next) => {
  try {
    req.headers.authorization = process.env.TEMP_TOKEN;
    const jwtToken = req.headers.authorization || process.env.TEMP_TOKEN;

    const unused = {
    };

    // Todo to remove later static data above
    if (!jwtToken) {
      return next();
      // return res.status(401).send('Access Token missing from header');
    } else {
      console.log(`in the else part for verifying the token!`);
      const data = await verifyJwt();
      console.log(`main dta`, data);
      console.log(`after verified `, req.user);
      next();
    }
  } catch (err) {
    return res.status(500).send(err.message || 'Internal server error');
  }
};
