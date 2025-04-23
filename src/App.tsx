import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Auth from './containers/Auth'
import Layout from './containers/Layout'
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from './store/reducers/models';
import { message } from 'antd';
import { setError } from './store/reducers';
import localStorageContent from './utils/localstorage';
import ProtectRoutes from './components/protectedRoutes';

const Dashboard = lazy(() => import('./containers/Dashboard'))
const User = lazy(() => import('./containers/User'))

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const gloablStore = useSelector((state: any) => state.store)
  const { showAlert, alertMessage, alertType, isAuthenticated }: IInitialState = gloablStore;
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(showAlert){
      messageApi.open({
        type: alertType,
        content: alertMessage,
      });

      setTimeout(() => {
        dispatch(setError({ status: false, type: undefined, message: '' }))
      }, 1000)
    }
  }, [showAlert, alertType, alertMessage])

  return (
    <div className="App">
        {contextHolder}
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route element={<Layout />}>
          <Route path='/user' element={<Suspense fallback={'Loading...'}><ProtectRoutes><User /></ProtectRoutes></Suspense>} />
          <Route path='/dashboard' element={<Suspense fallback={'Loading...'}><ProtectRoutes><Dashboard /></ProtectRoutes></Suspense>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
