'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Form, FormItem, useForm } from '@workspace/ui/components/organisms/form';
import { Input } from '@workspace/ui/components/atoms/input';
import { TextArea } from '@workspace/ui/components/atoms/textArea';
import { Select } from '@workspace/ui/components/atoms/select';
import { Switch } from '@workspace/ui/components/atoms/switch';
import { Checkbox } from '@workspace/ui/components/atoms/checkbox';
import { Upload } from '@workspace/ui/components/atoms/upload';
import { Button } from '@workspace/ui/components/atoms/button';
import { DatePicker } from '@workspace/ui/components/atoms/datepicker';
import dayjs from 'dayjs';
import { FormFooter } from '@client/components/common/form';
import { ImageIcon } from '@workspace/ui/components/atoms/icon';
import { CALL_STATUS } from '@workspace/types/enums/callList';

// Dummy operator data (replace with API call in real usage)
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

const callStatusOptions = [
  { label: '通話中', value: CALL_STATUS.ON_CALL },
  { label: '通話停止', value: CALL_STATUS.CALL_SUSPENDED },
  { label: '手動停止', value: CALL_STATUS.MANUAL_STOP },
  { label: '完了', value: CALL_STATUS.COMPLETED },
];

export const CallListForm = () => {
  const t = useTranslations('callList');

  const [form] = useForm();
  const [timeSlots, setTimeSlots] = useState([
    { start: dayjs('09:00', 'HH:mm'), end: dayjs('18:00', 'HH:mm') },
  ]);
  const [voiceDataFile, setVoiceDataFile] = useState<any>(null);
  const [operators, setOperators] = useState<number[]>(
    operatorOptions.length > 0 ? [operatorOptions[0].value] : [],
  );

  // Add/remove time slot
  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: dayjs('09:00', 'HH:mm'), end: dayjs('18:00', 'HH:mm') }]);
  };
  const handleRemoveTimeSlot = (idx: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== idx));
  };
  // Update time slot
  const handleTimeChange = (idx: number, type: 'start' | 'end', value: any) => {
    const newSlots = [...timeSlots];
    newSlots[idx][type] = value;
    setTimeSlots(newSlots);
  };

  // Voice data file upload
  const handleVoiceDataUpload = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      setVoiceDataFile(info.file.originFileObj);
    }
  };

  // Operator select handlers
  const handleOperatorChange = (idx: number, value: number) => {
    const newOperators = [...operators];
    newOperators[idx] = value;
    setOperators(newOperators);
  };
  const handleAddOperator = () => {
    setOperators([...operators, operatorOptions[0]?.value ?? 0]);
  };
  const handleRemoveOperator = (idx: number) => {
    setOperators(operators.filter((_, i) => i !== idx));
  };

  // Form submit
  const handleSubmit = (values: any) => {
    // Compose time slots
    const callTimeSlots = timeSlots.map((slot) => ({
      startTime: slot.start.format('HH:mm'),
      endTime: slot.end.format('HH:mm'),
    }));

    // Compose payload according to CreateCallListDto
    const payload = {
      name: values.name,
      createdBy: 1, // TODO: Get from auth context
      callStatus: values.callStatus || CALL_STATUS.CALL_SUSPENDED,
      voiceDataGroupId: 1, // TODO: Get from uploaded file or API
      noAi: values.noAi,
      telNum: values.telNum,
      aiState: values.aiState || false,
      isCallPossible: values.isCallPossible || false,
      description: values.description,
      remarks: values.remarks,
      callTimeSlots,
      objectKey: voiceDataFile ? voiceDataFile.name : undefined,
      operators: operators.filter((op) => op != null),
    };

    // TODO: Call API to submit payload
    // Example: await createCallListClient(payload)
    // Show success/error message
    // Reset form if needed
    console.log('Submit:', payload);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className=" flex items-start w-full custom_ant_form"
        onFinish={handleSubmit}
      >
        {/* Left column */}
        <div className="  w-full flex flex-col h-full">
          <FormItem layout="horizontal" name="listId" label={t('form.listId')}>
            <Input disabled placeholder={t('form.listIdPlaceholder')} />
          </FormItem>
          <FormItem
            name="name"
            label={t('form.listName')}
            layout="horizontal"
            rules={[{ required: true, message: t('form.listNameRequired') }]}
          >
            <Input placeholder={t('form.listNamePlaceholder')} />
          </FormItem>
          <FormItem layout="horizontal" name="voiceData" label={t('form.voiceData')}>
            <Upload accept=".wav,.mp3" showUploadList={false} onChange={handleVoiceDataUpload}>
              <Button icon={<ImageIcon path="actions/upload.svg" />} variant="primary-outline">
                {t('form.fileUpload')}
              </Button>
            </Upload>
          </FormItem>
          <FormItem layout="horizontal" label={t('form.operators')}>
            {operators.map((op, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Select
                  id={`operator-select-${idx}`}
                  options={operatorOptions}
                  value={op}
                  onChange={(value) => handleOperatorChange(idx, value as number)}
                  placeholder={t('form.operatorsPlaceholder')}
                  className="min-w-[200px]"
                />
                {operators.length > 1 && idx !== 0 && (
                  <div className="cursor-pointer" onClick={() => handleRemoveOperator(idx)}>
                    <ImageIcon path="actions/remove.svg" className="!ml-2" />
                  </div>
                )}
              </div>
            ))}
            <Button variant="primary-outline" onClick={handleAddOperator}>
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
            layout="horizontal"
            name="aiState"
            label={t('form.aiCallUsage')}
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </FormItem>
          <FormItem
            name="isCallPossible"
            label={t('form.aiCallStart')}
            valuePropName="checked"
            initialValue={false}
            layout="horizontal"
          >
            <Switch />
          </FormItem>
          <div>
            <FormItem
              name="time"
              label={t('form.aiCallTimeSlots')}
              valuePropName="checked"
              initialValue={true}
              layout="horizontal"
            >
              {timeSlots.map((slot, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    type="time"
                    value={slot.start.format('HH:mm')}
                    onChange={(e) => handleTimeChange(idx, 'start', dayjs(e.target.value, 'HH:mm'))}
                    className="w-[100px]"
                  />
                  <span>〜</span>
                  <Input
                    type="time"
                    value={slot.end.format('HH:mm')}
                    onChange={(e) => handleTimeChange(idx, 'end', dayjs(e.target.value, 'HH:mm'))}
                    className="w-[100px]"
                  />
                  {timeSlots.length > 1 && idx !== 0 && (
                    <div className="cursor-pointer" onClick={() => handleRemoveTimeSlot(idx)}>
                      <ImageIcon path="actions/remove.svg" className="!ml-2" />
                    </div>
                  )}
                </div>
              ))}
              <Button variant="primary-outline" onClick={handleAddTimeSlot} size="small">
                {t('form.addTimeSlot')}
              </Button>
            </FormItem>
          </div>
          <FormItem
            layout="horizontal"
            name="weekdays"
            label={t('form.aiCallWeekdays')}
            initialValue={['mon', 'tue', 'wed', 'thu']}
          >
            <Checkbox type="group" options={weekdayOptions} />
          </FormItem>
        </div>
        {/* Right column */}
        <div className=" w-full  flex flex-col h-full">
          <FormItem layout="horizontal" name="description" label={t('form.description')}>
            <TextArea rows={11} placeholder={t('form.descriptionPlaceholder')} />
          </FormItem>
          <FormItem name="remarks" layout="horizontal" label={t('form.remarks')}>
            <TextArea rows={10} placeholder={t('form.remarksPlaceholder')} />
          </FormItem>
        </div>
        {/* Footer */}
      </Form>
      <FormFooter onClick={handleSubmit} />
    </>
  );
};
