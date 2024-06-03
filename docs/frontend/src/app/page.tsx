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

	function getOptions() {
		switch (passwordType) {
			case "RANDOM":
				return (
					<>
						<input
							type="range"
							min={minimumPasswordLength}
							max={256}
							value={passwordLength}
							onChange={onPasswordLengthChange}
						/>
						{passwordLength} characters
						<input
							id="should-have-numbers"
							type="checkbox"
							checked={shouldHaveNumbers}
							onChange={(e) => setShouldHaveNumbers(!shouldHaveNumbers)}
						/>
						<label htmlFor="should-have-numbers">Include numbers</label>{" "}
						<input
							id="should-have-symbols"
							type="checkbox"
							checked={shouldHaveSymbols}
							onChange={() => setShouldHaveSymbols(!shouldHaveSymbols)}
						/>
						<label htmlFor="should-have-symbols">Include symbols</label>{" "}
					</>
				);
			case "MEMORABLE":
				return (
					<>
						<input
							type="range"
							min={minimumPassphraseLength}
							max={12}
							value={passphraseLength}
							onChange={onPassphraseLengthChange}
						/>
						{passphraseLength} words
					</>
				);
			case "PIN":
				return (
					<>
						<input
							type="range"
							min={minimumPinLength}
							max={12}
							value={pinCodeLength}
							onChange={onPinLengthChange}
						/>
						{pinCodeLength} digits
					</>
				);
		}
	}

	return (
		<main className="">
			Strength: {getStrength()}
			<input type="text" disabled value={currentPassword} />
			<select value={passwordType} onChange={onPasswordTypeChange}>
				<option value="RANDOM">Random</option>
				<option value="MEMORABLE">Memorable</option>
				<option value="PIN">PIN</option>
			</select>
			{getOptions()}
			<button onClick={getNewPassword}>Generate</button>
		</main>
	);
});
