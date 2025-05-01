import React from 'react'
import { HEADER_CONTACT_NUMBER, HEADER_CONTACT_EMAIL, LOGIN_TEXT, LOGOUT_TEXT } from './constants'
import Logo from '../../assets/images/qtflogo1.png'
import { PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { IHeader } from './model'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearData } from '../../store/reducers';
import localStorageContent from '../../utils/localstorage';
import './styles.scss'

const Header: React.FC<any> = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const localUserData = localStorageContent.getUserData();

   const handleLogout = () => {
    localStorage.clear();
    dispatch(clearData())
    navigate('/')
  }

  return (
      <div className='header'>
        <div className='header-first'>
          <div className='header-first__contact-number'>
            
            <p className='header-first__contact-number--text'><PhoneOutlined /> {HEADER_CONTACT_NUMBER} -  <MailOutlined /> {HEADER_CONTACT_EMAIL}</p>
          </div>
          <div className='header-first__user-details'>
            <p className='header-first__user-details--text'>{localUserData?.email}</p>
            {
              true ? (
                <p className='header-first__user-details--text' onClick={handleLogout}>{LOGOUT_TEXT}</p>
              ) : (
                <p className='header-first__user-details--text' onClick={handleLogout}>{LOGIN_TEXT}</p>
              )
            }
          </div>
        </div>
        <div className='header-second'>
          <img src={Logo} alt="logo" />
        </div>
      </div>
  )
}

export default Header