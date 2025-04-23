import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from '../constants';
import GenerateElements from '../../../components/GenerateElements';
import Skeleton from '../../../components/Skeletons';
import localStorageContent from '../../../utils/localstorage';
import { useDispatch, useSelector } from 'react-redux';
import { IInitialState } from '../../../store/reducers/models';
import { addDocuments } from '../../../store/actions/creators';
import { TiDeleteOutline } from 'react-icons/ti'
import TextArea from 'antd/es/input/TextArea';
import { downloadFile } from '../../../utils';
import { useLocation } from 'react-router-dom';

function Documents() {
    const location = useLocation();
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const leadId = queryParams.get('lead_id');
    const [form] = Form.useForm()
    const [noteValue, setNoteValues] = useState<string>('')
    const [filesChanged, setFilesChanged] = useState<boolean>(false)
    const [selectedMultipleFiles, setSelectedMultipleFiles] = useState<any[]>([])
    const [createdMultipleFiles, setCreatedMultipleFiles] = useState<any[]>([])

    const [documents, setDocuments] = useState<any>({
        wagesAndSalaryW2s: null,
        pensions1099R: null,
        socialSecuritySsa1099: null,
        interestIncome1099Int: null,
        partnershipk1: null,
        partnershipK1New: null,
        investmentSold1099B: null,
        propertySold1099S: null,
    });
    const localStoreData = localStorageContent.getUserData()
    const gloablStore = useSelector((state: any) => state.store)
    const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
    const dispatch = useDispatch()
    const inputRef: any = useRef(null)

    const onChangeDocuments = (value: any, name: string,) => {
        setFilesChanged(true)
        setDocuments((prev: any) => {
            return{
                ...prev,
                [name]: value.files[0]
            }
        })
    }

    const formFields: any = useMemo(() => {
        const { 
            wagesAndSalaryW2s,
            pensions1099R,
            socialSecuritySsa1099,
            interestIncome1099Int,
            partnershipk1,
            partnershipK1New,
            investmentSold1099B,
            propertySold1099S,
        } = documents;

        return [
            {
                label: 'Wage & Salary Income-Form W-2s',
                key: 'wagesAndSalaryW2s',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof wagesAndSalaryW2s === 'string' ? wagesAndSalaryW2s : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: 'Enter Wage & Salary Income-Form W-2s',
                config: {
                    rules: [{ required: false, message: 'Please Enter Wage & Salary Income-Form W-2s' }],
                }
            },
            {
                label: "Pensions, Annuities, Profit Sharing, IRA's, -Form(s) 1099-R",
                key: 'pensions1099R',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof pensions1099R === 'string' ? pensions1099R : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: "Enter Pensions, Annuities, Profit Sharing, IRA's, -Form(s) 1099-R",
                config: {
                    rules: [{ required: false, message: "Please Enter Pensions, Annuities, Profit Sharing, IRA's, -Form(s) 1099-R" }],
                }
            },
            {
                label: 'Social Security/Railroad Benefits- Form(s) SSA-1099',
                key: 'socialSecuritySsa1099',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof socialSecuritySsa1099 === 'string' ? socialSecuritySsa1099 : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: 'Enter Social Security/Railroad Benefits- Form(s) SSA-1099',
                config: {
                    rules: [{ required: false, message: 'Please Enter Social Security/Railroad Benefits- Form(s) SSA-1099' }],
                }
            },
            {
                label: 'Interest Income- Form(s) 1099-INT & Broker statements',
                key: 'interestIncome1099Int',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof interestIncome1099Int === 'string' ? interestIncome1099Int : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: 'Enter Interest Income- Form(s) 1099-INT & Broker statements',
                config: {
                    rules: [{ required: false, message: 'Please Enter Interest Income- Form(s) 1099-INT & Broker statements' }],
                }
            },
            {
                label: 'Partnership, Trust, Estate- Form(s) K-1',
                key: 'partnershipk1',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof partnershipk1 === 'string' ? partnershipk1 : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: 'Enter Partnership, Trust, Estate- Form(s) K-1',
                config: {
                    rules: [{ required: false, message: 'Please Enter Partnership, Trust, Estate- Form(s) K-1' }],
                }
            },
            {
                label: 'Partnership, Trust, Estate- Form(s) K-1',
                key: 'partnershipK1New',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof partnershipK1New === 'string' ? partnershipK1New : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: 'Enter Partnership, Trust, Estate- Form(s) K-1',
                config: {
                    rules: [{ required: false, message: 'Please Enter Partnership, Trust, Estate- Form(s) K-1' }],
                }
            },
            {
                label: 'Investments Sold- Form(s) 1099-B',
                key: 'investmentSold1099B',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof investmentSold1099B === 'string' ? investmentSold1099B : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: 'Enter Investments Sold- Form(s) 1099-B',
                config: {
                    rules: [{ required: false, message: 'Please Enter Investments Sold- Form(s) 1099-B' }],
                }
            },
            {
                label: 'Property Sold- Form(s) 1099-S',
                key: 'propertySold1099S',
                elementType: 'INPUT_FILE',
                onChangeField: onChangeDocuments,
                value: typeof propertySold1099S === 'string' ? propertySold1099S : '',
                required: true,
                disable: false,
                type: 'file',
                placeholder: 'Enter Property Sold- Form(s) 1099-S',
                config: {
                    rules: [{ required: false, message: 'Please Enter Property Sold- Form(s) 1099-S' }],
                }
            },
        ]
    }, [documents])

    const onChangeFiles = (e: any) => {
        setFilesChanged(true)
        setSelectedMultipleFiles([...selectedMultipleFiles, ...e.target.files])
    }

    const removeSelectedFile = (index: number) => {
        if(selectedMultipleFiles.length > 0){
            const copyFiles = [...selectedMultipleFiles]
            setSelectedMultipleFiles(copyFiles.filter((_: any, i: number) => i !== index))
        }
    }

     const onSubmitTaxFile = () => {
        // if(!filesChanged){
        //     return;
        // }
        const copyValues = {...documents}
        const keys = Object.keys(documents)
        const forms = new FormData();
        forms.append('leadDocumentsComment', noteValue)
        keys.forEach((k: any) => {
            if(typeof copyValues[k] === 'string'){
                const value: any = null
                forms.append(k, value)
            }else{
                const value: any = copyValues[k]
                forms.append(k, value)
            }
        })
        if(selectedMultipleFiles.length > 0){
            selectedMultipleFiles.forEach((file: any) => {
                forms.append('others', file)
            })
        }
        setSelectedMultipleFiles([])
        //dispatch(addDocuments(forms, localStoreData.leadId))
        dispatch(addDocuments(forms, leadId))
    }
    

     useEffect(() => {
        if(leadData && Object.keys(leadData).length > 0 && !Array.isArray(leadData)){
            const { leadDocuments } = leadData;
            if(leadDocuments.length > 0 && Object.keys(leadDocuments[0]).length > 0 && leadDocuments){
                const {
                    interest_income_1099_int,
                    investment_sold_1099_b,
                    partnership_k1,
                    partnership_k1_2,
                    pensions_1099r,
                    property_sold_1099_s,
                    social_security_ssa1099,
                    wages_salary_w2s,                   
                    lead_documents
                } = leadDocuments[0];

               setDocuments({
                    wagesAndSalaryW2s: wages_salary_w2s,
                    pensions1099R: pensions_1099r,
                    socialSecuritySsa1099: social_security_ssa1099,
                    interestIncome1099Int: interest_income_1099_int,
                    partnershipk1: partnership_k1,
                    partnershipK1New: partnership_k1_2,
                    investmentSold1099B: investment_sold_1099_b,
                    propertySold1099S: property_sold_1099_s,
                })

                if(lead_documents){
                    const splitData= lead_documents.split(',')
                    if(splitData.length > 0){
                        setCreatedMultipleFiles(splitData)
                    }
                }
                

                setFilesChanged(false)
            }
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
                              new Array(8).fill('null').map((_: any, index: number) => (
                                  <Col className="gutter-row" xl={12} sm={12} xs={24} key={index}>
                                      <Skeleton shape="rectangle" styles={{ height: '20px', width: '150px' }} />
                                      <Skeleton shape="rectangle" />
                                  </Col>
                              ))
                          }
                      </Row>
                  </>
              ) : (
                  <>
                      <Form
                          form={form}
                          onFinish={onSubmitTaxFile}
                          onFinishFailed={() => { }}
                          autoComplete="off"
                          layout='vertical'
                      >
                          <Row
                              gutter={gutterBlobal}
                          >
                              {
                                  formFields.map((formItem: any, index: number) => (
                                      <Col className="gutter-row" xl={12} sm={12} xs={24} key={index}>
                                          <GenerateElements elementData={formItem} />
                                      </Col>
                                  ))
                              }
                          </Row>
                          <Row>
                          <Col>
                                  <Form.Item>
                                        <input ref={inputRef} style={{display: 'none'}} type='file' multiple onChange={onChangeFiles}/>
                                      <Button type="dashed" onClick={() => {
                                        if(inputRef.current){
                                            inputRef.current.click()
                                        }
                                      }}>
                                         Select Multiple Files
                                      </Button>
                                  </Form.Item>
                                </Col>
                               


                          </Row>
                          <Row
                              gutter={gutterBlobal}
                          >
                           
                                

                                {
                                    selectedMultipleFiles.length > 0 && selectedMultipleFiles.map((singleFile: any, i: number) => (
                                        <Col className="gutter-row" xl={12} sm={12} xs={24}>
                                        <Form.Item>
                                            <div className='multiple-file' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', border:'1px solid #d9d9d9', borderRadius: '5px' }}>
                                                <p style={{margin: '7px 0'}}>{singleFile.name}</p>
                                                <TiDeleteOutline size={20} color='#b1b0b0' style={{cursor: 'pointer'}} onClick={() => removeSelectedFile(i)}/>
                                            </div>
                                        </Form.Item>
                                        </Col>
                                    ))
                                }
                                {
                                    createdMultipleFiles.length > 0 && createdMultipleFiles.map((singleFile: any, i: number) => (
                                        <Col className="gutter-row" xl={12} sm={12} xs={24}>
                                        <Form.Item>
                                            <div onClick={() => downloadFile(singleFile)} className='multiple-file' style={{ cursor: 'pointer', border: '1px solid #1677ff', color: '#1677ff', padding: '0 20px', borderRadius: '5px' }}>

                                                <p style={{ margin: '7px 0', textOverflow: 'ellipsis', overflow: 'hidden', width: '500px' }}>{singleFile.split('/').pop().replace(/%20/g, '') || 'Tax file'}</p> {/* Show the filename */}

                                            </div>
                                        </Form.Item>
                                        </Col>
                                    ))
                                }
                               
                                
                          </Row>
                          <Row>
                              <Col className="gutter-row" xl={24} sm={24} xs={24}>
                                  <Form.Item>
                                      <p><strong>Note</strong> : {leadData?.leadDocumentsComment ? leadData?.leadDocumentsComment : ''}</p>
                                      <TextArea onChange={(e: any) => setNoteValues(e.target.value)} placeholder='Enter Selected Notes' />
                                  </Form.Item>
                                  {leadData?.leadDocuments?.length > 0 && (
                                    <p>
                                        <strong>Note:</strong> {leadData.leadDocuments[0].comment}
                                    </p>
                                    )}
                              </Col>
                          </Row>
                          
                <Row justify={'end'}>
                  <Col>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                  </Col>
                </Row> 
                      </Form>
                  </>
              )
          }
    </div>
  )
}

export default Documents