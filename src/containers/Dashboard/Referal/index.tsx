import { TabsProps } from 'antd'
import React, { useState } from 'react'
import CreateReferal from './CreateReferal'
import ReferalList from './ReferalList'
import { Tabs } from 'antd';

function Referal({ toggleModal }: any) {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Create Referal',
            children: <CreateReferal toggleModal={toggleModal}/>,
        },
        {
            key: '2',
            label: 'Referal list',
            children: <ReferalList toggleModal={toggleModal}/>,
        }
    ];
  return (
    <div style={{width: '100%'}}>
        <Tabs defaultActiveKey={'1'} items={items} />
    </div>
  )
}

export default Referal