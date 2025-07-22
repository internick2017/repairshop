"use client";

import * as React from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface CheckboxWithLabelProps<TFieldValues extends FieldValues> {
    fieldTitle: string;  
    required?: boolean;
    labelClassName?: string;
    checkboxClassName?: string;
    id?: string;
    nameInSchema: FieldPath<TFieldValues>;
    className?: string;
    description?: string;
    disabled?: boolean;
    onValueChange?: (checked: boolean) => void;
}

const DEFAULT_FORM_ITEM_CLASS = "space-y-2";
const DEFAULT_LABEL_CLASS = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
const DEFAULT_CHECKBOX_CLASS = "";

export function CheckboxWithLabel<TFieldValues extends FieldValues>({
    fieldTitle,
    nameInSchema,
    required = false,
    className,
    labelClassName,
    checkboxClassName,
    id,
    description,
    disabled = false,
    onValueChange,
}: CheckboxWithLabelProps<TFieldValues>) {
    const { control } = useFormContext();
    const checkboxId = id || `checkbox-${nameInSchema}`;
    
    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className={cn(DEFAULT_FORM_ITEM_CLASS, className)}>
                    <div className="flex items-center space-x-2">
                        <FormControl>
                            <Checkbox
                                id={checkboxId}
                                checked={field.value}
                                onCheckedChange={(checked) => {


                                    const boolValue = checked === true;
                                    field.onChange(boolValue);
                                    if (onValueChange) onValueChange(boolValue);
                                }}
                                disabled={disabled}
                                className={cn(DEFAULT_CHECKBOX_CLASS, checkboxClassName)}
                            />
                        </FormControl>
                        <div className="grid gap-1.5 leading-none">
                            <FormLabel 
                                htmlFor={checkboxId}
                                className={cn(DEFAULT_LABEL_CLASS, labelClassName)}
                            >
                                {fieldTitle}
                                {required && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>
                            {description && (
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
} 