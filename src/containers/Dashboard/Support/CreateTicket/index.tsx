import { Button, Col, Row } from 'antd'
import React from 'react'
import { Form } from 'antd'
import { gutterBlobal } from '../../../User/constants'
import GenerateElements from '../../../../components/GenerateElements'
import { useDispatch } from 'react-redux'
import { createReferal, createTicket } from '../../../../store/actions/creators'
import { categoryList, priorityList } from './constants'

function CreateReferal({ toggleModal }: any) {
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const formFields = [
         {
            label: 'Subject',
            key: 'subject',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter subject',
            config: {
                rules: [{ required: true, message: 'Please Enter subject' }],
            }
        },
         {
            label: 'Category',
            key: 'category',
            elementType: 'SELECT',
            onChangeField: () => {},
            required: true,
            disable: false,
            options:categoryList,
            placeholder: 'Enter subject',
            config: {
                rules: [{ required: true, message: 'Please Enter subject' }],
            }
        },
         {
            label: 'Priority',
            key: 'priority',
            elementType: 'SELECT',
            onChangeField: () => {},
            required: true,
            disable: false,
            options:priorityList,
            placeholder: 'Enter priority',
            config: {
                rules: [{ required: true, message: 'Please Enter priority' }],
            }
        },
        {
            label: 'Description',
            key: 'description',
            elementType: 'Textarea',
            Row:4,
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter description',
            config: {
                rules: [{ required: true, message: 'Please Enter description' }],
            }
        }
    ]


    const onSubmitReferal = (values: any) => {
        dispatch(createTicket({ deptId:1, ...values}))
        form.setFieldsValue({
            subject: '',
            description: ''
        })
        toggleModal()
    }
  return (
    <div style={{width: '100%'}}>
         <Form
            form={form}
            onFinish={onSubmitReferal}
            autoComplete="off"
            layout='vertical'
        >
            <Row
                gutter={gutterBlobal}
            >
                {
                    formFields.map((formItem: any, index: number) => (
                        <Col className="gutter-row" xl={24} sm={24} xs={24} key={index}>
                            <GenerateElements elementData={formItem} />
                        </Col>
                    ))
                }
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
    </div>
  )
}

export default CreateReferal