import { TabsProps } from 'antd'
import React, { useState } from 'react'
import CreateTicket from './CreateTicket'
import TicketsList from './TicketsList'
import { Tabs } from 'antd';

function Support({ toggleModal }: any) {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Create Escalation',
            children: <CreateTicket toggleModal={toggleModal} />,
        },
        {
            key: '2',
            label: ' List',
            children: <TicketsList toggleModal={toggleModal} />,
        }
    ];
  return (
    <div style={{width: '100%'}}>
        <Tabs defaultActiveKey={'1'} items={items} />
    </div>
  )
}

export default Support