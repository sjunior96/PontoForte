import React, { SyntheticEvent, useEffect, useState } from 'react';
import { EventEmitter } from 'stream';
import './App.css';
import InputInbox from './Components/Input/Input';
import { IClassification, IGoal, IMonth, IProduction, ISimulation, IStore } from './types';

const initialActualGoal: ISimulation = {
	storeClassificationId: 1,
	storeClassification: "A",
	production: 0.00,
	furniture: 0.00,
	service: 0.00,
	cdc: 0.00,
	ep: 0.00,
	premium: 0.00,
	total2: 0.00,
	guaranteed: 0.00,
	cityStoreId: 0,
	goalId: 0,
	month: 0,
	year: 0,
	monthGoal: 0.00,
	monthId: 0,
	monthName: ""
};

const initialProduction: IProduction = {
	mercantileCommissionTax: 0.002,
	mercantileCommissionValue: 0.00,
	mercantilePercent: ,
	mercantileValue: 250000,
	mercantileBonus: 0.00,

	profitabilityCommission: 0.01,
	profitabilityPercent: 0,
	profitabilityValue: 12562,

	serviceWarrantyAndWoliCommission: 0.025,
	serviceWarrantyAndWoliPercent: 0,
	serviceWarrantyAndWoliValue: 56589,

	loanCommission: 0.005,
	loanPercent: 0,
	loanValue: 25356,

	cdcPercent: 0,
	cdcValue: 58985,

	furniturePercent: 0,
	furnitureValue: 60358
};

