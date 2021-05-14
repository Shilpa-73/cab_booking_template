import bcrypt from 'bcryptjs';

export const generatePassword = async (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return reject(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return reject(err);
        // Store hash in your password DB.
        resolve(hash);
      });
    });
  });

export const comparePassword = async (password, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, res) {
      if (err) return reject(err);
      // res === true
      resolve(res);
    });
  });
