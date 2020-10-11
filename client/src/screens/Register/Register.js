import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { isAuth } from '../../helpers/auth';
import authSvg from '../../assets/images/auth.svg';
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password1: '',
    password2: '',
  });
  const { name, email, password1, password2 } = formData;
  const onChange = text => e =>
    setFormData({ ...formData, [text]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (name && email && password1) {
      if (password1 === password2) {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/register`,
            {
              name,
              email,
              password: password1,
            }
          );
          setFormData({ name: '', email: '', password1: '', password2: '' });
          toast.success(res.data.msg)

        } catch (err) {
          toast.error(err.response.data.msg)
        }
      } else {
        toast.error("Passwords don't matches");
      }
    } else {
      toast.error('Please fill all fields');
    }
  };
  return (
    <div className='main-h-screen bg-gray-100 text-gray-100 flex justify-center'>
      {isAuth() && <Redirect to='/' />}
      <ToastContainer />
      <div className='max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='lg:w-1/2 w-full xl:w-6/12 p-6 sm:p-12'>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-bold text-black'>
              Sign Up for MERN Auth
            </h1>
            <form
              className='w-full flex-1 mt-8 text-indigo-500'
              onSubmit={onSubmit}
            >
              <div className='mx-auto max-w-xs relative'>
                <input
                  type='text'
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-700 text-sm focus:bg-white mt-5'
                  placeholder='Enter your Name'
                  onChange={onChange('name')}
                  value={name}
                />
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
                  onChange={onChange('password1')}
                  value={password1}
                />
                <input
                  type='password'
                  className='w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-700 text-sm focus:bg-white mt-5'
                  placeholder='Confirm password'
                  onChange={onChange('password2')}
                  value={password2}
                />
                <button
                  type='submit'
                  className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out'
                >
                  Register
                </button>
              </div>
              <div className='my-5 flex items-center justify-center border-b text-center'>
                <div className='leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2'>
                  Or sign with email or social login
                </div>
              </div>
              <div className='flex flex-col items-center mt-10'>
                <Link
                  to='/login'
                  className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow-sm focus-shadow-outline'
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className='flex-1 bg-indigo-100 text-center hidden md:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
