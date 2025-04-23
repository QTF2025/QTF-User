import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from '../constants';
import { emptyBankContext } from './constants';
import { PlusCircleOutlined } from "@ant-design/icons";
import Skeleton from '../../../components/Skeletons';
import localStorageContent from '../../../utils/localstorage';
import { IInitialState } from '../../../store/reducers/models';
import { useDispatch, useSelector } from 'react-redux';
import { updateBankDetails } from '../../../store/actions/creators';
import { isEmptyKeys } from '../../../utils';
import BankAccount from './BankAccount';
import { setError } from '../../../store/reducers';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

function BankAccountDetails() {
    const [taxPayer, setTaxPayer] = useState<any>([{...emptyBankContext}])
    const [validate, setValidate] = useState<boolean>(false)
    const [options, setOptions] = useState<any>([])
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()
    const location = useLocation();
 // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const leadId = queryParams.get('lead_id');
    
    const onChangeBankDetails = useCallback((value: string, name: string, index: number) => {
        setTaxPayer((prevResidency: any) => {
            // Check if prevResidency is an array and the index is within bounds
            if (!Array.isArray(prevResidency)) {
                console.error('Invalid state: prevResidency is not an array');
                return prevResidency; // Return existing state to prevent undefined errors
            }
            
            if (index < 0 || index >= prevResidency.length) {
                console.error('Invalid index:', index);
                return prevResidency; // Return existing state if index is out of bounds
            }
    
            // Create a new array and update the specific index
            const updatedResidency = [...prevResidency];
            updatedResidency[index] = {
                ...updatedResidency[index],
                [name]: name === 'paymentDate' ? dayjs(value) : value, // Dynamically update the field
            };
    
            return updatedResidency; // Return the updated state
        });
    }, []);
    
    

    const addBankResidentTaxPayer = useCallback(() => {
        const values = [...taxPayer]
        values.push({ ...emptyBankContext })
        setTaxPayer(values);
    }, [taxPayer])

    const deleteBankResidentTaxPayer = useCallback((index: number) => {
        const copyResidency = [...taxPayer]
        setTaxPayer(copyResidency.filter((_: any, i: number) => i !== index))
    },[taxPayer])

    const onSubmitBankDetails= useCallback((values: any) => {
         setValidate(true)

        let bankAccountsArray:any = [...taxPayer]
        bankAccountsArray = bankAccountsArray.map((item:any) => {    
            if(item.paymentType !== "1"  || item.paymentType === ""){
            const {paymentDate, ...newitem} = item;
                return {...newitem}
            } 
            return {...item,
                paymentDate: item.paymentDate ? dayjs(item.paymentDate).format('YYYY-MM-DD') : null
            };            
        });
        let isValidData = true;
        
        //isValidData = bankAccountsArray.every((resident: any) => isEmptyKeys(resident, 'ALL',[]));

        if(!isValidData){
            dispatch(setError({ status: true, type: 'error', message: 'Form validation Error' }))
            return;
        }

        //dispatch(updateBankDetails({ bankAccounts: bankAccountsArray }, localStoreData.leadId))
        dispatch(updateBankDetails({ bankAccounts: bankAccountsArray }, leadId))
    },[taxPayer])
    

    useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { bankAccountDetails, first_name, spouseDetails } = leadData;
            if(bankAccountDetails && bankAccountDetails?.length > 0){
                setTaxPayer(bankAccountDetails.map((taxPayer: any) => ({
                    taxPayer: taxPayer?.tax_payer || '',
                    accountNumber: taxPayer?.account_number || '',
                    accountOwnerName: taxPayer?.owner_account_name || '',
                    accountType: taxPayer?.account_type || '',
                    bankName: taxPayer?.bank_name || '',
                    routingNumber: taxPayer?.routing_number || '',
                    paymentType: taxPayer?.payment_type || '',
                    paymentDate: taxPayer?.payment_date || '',
                })))
            }

            const optionsValues = [
                {
                    value: first_name ? first_name : '',
                    label: first_name ? first_name : ''
                }
            ]
            if(spouseDetails && Object.keys(spouseDetails).length > 0){
                optionsValues.push({
                    value: spouseDetails.first_name ? spouseDetails.first_name : '',
                    label: spouseDetails.first_name ? spouseDetails.first_name : ''
                })
            }
            setOptions(optionsValues)
        }
    }, [leadData])

  return (
    <div>
          {
              isleadDetailsLoading ? (
                  <>
                      <Row
                          gutter={gutterBlobal}
                      >
                          {
                              new Array(6).fill('null').map((_: any, index: number) => (
                                  <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                                      <Skeleton shape="rectangle" styles={{ height: '20px', width: '150px' }} />
                                      <Skeleton shape="rectangle" />
                                  </Col>
                              ))
                          }
                      </Row>
                  </>
              ) : (
                  <>
                        <div>
                            {
                                taxPayer.map((resident: any, index: number) => (
                                <BankAccount 
                                    key={index}
                                    deleteBankResident={deleteBankResidentTaxPayer} 
                                    onChangeBankDetails={onChangeBankDetails} 
                                    resident={resident} 
                                    index={index} 
                                    residency={taxPayer}
                                    validate={validate}
                                    options={options}
                                    setValidate={setValidate}
                                />
                                ))
                            }
                            <Col>
                                <Form.Item>
                                    <Button
                                        className="add-dependent-btn green mx-2"
                                        onClick={addBankResidentTaxPayer}
                                    >
                                        <PlusCircleOutlined />
                                    </Button>
                                </Form.Item>
                            </Col>
                        </div>
                        <div>
                            <p><strong>Attention : </strong>Kindly verify the rightness of the above-mentioned information by thoroughly reviewing it. To ensure that your tax refund is processed promptly and securely by the tax authorities (if applicable), it is vital that you verify the accuracy of your Direct Deposit information.</p>
                            <hr />
                        </div>
                        
                        <Row justify={'end'}>
                            
                            <Col>
                                <Form.Item>
                                    
                                    <Button type="primary" htmlType="submit" onClick={onSubmitBankDetails}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                        
                  </>
              )
          }
    </div>
  )
}

export default BankAccountDetails