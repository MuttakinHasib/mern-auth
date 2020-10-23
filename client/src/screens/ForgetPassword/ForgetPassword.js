import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Mail } from '@geist-ui/react-icons';
import { isAuth } from '../../helpers/auth';
import loginSvg from '../../assets/images/login.svg';
import { Button } from '@geist-ui/react';

const ForgetPassword = ({ history }) => {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const { email } = formData;
  const onChange = text => e =>
    setFormData({ ...formData, [text]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (email) {
      try {
        setLoading(true);
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/password/forget`,
          {
            email,
          }
        );
        setLoading(false);
        toast.success(res.data.msg);
      } catch (err) {
        toast.error(err.response.data.msg);
        setLoading(false);
      }
    } else {
      toast.error('Please fill all fields');
    }
  };
  return (
    <div className='min-h-screen bg-gray-100 text-gray-100 flex justify-center'>
      {isAuth() && <Redirect to='/' />}
      <ToastContainer />
      <div className='max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='lg:w-1/2 w-full xl:w-6/12 p-6 sm:p-12'>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-bold text-black'>
              Forget Password ?
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

                <Button
                  onClick={onSubmit}
                  type='success-light'
                  size='large'
                  loading={loading}
                  style={{ width: '100%' }}
                  icon={<Mail />}
                  className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out'
                >
                  Sent Email
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className='flex-1 text-center hidden md:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${loginSvg})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
