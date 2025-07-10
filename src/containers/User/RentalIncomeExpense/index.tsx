import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from "../constants";
import { PlusCircleOutlined } from "@ant-design/icons";
import { rentalExpensesContext } from "./constants";
import Expense from "./Expense";
import Skeleton from "../../../components/Skeletons";
import localStorageContent from "../../../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { IInitialState } from "../../../store/reducers/models";
import dayjs from "dayjs";
import { convertToDate, isEmptyKeys } from "../../../utils";
import { addRentalIncomes } from "../../../store/actions/creators";
import { setError } from "../../../store/reducers";
import { useLocation } from "react-router-dom";

function RentalIncomeExpense() {
  const location = useLocation();
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("lead_id");
  const [options, setOptions] = useState<any>([]);
  const [expenses, setExpenses] = useState<any>([{ ...rentalExpensesContext }]);
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
    values.push({ ...rentalExpensesContext });
    setExpenses(values);
  };

  const deleteExpense = (index: number) => {
    const copydayCareData = [...expenses];
    setExpenses(copydayCareData.filter((_: any, i: number) => i !== index));
  };

  const onChangeRentalExpenses = (
    value: string,
    name: string,
    index: number
  ) => {
    formChangedRef.current = true;
    setExpenses((prevExpenses: any) => {
      const updatedExpenses = [...prevExpenses];
      updatedExpenses[index][name] = value;
      return updatedExpenses;
    });
  };

  const onSubmitRentalIncome = (isAutoSave = false) => {
    setValidate(true);
    if (!isAutoSave) {
      setIsLoading(true); // Only for manual save
    }
    let isValidData: boolean = true;

    //isValidData = expenses.every((expense: any) => isEmptyKeys(expense, 'ALL',[]));

    isValidData = expenses.every((expense: any) => {
      return expense.taxPayer && expense.datePlacedInService;
    });

    if (!isValidData) {
      return;
    }
    const modifiedData = expenses.map((expense: any) => {
      const copyValues = { ...expense };
      if (copyValues.datePlacedInService) {
        copyValues.datePlacedInService = convertToDate(
          copyValues.datePlacedInService
        );
      }
      const keys = Object.keys(expense);
      keys.forEach((k: any) => {
        if (!isNaN(Number(copyValues[k]))) {
          if (k === "datePlacedInService" || k === "address") {
            copyValues[k] = copyValues[k] || " ";
          } else copyValues[k] = Number(copyValues[k]);
        }
      });
      return copyValues;
    });

    dispatch(
      addRentalIncomes(
        { rentalIncomeExpenses: modifiedData },
        leadData?.lead_id
      )
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
      onSubmitRentalIncome(true);
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
      const { rentalIncomeExpenses, spouseDetails, first_name } = leadData;
      if (rentalIncomeExpenses.length > 0) {
        setExpenses(
          rentalIncomeExpenses.map((expense: any) => {
            const {
              address,
              advertising,
              association_dues,
              auto_miles,
              auto_travel,
              clearing_maintainance,
              commisions_paid,
              date_placed_in_service,
              expenses,
              grounds_gardening,
              insurance,
              interest_expense,
              management_fees,
              others,
              others2,
              others3,
              ownership,
              pest_control,
              property_cost_basics,
              rent_received,
              repair_maintainance,
              supplies,
              tax_payer,
              taxes,
              utilities,
              fair_rental_days,
              personal_use_days,
            } = expense;
            return {
              address,
              advertising,
              associationDues: association_dues,
              autoMiles: auto_miles,
              autoTravel: auto_travel,
              clearingMaintainance: clearing_maintainance,
              commisionsPaid: commisions_paid,
              datePlacedInService: date_placed_in_service
                ? dayjs(
                    date_placed_in_service ? date_placed_in_service : "",
                    "YYYY-MM-DD"
                  )
                : "",
              // expenses,
              groundsGardening: grounds_gardening,
              insurance,
              interestExpense: interest_expense,
              managementFees: management_fees,
              others: others,
              others2: others2,
              others3: others3,
              // ownership: ownership,
              pestControl: pest_control,
              propertyCostBasics: property_cost_basics,
              rentReceived: rent_received,
              repairMaintainance: repair_maintainance,
              supplies: supplies,
              taxPayer: tax_payer,
              taxes,
              utilities,
              fairRentalDays: fair_rental_days || "",
              personalUseDays: personal_use_days || "",
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
              onChange={onChangeRentalExpenses}
              onDelete={deleteExpense}
              item={expense}
              data={expenses}
              options={options}
              index={index}
              key={index}
              validate={validate}
              setValidate={setValidate}
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
                  onClick={() => onSubmitRentalIncome(false)}
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

export default RentalIncomeExpense;
