import React, { useState, useEffect, useMemo, useRef } from "react";
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from "../constants";
import GenerateElements from "../../../components/GenerateElements";
import Skeleton from "../../../components/Skeletons";
import { useDispatch, useSelector } from "react-redux";
import { IInitialState } from "../../../store/reducers/models";
import localStorageContent from "../../../utils/localstorage";
import { addAdjustmentIncome } from "../../../store/actions/creators";
import { yesNoOptions } from "../GeneralInformation/constants";
import {
  educationalLoansOptions,
  hsafsaOptions,
  iraOptions,
} from "./constants";
import { convertToDate, convertToDateYear, isEmptyKeys } from "../../../utils";
import dayjs from "dayjs";
import { setError } from "../../../store/reducers";
import { useLocation } from "react-router-dom";

function AdjustmentIncome() {
  const [form] = Form.useForm();
  const location = useLocation();
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("lead_id");
  const [showFields, setShowFields] = useState<any>({
    year: false,
    modal: false,
    manufacturerOfVehicle: false,
    vehicleIDNumber: false,
    dateOfPurchase: false,
    price: false,
    electricPropertyCosts: false,
    heatingPropertyCosts: false,
    energyPropertyCosts: false,
    pumpPropertyCosts: false,
  });
  const [filterFields, setfilterFields] = useState<any[]>([]);
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formChangedRef = useRef<boolean>(false);

  const onChangeAdjustmentIncome = () => {};

  const onChangeDropDown = (key: string, status: boolean) => {
    if (key === "purchasedHybridCar") {
      setShowFields({
        year: status,
        modal: status,
        manufacturerOfVehicle: status,
        vehicleIDNumber: status,
        dateOfPurchase: status,
        price: status,
      });
      return;
    }

    if (key === "energySaveEquipment") {
      setShowFields({
        electricPropertyCosts: status,
        heatingPropertyCosts: status,
        energyPropertyCosts: status,
        pumpPropertyCosts: status,
      });
      return;
    }
    console.log("");
  };

  const formFields: any = useMemo(() => {
    return [
      {
        label: "Alimony Paid Name",
        key: "alimonyPaidName",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "text",
        placeholder: "Enter Alimony Paid Name",
        config: {
          rules: [
            { required: true, message: "Please Enter Alimony Paid Name" },
          ],
        },
      },
      {
        label: "Alimony Paid SS",
        key: "alimonyPaidSS",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Alimony Paid SS",
        config: {
          rules: [{ required: false, message: "Please Enter Alimony Paid SS" }],
        },
      },
      {
        label: "Educator Expenses",
        key: "educatorExpenses",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Educator Expenses",
        config: {
          rules: [
            { required: false, message: "Please Enter Educator Expenses" },
          ],
        },
      },
      {
        label: "Health Savings Account",
        key: "healthSavingsAccount",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Health Savings Account",
        config: {
          rules: [
            { required: false, message: "Please Enter Health Savings Account" },
          ],
        },
      },
      {
        label: "Tuition and Fees paid",
        key: "tuitionAndFeesPaid",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Tuition and Fees paid",
        config: {
          rules: [
            { required: false, message: "Please Enter Tuition and Fees paid" },
          ],
        },
      },
      {
        label: "IRA/SEP Taxpayer",
        key: "iraSepTaxPayer",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        placeholder: "$",
        config: {
          rules: [
            { required: false, message: "Please Enter IRA/SEP Taxpayer" },
          ],
        },
      },
      {
        label: "IRA/SEP Spouse",
        key: "iraSepSpouse",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter IRA/SEP Spouse",
        config: {
          rules: [{ required: false, message: "Please Enter IRA/SEP Spouse" }],
        },
      },
      {
        label: "Student loan interest",
        key: "studentLoanInterest",
        childKey: [],
        parentKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Student loan interest",
        config: {
          rules: [
            { required: false, message: "Please Enter Student loan interest" },
          ],
        },
      },
      {
        label:
          "Have you purchased Electric / Hybrid Car in US during the tax year?",
        key: "purchasedHybridCar",
        childKey: [
          "year",
          "modal",
          "manufacturerOfVehicle",
          "vehicleIDNumber",
          "dateOfPurchase",
          "price",
        ],
        parentKey: [],
        elementType: "SELECT",
        onChangeField: (value: any, name: any, index: any) => {
          onChangeDropDown("purchasedHybridCar", value === "1");
        },
        required: true,
        options: yesNoOptions,
        disable: false,
        type: "text",
        config: {
          rules: [
            { required: false, message: "Please Enter Visa Change year" },
          ],
        },
      },
      {
        label: "Year",
        key: "year",
        childKey: [],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        parentKey: ["purchasedHybridCar"],
        required: true,
        disable: false,
        type: "number",
        config: {
          rules: [{ required: false, message: "Please Enter year" }],
        },
      },
      {
        label: "Modal",
        key: "modal",
        childKey: [],
        parentKey: ["purchasedHybridCar"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "text",
        config: {
          rules: [{ required: false, message: "Please Enter Modal" }],
        },
      },
      {
        label: "Manufacturer Of Vehicle",
        key: "manufacturerOfVehicle",
        childKey: [],
        parentKey: ["purchasedHybridCar"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "text",
        config: {
          rules: [
            {
              required: false,
              message: "Please Enter Manufacturer Of Vehicle",
            },
          ],
        },
      },
      {
        label: "Vehicle ID Number",
        key: "vehicleIDNumber",
        childKey: [],
        parentKey: ["purchasedHybridCar"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "text",
        config: {
          rules: [
            { required: false, message: "Please Enter Vehicle ID Number" },
          ],
        },
      },
      {
        label: "Date Of Purchase",
        key: "dateOfPurchase",
        childKey: [],
        parentKey: ["purchasedHybridCar"],
        elementType: "DATE_PICKER_DATE",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "date",
        config: {
          rules: [
            { required: false, message: "Please Enter Date Of Purchase" },
          ],
        },
      },
      {
        label: "Price",
        key: "price",
        childKey: [],
        parentKey: ["purchasedHybridCar"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        config: {
          rules: [{ required: false, message: "Please Enter Price" }],
        },
      },
      {
        label: "Energy Saving Equipment in US during the tax year?",
        key: "energySaveEquipment",
        childKey: [
          "electricPropertyCosts",
          "heatingPropertyCosts",
          "energyPropertyCosts",
          "pumpPropertyCosts",
        ],
        parentKey: [],
        elementType: "SELECT",
        onChangeField: (value: any, name: any, index: any) => {
          onChangeDropDown("energySaveEquipment", value === "1");
        },
        required: true,
        options: yesNoOptions,
        disable: false,
        type: "text",
        config: {
          rules: [
            { required: false, message: "Please Enter Visa Change year" },
          ],
        },
      },
      {
        label: "Qualified solar electric property costs",
        key: "electricPropertyCosts",
        childKey: [],
        parentKey: ["energySaveEquipment"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        config: {
          rules: [
            {
              required: false,
              message: "Please Enter electric property costs",
            },
          ],
        },
      },
      {
        label: "Qualified solar water heating property costs",
        key: "heatingPropertyCosts",
        childKey: [],
        parentKey: ["energySaveEquipment"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        config: {
          rules: [
            { required: false, message: "Please Enter heating property costs" },
          ],
        },
      },
      {
        label: "Qualified small wind energy property costs",
        key: "energyPropertyCosts",
        childKey: [],
        parentKey: ["energySaveEquipment"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        config: {
          rules: [
            { required: false, message: "Please Enter energy property costs" },
          ],
        },
      },
      {
        label: "Qualified geothermal heat pump property costs .",
        key: "pumpPropertyCosts",
        childKey: [],
        parentKey: ["energySaveEquipment"],
        elementType: "INPUT",
        onChangeField: onChangeAdjustmentIncome,
        required: true,
        disable: false,
        type: "number",
        config: {
          rules: [
            { required: false, message: "Please Enter pump property costs" },
          ],
        },
      },
      {
        label: "IRA : ",
        key: "ira",
        childKey: [],
        parentKey: [],
        elementType: "CHECKBOX_GROUP",
        required: true,
        options: iraOptions,
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
        label: "Education Loans : ",
        key: "educationalLoans",
        childKey: [],
        parentKey: [],
        elementType: "CHECKBOX_GROUP",
        required: true,
        options: educationalLoansOptions,
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
        label: "HSA/FSA : ",
        key: "hsafsa",
        childKey: [],
        parentKey: [],
        elementType: "CHECKBOX_GROUP",
        required: true,
        options: hsafsaOptions,
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
  }, [leadData]);

  const onSubmitAdjustmentIncome = (values: any, isAutoSave = false) => {
    const copyValues = { ...values };
    if (!isAutoSave) {
      setIsLoading(true); // Only for manual save
    }
    if (copyValues?.energySaveEquipment === "0") {
      delete copyValues?.electricPropertyCosts;
      delete copyValues?.heatingPropertyCosts;
      delete copyValues?.energyPropertyCosts;
      delete copyValues?.pumpPropertyCosts;
    }

    if (copyValues?.purchasedHybridCar === "0") {
      delete copyValues?.year;
      delete copyValues?.modal;
      delete copyValues?.manufacturerOfVehicle;
      delete copyValues?.vehicleIDNumber;
      delete copyValues?.dateOfPurchase;
      delete copyValues?.price;
    }

    if (copyValues.dateOfPurchase) {
      copyValues.dateOfPurchase = convertToDate(copyValues?.dateOfPurchase);
    }

    let isValidDetails = true;
    isValidDetails = isEmptyKeys(copyValues, "ALL", []);

    if (!isValidDetails) {
      dispatch(
        setError({
          status: true,
          type: "error",
          message: "Form validation Error",
        })
      );
      return;
    }

    const keys = Object.keys(values);
    keys.forEach((k: any) => {
      if (
        !isNaN(Number(copyValues[k])) &&
        !["energySaveEquipment", "purchasedHybridCar"].includes(k)
      ) {
        copyValues[k] = Number(copyValues[k]);
      }
    });

    const modiFiedData = copyValues;
    dispatch(addAdjustmentIncome(modiFiedData, leadData?.lead_id));
    if (!isAutoSave) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!formChangedRef.current) return;

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [form]);

  const handleFormChange = () => {
    formChangedRef.current = true;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const values = form.getFieldsValue();
      onSubmitAdjustmentIncome(values);
      formChangedRef.current = false;
    }, 2000); // 2 second debounce
  };

  useEffect(() => {
    let conditionalKeys = Object.keys(showFields);
    let existingKeys = filterFields.map((field: any) => field.key);
    conditionalKeys.forEach((fieldKey: any) => {
      if (showFields[fieldKey]) {
        existingKeys.push(fieldKey);
      } else {
        existingKeys = existingKeys.filter((key: any) => key !== fieldKey);
      }
    });
    setfilterFields(
      formFields.filter((field: any) => existingKeys.includes(field.key))
    );
  }, [showFields]);

  useEffect(() => {
    if (leadData) {
      const yesNoElements = ["purchasedHybridCar", "energySaveEquipment"];
      let { adjustmentsIncome } = leadData;
      let residentKeys =
        leadData && adjustmentsIncome ? Object.keys(adjustmentsIncome) : [];
      if (residentKeys.length > 0) {
        setfilterFields(
          formFields.filter(
            (field: any) =>
              (field?.parentKey.length > 0 &&
                yesNoElements.includes(field.parentKey[0]) &&
                adjustmentsIncome[field?.parentKey[0]] === "1") ||
              field?.parentKey.length === 0
          )
        );
      }
    } else {
      setfilterFields(
        formFields.filter((field: any) => field?.parentKey.length === 0)
      );
    }
  }, [leadData]);

  useEffect(() => {
    if (
      leadData &&
      Object.keys(leadData).length > 0 &&
      !Array.isArray(leadData)
    ) {
      const { adjustmentsIncome } = leadData;
      if (Object.keys(adjustmentsIncome).length > 0 && adjustmentsIncome) {
        const {
          alimonyPaidName,
          alimonyPaidSS,
          educatorExpenses,
          healthSavingsAccount,
          iraSepSpouse,
          iraSepTaxPayer,
          studentLoanInterest,
          tuitionAndFeesPaid,
          purchasedHybridCar,
          year,
          modal,
          manufacturerOfVehicle,
          vehicleIDNumber,
          dateOfPurchase,
          price,
          energySaveEquipment,
          electricPropertyCosts,
          heatingPropertyCosts,
          energyPropertyCosts,
          pumpPropertyCosts,
          ira,
          educationalLoans,
          hsafsa,
        } = adjustmentsIncome;

        form.setFieldsValue({
          alimonyPaidName,
          alimonyPaidSS: alimonyPaidSS || 0,
          educatorExpenses: educatorExpenses || 0,
          healthSavingsAccount: healthSavingsAccount || 0,
          iraSepSpouse: iraSepSpouse || 0,
          iraSepTaxPayer: iraSepTaxPayer || 0,
          studentLoanInterest: studentLoanInterest || 0,
          tuitionAndFeesPaid: tuitionAndFeesPaid || 0,
          purchasedHybridCar: purchasedHybridCar || 0,
          year: year,
          modal,
          manufacturerOfVehicle,
          vehicleIDNumber,
          dateOfPurchase: dateOfPurchase
            ? dayjs(dateOfPurchase, "YYYY-MM-DD")
            : "",
          price,
          energySaveEquipment,
          electricPropertyCosts: electricPropertyCosts || 0,
          heatingPropertyCosts: heatingPropertyCosts || 0,
          energyPropertyCosts: energyPropertyCosts || 0,
          pumpPropertyCosts: pumpPropertyCosts || 0,
          ira: ["none"], // Default value
          educationalLoans: ["none"],
          hsafsa: ["none"],
        });
      }
    }
  }, [leadData]);

  return (
    <div>
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
            onFinish={onSubmitAdjustmentIncome}
            onFinishFailed={() => {}}
            autoComplete="off"
            layout="vertical"
            onValuesChange={handleFormChange}
          >
            <Row gutter={gutterBlobal}>
              {filterFields.map((formItem: any, index: number) => (
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

export default AdjustmentIncome;
