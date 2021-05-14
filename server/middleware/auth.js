import jwt from 'express-jwt';
import { USER_TYPE } from '../utils/constants';

// Todo to remove this later!
export const useDummyToken = (req, res, next) => {
  req.headers.authorization = `Bearer ${process.env.TEMP_TOKEN}`;
  console.log(`process.env.TEMP_TOKEN is here`, process.env.TEMP_TOKEN);
  next();
};

export const verifyJwt = () =>
  jwt({
    secret: process.env.TOKEN_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256']
  });

export const isAuthenticatedUser = async ({ user, type }) => {
  try {
    // Todo to remove By pass for driver
    if (user.userType === USER_TYPE.DRIVER) return Promise.resolve();

    if (user.userType !== type) throw new Error(`Only ${type} of user can access this query/mutation!`);

    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};
