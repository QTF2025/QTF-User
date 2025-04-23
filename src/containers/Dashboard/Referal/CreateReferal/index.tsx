import { Button, Col, Row } from 'antd'
import React from 'react'
import { Form } from 'antd'
import { gutterBlobal } from '../../../User/constants'
import GenerateElements from '../../../../components/GenerateElements'
import { useDispatch } from 'react-redux'
import { createReferal } from '../../../../store/actions/creators'

function CreateReferal({ toggleModal }: any) {
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const formFields = [
         {
            label: 'Name',
            key: 'name',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter user Name',
            config: {
                rules: [{ required: true, message: 'Please Enter user Name' }],
            }
        },
        {
            label: 'Email',
            key: 'email',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'text',
            placeholder: 'Enter user Email',
            config: {
                rules: [{ required: true, message: 'Please Enter user Email' }],
            }
        },
        {
            label: 'Mobile',
            key: 'phone',
            elementType: 'INPUT',
            onChangeField: () => {},
            required: true,
            disable: false,
            type: 'number',
            placeholder: 'Enter user Mobile',
            config: {
                rules: [{ required: true, message: 'Please Enter user Mobile' }],
            }
        },
    ]


    const onSubmitReferal = (values: any) => {
        dispatch(createReferal(values))
        form.setFieldsValue({
            name: '',
            email: '',
            phone: ''
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