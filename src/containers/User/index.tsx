import React, { useEffect } from 'react'
import { Collapse, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import GeneralInformation from './GeneralInformation';
import Residency from './Residency';
import BankAccountDetails from './BankAccountDetails';
import DayCareExpense from './DayCareExpense';
import RentalIncomeExpense from './RentalIncomeExpense';
import SelfEmployment from './SelfEmployment';
import EstimatedTaxPayments from './EstimatedTaxPayments';
import FbarFatca from './FbarFatca';
import OtherIncome from './OtherIncome';
import AdjustmentIncome from './AdjustmentIncome';
import MedicalExpenses from './MedicalExpenses';
import TaxPaid from './TaxPaid';
import Documents from './Document\'s';
import localStorageContent from '../../utils/localstorage';
import { initGetLead } from '../../store/actions/creators';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles.scss'
import IncomeInformation from './IncomeInformation';
import { IInitialState } from '../../store/reducers/models';


const { Panel } = Collapse;

const User = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gloablStore = useSelector((state: any) => state.store)
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore
  const location = useLocation()

  const panelItems: any = [
    {
      key: '1',
      Component: GeneralInformation,
      header: 'General Information',
    },
    {
      key: '1',
      Component: Residency,
      header: 'States (US) of Residency',
    },
    {
      key: '1',
      Component: BankAccountDetails,
      header: 'Bank Account Details',
    },
   
    {
      key: '2',
      Component: IncomeInformation,
      header: 'Income Information'
    },
    {
      key: '2',
      Component: RentalIncomeExpense,
      header: 'Rental Income and Expenses'
    },
    {
      key: '2',
      Component: SelfEmployment,
      header: 'Self Employment Information'
    },
    {
      key: '2',
      Component: OtherIncome,
      header: 'Other Income'
    },
    
    {
      key: '4',
      Component: FbarFatca,
      header: 'FBAR / FATCA'
    },
    {
      key: '3',
      Component: MedicalExpenses,
      header: 'Itemized Deductions'
    },
     {
      key: `${leadData && leadData?.dependentDetails?.length > 0 ? '3' : ''}`,
      Component: DayCareExpense,
      header: 'Day Care Expense',
    },
    {
      key: '3',
      Component: EstimatedTaxPayments,
      header: 'Estimated Tax Payments'
    },
    {
      key: '3',
      Component: AdjustmentIncome,
      header: 'Adjustments Income'
    },
    {
      key: '3',
      Component: TaxPaid,
      header: 'Taxes Paid'
    },
    {
      key: '5',
      Component: Documents,
      header: 'Documents'
    }
  ]

  const tabItems: any = [
      {
          key: '1',
          label: 'General Information',
          children: <>
            {
               <Collapse accordion defaultActiveKey={["0"]}>
                {
                  panelItems.map(({ key, header, Component }: any, index: any) => key === '1' && (
                    <Panel header={header} key={index} disabled={!leadData && header !== 'General Information'}>
                      <Component />
                    </Panel>
                  ))
                }
              </Collapse>
            }
          </>,
      },
      {
          key: '2',
          label: 'Income Details',
          children: <>
            {
               <Collapse accordion defaultActiveKey={[leadData ? "3" : ""]} >
                {
                  panelItems.map(({ key, header, Component }: any, index: any) => key === '2' && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  ))
                }
              </Collapse>
            }
          </>,
      },
      {
          key: '3',
          label: 'Expenses or Deductions',
          children: <>
            {
               <Collapse accordion defaultActiveKey={[leadData ? "8" : ""]}>
                {
                  panelItems.map(({ key, header, Component }: any, index: any) => key === '3' && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  ))
                }
              </Collapse>
            }
          </>,
      },
      {
          key: '4',
          label: 'Misc (FBAR and Foreign Info)',
          children: <>
            {
               <Collapse accordion defaultActiveKey={[leadData ? "7" : ""]}>
                {
                  panelItems.map(({ key, header, Component }: any, index: any) => key === '4' && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  ))
                }
              </Collapse>
            }
          </>,
      },
      {
          key: '5',
          label: 'Documents',
          children: <>
            {
               <Collapse accordion defaultActiveKey={[leadData ? "13" : ""]}>
                {
                  panelItems.map(({ key, header, Component }: any, index: any) => key === '5' && (
                    <Panel header={header} key={index} disabled={!leadData}>
                      <Component />
                    </Panel>
                  ))
                }
              </Collapse>
            }
          </>,
      }
  ];
  

  useEffect(() => {
    const userData = localStorageContent.getUserData()
    const queryPrams = new URLSearchParams(location.search)
    const leadId = queryPrams.get('lead_id')
    if(localStorage.getItem("newapplication")) {
      dispatch(initGetLead(sessionStorage.getItem('newappleadid')))
    } else if(leadId && typeof Number(leadId) === 'number'){
      dispatch(initGetLead(leadId))
    }else{
      if(userData && userData.leadId){
        dispatch(initGetLead(userData.leadId))
      }
    }
  }, [])

  return (
    <div className='user-details'>
      <div className='user-details__collapses-menu'>
        <div className='user-details__collapses-menu__header'>
        {Number(leadData?.lead_status) === 6 && (
    
    <>
    <div className="user-details__collapses-menu__header">
          <p className="user-details__collapses-menu__header--title">
            Tax Documents 
          </p>
        </div>

      {/* Online and Offline Tax Files */}
      {leadData.selected_review && (
        <div style={{ marginBottom: '20px'}}>
          <div>selected review tax files: </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(leadData.selected_review.trim(), '_blank', 'noopener,noreferrer');
            }}
          >
            {leadData.selected_review.split('/').pop().replace(/%20/g, '') || 'Tax file'}
          </a>
        </div>
      )}

      {leadData.online_offline_attachments && (
        <div style={{ marginBottom: '20px'}}>
          <div>Online and offline tax files:</div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.open(leadData.online_offline_attachments.trim(), '_blank', 'noopener,noreferrer');
            }}
          >
            {leadData.online_offline_attachments.split('/').pop().replace(/%20/g, '') || 'Tax file'}
          </a>
        </div>
      )}

      {/* Final Tax Files */}
      {leadData.online_final_attachments && (
        <div style={{ marginBottom: '20px'}}>
          Final tax files:
          {leadData.online_final_attachments.split(',').map((file: any, index: any) => (
            <div key={index}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(file.trim(), '_blank', 'noopener,noreferrer');
                }}
              >
                {file.split('/').pop().replace(/%20/g, '') || `Tax file ${index + 1}`}
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  )}

          <p className='user-details__collapses-menu__header--title'>Fill Your Tax Information</p>
          <p className='user-details__collapses-menu__header--link' onClick={() => navigate('/dashboard')}>Go to dashboard</p>
        </div>
        <Tabs defaultActiveKey={'1'} items={tabItems} />
      </div>
    </div>
  )
}

export default User