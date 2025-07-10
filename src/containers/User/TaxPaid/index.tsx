import React, { useState, useEffect, useMemo, useRef } from "react";
import { Col, Row, Form, Button } from "antd";
import { gutterBlobal } from "../constants";
import GenerateElements from "../../../components/GenerateElements";
import Skeleton from "../../../components/Skeletons";
import localStorageContent from "../../../utils/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { IInitialState } from "../../../store/reducers/models";
import { addTaxFile } from "../../../store/actions/creators";
import { useLocation } from "react-router-dom";

function MedicalExpenses() {
  const location = useLocation();
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const leadId = queryParams.get("lead_id");
  const [form] = Form.useForm();
  const [propertyTaxFile, setPropertyTaxFile] = useState("");
  const [fileChanged, setFileChanged] = useState<boolean>(false);
  const localStoreData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { isleadDetailsLoading, leadData }: IInitialState = gloablStore;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const formChangedRef = useRef<boolean>(false);

  const onChanggeTaxPaid = (value: any) => {
    setFileChanged(true);
    setPropertyTaxFile(value.files[0]);
  };

  const formFields: any = useMemo(() => {
    return [
      {
        label: "Tax File",
        key: "realPropertyTax",
        elementType: "INPUT_FILE",
        onChangeField: onChanggeTaxPaid,
        value: typeof propertyTaxFile === "string" ? propertyTaxFile : "",
        required: true,
        disable: false,
        type: "file",
        placeholder: "Enter Tax File",
        config: {
          rules: [{ required: true, message: "Please Enter Tax File" }],
        },
      },
      {
        label: "Personal property tax",
        key: "personelPropertyTax",
        elementType: "INPUT",
        onChangeField: () => {},
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Personal property tax",
        config: {
          rules: [
            { required: true, message: "Please Enter Personal property tax" },
          ],
        },
      },
      {
        label: "Other",
        key: "others",
        elementType: "INPUT",
        onChangeField: () => {},
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Other",
        config: {
          rules: [{ required: false, message: "Please Enter Other" }],
        },
      },
      {
        label: "Other 1",
        key: "others2",
        elementType: "INPUT",
        onChangeField: () => {},
        required: true,
        disable: false,
        type: "number",
        placeholder: "Enter Other1",
        config: {
          rules: [{ required: false, message: "Please Enter Other 1" }],
        },
      },
    ];
  }, [propertyTaxFile]);

  const onSubmitTaxFile = (values: any, isAutoSave = false) => {
    console.log("tesing");
    const copyValues = { ...values };
    if (!isAutoSave) {
      setIsLoading(true); // Only for manual save
    }
    if (
      !isAutoSave &&
      (propertyTaxFile === "" || propertyTaxFile === undefined)
    ) {
      return;
    }
    const keys = Object.keys(values);
    const form = new FormData();
    console.log("tesing1");
    if (fileChanged) {
      form.append("file", propertyTaxFile);
    }
    keys.forEach((k: any) => {
      if (!isNaN(Number(copyValues[k])) && k !== "realPropertyTax") {
        const value: any = Number(copyValues[k]);
        form.append(k, value);
      }
    });
    dispatch(addTaxFile(form, leadData?.lead_id));
    console.log("tesing2");
    if (!isAutoSave) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  const handleFormChange = () => {
    formChangedRef.current = true;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const values = form.getFieldsValue();
      console.log("Auto-saving values:", values);
      try {
        onSubmitTaxFile(values, true);
      } catch (err) {
        console.error("Auto-save error:", err);
      }
      console.log("tesing3");
      formChangedRef.current = false;
    }, 2000); // 2 second debounce
  };

  useEffect(() => {
    if (
      leadData &&
      Object.keys(leadData).length > 0 &&
      !Array.isArray(leadData)
    ) {
      const { taxesPaid } = leadData;
      if (Object.keys(taxesPaid).length > 0 && taxesPaid) {
        const { others, others2, personelPropertyTax, realPropertyTax } =
          taxesPaid;

        form.setFieldsValue({
          personelPropertyTax,
          others,
          others2,
        });

        if (realPropertyTax) {
          setPropertyTaxFile(realPropertyTax);
        }
      }
    }
  }, [leadData]);

  return (
    <div>
      {isleadDetailsLoading ? (
        <>
          <Row gutter={gutterBlobal}>
            {new Array(4).fill("null").map((_: any, index: number) => (
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
            onFinish={onSubmitTaxFile}
            onFinishFailed={() => {}}
            autoComplete="off"
            layout="vertical"
            onValuesChange={handleFormChange}
          >
            <Row gutter={gutterBlobal}>
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

export default MedicalExpenses;
