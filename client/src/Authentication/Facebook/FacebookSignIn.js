import React from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ReactComponent as FacebookIcon } from '../../assets/images/facebook-icon.svg';
import SocialButton from '../../components/Buttons/SocialButton';
import { authenticate, isAuth } from '../../helpers/auth';
import { toast } from 'react-toastify';

const FacebookSignIn = () => {
  const history = useHistory();
  const sendFacebookToken = async (userID, accessToken) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/facebookLogin`,
        {
          userID,
          accessToken,
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
  const facebookSignInHandler = async res => {
    try {
      await sendFacebookToken(res.userID, res.accessToken);
    } catch (err) {
      toast.error(err.response.data.msg)
    }
  };
  return (
    <div className='w-full max-w-xs'>
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
        autoLoad={false}
        callback={facebookSignInHandler}
        render={props => (
          <SocialButton
            icon={<FacebookIcon />}
            style={{ width: '100%' }}
            onClick={props.onClick}
            disabled={props.disabled}
          >
            Continue with Facebook
          </SocialButton>
        )}
      />
    </div>
  );
};

export default FacebookSignIn;
