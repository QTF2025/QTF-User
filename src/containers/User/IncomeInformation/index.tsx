import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from "../constants";
import GenerateElements from "../../../components/GenerateElements";
import Skeleton from "../../../components/Skeletons";
import localStorageContent from "../../../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { IInitialState } from "../../../store/reducers/models";
import { addIncomeInformation } from "../../../store/actions/creators";
import {
  employmentIncomes,
  investmentIncomes,
  rentalIncomes,
  retirementIncomes,
  salesAssets,
  selfEmploymentIncomes,
} from "./constants";
import { useLocation } from "react-router-dom";

function IncomeInformation() {
  const location = useLocation();
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("lead_id");
  const [form] = Form.useForm();
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formChangedRef = useRef<boolean>(false);
  const [formTick, setFormTick] = useState(0);

  const handleFormChange = () => {
    formChangedRef.current = true;
    setFormTick((prev) => prev + 1); // Trigger auto-save effect
  };

  const onSubmitIncomeInformation = (values: any, isAutoSave = false) => {
    console.log("testing");
    if (!isAutoSave) {
      setIsLoading(true); // Only for manual save
    }

    // const copyValues = {...values}
    // const keys = Object.keys(values)
    // keys.forEach((k: any) => {
    //     if(!isNaN(Number(copyValues[k]))){
    //         copyValues[k] = Number(copyValues[k])
    //     }
    // })
    const havingValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== null)
    );
    dispatch(addIncomeInformation(havingValues, leadData.lead_id));
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
      const currentValues = form.getFieldsValue();
      onSubmitIncomeInformation(currentValues, true);
      formChangedRef.current = false;
    }, 2000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formTick]); // ✅ now triggered only after user changes something

  const formFields: any = useMemo(() => {
    return [
      {
        label: "Employment Income : ",
        key: "employmentIncome",
        elementType: "CHECKBOX_GROUP",
        required: false,
        options: employmentIncomes,
        disable: false,
        onChangeField: () => {},
        type: "text",
        placeholder: "",
        config: {
          rules: [
            { required: false, message: "Please Select any of the option" },
          ],
        },
      },
      {
        label: "Investment Income : ",
        key: "investmentIncome",
        elementType: "CHECKBOX_GROUP",
        required: false,
        options: investmentIncomes,
        disable: false,
        onChangeField: () => {},
        type: "text",
        placeholder: "",
        config: {
          rules: [
            { required: false, message: "Please Select any of the option" },
          ],
        },
      },
      {
        label: "Self-Employment Income : ",
        key: "selfEmploymentIncome",
        elementType: "CHECKBOX_GROUP",
        required: false,
        options: selfEmploymentIncomes,
        disable: false,
        onChangeField: () => {},
        type: "text",
        placeholder: "",
        config: {
          rules: [
            { required: false, message: "Please Select any of the option" },
          ],
        },
      },
      {
        label: "Rental Income : ",
        key: "rentalIncome",
        elementType: "CHECKBOX_GROUP",
        required: false,
        options: rentalIncomes,
        disable: false,
        onChangeField: () => {},
        type: "text",
        placeholder: "",
        config: {
          rules: [
            { required: false, message: "Please Select any of the option" },
          ],
        },
      },
      {
        label: "Retirement Income : ",
        key: "retirementIncome",
        elementType: "CHECKBOX_GROUP",
        required: false,
        options: retirementIncomes,
        disable: false,
        onChangeField: () => {},
        type: "text",
        placeholder: "",
        config: {
          rules: [
            { required: false, message: "Please Select any of the option" },
          ],
        },
      },
      {
        label: "Sale of Assets : ",
        key: "salesOfAssets",
        elementType: "CHECKBOX_GROUP",
        required: false,
        options: salesAssets,
        disable: false,
        onChangeField: () => {},
        type: "text",
        placeholder: "",
        config: {
          rules: [
            { required: false, message: "Please Select any of the option" },
          ],
        },
      },
    ];
  }, []);

  useEffect(() => {
    if (
      leadData &&
      Object.keys(leadData).length > 0 &&
      !Array.isArray(leadData)
    ) {
      const { incomeInformaton } = leadData;

      form.setFieldsValue({
        employmentIncome: incomeInformaton?.employmentIncome,
        investmentIncome: incomeInformaton?.investmentIncome,
        selfEmploymentIncome: incomeInformaton?.selfEmploymentIncome,
        rentalIncome: incomeInformaton?.rentalIncome,
        retirementIncome: incomeInformaton?.retirementIncome,
        salesOfAssets: incomeInformaton?.salesOfAssets,
      });
    }
  }, [leadData]);

  return (
    <div style={{ padding: "0px 20px" }}>
      {isleadDetailsLoading ? (
        <>
          <Row gutter={gutterBlobal}>
            {new Array(8).fill("null").map((_: any, index: number) => (
              <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
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
        <>
          <Form
            form={form}
            onFinish={onSubmitIncomeInformation}
            onFinishFailed={() => {}}
            onValuesChange={handleFormChange}
            autoComplete="off"
            layout="vertical"
          >
            <Row gutter={gutterBlobal}>
              <div>
                <p>
                  Briefly look through and mark the appropriate sections for the
                  following income categories (You and Spouse- if Joint Tax
                  Return). Moreover, please submit the required Source
                  Statements for each respective category :{" "}
                </p>
                <hr />
              </div>
              {formFields.map((formItem: any, index: number) => (
                <Col className="gutter-row" xl={6} sm={12} xs={24} key={index}>
                  <GenerateElements elementData={formItem} />
                </Col>
              ))}
            </Row>

            <Row justify={"end"}>
              <Col>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}
    </div>
  );
}

export default IncomeInformation;
