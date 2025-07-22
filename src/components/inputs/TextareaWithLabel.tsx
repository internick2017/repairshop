"use client";

import * as React from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface TextareaWithLabelProps<TFieldValues extends FieldValues> extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    fieldTitle: string;  
    required: boolean;
    labelClassName?: string;
    textareaClassName?: string;
    id?: string;
    nameInSchema: FieldPath<TFieldValues>;
    className?: string;
}

const DEFAULT_FORM_ITEM_CLASS = "space-y-2";
const DEFAULT_LABEL_CLASS = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
const DEFAULT_TEXTAREA_CLASS = "min-h-[80px] resize-none";

export function TextareaWithLabel<TFieldValues extends FieldValues>({
    fieldTitle,
    nameInSchema,
    required = false,
    className,
    labelClassName,
    textareaClassName,
    id,
    ...props
}: TextareaWithLabelProps<TFieldValues>) {
    const { control } = useFormContext();
    const textareaId = id || `textarea-${nameInSchema}`;
    
    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className={cn(DEFAULT_FORM_ITEM_CLASS, className)}>
                    <FormLabel 
                        htmlFor={textareaId}
                        className={cn(DEFAULT_LABEL_CLASS, labelClassName)}
                    >
                        {fieldTitle}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            id={textareaId}
                            className={cn(DEFAULT_TEXTAREA_CLASS, textareaClassName)}
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