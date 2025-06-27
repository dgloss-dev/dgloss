'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Form, FormItem, useForm } from '@workspace/ui/components/organisms/form';
import { Input } from '@workspace/ui/components/atoms/input';
import { TextArea } from '@workspace/ui/components/atoms/textArea';
import { Select } from '@workspace/ui/components/atoms/select';
import { Switch } from '@workspace/ui/components/atoms/switch';
import { Checkbox } from '@workspace/ui/components/atoms/checkbox';
import { Upload } from '@workspace/ui/components/atoms/upload';
import { Button } from '@workspace/ui/components/atoms/button';
import { FormFooter } from '@client/components/common/form';
import { ImageIcon } from '@workspace/ui/components/atoms/icon';
import { CALL_STATUS } from '@workspace/types/enums/callList';
import { CreateCallListDto } from '@workspace/types/dto/callList';
import {
  createCallListClient,
  updateCallListClient,
} from '@client/services/callList.client.services';
import { useRouter } from 'next/navigation';
import { MODAL_KEY } from '@client/constants/modalKey.constant';
import { useAppStore } from '@client/store/app.store';
import { ROUTES } from '@client/constants/routes.constant';
import { ICallList } from '@workspace/types/interfaces/callList';
import {
  BasicInput,
  BasicNumberInput,
  TextAreaInput,
  ToggleSwitch,
} from '@client/components/common/form/commonFormItems';
import { uploadToS3 } from '@client/services/utils.service';
import { useMessage } from '@workspace/ui/components/atoms/message';

