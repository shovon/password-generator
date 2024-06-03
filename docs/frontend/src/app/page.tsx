"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	exact,
	either,
	validate,
	string,
	number,
	predicate,
	InferType,
} from "hyperguard";
import { randomInt } from "crypto";
import { wordList } from "../lib/wordlist";
import { getRandomInt } from "../lib/random";
import { calculateStrength } from "../lib/pin-strength";
import { entropy } from "../lib/entropy";

const passwordTypes = either(exact("RANDOM"), exact("MEMORABLE"), exact("PIN"));

type PasswordTypes = InferType<typeof passwordTypes>;

const minimumPasswordLength = 6;
const minimumPinLength = 4;
const minimumPassphraseLength = 3;

const characters = "abcdefghijklmnopqrstuvwxyz";
const digits = "0123456789";
const symbols = "!@#$%^&*(){}[]-=_+|/?,<.>;:'\"";

export default React.memo(function Home() {
	const [currentPassword, setCurrentPassword] = useState("");
	const [passwordType, setPasswordType] = useState<PasswordTypes>("RANDOM");
	const [passwordLength, setPasswordLength] = useState(minimumPasswordLength);
	const [shouldHaveNumbers, setShouldHaveNumbers] = useState(true);
	const [shouldHaveSymbols, setShouldHaveSymbols] = useState(true);
	const [pinCodeLength, setPinCodeLength] = useState(minimumPinLength);
	const [passphraseLength, setPassphraseLength] = useState(
		minimumPassphraseLength
	);

	const generatePassword = useCallback(() => {
		switch (passwordType) {
			case "RANDOM":
				let characterSet = characters;
				if (shouldHaveNumbers) characterSet += digits;
				if (shouldHaveSymbols) characterSet += symbols;

				return Array.from({ length: passwordLength })
					.map(() => characterSet[getRandomInt(0, characterSet.length - 1)])
					.join("");
			case "MEMORABLE":
				return Array.from({ length: passphraseLength })
					.map(() => wordList[getRandomInt(0, wordList.length - 1)])
					.join(" ");
			case "PIN":
				return Array.from({ length: pinCodeLength })
					.map(() => digits[getRandomInt(0, digits.length - 1)])
					.join("");
		}
	}, [
		passwordType,
		passwordLength,
		shouldHaveNumbers,
		shouldHaveSymbols,
		passphraseLength,
		pinCodeLength,
	]);

	useEffect(() => {
		setCurrentPassword(generatePassword());
	}, [passwordType, passwordLength, shouldHaveNumbers, shouldHaveSymbols, pinCodeLength, passphraseLength, generatePassword]);

	const onPasswordTypeChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			// TODO: handle the exception
			setPasswordType(validate(passwordTypes, e.target.value));
		},
		[]
	);

	const onPasswordLengthChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			// TODO: handle the exception
			setPasswordLength(
				validate(
					predicate(number(), (value) => !isNaN(value)),
					parseInt(validate(string(), e.target.value), 10)
				)
			);
		},
		[]
	);

	const onPassphraseLengthChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setPassphraseLength(
				validate(
					predicate(number(), (value) => !isNaN(value)),
					parseInt(validate(string(), e.target.value), 10)
				)
			);
		},
		[]
	);

	const onPinLengthChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setPinCodeLength(
				validate(
					predicate(number(), (value) => !isNaN(value)),
					parseInt(validate(string(), e.target.value), 10)
				)
			);
		},
		[]
	);

	const getNewPassword = useCallback(() => {
		setCurrentPassword(generatePassword());
	}, [generatePassword]);

	function getStrength() {
		switch (passwordType) {
			case "RANDOM":
				if (entropy(currentPassword) * currentPassword.length < 19)
					return <>Very weak</>;
				if (entropy(currentPassword) * currentPassword.length < 28)
					return <>Weak</>;
				if (entropy(currentPassword) * currentPassword.length < 38)
					return <>Good</>;
				return <>Strong</>;
			case "MEMORABLE":
				if (entropy(currentPassword) * currentPassword.length < 19)
					return <>Very weak</>;
				if (entropy(currentPassword) * currentPassword.length < 28)
					return <>Weak</>;
				if (entropy(currentPassword) * currentPassword.length < 38)
					return <>Good</>;
				return <>Strong</>;
			case "PIN":
				switch (calculateStrength(currentPassword)) {
					case "WEAK":
						return <>Weak</>;
					case "GOOD":
						return <>Good</>;
					case "STRONG":
						return <>Strong</>;
				}
		}
	}

	function getRangeOptions(): {
		a: number;
		b: number;
		unitName: string;
		value: number;
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	} {
		switch (passwordType) {
			case "RANDOM":
				return {
					a: minimumPasswordLength,
					b: 24,
					unitName: "characters",
					value: passwordLength,
					onChange: onPasswordLengthChange,
				};
			case "MEMORABLE":
				return {
					a: minimumPassphraseLength,
					b: 12,
					unitName: "words",
					value: passphraseLength,
					onChange: onPassphraseLengthChange,
				};
			case "PIN":
				return {
					a: minimumPinLength,
					b: 12,
					unitName: "digits",
					value: pinCodeLength,
					onChange: onPinLengthChange,
				};
		}
	}

	function getLengthSelector() {
		let { a, b, unitName, value, onChange } = getRangeOptions();
		if (a > b) {
			let temp = a;
			a = b;
			b = temp;
		}
		return (
			<div>
				<label className="block mb-2 character-count-selector">
					{value} {unitName}
				</label>
				<input
					id="character-count-selector"
					className="w-full"
					type="range"
					min={a}
					max={b}
					value={value}
					onChange={onChange}
				/>
			</div>
		);
	}

	function getOptions() {
		switch (passwordType) {
			case "RANDOM":
				return (
					<div>
						<h2 className="mb-2">Other Options</h2>
						<div className="inline-block mr-4">
							<div className="flex items-center">
								<input
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
									id="should-have-numbers"
									type="checkbox"
									checked={shouldHaveNumbers}
									onChange={() => setShouldHaveNumbers(!shouldHaveNumbers)}
								/>
								<label
									htmlFor="should-have-numbers"
									className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									Include numbers
								</label>
							</div>
						</div>
						<div className="inline-block">
							<div className="flex items-center">
								<input
									className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
									id="should-have-symbols"
									type="checkbox"
									checked={shouldHaveSymbols}
									onChange={() => setShouldHaveSymbols(!shouldHaveSymbols)}
								/>
								<label
									htmlFor="should-have-symbols"
									className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>
									Include symbols
								</label>
							</div>
						</div>
					</div>
				);
			case "MEMORABLE":
				return null;
			case "PIN":
				return null;
		}
	}

	const typesMap = new Map<PasswordTypes, string>([
		["RANDOM", "Password"],
		["MEMORABLE", "Passphrase"],
		["PIN", "PIN"],
	]);

	return (
		<main className="w-[500px] my-0 mt-10 mx-auto">
			<div className="bg-slate-50 p-10 rounded-10 shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]">
				{typesMap.get(passwordType)} strength: {getStrength()}
				<div className="mb-4">
					<textarea
						className="text-2xl w-full text-center p-4 rounded-lg border-solid border-2"
						disabled
						value={currentPassword}
					/>
				</div>
				<div className="mb-4">
					<button
						className="inline-block w-full bg-blue-500 text-white px-4 py-2 rounded-full"
						onClick={getNewPassword}
					>
						Regenerate
					</button>
				</div>
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div>
						<label className="block mb-2" htmlFor="password-type-selecto">
							Type
						</label>
						<select
							id="password-type-selector"
							className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							value={passwordType}
							onChange={onPasswordTypeChange}
						>
							<option value="RANDOM">Password</option>
							<option value="MEMORABLE">Memorable</option>
							<option value="PIN">PIN</option>
						</select>
					</div>
					<div>{getLengthSelector()}</div>
				</div>
				{getOptions()}
			</div>
		</main>
	);
});
