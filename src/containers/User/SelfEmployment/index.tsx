import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from "../constants";
import { PlusCircleOutlined } from "@ant-design/icons";
import { selfEmploymentContext } from "./constants";
import Expense from "./Expense";
import Skeleton from "../../../components/Skeletons";
import localStorageContent from "../../../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { IInitialState } from "../../../store/reducers/models";
import { convertToDate, isEmptyKeys } from "../../../utils";
import { addSelfEmployment } from "../../../store/actions/creators";
import dayjs from "dayjs";
import { setError } from "../../../store/reducers";
import exp from "constants";
import { useLocation } from "react-router-dom";

function SelfEmployment() {
  const location = useLocation();
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("lead_id");
  const [options, setOptions] = useState<any>([]);
  const [expenses, setExpenses] = useState<any>([{ ...selfEmploymentContext }]);
  const [validate, setValidate] = useState<boolean>(false);
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formChangedRef = useRef<boolean>(false);
  const addExpense = () => {
    const values = [...expenses];
    values.push({ ...selfEmploymentContext });
    setExpenses(values);
  };

  const deleteExpense = (index: number) => {
    const copydayCareData = [...expenses];
    setExpenses(copydayCareData.filter((_: any, i: number) => i !== index));
  };

  const onChangeEmployment = (value: string, name: string, index: number) => {
    formChangedRef.current = true;
    setExpenses((prevExpenses: any) => {
      const updatedExpenses = [...prevExpenses];
      updatedExpenses[index][name] = value;
      return updatedExpenses;
    });
  };

  const onSubmitSelfEmployment = (isAutoSave = false) => {
    setValidate(true);
    if (!isAutoSave) {
      setIsLoading(true); // Only for manual save
    }
    // let isValidData: boolean = true;

    // isValidData = expenses.every((expense: any) => isEmptyKeys(expense, 'ALL',[]));

    // if(!isValidData){
    //     dispatch(setError({ status: true, type: 'error', message: 'Form validation Error' }))
    //     return;
    // }
    const exceptionalCases = [
      "categoryOfBusiness",
      "ownerShip",
      "nameOfBusiness",
      "addressOfBusiness",
      "dateStarted",
    ];
    const modifiedData = expenses.map((expense: any) => {
      const copyValues = { ...expense };
      if (copyValues.dateStarted) {
        copyValues.dateStarted = convertToDate(copyValues.dateStarted);
      }
      const keys = Object.keys(expense);
      keys.forEach((k: any) => {
        if (!isNaN(Number(copyValues[k]))) {
          if (exceptionalCases.indexOf(k) !== -1) {
            if (k === "dateStarted") {
              copyValues[k] = copyValues[k]
                ? convertToDate(copyValues[k])
                : null;
            } else {
              copyValues[k] = copyValues[k] || "";
            }
          } else {
            copyValues[k] = Number(copyValues[k]);
          }
        }
      });
      return copyValues;
    });

    dispatch(
      addSelfEmployment({ selfEmploymentInfo: modifiedData }, leadData?.lead_id)
    );
    if (!isAutoSave) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!formChangedRef.current) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      onSubmitSelfEmployment(true); // ✅ Trigger save
      formChangedRef.current = false;
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [expenses]);

  useEffect(() => {
    if (
      leadData &&
      Object.keys(leadData).length > 0 &&
      !Array.isArray(leadData)
    ) {
      const { selfEmploymentInfo, spouseDetails, first_name } = leadData;

      if (selfEmploymentInfo.length > 0) {
        setExpenses(
          selfEmploymentInfo.map((expense: any) => {
            const {
              advertisingate,
              auto_expenses,
              auto_miles,
              bank_charges,
              business,
              commision_fees,
              dues_publications,
              eqipment_rental_expenses,
              footage,
              home,
              insurance,
              interest_expense,
              leagal_professionals,
              meals_entertainment_paid,
              office_expenses,
              office_rent_expenses,
              others,
              postage,
              repairs_expenses,
              supplies_expenses,
              tax_payer,
              taxes,
              telephone,
              tools_equipment,
              travel_expenses,
              utilities,
              wages,
              ownership,
              name_of_business,
              address_of_business,
              category_of_business,
              date_started,
              gross_receipts,
              other_income,
              cogs,
            } = expense;
            return {
              advertisingate,
              autoExpenses: auto_expenses,
              autoMiles: auto_miles,
              bankCharges: bank_charges,
              business,
              commisionFees: commision_fees,
              duesPublications: dues_publications,
              eqipmentRentalExpenses: eqipment_rental_expenses,
              // footage,
              home,
              insurance,
              interestExpense: interest_expense,
              leagalProfessionals: leagal_professionals,
              mealsEntertainmentPaid: meals_entertainment_paid,
              officeExpenses: office_expenses,
              officeRentExpenses: office_rent_expenses,
              others,
              postage,
              repairsExpenses: repairs_expenses,
              suppliesExpenses: supplies_expenses,
              taxPayer: tax_payer,
              taxes,
              telephone,
              toolsEquipment: tools_equipment,
              travelExpenses: travel_expenses,
              utilities,
              wages,
              ownerShip: ownership,
              nameOfBusiness: name_of_business,
              addressOfBusiness: address_of_business,
              categoryOfBusiness: category_of_business,
              dateStarted: date_started
                ? dayjs(date_started, "YYYY-MM-DD")
                : "",
              grossReceipts: gross_receipts,
              otherIncome: other_income,
              cogs,
            };
          })
        );
      }
      const optionsValues = [
        {
          value: first_name ? first_name : "",
          label: first_name ? first_name : "",
        },
      ];
      if (spouseDetails && Object.keys(spouseDetails).length > 0) {
        optionsValues.push({
          value: spouseDetails.first_name ? spouseDetails.first_name : "",
          label: spouseDetails.first_name ? spouseDetails.first_name : "",
        });
      }
      setOptions(optionsValues);
    }
  }, [leadData]);

  return (
    <>
      {isleadDetailsLoading ? (
        <>
          <Row gutter={gutterBlobal}>
            {new Array(24).fill("null").map((_: any, index: number) => (
              <Col className="gutter-row" xl={4} sm={12} xs={24} key={index}>
                <Skeleton
                  shape="rectangle"
                  styles={{ height: "20px", width: "150px" }}
                />
                <Skeleton shape="rectangle" />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <div>
          {expenses.map((expense: any, index: number) => (
            <Expense
              onChange={onChangeEmployment}
              onDelete={deleteExpense}
              item={expense}
              data={expenses}
              options={options}
              index={index}
              validate={validate}
              setValidate={setValidate}
              key={index}
            />
          ))}
          {
            // expenses.length < options.length && (
            <Button
              className="add-dependent-btn green mx-2"
              onClick={addExpense}
            >
              <PlusCircleOutlined />
            </Button>
            // )
          }

          <Row justify={"end"}>
            <Col>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => onSubmitSelfEmployment(false)}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
}

export default SelfEmployment;