interface OperatorInputProps {
  idx: number;
  value: number;
  onChange: (idx: number, value: number) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
  options: { label: string; value: number }[];
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface TimeSlotInputProps {
  idx: number;
  slot: TimeSlot;
  onChange: (idx: number, key: keyof TimeSlot, value: string) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}

const operatorOptions = [
  { label: '山田太郎', value: 1 },
  { label: '佐藤花子', value: 2 },
];

const weekdayOptions = [
  { id: 'mon', label: '月', value: 'mon' },
  { id: 'tue', label: '火', value: 'tue' },
  { id: 'wed', label: '水', value: 'wed' },
  { id: 'thu', label: '木', value: 'thu' },
  { id: 'fri', label: '金', value: 'fri' },
  { id: 'sat', label: '土', value: 'sat' },
  { id: 'sun', label: '日', value: 'sun' },
];

export const CallListForm = ({ record }: { record?: any }) => {
  const [form] = useForm();
  const t = useTranslations('callList');
  const { setOpenModalAction, setRefreshAction, refresh } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const message = useMessage();
  const [file, setFile] = useState<File | null>(null);
  const [formState, setFormState] = useState({
    timeSlots: [{ startTime: '09:00', endTime: '18:00' }],
    voiceDataFile: null as File | null,
    operators: [operatorOptions[0]?.value ?? 0],
    weekdays: [] as string[],
  });

  const updateFormState = <K extends keyof typeof formState>(
    key: K,
    value: (typeof formState)[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (record) {
      const weekdays = record.weekdays || [];
      form.setFieldsValue({
        id: record.id,
        name: record.name,
        description: record.description || '',
        remarks: record.remarks || '',
        noAi: record.noAi,
        aiState: record.aiState,
        isCallPossible: record.isCallPossible,
        timeSlots: record.aiCallSlots,
        weekdays: Array.isArray(weekdays) ? weekdays : [],
      });
    } else {
      clearAllValues();
    }
  }, [record, form]);

  const handleTimeSlot = (type: 'add' | 'remove', idx?: number) => {
    if (type === 'add') {
      updateFormState('timeSlots', [
        ...formState.timeSlots,
        { startTime: '09:00', endTime: '18:00' },
      ]);
    } else {
      updateFormState(
        'timeSlots',
        formState.timeSlots.filter((_, i) => i !== idx),
      );
    }
  };

  const handleTimeChange = (idx: number, type: 'startTime' | 'endTime', value: string) => {
    const updatedSlots = [...formState.timeSlots];
    updatedSlots[idx] = { ...updatedSlots[idx], [type]: value };
    updateFormState('timeSlots', updatedSlots);
  };

  const handleOperatorChange = (idx: number, value: number) => {
    const updated = [...formState.operators];
    updated[idx] = value;
    updateFormState('operators', updated);
  };

  const handleOperator = (type: 'add' | 'remove', idx?: number) => {
    if (type === 'add') {
      updateFormState('operators', [...formState.operators, operatorOptions[0]?.value ?? 0]);
    } else {
      updateFormState(
        'operators',
        formState.operators.filter((_, i) => i !== idx),
      );
    }
  };

  const handleWeekdaysChange = (selectedWeekdays: string[]) => {
    updateFormState('weekdays', selectedWeekdays);
    form.setFieldValue('weekdays', selectedWeekdays);
  };

  const clearAllValues = () => {
    form.resetFields();
    setFormState({
      timeSlots: [{ startTime: '09:00', endTime: '18:00' }],
      voiceDataFile: null as File | null,
      operators: [operatorOptions[0]?.value ?? 0],
      weekdays: [],
    });
  };

  const handleSubmit = async (values: CreateCallListDto) => {
    let objectKey = '';
    if (file) {
      const filedata = file;
      const fileName = `${Date.now()}.csv`;
      objectKey = fileName;
      await uploadToS3(filedata, fileName, 'call-list-callers/');
    }
    const payload: CreateCallListDto = {
      name: values.name,
      createdBy: values.createdBy || 1,
      callStatus: CALL_STATUS.CALL_SUSPENDED,
      voiceDataGroupId: 1,
      noAi: values.noAi,
      telNum: values.telNum,
      aiState: values.aiState,
      isCallPossible: values.isCallPossible,
      description: values.description,
      remarks: values.remarks,
      objectKey: objectKey,
      aiCallSlots: formState.timeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    };

    try {
      setLoading(true);
      if (record) {
        await updateCallListClient(record.id, payload);
        message.success(t('descriptions.call_list_updated_description'));
      } else {
        await createCallListClient(payload);
        message.success(t('descriptions.call_list_created_description'));
      }
      setOpenModalAction(MODAL_KEY.CALL_LIST, false);
      clearAllValues();
      setRefreshAction(!refresh);
    } catch (error) {
      console.error('Error submitting call list:', error);
      message.error(t('descriptions.call_list_submit_error_description'));
    } finally {
      setLoading(false);
    }
  };

  const handleCallListSubmit = () => {
    form.validateFields().then((values) => {
      handleSubmit({ ...values });
    });
  };

  const OperatorInput: React.FC<OperatorInputProps> = ({
    idx,
    value,
    onChange,
    onRemove,
    canRemove,
    options,
  }) => (
    <div className="flex items-center mb-2">
      <Select
        id={`operator-select-${idx}`}
        options={options}
        value={value}
        onChange={(v) => onChange(idx, v as number)}
        placeholder={t('form.operatorsPlaceholder')}
        className="min-w-[200px]"
      />
      {canRemove && (
        <div className="cursor-pointer" onClick={() => onRemove(idx)}>
          <ImageIcon path="actions/remove.svg" className="!ml-2" />
        </div>
      )}
    </div>
  );

  const TimeSlotInput: React.FC<TimeSlotInputProps> = ({
    idx,
    slot,
    onChange,
    onRemove,
    canRemove,
  }) => (
    <div className="flex items-center gap-2 mb-2">
      <Input
        type="time"
        className="w-[100px]"
        value={slot.startTime}
        onChange={(e) => onChange(idx, 'startTime', e.target.value)}
      />
      <span>〜</span>
      <Input
        type="time"
        className="w-[100px]"
        value={slot.endTime}
        onChange={(e) => onChange(idx, 'endTime', e.target.value)}
      />
      {canRemove && (
        <div className="cursor-pointer" onClick={() => onRemove(idx)}>
          <ImageIcon path="actions/remove.svg" className="!ml-2" />
        </div>
      )}
    </div>
  );

  const handleFileUpload = async (info: any) => {
    try {
      setFileUploadLoading(true);
      const file = info.file.originFileObj;
      setFile(file);
    } catch (error) {
      console.log(error);
    } finally {
      setFileUploadLoading(false);
    }
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        className="flex items-start w-full custom_ant_form !h-full"
      >
        {/* Left column */}
        <div className="w-full flex flex-col !h-">
          <BasicInput
            label={t('form.listId')}
            name="id"
            placeholder={t('form.listIdPlaceholder')}
            disabled
          />
          <BasicInput
            label={t('form.listName')}
            name="name"
            placeholder={t('form.listNamePlaceholder')}
          />

          <FormItem name="objectKey" label={t('form.voiceData')} layout="horizontal">
            <Upload accept=".csv" showUploadList={false} onChange={handleFileUpload}>
              <Button icon={<ImageIcon path="actions/upload.svg" />} variant="primary-outline">
                {t('form.fileUpload')}
              </Button>
            </Upload>
          </FormItem>

          <FormItem name="operators" label={t('form.operators')} layout="horizontal">
            {formState.operators.map((op, idx) => (
              <OperatorInput
                key={idx}
                idx={idx}
                value={op}
                onChange={handleOperatorChange}
                onRemove={() => handleOperator('remove', idx)}
                canRemove={formState.operators.length > 1 && idx !== 0}
                options={operatorOptions}
              />
            ))}
            <Button variant="primary-outline" onClick={() => handleOperator('add')}>
              {t('form.addOperator')}
            </Button>
          </FormItem>

          <BasicNumberInput
            name="noAi"
            label={t('form.aiOperationCount')}
            placeholder={t('form.aiOperationCountPlaceholder')}
            className="!max-w-20"
          />

          <ToggleSwitch
            name="aiState"
            label={t('form.aiCallUsage')}
            onChange={(checked) => form.setFieldValue('aiState', checked)}
          />

          <ToggleSwitch
            name="isCallPossible"
            label={t('form.aiCallStart')}
            onChange={(checked) => form.setFieldValue('isCallPossible', checked)}
          />

          <FormItem name="timeSlots" label={t('form.aiCallTimeSlots')} layout="horizontal">
            {formState.timeSlots.map((slot, idx) => (
              <TimeSlotInput
                key={idx}
                idx={idx}
                slot={slot}
                onChange={handleTimeChange}
                onRemove={() => handleTimeSlot('remove', idx)}
                canRemove={formState.timeSlots.length > 1 && idx !== 0}
              />
            ))}
            <Button variant="primary-outline" onClick={() => handleTimeSlot('add')} size="small">
              {t('form.addTimeSlot')}
            </Button>
          </FormItem>

          <FormItem label={t('form.aiCallTimeSlots')} layout="horizontal">
            <Checkbox
              type="group"
              options={weekdayOptions}
              value={formState.weekdays}
              onChange={handleWeekdaysChange}
              id="weekdays"
            />
          </FormItem>
        </div>

        {/* Right column */}
        <div className="w-full flex flex-col ">
          <TextAreaInput
            name="description"
            label={t('form.description')}
            rows={10}
            placeholder={t('form.descriptionPlaceholder')}
          />
          <TextAreaInput
            name="remarks"
            label={t('form.remarks')}
            rows={12}
            placeholder={t('form.remarksPlaceholder')}
            className="!h-full"
          />
        </div>
      </Form>

      <FormFooter
        onCancel={() => {
          setOpenModalAction(MODAL_KEY.CALL_LIST, false);
          clearAllValues();
        }}
        loading={loading}
        onClick={handleCallListSubmit}
      />
    </>
  );
};
