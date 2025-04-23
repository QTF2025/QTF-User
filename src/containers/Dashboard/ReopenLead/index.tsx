import { Button, Modal, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { categoryOptions, reopenLeadContext } from './constants'
import { useDispatch } from 'react-redux'
import localStorageContent from '../../../utils/localstorage'
import { reOpenLead } from '../../../store/actions/creators'
import './styles.scss'
import { isEmptyKeys } from '../../../utils'

function ReopenLead({ isChecked, toggleReopenLeadCheckbox, leadId }: any) {
  const { Option } = Select;
  const [reOpenLeadData, setOpenLeadData] = useState({ ...reopenLeadContext })
  const localStoreData = localStorageContent.getUserData()
  const dispatch = useDispatch()
console.log('raj', leadId)
   const onChangeOpenlead = (value: any, key: any) => {
    setOpenLeadData((prev) => {
      return {
        ...prev,
        [key]: value
      }
    })
  }

  const onSubmitReopenLead = async () => {
    try {
      const copyValues = {...reOpenLeadData}
      let isDataValid: boolean = true;
      isDataValid = isEmptyKeys(copyValues, 'ALL', [])
      if(!isDataValid){
        return;
      }
      await dispatch(reOpenLead(reOpenLeadData, leadId))
      toggleReopenLeadCheckbox()
      setOpenLeadData({...reopenLeadContext})
    } catch (error) {
      
    }
  }

  return (
    <div>
        <Modal
        className='modal-container'
        title="Reopen Note"
        visible={isChecked}
        onCancel={toggleReopenLeadCheckbox}
        footer={false}
      >
        <div className='modal-container__body'>
          <div className='modal-container__body--category'>Category</div>
            <Select 
                className='modal-container__body--select'
                onChange={(e) => onChangeOpenlead(e, 'category')}
            >
                {
                  categoryOptions.map((opt: any) => <Option value={opt.label}>{opt.label}</Option>)
                }
            </Select>
            <div className='modal-container__body--comment'>Comment</div>
            <TextArea
                placeholder="Comment..."
                value={reOpenLeadData.reOpenComments}
                onChange={(e) => onChangeOpenlead(e.target.value, 'reOpenComments')}
            />
            <Button className='modal-container__body--button' type="primary" onClick={onSubmitReopenLead}>Submit </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ReopenLead