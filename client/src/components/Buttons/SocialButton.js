import { Button } from '@geist-ui/react';
import React from 'react';

const SocialButton = props => {
  return (
    <Button
      {...props}
      size='large'
      icon={props.icon}
      className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out'
    >
      {props.children}
    </Button>
  );
};

export default SocialButton;
