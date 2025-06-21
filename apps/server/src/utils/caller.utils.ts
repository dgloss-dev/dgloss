import Ajv from 'ajv';

export const validateCallerRecord = (schema: any, record: any, ajv: Ajv) => {
  for (const [key, value] of Object.entries(record)) {
    if (schema.properties[key]) {
      if (value === '') {
        record[key] = undefined;
      } else if (schema.properties[key].type === 'number') {
        record[key] = value ? Number(value) : undefined;
      } else if (schema.properties[key].type === 'boolean') {
        const lowerValue = typeof value === 'string' ? value.toLowerCase() : value;
        record[key] = lowerValue === 'true' ? true : lowerValue === 'false' ? false : undefined;
      } else {
        record[key] = value || undefined;
      }
    }
  }

  const isValid = ajv.validate(schema, record);

  if (!isValid) {
    return {
      isValid: false,
      errors: ajv.errorsText(ajv.errors, { separator: '\n' }),
    };
  }

  return { isValid: true };
};
