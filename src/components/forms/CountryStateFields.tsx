"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFormContext, FieldValues, FieldPath } from "react-hook-form";
import { SelectWithLabel } from "@/components/inputs";
import { FormGrid } from "./FormGrid";
import { allCountries } from "country-region-data";

interface CountryStateFieldsProps<TFieldValues extends FieldValues> {
  countryFieldName: FieldPath<TFieldValues>;
  stateFieldName: FieldPath<TFieldValues>;
  countryLabel?: string;
  stateLabel?: string;
  countryPlaceholder?: string;
  statePlaceholder?: string;
  noRegionsPlaceholder?: string;
  required?: boolean;
  defaultCountry?: string;
  className?: string;
}

export function CountryStateFields<TFieldValues extends FieldValues>({
  countryFieldName,
  stateFieldName,
  countryLabel = "Country",
  stateLabel = "State/Region", 
  countryPlaceholder = "Select country",
  statePlaceholder = "Select state/region",
  noRegionsPlaceholder = "No regions available",
  required = true,
  defaultCountry,
  className = "space-y-3"
}: CountryStateFieldsProps<TFieldValues>) {
  const { setValue, watch } = useFormContext<TFieldValues>();
  
  // Watch the country field for changes
  const selectedCountry = watch(countryFieldName) || defaultCountry || "";
  
  const [internalCountry, setInternalCountry] = useState(selectedCountry);

  // Generate country options
  const countryOptions = useMemo(
    () => (allCountries as Array<[string, string, Array<[string, string]>]>).map(c => ({
      value: c[1],   // country short code
      label: c[0],   // country name
    })),
    []
  );

  // Generate region options based on selected country
  const regionOptions = useMemo(() => {
    const country = (allCountries as Array<[string, string, Array<[string, string]>]>)
      .find(c => c[1] === internalCountry);
    return country && country[2].length > 0
      ? country[2].map((r: [string, string]) => ({
          value: r[1] || r[0],
          label: r[0],
        }))
      : [];
  }, [internalCountry]);

  // Update form values when country changes
  useEffect(() => {
    if (internalCountry !== selectedCountry) {
      setInternalCountry(selectedCountry);
    }
  }, [selectedCountry, internalCountry]);

  // Handle country change
  const handleCountryChange = (value: string) => {
    setInternalCountry(value);
    setValue(countryFieldName, value as TFieldValues[typeof countryFieldName]);
    // Clear state field when country changes
    setValue(stateFieldName, "" as TFieldValues[typeof stateFieldName]);
  };

  return (
    <FormGrid columns={2} className={className}>
      <SelectWithLabel<TFieldValues>
        fieldTitle={countryLabel}
        nameInSchema={countryFieldName}
        required={required}
        placeholder={countryPlaceholder}
        options={countryOptions}
        onValueChange={handleCountryChange}
        className="space-y-3"
      />
      <SelectWithLabel<TFieldValues>
        fieldTitle={stateLabel}
        nameInSchema={stateFieldName}
        required={required}
        placeholder={regionOptions.length ? statePlaceholder : noRegionsPlaceholder}
        options={regionOptions}
        disabled={regionOptions.length === 0}
        className="space-y-3"
      />
    </FormGrid>
  );
}