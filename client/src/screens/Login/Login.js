import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@geist-ui/react';
import { Link, Redirect } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { toast, ToastContainer } from 'react-toastify';
import { LogIn, UserPlus } from '@geist-ui/react-icons';
import { authenticate, isAuth } from '../../helpers/auth';
import loginSvg from '../../assets/images/login.svg';

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;
  const onChange = text => e =>
    setFormData({ ...formData, [text]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (email && password) {
      try {
        setLoading(true);
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/user/login`,
          {
            email,
            password,
          }
        );
        setLoading(false);
        authenticate(res, () => {
          setFormData({ email: '', password: '' });
        });

        isAuth() && isAuth().role === 'admin'
          ? history.push('/admin')
          : history.push('/private');
        toast.success(`Hey ${res.data.user.name}, welcome back`);
      } catch (err) {
        setLoading(false);
        toast.error(err.response.data.msg);
      }
    } else {
      toast.error('Please fill all fields');
    }
  };

  const sendGoogleToken = async idToken => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/googleLogin`,
        {
          idToken,
        }
      );
      await informParent(res);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const informParent = res => {
    authenticate(res, () => {
      isAuth() && isAuth().role === 'admin'
        ? history.push('/admin')
        : history.push('/private');
    });
  };
  const googleSignIn = async res => {
    try {
      console.log(res);
      await sendGoogleToken(res.tokenId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 text-gray-100 flex justify-center'>
      {isAuth() && <Redirect to='/' />}
      <ToastContainer />
      <div className='max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='flex-1 text-center hidden md:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${loginSvg})` }}
          />
        </div>
        <div className='lg:w-1/2 w-full xl:w-6/12 p-6 sm:p-12'>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-bold text-black'>
              Sign in here
            </h1>
            <form
              className='w-full flex-1 mt-8 text-indigo-500'
              onSubmit={onSubmit}
            >
              <div className='mx-auto max-w-xs relative'>
                <input
                  type='email'
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-700 text-sm focus:bg-white mt-5'
                  placeholder='Enter E-mail address'
                  onChange={onChange('email')}
                  value={email}
                />
                <input
                  type='password'
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-700 text-sm focus:bg-white mt-5'
                  placeholder='Enter password'
                  onChange={onChange('password')}
                  value={password}
                />
                <Button
                  onClick={onSubmit}
                  type='success-light'
                  size='large'
                  loading={loading}
                  icon={<LogIn />}
                  style={{ width: '100%' }}
                  className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out'
                >
                  Login
                </Button>
                <Link
                  to='/users/password/forget'
                  className='text-right mt-4 block'
                >
                  <p>Forget password ?</p>
                </Link>
              </div>
              <div className='my-5 flex items-center justify-center border-b text-center'>
                <div className='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>
                  Or sign with email or social login
                </div>
              </div>
              <div className='flex flex-col items-center mt-10'>
                <Link to='/register' className='w-full max-w-xs'>
                  <Button
                    type='secondary-light'
                    size='large'
                    icon={<UserPlus />}
                    style={{ width: '100%' }}
                    className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out'
                  >
                    Register
                  </Button>
                </Link>
                <GoogleLogin
                  clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                  onSuccess={googleSignIn}
                  onFailure={googleSignIn}
                  cookiePolicy={'single_host_origin'}
                  render={props => (
                    <button onClick={props.onClick} disabled={props.disabled}>
                      Sign in with Google
                    </button>
                  )}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
