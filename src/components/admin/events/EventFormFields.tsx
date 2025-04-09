
import { UseFormReturn } from "react-hook-form";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { DateTimeFields } from "./fields/DateTimeFields";
import { LocationField } from "./fields/LocationField";
import { PriceFields } from "./fields/PriceFields";
import { CpdFields } from "./fields/CpdFields";

interface EventFormFieldsProps {
  form: UseFormReturn<any>;
}

export function EventFormFields({ form }: EventFormFieldsProps) {
  return (
    <>
      <BasicInfoFields form={form} />
      <DateTimeFields form={form} />
      <LocationField form={form} />
      <PriceFields form={form} />
      <CpdFields form={form} />
    </>
  );
}
