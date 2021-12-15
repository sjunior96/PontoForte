import { InputHTMLAttributes } from "react";

export interface IMonth {
    monthId: number;
    monthName: string;
}

export interface IGoal {
    cityStoreId: number;
    goalId: number;
    month: number;
    year: number;
    monthGoal: number;
}

export interface IClassification {
    storeClassificationId: number;
    storeClassification: string;
    production: number;
    furniture: number;
    service: number;
    cdc: number;
    ep: number;
    premium: number;
    total2: number;
    guaranteed: number;
}

export interface IStore {
    storeId: number;
    storeName: string;
    storeClassificationId: number;
}

export interface ISimulation extends IMonth, IClassification, IGoal {

}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    appendedText?: string;
}

export interface IProduction {
    mercantileCommissionTax: number;
    mercantileCommissionValue: number;
    mercantilePercent: number;
    mercantileValue: number;
    mercantileBonus: number;
    profitabilityCommission: number;
    profitabilityPercent: number;
    profitabilityValue: number;
    serviceWarrantyAndWoliCommission: number;
    serviceWarrantyAndWoliPercent: number;
    serviceWarrantyAndWoliValue: number;
    loanCommission: number;
    loanPercent: number;
    loanValue: number;
    cdcPercent: number;
    cdcValue: number;
    furniturePercent: number;
    furnitureValue: number;
}