function App() {
	const stores: IStore[] = require('./database/stores.json');
	const months: IMonth[] = require('./database/months.json');
	const goals: IGoal[] = require("./database/database.json").goals;
	const classifications: IClassification[] = require('./database/classifications.json');

	const [selectedStore, setSelectedStore] = useState<number>(1);
	const [selectedMonth, setSelectedMonth] = useState<number>(8);
	const [actualGoalCalc, setActualGoalCalc] = useState<ISimulation>(initialActualGoal);
	const [production, setProduction] = useState<IProduction>(initialProduction);

	const handleGetActualGoal = () => {
		let store = stores.filter((store) => store.storeId === selectedStore)[0];
		let classification = classifications.filter((classification) => classification.storeClassificationId === store.storeClassificationId)[0];
		let month = months.filter((month) => month.monthId === selectedMonth)[0];
		let goal = goals.filter((goal) => goal.cityStoreId === selectedStore && goal.month === selectedMonth && goal.year === 1)[0];

		let realStore: ISimulation = {
			...classification,
			...month,
			...goal,
		};

		console.log(realStore);
		setActualGoalCalc(realStore);
	};

	const handleActualGoalEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
		setProduction({
			...production,
			[event.target.name]: event.target.value,
			mercantilePercent: production.mercantileValue / actualGoalCalc.monthGoal,
			mercantileCommissionValue: production.mercantileCommissionTax * (event.target.name !== "mercantilValue" ? production.mercantileValue : parseFloat(event.target.value))
		});
		console.log(production.mercantileValue);
		console.log(event.target.name);
		console.log(event.target.value);
	};

	useEffect(() => {
		handleGetActualGoal();
	}, [selectedStore, selectedMonth]);

	return (
		<div className="App">
			<h1>Stores</h1>
			<select
				value={selectedStore}
				onChange={(e) => [setSelectedStore(parseInt(e.target.value)), console.log(parseInt(e.target.value))]}
			>
				{stores.map((store, index) => (
					<option key={index} value={store.storeId}>{store.storeName}</option>
				))}
			</select>

			<select
				value={selectedMonth}
				onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
			>
				{months.map((month, index) => (
					<option key={index} value={month.monthId}>{month.monthName}</option>
				))}
			</select>

			<input value={actualGoalCalc?.storeClassification} placeholder="Classificação" disabled />
			<input value={actualGoalCalc?.monthGoal ? actualGoalCalc.monthGoal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "N/A"} placeholder="Meta Ideal" disabled />
			<input value={actualGoalCalc?.guaranteed} placeholder="Garantido" disabled />
			<input placeholder="Total Comissão" disabled />
			<input placeholder="Total Bônus" disabled />
			<input value={actualGoalCalc?.premium} placeholder="Premium" disabled />

			<h1>Valores manuais</h1>
			<input placeholder="Mercantil Produção" />
			<input placeholder="Rentabilidade" />
			<input value={actualGoalCalc?.service} placeholder="Serviço" />
			<input value={actualGoalCalc?.ep} placeholder="Empréstimos (R$)" />
			<input value={actualGoalCalc?.cdc} placeholder="CDC (R$)" />

			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<fieldset>
					<legend>Produção</legend>
					<fieldset>
						<legend>Mercantil</legend>
						<InputInbox
							name="mercantileValue"
							value={production.mercantileValue}
							onChange={(e) => handleActualGoalEdit(e)}
							label="Mercantil"
							appendedText={production.mercantilePercent.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}
						/>
						<span>Comissão: ({production.mercantileCommissionTax.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}) = {(production.mercantileValue * production.mercantileCommissionTax).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
					</fieldset>

					<fieldset>
						<legend>Rentabilidade</legend>
						<InputInbox
							name="profitabilityValue"
							value={production.profitabilityValue}
							placeholder="Móveis"
							onChange={(e) => handleActualGoalEdit(e)}
							label="Rentabilidade (%)"
							appendedText={(production.profitabilityValue / actualGoalCalc.monthGoal).toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}
						/>
						<span>Comissão: ({production.profitabilityCommission.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}) = {(production.profitabilityValue * production.profitabilityCommission).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
					</fieldset>

					<fieldset>
						<legend>Serviços - Garantia e WOLI</legend>
						<InputInbox
							name="serviceWarrantyAndWoliValue"
							value={production.serviceWarrantyAndWoliValue}
							placeholder="Móveis"
							onChange={(e) => handleActualGoalEdit(e)}
							label="Serviço - Garantia e Woli (%)"
							appendedText={(production.serviceWarrantyAndWoliValue / actualGoalCalc.monthGoal).toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}
						/>
						<span>Comissão: ({production.serviceWarrantyAndWoliCommission.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}) = {(production.serviceWarrantyAndWoliValue * production.serviceWarrantyAndWoliCommission).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
					</fieldset>

					<fieldset>
						<legend>Empréstimos</legend>
						<InputInbox
							name="loanValue"
							value={production.loanValue}
							placeholder="Móveis"
							onChange={(e) => handleActualGoalEdit(e)}
							label="Empréstimos (R$)"
							appendedText={(production.loanValue / actualGoalCalc.monthGoal).toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}
						/>
						<span>Comissão: ({production.loanCommission.toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}) = {(production.loanValue * production.loanCommission).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
					</fieldset>

					<fieldset>
						<legend>CDC</legend>
						<InputInbox
							name="cdc"
							value={production.cdcValue}
							placeholder="Móveis"
							onChange={(e) => handleActualGoalEdit(e)}
							label="CDC"
							appendedText={(production.cdcValue / actualGoalCalc.monthGoal).toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}
						/>
					</fieldset>

					<fieldset>
						<legend>Móveis</legend>
						<InputInbox
							name="furniture"
							value={production.furnitureValue}
							placeholder="Móveis"
							onChange={(e) => handleActualGoalEdit(e)}
							label="Móveis"
							appendedText={(production.furnitureValue / actualGoalCalc.monthGoal).toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}
						/>
					</fieldset>
				</fieldset>
			</div>
			{/* <div style={{ display: 'flex', flexDirection: 'column' }}>
				<label>Móveis</label>
				<input name="furniture" value={actualGoalCalc?.classification.furniture} placeholder="Móveis" onChange={(e) => handleActualGoalEdit(e)} />
				<span>{(actualGoalCalc.classification.furniture / actualGoalCalc.goal.monthGoal).toLocaleString('pt-BR', { style: "percent", minimumFractionDigits: 2 })}</span>
			</div> */}
		</div>
	);
}

export default App;
