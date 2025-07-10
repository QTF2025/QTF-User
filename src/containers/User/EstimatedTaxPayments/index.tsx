import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from "../constants";
import { PlusCircleOutlined } from "@ant-design/icons";
import { estimatedTaxPaymentsContext } from "./constants";
import TaxPayer from "./Taxpayer";
import Skeleton from "../../../components/Skeletons";
import localStorageContent from "../../../utils/localstorage";
import { IInitialState } from "../../../store/reducers/models";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { convertToDate, isEmptyKeys } from "../../../utils";
import { addEstimatedTaxPayer } from "../../../store/actions/creators";
import { setError } from "../../../store/reducers";
import { useLocation } from "react-router-dom";

function EstimatedTaxPayments() {
  const location = useLocation();
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("lead_id");
  const [taxPayers, setTaxPayer] = useState<any>([
    { ...estimatedTaxPaymentsContext },
  ]);
  const [options, setOptions] = useState<any>([]);
  const [validate, setValidate] = useState<boolean>(false);
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formChangedRef = useRef<boolean>(false);
  const addTaxPayer = () => {
    const values = [...taxPayers];
    values.push({ ...estimatedTaxPaymentsContext });
    setTaxPayer(values);
  };

  const deleteTaxPayer = (index: number) => {
    const copydayCareData = [...taxPayers];
    setTaxPayer(copydayCareData.filter((_: any, i: number) => i !== index));
  };

  const onChangeEstimatedTaxPayments = (
    value: string,
    name: string,
    index: number
  ) => {
    formChangedRef.current = true;
    setTaxPayer((prevTaxPayers: any) => {
      const updatedTaxPayer = [...prevTaxPayers];
      updatedTaxPayer[index][name] = value;
      return updatedTaxPayer;
    });
  };

  const onSubmitEstimatedTaxPayer = (isAutoSave = false) => {
    setValidate(true);
    if (!isAutoSave) {
      setIsLoading(true); // Only for manual save
    }
    let isValidData: boolean = true;

    isValidData = taxPayers.every((taxPayer: any) =>
      isEmptyKeys(taxPayer, "ALL", [])
    );

    if (isValidData) {
      return;
    }

    const modifiedData = taxPayers.map((taxPayer: any) => {
      const copyValues = { ...taxPayer };
      if (copyValues.date) {
        copyValues.date = convertToDate(copyValues.date);
      }
      const keys = Object.keys(taxPayer);
      keys.forEach((k: any) => {
        if (!isNaN(Number(copyValues[k]))) {
          copyValues[k] = Number(copyValues[k]);
        }
      });
      return copyValues;
    });

    dispatch(
      addEstimatedTaxPayer(
        { estimatedTaxPayments: modifiedData },
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
      onSubmitEstimatedTaxPayer(true); // ✅ Trigger save
      formChangedRef.current = false;
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [taxPayers]);

  useEffect(() => {
    if (
      leadData &&
      Object.keys(leadData).length > 0 &&
      !Array.isArray(leadData)
    ) {
      const { estimatedTaxPayments, spouseDetails, first_name } = leadData;

      if (estimatedTaxPayments.length > 0) {
        setTaxPayer(
          estimatedTaxPayments.map((dayCare: any) => {
            const { federal, date, state, tax_payer, state_cnt } = dayCare;
            return {
              taxPayer: tax_payer,
              date: date ? dayjs(date, "YYYY-MM-DD") : "",
              federal: federal,
              state: state,
              stateCnt: state_cnt,
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
            {new Array(4).fill("null").map((_: any, index: number) => (
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
          <p>Tax Payments</p>
          <hr />
          {taxPayers.map((expense: any, index: number) => (
            <TaxPayer
              onChange={onChangeEstimatedTaxPayments}
              onDelete={deleteTaxPayer}
              item={expense}
              data={taxPayers}
              options={options}
              index={index}
              validate={validate}
              setValidate={setValidate}
              key={index}
            />
          ))}
          <Button
            className="add-dependent-btn green mx-2"
            onClick={addTaxPayer}
          >
            <PlusCircleOutlined />
          </Button>

          <Row justify={"end"}>
            <Col>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => onSubmitEstimatedTaxPayer(false)}
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

export default EstimatedTaxPayments;
