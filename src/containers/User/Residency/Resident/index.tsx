import React, { useEffect, useMemo, useState } from 'react'
import { stateOptions, taxYearOptions } from '../constants'
import { Col, Row, Form, Button } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import GenerateElements from '../../../../components/GenerateElements';
import { gutterBlobal } from '../../constants';
import dayjs from 'dayjs';
import { generateTaxYearMonth } from '../../../../utils';

const Resident = ({ onChangeResidency, resident, index, deleteResident, residency, validate, setValidate, options }: any) => {
    const [form] = Form.useForm()
    const currentYear = new Date().getFullYear()

    const formFields: any = useMemo(() => {
        return [
                {
                    label: 'Taxpayer',
                    key: 'taxPayer',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: onChangeResidency,
                    options: options,
                    required: true,
                    disable: false,
                    type: 'string',
                    placeholder: 'Select Tax Year',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Tax Year' }],
                    }
                },
                {
                    label: 'Tax Year',
                    key: 'taxYear',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: onChangeResidency,
                    options: taxYearOptions.filter((year: any) => generateTaxYearMonth() ? year.value <= currentYear : year.value <= currentYear-1),
                    required: true,
                    disable: false,
                    type: 'string',
                    placeholder: 'Select Tax Year',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Tax Year' }],
                    }
                },
                {
                    label: 'State',
                    key: 'state',
                    childKey: [],
                    parentKey: [],
                    elementType: 'SELECT',
                    onChangeField: onChangeResidency,
                    options: stateOptions,
                    required: true,
                    disable: false,
                    type: 'string',
                    placeholder: 'Select State',
                    config: {
                        rules: [{ required: true, message: 'Please Enter State' }],
                    }
                },
                {
                    label: 'Select Date',
                    key: 'date',
                    childKey: [],
                    parentKey: [],
                    elementType: 'DATE_PICKER_DATE_RANGE',
                    onChangeField: onChangeResidency,
                    required: true,
                    disable: false,
                    type: 'date',
                    value: resident.startDate ? [dayjs(resident.startDate, 'YYYY/MM/DD'), dayjs(resident.endDate, 'YYYY/MM/DD')] : '',
                    config: {
                        rules: [{ required: true, message: 'Please Enter Date!' }],
                    }
                },
            ]
    }, [resident, options])



    useEffect(() => {
        form.setFieldsValue({
            taxPayer: resident.taxPayer,
            taxYear: resident.taxYear,
            state: resident.state,
            // showMonthlyRendPaid: resident?.showMonthlyRendPaid,     
            // monthlyRendPaid: resident?.monthlyRendPaid,
            // showMassachusettsInsurance: resident?.showMassachusettsInsurance,
            // massachusettsInsurance: resident?.massachusettsInsurance,
            // showselfspouseReside: resident?.showselfspouseReside,
            // selfspouseReside: resident?.selfspouseReside,
            // showLicenseOrStateId: resident?.showLicenseOrStateId,
            // licenseOrStateId: resident?.licenseOrStateId,
        })
    })

    useEffect(() => {
        if(validate){
            form.submit()
            setValidate(false)
        }
    }, [validate])

  return (
    <>
        {
            index > 0 && <hr />
        }
        <Form
          form={form}
          autoComplete="off"
          layout='vertical'
          key={index}
      >
          <Row
              gutter={gutterBlobal}
          >
              {
                  formFields.map((formItem: any, i: number) => (
                    <Col className="gutter-row" xl={6} sm={12} xs={24} key={i}>
                        <GenerateElements elementData={formItem} index={index} />
                    </Col>
                  ))
              }
              <Col className="gutter-row m-auto" span={6}>
                  {residency.length > 1 && (
                      <Button
                          danger
                          type="text"
                          className="add-dependent-btn mx-2"
                          onClick={() => deleteResident(index)}
                      >
                          <DeleteFilled />
                      </Button>
                  )}
              </Col>
          </Row>
      </Form>
    </>
      
  )
}

export default React.memo(Resident)