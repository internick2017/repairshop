"use client";

import * as React from "react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectWithLabelProps<TFieldValues extends FieldValues> {
    fieldTitle: string;  
    required: boolean;
    labelClassName?: string;
    selectClassName?: string;
    id?: string;
    nameInSchema: FieldPath<TFieldValues>;
    className?: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
    onValueChange?: (value: string) => void;
}

const DEFAULT_FORM_ITEM_CLASS = "space-y-2";
const DEFAULT_LABEL_CLASS = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";
const DEFAULT_SELECT_CLASS = "";

export function SelectWithLabel<TFieldValues extends FieldValues>({
    fieldTitle,
    nameInSchema,
    required = false,
    className,
    labelClassName,
    selectClassName,
    id,
    placeholder = "Select an option",
    options,
    disabled = false,
    onValueChange,
}: SelectWithLabelProps<TFieldValues>) {
    const { control } = useFormContext();
    const selectId = id || `select-${nameInSchema}`;
    
    return (
        <FormField
            control={control}
            name={nameInSchema}
            render={({ field }) => (
                <FormItem className={cn(DEFAULT_FORM_ITEM_CLASS, className)}>
                    <FormLabel 
                        htmlFor={selectId}
                        className={cn(DEFAULT_LABEL_CLASS, labelClassName)}
                    >
                        {fieldTitle}
                        {required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                        <Select 
                            disabled={disabled}
                            onValueChange={val => {
                                field.onChange(val);
                                if (onValueChange) onValueChange(val);
                            }}
                            value={field.value || ""}
                        >
                            <SelectTrigger 
                                id={selectId}
                                className={cn(DEFAULT_SELECT_CLASS, selectClassName)}
                            >
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option) => (
                                    <SelectItem 
                                        key={option.value} 
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
} 