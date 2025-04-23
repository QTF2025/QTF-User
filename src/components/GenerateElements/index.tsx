import React, { useState } from 'react'
import {
    Input,
    DatePicker,
    Select,
    Form,
    Checkbox,
    InputNumber
} from "antd";
import { MdInfoOutline } from "react-icons/md";
const { RangePicker } = DatePicker;

function GenerateElements({ elementData, index }: any) {
    const { elementType, key, label, onChangeField, options, value, config, type, disable, placeholder, toolTiptext, defaultValue } = elementData;
    let Element: JSX.Element;

    switch (elementType) {
        case 'INPUT':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <Input 
                        onChange={(e) => onChangeField(e.target.value, key, index)} 
                        name={key}
                        type={type}
                        disabled={disable}
                        placeholder={placeholder}
                    />
                </Form.Item>
            )
            break

            case 'INPUT_MAX':
                Element = (
                    <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                        <Input 
                            onChange={(e) => {
                                // Extract digits and preserve leading zeros
                                const newValue = e.target.value.replace(/[^\d]/g, '').slice(0, 9); 
            
                                // Update the state with the new value
                                onChangeField(newValue, key, index);
                            }} 
                            name={key}
                            type="text" // Use "text" to ensure leading zeros are preserved
                            disabled={disable}
                            placeholder={placeholder}
                            maxLength={9} // Limit the input length to 9 characters
                            value={value || ''} // Bind the value from state
                        />
                    </Form.Item>
                );
                break;
            

                
        case 'Textarea':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <Input.TextArea 
                        onChange={(e) => onChangeField(e.target.value, key, index)} 
                        name={key}
                        rows={4}
                        disabled={disable}
                        placeholder={placeholder}
                    />
                </Form.Item>
            )
            break
        case 'INPUT_FILE':
            Element = (
                <Form.Item label={label} name={key} {...config} initialValue={value}>
                      <Input 
                        name={key}
                        type={type}
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => onChangeField(e.target, key, index)}
                    />
                    {value && 
                         <a href={value} target="_blank" rel="noopener noreferrer" id={`${label}1`}>{value.split('/').pop().replace(/%20/g, '') || 'Tax file' }</a>
                    }
                </Form.Item>
            )
            break;
            case 'INPUT_FORMATTER':
                const formatter = (value: any) => {
                    if (!value) return '';
                    
                    // Keep leading zeros but remove all other non-digit characters
                    const newValue = value.replace(/[^\d]/g, '');
                    
                    if (newValue) {
                        onChangeField(newValue, key, index);
                        
                        // Format as XXX-XX-XXXX (adjust the pattern according to the length)
                        return newValue.replace(/^(\d{3})(\d{2})(\d{4})/, "$1-$2-$3").replace(/-$/, '');
                    } else {
                        return '';
                    }
                };
            

            const parser = (value: any) => {
                 if (!value) return '';
                return value.replace(/\D/g, '');
            };
            
            Element = (
                <Form.Item label={label} name={key} {...config} initialValue={value}>
                      <InputNumber 
                        name={key}
                        formatter={formatter}
                        parser={parser}
                        style={{ width: '100%' }}
                        maxLength={9}
                    />
                </Form.Item>
            )
            break;
        case 'INPUT_FILE_TOOLTIP':
            Element = (
                <Form.Item label={label} name={key} initialValue={value} {...config} tooltip={{ icon: <MdInfoOutline style={{cursor: 'pointer'}} size={20}/>, title: toolTiptext }}>
                      <Input 
                        name={key}
                        type={type}
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={(e) => onChangeField(e.target, key, index)}
                    />
                    {value && 
                        <a href={value} target="_blank" rel="noopener noreferrer" id={`${label}1`}>{label} Document</a>
                    }
                </Form.Item>
            )
            break;
        case 'INPUT_TOOLTIP':
            Element = (
                <Form.Item label={label} name={key} initialValue={value} {...config} tooltip={{ icon: <MdInfoOutline style={{cursor: 'pointer'}} size={20}/>, title: toolTiptext }}>
                    <Input 
                        onChange={(e) => onChangeField(e.target.value, key, index)} 
                        name={key}
                        type={type}
                        disabled={disable}
                        placeholder={placeholder}
                    />
                </Form.Item>
            )
            break;
        case 'SELECT':
            const filterOption = (input: string, option?: { label: string; value: string }) =>
            (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase());
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <Select
                        showSearch
                        options={options}
                        // value={value}
                        onChange={(e) => onChangeField(e, key, index)}
                        placeholder={placeholder}
                        disabled={disable}
                        filterOption={filterOption}
                    />
                </Form.Item>
            )
            break;
            case 'MULTI_SELECT':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Please select"
                        onChange={(e) => onChangeField(e, key, index)}
                        options={options}
                        disabled={disable}
                        defaultValue={defaultValue}
                    />
                </Form.Item>
            )
            break;
        case 'SELECT_TOOLTIP':
            const filterOption1 = (input: string, option?: { label: string; value: string }) =>
            (option?.label ?? '')?.toLowerCase().includes(input?.toLowerCase());
            Element = (
                <Form.Item label={label} key={key} name={key} tooltip={{ icon: <MdInfoOutline style={{cursor: 'pointer'}} size={15}/>, title: toolTiptext }} {...config}>
                     <Select
                        showSearch
                        options={options}
                        // value={value}
                        onChange={(e) => onChangeField(e, key, index)}
                        placeholder={placeholder}
                        disabled={disable}
                        filterOption={filterOption1}
                    />
                </Form.Item>
            )
            break;
        case 'DATE_PICKER_DATE':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <DatePicker picker={type} format={'MM/DD/YYYY'}  disabled={disable}  style={{ width: '100%' }} onChange={(e: any) => onChangeField(e, key, index)}/>
                </Form.Item>
            )
            break;
        case 'DATE_PICKER_DATE_TIME':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config}>
                    <DatePicker picker={type} format={'MM/DD/YYYY'} style={{ width: '100%' }} onChange={(e: any) => onChangeField(e, key, index)}/>
                </Form.Item>
            )
            break;
        case 'DATE_PICKER_DATE_RANGE':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                    <RangePicker picker={type} format={'MM/DD/YYYY'} style={{ width: '100%' }} onChange={(e: any) => onChangeField(e, key, index)}/>
                </Form.Item>
            )
            break;
        case 'CHECKBOX_GROUP':
            Element = (
                <Form.Item label={label} key={key} name={key} {...config} initialValue={value}>
                     <Checkbox.Group style={{ width: '100%' }} disabled={disable} onChange={(e) => onChangeField(e, key, index)}>
                        {
                            options.map((option: any, i: any) => <Checkbox key={option.value} value={option?.value}>{option.label}</Checkbox>)
                        }
                     </Checkbox.Group>
                </Form.Item>
            )
            break;
        default:
            Element = <></>
    }

    return Element;
}

export default React.memo(GenerateElements)