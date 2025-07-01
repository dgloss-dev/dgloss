import dayjs from 'dayjs';

export const getDisabledTime = (compareTime: dayjs.Dayjs, type: 'before' | 'after') => {
  return {
    disabledHours: () =>
      Array.from({ length: 24 }, (_, i) => i).filter((hour) =>
        type === 'after' ? hour > compareTime.hour() : hour < compareTime.hour(),
      ),
    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === compareTime.hour()) {
        return Array.from({ length: 60 }, (_, i) => i).filter((min) =>
          type === 'after' ? min >= compareTime.minute() : min <= compareTime.minute(),
        );
      }
      return [];
    },
  };
};
