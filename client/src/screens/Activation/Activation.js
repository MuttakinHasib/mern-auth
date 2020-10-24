import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import welcomeSvg from '../../assets/images/welcome.svg';
import { Link, Redirect } from 'react-router-dom';
import { isAuth } from '../../helpers/auth';
import { Key, LogIn } from '@geist-ui/react-icons';
import { Button } from '@geist-ui/react';
const Activation = ({ match }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    show: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = match.params.token;
    const { name } = jwt.decode(token);
    if (token) {
      setFormData({ ...formData, name, token });
    }
    // eslint-disable-next-line
  }, []);

  const { name, token } = formData;

  const onSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/activation`,
        {
          token,
        }
      );
      setFormData({ ...formData, show: false });
      setLoading(false);
      toast.success(data.msg);
    } catch (err) {
      setLoading(false);
      toast.error(err.response.data.msg);
    }
  };
  return (
    <div className='min-h-screen bg-gray-100 text-gray-100 flex justify-center'>
      {isAuth() && <Redirect to='/' />}
      <ToastContainer />
      <div className='max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='md:w-1/2 w-full xl:w-6/12  p-6 sm:p-12'>
          <div className='flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-bold text-black'>
              Welcome {name}
            </h1>
            <form
              className='w-full flex-1 mt-8 text-indigo-500'
              onSubmit={onSubmit}
            >
              <div className='mx-auto max-w-xs relative'>
                <Button
                  onClick={onSubmit}
                  type='success-light'
                  size='large'
                  loading={loading}
                  style={{ width: '100%' }}
                  icon={<Key />}
                  className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out'
                >
                  Active your account
                </Button>

                <div className='my-5 flex items-center justify-center border-b text-center'>
                  <div className='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>
                    Or sign up again
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <Link to='/login' className='w-full max-w-xs'>
                    <Button
                      type='secondary-light'
                      size='large'
                      icon={<LogIn />}
                      style={{ width: '100%' }}
                      className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out'
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className='flex-1 bg-indigo-100 text-center hidden md:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${welcomeSvg})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Activation;
