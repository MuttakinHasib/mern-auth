import React from 'react';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login';

import { ReactComponent as GoogleIcon } from '../../assets/images/google-icon.svg';
import SocialButton from '../../components/Buttons/SocialButton';
import { authenticate, isAuth } from '../../helpers/auth';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const GoogleSignIn = () => {
  const history = useHistory();
  const sendGoogleToken = async idToken => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/googleLogin`,
        {
          idToken,
        }
      );
      await informParent(res);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };
  const informParent = res => {
    authenticate(res, () => {
      isAuth() && isAuth().role === 'admin'
        ? history.push('/admin')
        : history.push('/private');
    });
  };
  const googleSignInHandler = async res => {
    try {
      await sendGoogleToken(res.tokenId);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };
  return (
    <div className='w-full max-w-xs'>
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
        onSuccess={googleSignInHandler}
        onFailure={googleSignInHandler}
        cookiePolicy={'single_host_origin'}
        render={props => (
          <SocialButton
            icon={<GoogleIcon />}
            style={{ width: '100%' }}
            onClick={props.onClick}
            disabled={props.disabled}
          >
            Continue with Google
          </SocialButton>
        )}
      />
    </div>
  );
};

export default GoogleSignIn;
