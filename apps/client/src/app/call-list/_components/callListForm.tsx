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

const operatorOptions = [
  { label: '山田太郎', value: 1 },
  { label: '佐藤花子', value: 2 },
];

const weekdayOptions = [
  { label: '月', value: 'mon' },
  { label: '火', value: 'tue' },
  { label: '水', value: 'wed' },
  { label: '木', value: 'thu' },
  { label: '金', value: 'fri' },
  { label: '土', value: 'sat' },
  { label: '日', value: 'sun' },
];

export const CallListForm = ({ record }: { record?: any }) => {
  const [form] = useForm();
  const t = useTranslations('callList');
  const { setOpenModalAction } = useAppStore();

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formState, setFormState] = useState({
    timeSlots: [{ startTime: '09:00', endTime: '18:00' }],
    voiceDataFile: null as File | null,
    operators: [operatorOptions[0]?.value ?? 0],
    selectedWeekdays: [] as string[],
  });

  const updateFormState = <K extends keyof typeof formState>(
    key: K,
    value: (typeof formState)[K],
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        id: record.id,
        name: record.name,
        description: record.description || '',
        remarks: record.remarks || '',
        noAi: record.noAi,
        aiState: record.aiState,
        isCallPossible: record.isCallPossible,
        timeSlots: record.aiCallSlots,
      });
    }
  }, [record]);

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

  const handleVoiceDataUpload = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      updateFormState('voiceDataFile', info.file.originFileObj);
    }
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

  const handleWeekdaysChange = (checkedValues: string[]) => {
    updateFormState('selectedWeekdays', checkedValues);
  };

  const clearAllValues = () => {
    form.resetFields();
    setFormState({
      timeSlots: [{ startTime: '09:00', endTime: '18:00' }],
      voiceDataFile: null as File | null,
      operators: [operatorOptions[0]?.value ?? 0],
      selectedWeekdays: [] as string[],
    });
  };

  const handleSubmit = async (values: CreateCallListDto) => {
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
      objectKey: values.objectKey,
      aiCallSlots: formState.timeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    };

    try {
      setLoading(true);
      await createCallListClient(payload);
      setOpenModalAction(MODAL_KEY.CALL_LIST, false);
      clearAllValues();
    } catch (error) {
      console.error('Error submitting call list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallListSubmit = () => {
    form.validateFields().then((values) => {
      handleSubmit({ ...values });
    });
  };

  return (
    <>
      <Form layout="vertical" form={form} className="flex items-start w-full custom_ant_form">
        <div className="w-full flex flex-col h-full">
          <FormItem layout="horizontal" name="id" label={t('form.listId')}>
            <Input disabled placeholder={t('form.listIdPlaceholder')} />
          </FormItem>
          <FormItem name="name" label={t('form.listName')} layout="horizontal">
            <Input placeholder={t('form.listNamePlaceholder')} />
          </FormItem>
          <FormItem layout="horizontal" name="objectKey" label={t('form.voiceData')}>
            <Upload accept=".csv" showUploadList={false} onChange={handleVoiceDataUpload}>
              <Button icon={<ImageIcon path="actions/upload.svg" />} variant="primary-outline">
                {t('form.fileUpload')}
              </Button>
            </Upload>
          </FormItem>
          <FormItem layout="horizontal" label={t('form.operators')}>
            {formState.operators.map((op, idx) => (
              <div key={idx} className="flex items-center mb-2">
                <Select
                  id={`operator-select-${idx}`}
                  options={operatorOptions}
                  value={op}
                  onChange={(value) => handleOperatorChange(idx, value as number)}
                  placeholder={t('form.operatorsPlaceholder')}
                  className="min-w-[200px]"
                />
                {formState.operators.length > 1 && idx !== 0 && (
                  <div className="cursor-pointer" onClick={() => handleOperator('remove', idx)}>
                    <ImageIcon path="actions/remove.svg" className="!ml-2" />
                  </div>
                )}
              </div>
            ))}
            <Button variant="primary-outline" onClick={() => handleOperator('add')}>
              {t('form.addOperator')}
            </Button>
          </FormItem>
          <FormItem layout="horizontal" name="noAi" label={t('form.aiOperationCount')}>
            <Input
              className="!max-w-20"
              type="number"
              min={0}
              placeholder={t('form.aiOperationCountPlaceholder')}
            />
          </FormItem>
          <FormItem
            name="aiState"
            label={t('form.aiCallUsage')}
            valuePropName="checked"
            layout="horizontal"
          >
            <Switch onChange={(checked) => form.setFieldValue('aiState', checked)} />
          </FormItem>
          <FormItem
            name="isCallPossible"
            label={t('form.aiCallStart')}
            valuePropName="checked"
            layout="horizontal"
          >
            <Switch onChange={(checked) => form.setFieldValue('isCallPossible', checked)} />
          </FormItem>
          <FormItem name="timeSlots" label={t('form.aiCallTimeSlots')} layout="horizontal">
            {formState.timeSlots.map((slot, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <Input
                  type="time"
                  className="w-[100px]"
                  value={slot.startTime}
                  onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                />
                <span>〜</span>
                <Input
                  type="time"
                  className="w-[100px]"
                  value={slot.endTime}
                  onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                />
                {formState.timeSlots.length > 1 && idx !== 0 && (
                  <div className="cursor-pointer" onClick={() => handleTimeSlot('remove', idx)}>
                    <ImageIcon path="actions/remove.svg" className="!ml-2" />
                  </div>
                )}
              </div>
            ))}
            <Button variant="primary-outline" onClick={() => handleTimeSlot('add')} size="small">
              {t('form.addTimeSlot')}
            </Button>
          </FormItem>
          <FormItem layout="horizontal" name="weekdays" label={t('form.aiCallWeekdays')}>
            <Checkbox type="group" options={weekdayOptions} onChange={handleWeekdaysChange} />
          </FormItem>
        </div>
        <div className="w-full flex flex-col h-full">
          <FormItem layout="horizontal" name="description" label={t('form.description')}>
            <TextArea rows={11} placeholder={t('form.descriptionPlaceholder')} />
          </FormItem>
          <FormItem name="remarks" layout="horizontal" label={t('form.remarks')}>
            <TextArea rows={10} placeholder={t('form.remarksPlaceholder')} />
          </FormItem>
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
