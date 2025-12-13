import jwt from 'jsonwebtoken';
import { User, IUser } from './models/User';
import { config } from '../../../config/config';
import { BadRequestError, AuthFailureError } from '../../../core/error.response';

const signToken = (id: string) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const signup = async (userData: any) => {
  const exists = await User.findOne({ email: userData.email });
  if (exists) throw new BadRequestError('User already exists');

  const newUser = (await User.create(userData)) as IUser;
  const token = signToken(newUser._id as string);

  // Remove password from output
  const userObj = newUser.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const login = async (userData: any) => {
  const { email, password } = userData;

  // 1) Check if email and password exist
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AuthFailureError('Incorrect email or password');
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id.toString());
  
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};
