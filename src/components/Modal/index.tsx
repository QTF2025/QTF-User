import React from 'react'
import { Modal } from 'antd';

function ModalPopUp({ show, children, showFooter, toggle, title, width }:  any) {
  return (
    <Modal title={title} visible={show} onCancel={toggle} footer={showFooter} width={width}>
       {children}
    </Modal>
  )
}

export default ModalPopUp