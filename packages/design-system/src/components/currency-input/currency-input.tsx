"use client"

import * as React from "react"

import { formatCurrency } from "@fiap-tech-challenge/utils"

import { Input } from "../input/input"

interface CurrencyInputState {
  value?: number
  formattedValue?: string
}

export interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  onChange?: (value: number) => void
  value: number
}

const currencyInputInitialState: CurrencyInputState = {
  value: undefined,
  formattedValue: "",
}

const currencyInputReducer = (_: CurrencyInputState, next?: number) => {
  if (typeof next !== "number") {
    return currencyInputInitialState
  }

  const formattedValue = formatCurrency(next)

  return {
    value: next,
    formattedValue,
  }
}

export function CurrencyInput(props: CurrencyInputProps) {
  const [innerValue, setInnerValue] = React.useReducer(
    currencyInputReducer,
    currencyInputInitialState
  )

  React.useEffect(() => {
    setInnerValue(props.value)
  }, [props.value])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    const parsedValue = value.replace(/\D/g, "")
    const numberValue = Number(parsedValue) / 100

    props.onChange?.(numberValue)
  }

  return (
    <Input {...props} value={innerValue.formattedValue} onChange={onChange} />
  )
}
