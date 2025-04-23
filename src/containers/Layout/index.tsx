import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ILayout } from './models'
import { HEADER_DESCRIPTION, HEADER_TITLE } from './constants'
import Header from '../../components/Header'
import { message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { IInitialState } from '../../store/reducers/models'
import { setError } from "../../store/reducers";
import './styles.scss'
import localStorageContent from '../../utils/localstorage'

const Layout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className='layout'>
        <div className='layout__sidebar'>

        </div>
        <div className='layout__navbar'>
            <Header />
        </div>
        <div className='layout__body'>
            <div className='layout__body--header'>
              <h1 className='layout__body--text'>{HEADER_TITLE}</h1>
              <h4 className='layout__body--text'>{HEADER_DESCRIPTION}</h4>
            </div>
            <div>
              <Outlet />
            </div>
        </div>
        <div className='layout__footer'>
            
        </div>
    </div>
  )
}

export default Layout