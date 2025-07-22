"use client";

import * as React from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputWithLabelProps<TFieldValues extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
    fieldTitle: string;  
    required: boolean;
    labelClassName?: string;
    inputClassName?: string;
    id?: string;
    nameInSchema: FieldPath<TFieldValues>;
    className?: string;
}

const DEFAULT_FORM_ITEM_CLASS = "space-y-2";
const DEFAULT_LABEL_CLASS = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
const DEFAULT_INPUT_CLASS = "border-input focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2";

export function InputWithLabel<TFieldValues extends FieldValues>({
    fieldTitle,
    nameInSchema,
    required = false,
    className,
    labelClassName,
    inputClassName,
    id,
    ...props
}: InputWithLabelProps<TFieldValues>) {
    const { control } = useFormContext();
    const inputId = id || `input-${nameInSchema}`;
    
    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className={cn(DEFAULT_FORM_ITEM_CLASS, className)}>
                    <FormLabel 
                        htmlFor={inputId}
                        className={cn(DEFAULT_LABEL_CLASS, labelClassName)}
                    >
                        {fieldTitle}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Input
                            id={inputId}
                            className={cn(DEFAULT_INPUT_CLASS, inputClassName)}
                            {...field}
                            {...props}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
} 