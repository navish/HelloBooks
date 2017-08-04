import jwt from 'jsonwebtoken';
import app from '../app';
import model from '../models';
import utils from '../utils';


const randomString = utils.randomString;
const User = model.User;

export default {
  signup(req, res) {
    let password = req.body.password;
    const name = req.body.name || '';
    const email = req.body.email || '';
    password = User.generateHash(password) || '';

    User.create({
      password,
      name,
      email,
      key: randomString(10)
    },
    {
      fields: ['name', 'email', 'password', 'key']
    })
      .then(() => res.status(201).send({
        message: 'Your account has been created successfully. Go to the login page to sign in to your account.',
        status: 'Created',
        code: 201 }))
      .catch(error => res.status(400).send({
        message: error.errors[0].message,
        status: 'Bad Request',
        code: 400
      }))
      .catch(error => res.status(500).send({
        message: error.message,
        status: 'Internal Server Error',
        code: 500
      }));
  },
  signin(req, res) {
    const secret = app.get('secret');
    const password = req.body.password || '';
    const email = req.body.email || '';

    User.findOne({ where: { email } })
      .then((user) => {
        if (user) {
          if (!user.validPassword(password)) { res.status(400).send({ message: 'You provided a wrong password', status: 'Bad Request', code: 400 }); }
          const token = jwt.sign(
            { user: user.id, group: user.userGroup },
            secret,
            { expiresIn: 24 * 60 * 60 }
          );
          res.status(200).send({ token, userId: user.id, group: user.userGroup, message: 'Successfully validated', status: 'OK', code: 200 });
        } else {
          res.status(400).send({ message: 'User not found', status: 'Bad Request', code: 400 });
        }
      })
      .catch(error => res.status(500).send({
        message: error.message,
        status: 'Internal Server Error',
        code: 500
      }));
  }
};
