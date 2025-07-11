import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from "../constants";
import { emptyBankContext } from "./constants";
import { PlusCircleOutlined } from "@ant-design/icons";
import Skeleton from "../../../components/Skeletons";
import localStorageContent from "../../../utils/localstorage";
import { IInitialState } from "../../../store/reducers/models";
import { useDispatch, useSelector } from "react-redux";
import { updateBankDetails } from "../../../store/actions/creators";
import { isEmptyKeys } from "../../../utils";
import BankAccount from "./BankAccount";
import { setError } from "../../../store/reducers";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

function BankAccountDetails() {
  const [taxPayer, setTaxPayer] = useState<any>([{ ...emptyBankContext }]);
  const [validate, setValidate] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore;
  const dispatch = useDispatch();
  const location = useLocation();
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("lead_id");
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formChangedRef = useRef<boolean>(false);

  const onChangeBankDetails = useCallback(
    (value: string, name: string, index: number) => {
      formChangedRef.current = true; // ✅ Mark form as changed

      setTaxPayer((prevResidency: any) => {
        // Check if prevResidency is an array and the index is valid
        if (!Array.isArray(prevResidency)) {
          console.error("Invalid state: prevResidency is not an array");
          return prevResidency; // Return the previous state
        }

        if (index < 0 || index >= prevResidency.length) {
          console.error(`Invalid index: ${index}`);
          return prevResidency; // Return the previous state
        }
        // Create a copy of the array and update the value at the given index
        const updatedResidency = [...prevResidency];
        updatedResidency[index] = {
          ...updatedResidency[index],
          [name]: name === "paymentDate" ? dayjs(value) : value, // Dynamically update the field
        };
        return updatedResidency;
      });
    },
    []
  );

  const addBankResidentTaxPayer = useCallback(() => {
    const values = [...taxPayer];
    values.push({ ...emptyBankContext });
    setTaxPayer(values);
  }, [taxPayer]);

  const deleteBankResidentTaxPayer = useCallback(
    (index: number) => {
      const copyResidency = [...taxPayer];
      setTaxPayer(copyResidency.filter((_: any, i: number) => i !== index));
    },
    [taxPayer]
  );

  const onSubmitBankDetails = (values: any, isAutoSave = false) => {
    setValidate(true);
    if (!isAutoSave) {
      setIsLoading(true); // Only for manual save
    }
    let bankAccountsArray: any = [...taxPayer];

    bankAccountsArray = bankAccountsArray.map((item: any) => {
      if (item.paymentType !== "1" || item.paymentType === "") {
        const { paymentDate, ...newItem } = item;
        return { ...newItem };
      }
      return {
        ...item,
        paymentDate: item.paymentDate
          ? dayjs(item.paymentDate).format("YYYY-MM-DD")
          : null,
      };
    });

    let isValidData = true;

    // isValidData = bankAccountsArray?.every((resident: any) => isEmptyKeys(resident, 'ALL', [])); // In empty Array add keys of fields which are optional

    if (!isValidData) {
      dispatch(
        setError({
          status: true,
          type: "error",
          message: "Form validation Error",
        })
      );
      return;
    }

    dispatch(
      updateBankDetails({ bankAccounts: bankAccountsArray }, leadData?.lead_id)
    );
    if (!isAutoSave) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!formChangedRef.current) return; // ✅ Only save if changed by user

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      onSubmitBankDetails(taxPayer, true); // auto-save
      formChangedRef.current = false; // ✅ Reset after saving
    }, 2000); // Debounce: 2 sec

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [taxPayer]);

  useEffect(() => {
    if (
      leadData &&
      Object.keys(leadData).length > 0 &&
      !Array.isArray(leadData)
    ) {
      const { bankAccountDetails, first_name, spouseDetails } = leadData;
      if (bankAccountDetails && bankAccountDetails?.length > 0) {
        setTaxPayer(
          bankAccountDetails.map((taxPayer: any) => ({
            taxPayer: taxPayer?.tax_payer || "",
            accountNumber: taxPayer?.account_number || "",
            accountOwnerName: taxPayer?.owner_account_name || "",
            accountType: taxPayer?.account_type || "",
            bankName: taxPayer?.bank_name || "",
            routingNumber: taxPayer?.routing_number || "",
            paymentType: taxPayer?.payment_type || "",
            paymentDate: taxPayer?.payment_date || "",
          }))
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
    <div>
      {isleadDetailsLoading ? (
        <>
          <Row gutter={gutterBlobal}>
            {new Array(6).fill("null").map((_: any, index: number) => (
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
          <div>
            {taxPayer.map((resident: any, index: number) => (
              <BankAccount
                key={index}
                deleteBankResident={deleteBankResidentTaxPayer}
                onChangeBankDetails={onChangeBankDetails}
                resident={resident}
                index={index}
                residency={taxPayer}
                validate={validate}
                options={options}
                setValidate={setValidate}
              />
            ))}
            <Col>
              <Form.Item>
                <Button
                  className="add-dependent-btn green mx-2"
                  onClick={addBankResidentTaxPayer}
                >
                  <PlusCircleOutlined />
                </Button>
              </Form.Item>
            </Col>
          </div>
          <div>
            <p>
              <strong>Attention : </strong>Kindly verify the rightness of the
              above-mentioned information by thoroughly reviewing it. To ensure
              that your tax refund is processed promptly and securely by the tax
              authorities (if applicable), it is vital that you verify the
              accuracy of your Direct Deposit information.
            </p>
            <hr />
          </div>

          <Row justify={"end"}>
            <Col>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={onSubmitBankDetails}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default BankAccountDetails;
