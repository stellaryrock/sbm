import { compare, hash } from "bcryptjs";
import { existsSync } from "fs";
import path from "path";
import z from "zod";
import { findMemberByEmail } from "./db";

export type ValidError = Record<
  string,
  { errors: string[]; value?: FormDataEntryValue | null }
>;

export const validate = <T extends z.ZodObject>(
  zobj: T,
  formData: FormData,
): [ValidError] | [undefined, z.core.output<T>] =>
  validateObject(zobj, Object.fromEntries(formData.entries()));

const validErrorWithData = (
  error: unknown | z.ZodError,
  formDataOrObject: Record<string, FormDataEntryValue | string | unknown>,
) => {
  const obj =
    formDataOrObject instanceof FormData
      ? Object.fromEntries(formDataOrObject.entries())
      : formDataOrObject;

  const err = z.treeifyError(error as z.ZodError<typeof obj>).properties as ValidError;
  for (const [prop, value] of Object.entries(obj)) {
    if (prop.startsWith("$")) continue;
    if (!err[prop]) err[prop] = { errors: [] };
    err[prop].value = value as string;
  }
  return err;
};

export const validateAsync = async <T extends z.ZodObject>(
  zobj: T,
  formDataOrObj: FormData | Record<string, FormDataEntryValue | string | unknown>,
): Promise<[ValidError] | [undefined, z.core.output<T>]> => {
  const obj =
    formDataOrObj instanceof FormData
      ? Object.fromEntries(formDataOrObj.entries())
      : formDataOrObj;
  try {
    const validData = await zobj.parseAsync(obj);
    return [undefined, validData];
  } catch (error) {
    return [validErrorWithData(error, obj)];
  }
};

export const validateObject = <T extends z.ZodObject>(
  zobj: T,
  obj: Record<string, FormDataEntryValue | string | unknown>,
): [ValidError] | [undefined, z.core.output<T>] => {
  const validator = zobj.safeParse(obj);

  if (!validator.success) {
    const err = z.treeifyError(validator.error).properties as ValidError;
    for (const [prop, value] of Object.entries(obj)) {
      if (prop.startsWith("$")) continue;
      if (!err[prop]) err[prop] = { errors: [] };
      err[prop].value = value as string;
      // err[prop] = { ...(err[prop] ?? { errors: [] }), value };
    }
    return [err];
  } else {
    return [undefined, validator.data];
  }
};

export const existsEmail = async (email: string, prop: string = "email") => {
  const mbr = await findMemberByEmail(email);
  if (mbr)
    return {
      [prop]: { errors: ["Duplicated Email Address!"], value: email },
    };
};

export const encryptPassword = async (passwd: string) => hash(passwd, 10);

export const comparePassword = (p1: string | undefined, p2: string) =>
  compare(p1 || "", p2);

export const existsFile = (filePath: string | undefined | null) => {
  if (!filePath || filePath.startsWith("http")) return filePath;

  const fullPath = path.join(process.cwd(), "public", filePath);
  return existsSync(fullPath) ? filePath : null;
};
