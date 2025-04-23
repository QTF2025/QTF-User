import React from 'react'
import { Steps } from 'antd'
import { getLeadStatusIndex, stepItems } from '../constants'
import './styles.scss'

function Stepper({ leadStatusId }: any) {
  return (
    <div className='stepper'>
      <Steps
          current={getLeadStatusIndex(leadStatusId)}
          items={stepItems}
        />
    </div>
  )
}

export default Stepper