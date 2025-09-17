//https://github.com/indiflex/sbm/blob/develop/lib/validator.ts

import z from "zod";

export type ValidError = Record<
  string,
  { errors: string[]; value?: FormDataEntryValue | null }
>;

export const validateObject = <T extends z.ZodObject>(
  zobj: T,
  object: Record<string, FormDataEntryValue | string | unknown>,
): [ValidError] | [undefined, z.core.output<T>] => {
  const validator = zobj.safeParse(object);
  if (!validator.success) {
    const err = z.treeifyError(validator.error).properties as ValidError;
    for (const [prop, value] of Object.entries(object)) {
      if (prop.startsWith("$")) continue;
      if (!err[prop]) err[prop] = { errors: [] };
      err[prop].value = value?.toString();
    }
    return [err];
  }

  return [undefined, validator.data];
};

export const validate = <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
): [ValidError] | [undefined, z.core.output<T>] => {
  const ent = Object.fromEntries(formData.entries());
  return validateObject(zobj, ent);
};
