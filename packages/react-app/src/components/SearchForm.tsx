import React, { useMemo } from 'react';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import type { FormInstance } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { SearchFieldOption } from '@/types/app';

const { RangePicker } = DatePicker;

type SearchFormProps = {
  options: SearchFieldOption[];
  loading?: boolean;
  form?: FormInstance;
  initialValues?: Record<string, unknown>;
  onSearch?: (values: Record<string, unknown>) => void;
  onReset?: () => void;
};

const fieldColSpan = 8;

const SearchForm: React.FC<SearchFormProps> = ({ options, loading, form, initialValues, onSearch, onReset }) => {
  const [internalForm] = Form.useForm();
  const formInstance = form ?? internalForm;

  const mergedOptions = useMemo(() => options.filter((option) => option.field), [options]);

  const renderField = (option: SearchFieldOption) => {
    const commonProps = {
      placeholder: option.placeholder ?? `请输入${option.label}`,
      allowClear: true,
    } as const;
    switch (option.type) {
      case 'select':
        return (
          <Select
            {...commonProps}
            options={(option.options ?? []).map((item) => ({ label: item.label, value: item.value }))}
          />
        );
      case 'number':
        return <InputNumber style={{ width: '100%' }} {...commonProps} />;
      case 'daterange':
        return (
          <RangePicker
            {...commonProps}
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
          />
        );
      case 'date':
        return <DatePicker {...commonProps} style={{ width: '100%' }} format="YYYY-MM-DD" />;
      default:
        return <Input {...commonProps} />;
    }
  };

  const transformValues = (values: Record<string, unknown>) => {
    const result: Record<string, unknown> = {};
    mergedOptions.forEach((option) => {
      const value = values[option.field];
      if (value === undefined || value === null || value === '') {
        return;
      }
      if (option.type === 'daterange' && Array.isArray(value)) {
        const [start, end] = value as Dayjs[];
        result[option.field] = [start?.format('YYYY-MM-DD'), end?.format('YYYY-MM-DD')];
      } else if (dayjs.isDayjs(value)) {
        result[option.field] = (value as Dayjs).format('YYYY-MM-DD');
      } else {
        result[option.field] = value;
      }
    });
    return result;
  };

  const handleFinish = (values: Record<string, unknown>) => {
    const transformed = transformValues(values);
    onSearch?.(transformed);
  };

  const handleReset = () => {
    formInstance.resetFields();
    onReset?.();
  };

  return (
    <Form
      form={formInstance}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
    >
      <Row gutter={16}>
        {mergedOptions.map((option) => (
          <Col span={option.params?.colSpan ?? fieldColSpan} key={option.field}>
            <Form.Item name={option.field} label={option.label} rules={option.rules as any}>
              {renderField(option)}
            </Form.Item>
          </Col>
        ))}
        <Col span={24}>
          <div className="search-form__actions">
            <Button onClick={handleReset}>重置</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
