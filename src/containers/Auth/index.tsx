import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from "antd";
import { initAuth, resendOtp, submitOtp } from '../../store/actions/creators'
import { useDispatch, useSelector } from 'react-redux'
import { IoChevronBackCircleOutline } from 'react-icons/io5'
import { IInitialState } from '../../store/reducers/models';
import { useNavigate } from 'react-router-dom';
import { setShowValidateOtp, setError } from '../../store/reducers'
import './styles.scss'

const Auth = () => {
    const [reSendOtp, setResendOtp] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [otpValue, setOtpValue] = useState<string>('')
    const state: IInitialState = useSelector((state: any) => state.store)
    const { showValidateOtp, isAuthLoading } = state;
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        dispatch(initAuth(values))
    }

    const submitresendOtp = () => {
        if(email === ''){
            dispatch(setError({ status: true, type: 'error', message: 'Please Provide Email.' }))
            return;
        }
        setResendOtp(true)
        dispatch(resendOtp({ email }))
    }

    const onSubmitOtp = () => {
        if(otpValue === ''){
            dispatch(setError({ status: true, type: 'error', message: 'Please Provide OTP.' }))
            return;
        }
        dispatch(submitOtp({ email: email, otp: otpValue }))
    }

    const goBack = () => {
        dispatch(setShowValidateOtp(false))
    }

    useEffect(() => {
        const { isAuthenticated } = state;
        if(isAuthenticated){
            navigate('/dashboard')
        }
    }, [state])

    return (
        <div className="auth-container">
            <div className="auth-container__login">
                <h3 className="auth-container__login--title">Login to Quess Tax Filing </h3>
               {
                showValidateOtp ? (
                     <>
                        <p>A OTP (One Time Password) has been Sent to your Email</p>
                        <Form
                        name="basic"
                        component={false}
                    >
                        <Form.Item
                            label="OTP"
                            name="OTP"
                            rules={[
                                {
                                    required: true,
                                    message: "Please Enter Valid OTP",
                                }
                            ]}
                            
                        >
                            <Input onChange={(e) => setOtpValue(e.target.value)} placeholder='Enter Valid OTP' type='number'/>
                        </Form.Item>

                        <Form.Item
                        >
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div onClick={goBack}>
                                    <IoChevronBackCircleOutline size={25}/>
                                </div>
                                <div>
                                    <Button type="default" onClick={submitresendOtp}>
                                        Resend
                                    </Button>
                                    <Button type="primary" style={{marginLeft: '5px'}} onClick={onSubmitOtp}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                        {
                            reSendOtp && <p className='otp-resent'>OTP Resent successfully.</p>
                        }
                     </>
                ) : (
                     !isAuthLoading && <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 700,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email Id"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your username!",
                                },
                                {
                                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                    message: 'Please enter valid email id'
                                }
                            ]}
                            
                        >
                            <Input onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Item>

                        <Form.Item style={{marginBottom:10}}
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                )
               }
            </div>
        </div>
    )
}

export default Auth