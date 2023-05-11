export function generateColumns(matrixSize) {
	const columns = Array.from({ length: Math.sqrt(matrixSize) }, () => '1fr');
	const gridStyle = `grid-template-columns: repeat(${Object.keys(columns).length}, 1fr);`;
	return gridStyle;
}

export function generateMatrix(matrixSize) {
	return Array.from({ length: matrixSize }, () => {
		let health = Math.floor(Math.random() * 10) + 1;
		let color = generateColor(health);
		return { health, color };
	});
}

function generateColor(health) {
	const red = 255 - health * 25;
	const green = health * 25;
	const blue = 0;
	return `rgb(${red}, ${green}, ${blue})`;
}

function randomBetween(min, max) {
	if (min === max) {
		return max;
	} else {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

function generateSets(matrix, totalSets, neighborAreaMin, neighborAreaMax) {
	const sets = [];
	const usedStartIndexes = new Set();

	console.log('Total sets are being generated');
	console.log('Creating new neighbors between: ' + neighborAreaMin + ' and ' + neighborAreaMax);

	for (let i = 0; i < totalSets; i++) {
		let startIndex;
		do {
			startIndex = Math.floor(Math.random() * matrix.length);
		} while (usedStartIndexes.has(startIndex));
		usedStartIndexes.add(startIndex);

		let numNeighbors = randomBetween(neighborAreaMin, neighborAreaMax);

		const rowSize = Math.sqrt(matrix.length);
		const colIndex = startIndex % rowSize;
		const rowIndex = Math.floor(startIndex / rowSize);
		const startRow = Math.max(rowIndex - 1, 0);
		const startCol = Math.max(colIndex - 1, 0);
		const endRow = Math.min(rowIndex + 1, rowSize - 1);
		const endCol = Math.min(colIndex + 1, rowSize - 1);
		const neighborIndexes = [];
		for (let row = startRow; row <= endRow; row++) {
			for (let col = startCol; col <= endCol; col++) {
				const neighborIndex = row * rowSize + col;
				if (neighborIndex !== startIndex) {
					neighborIndexes.push(neighborIndex);
				}
			}
		}

		if (neighborIndexes.length < numNeighbors) {
			numNeighbors = neighborIndexes.length;
		}

		const selectedNeighbors = [];
		while (selectedNeighbors.length < numNeighbors) {
			const neighborIndex = neighborIndexes[Math.floor(Math.random() * neighborIndexes.length)];
			if (!selectedNeighbors.includes(neighborIndex)) {
				selectedNeighbors.push(neighborIndex);
			}
		}

		const cellsToUpdate = [startIndex, ...selectedNeighbors];
		sets.push(cellsToUpdate);
		console.log(
			`Set ${i}:
			Starting Index = ${startIndex}
			Total Neighbors = ${numNeighbors}
			Neighbors = ${selectedNeighbors}`
		);
	}

	return sets;
}

export function BSGMGC(
	matrix,
	totalSets,
	totalSetsSelected,
	stepSize,
	neighborAreaMin,
	neighborAreaMax
) {
	console.log('--------------------');
	console.log('Running Algorithm');

	let pickTurn = 1;

	let totalSetsArray = generateSets(matrix, totalSets, neighborAreaMin, neighborAreaMax);

	let C = [];
	while (C.length < totalSetsSelected) {
		if (totalSetsSelected - C.length == 1) {
			console.log('Finished');
			C.push(1);
		} else {
			console.log('Picking turn: ', pickTurn);
			// let q = (totalSetsSelected - C.length) < stepSize ? (totalSetsSelected - C.length) : stepSize;
			let possibleCombinations = generateCombinations(totalSetsArray, stepSize);
			possibleCombinations.sort((a, b) => b.length - a.length);

			// console.log("")
			let tableData = possibleCombinations.map((comb) => ({ combination: comb.join(' ||| ') }));
			console.table(tableData);

			//TODO left here

			// let combinationsMap = new Map();

			// console.table(matrix)

			// possibleCombinations.forEach((combination) => {
			// 	console.log("Combination: ", combination)
			// 	combination.forEach((group) => {
			// 		console.log("Group: ", group)
			// 		group.forEach((cell) => {
			// 			console.log("Cell: ", cell)
			// 			console.log(matrix[cell])
			// 			let newCell = { ...matrix[cell] }
			// 			newCell.health = 1000
			// 			newCell.color = generateColor(10)
			// 			console.log(newCell)
			// 			matrix = [...matrix.splice(0, cell), ...matrix.splice(cell + 1)]
			// 			// matrix = newCell
			// 			// console.log(matrix)
			// 			return
			// 		})
			// 	})
			// 	// matrix.forEach((cell) => {
			// 	// 	// console.log(cell)
			// 	// })
			// })
			// console.log("End matrix: ", matrix)

			// for (let combination of possibleCombinations) {
			// let repair = 0;
			// console.log(matrix)
			// let intersectionSize = combination[0].length;

			// for (let i = 1; i < combination.length; i++) {
			// 	let set = new Set(combination[i].map(cell => cell.index));
			// 	let newIntersectionSet = new Set([...intersectionSet].filter(x => set.has(x)));
			// 	let newIntersectionSize = newIntersectionSet.size;
			// 	let maxIntersectionSet = intersectionSize >= newIntersectionSize ? intersectionSet : set;
			// 	let W = new Set([...maxIntersectionSet].filter(x => !newIntersectionSet.has(x)));
			// 	repair += W.size;
			// 	intersectionSet = newIntersectionSet;
			// 	intersectionSize = newIntersectionSize;
			// }

			// let combinationKey = JSON.stringify(combination);
			// combinationsMap.set(combinationKey, repair);
			// }

			// console.log(combinationsMap)
			for (let i = 0; i < stepSize; i++) {
				C.push(i);
			}
			pickTurn++;
		}
	}
	// console.log(C)
	console.log('--------------------');
	return C;
}

// export function BSGMGC(S, k, p) {
// 	let C = [];
// 	let W = new Set(S.flat());

// 	while (C.length < k) {
// 		let q = Math.min(p, k - C.length);
// 		let selectedSets = null;
// 		let maxIntersectionSize = -1;

// 		// Step 1: generate all possible combinations of size q from sets in S\C
// 		let setsNotInC = S.filter(set => !C.includes(set));
// 		let possibleCombinations = generateCombinations(setsNotInC, q);

// 		possibleCombinations.sort((a, b) => b.length - a.length);
// 		console.log("Possible combinations")
// 		let tableData = possibleCombinations.map(comb => ({ combination: comb.join(', ') }));
// 		console.table(tableData);

// 		// Step 2: For each possible combination, find the set with the maximum intersection size
// 		for (let combination of possibleCombinations) {
// 			let intersection = new Set(combination[0]);
// 			for (let i = 1; i < q; i++) {
// 				intersection = new Set([...intersection].filter(x => combination[i].includes(x)));
// 			}
// 			if (intersection.size > maxIntersectionSize) {
// 				maxIntersectionSize = intersection.size;
// 				selectedSets = combination;
// 			}
// 		}

// 		console.log("Selected set: ", selectedSets);

// 		// Step 3: Remove the elements in the selected set with the maximum intersection
// 		let maxIntersectionSet = new Set([...selectedSets].flat().filter(x => {
// 			return [...selectedSets].every(set => set.includes(x));
// 		}));
// 		W = new Set([...W].filter(x => !maxIntersectionSet.has(x)));

// 		// Step 4: Add the selected set to C
// 		C = C.concat(selectedSets);
// 	}

// 	console.table("End result");
// 	console.table(C);

// 	return C;
// }

// export function BSGMGC(S, k, p) {
// 	let C = [];
// 	let W = new Set(S.flat());

// 	p = parseInt(p)

// 	console.log("Step size: ", p)

// 	while (C.length < k) {
// 		let possibleCombinations = generateCombinations(S, p)
// 		possibleCombinations.sort((a, b) => b.length - a.length);
// 		console.log("Possible combinations")
// 		let tableData = possibleCombinations.map(comb => ({ combination: comb.join(', ') }));
// 		console.table(possibleCombinations);

// 		//Problem starts here

// 		let maxIntersectionSize = 0;
// 		let maxIntersectionSet = null;
// 		let selectedCombination = [];

// 		// Step 2: For each possible combination, find the set with the maximum intersection size
// 		for (let combination of possibleCombinations) {
// 			let intersection = new Set(combination[0]);
// 			for (let i = 1; i < p; i++) {
// 				intersection = new Set([...intersection].filter(x => combination[i].includes(x)));
// 			}
// 			if (intersection.size > maxIntersectionSize) {
// 				maxIntersectionSize = intersection.size;
// 				maxIntersectionSet = intersection;
// 				selectedCombination = combination;
// 			} else if (intersection.size === maxIntersectionSize && selectedCombination !== null) {
// 				let selectedIntersection = new Set(selectedCombination[0]);
// 				for (let i = 1; i < p; i++) {
// 					selectedIntersection = new Set([...selectedIntersection].filter(x => selectedCombination[i].includes(x)));
// 				}
// 				if (intersection.size > selectedIntersection.size) {
// 					maxIntersectionSize = intersection.size;
// 					maxIntersectionSet = intersection;
// 					selectedCombination = combination;
// 				}
// 			} else if (intersection.size === maxIntersectionSize && selectedCombination === null) {
// 				maxIntersectionSet = intersection;
// 				selectedCombination = combination;
// 			}
// 		}

// 		console.log("Selected combination: ", selectedCombination);

// 		// Step 3: Remove the elements in the selected set with the maximum intersection
// 		if (maxIntersectionSet !== null) {
// 			W = new Set([...W].filter(x => !maxIntersectionSet.has(x)));
// 		}
// 		console.log("W after removing elements: ", W);

// 		// Step 4: Add the selected set to C
// 		C.push(selectedCombination);
// 		console.table("Update table");
// 		console.table(C);
// 	}
// 	console.table("End result");
// 	console.table(C);
// 	return C;
// }

function generateCombinations(S, stepSize) {
	console.log('Generating combinations');
	let possibleCombinations = [];
	const n = S.length;

	console.log('Step size: ', stepSize);

	switch (stepSize) {
		case 1:
			break;
		case 2:
			console.log('Combinations of 2 sets');
			for (let i = 0; i < n - 1; i++) {
				for (let j = i + 1; j < n; j++) {
					possibleCombinations.push([S[i], S[j]]);
				}
			}
			break;

		case 3:
			console.log('Combinations of 3 sets');
			for (let i = 0; i < n - 2; i++) {
				for (let j = i + 1; j < n - 1; j++) {
					for (let k = j + 1; k < n; k++) {
						possibleCombinations.push([S[i], S[j], S[k]]);
					}
				}
			}
			break;

		case 4:
			console.log('Combinations of 4 sets');
			for (let i = 0; i < n - 3; i++) {
				for (let j = i + 1; j < n - 2; j++) {
					for (let k = j + 1; k < n - 1; k++) {
						for (let l = k + 1; l < n; l++) {
							possibleCombinations.push([S[i], S[j], S[k], S[l]]);
						}
					}
				}
			}
			break;

		default:
			console.error('Invalid step size:', stepSize);
			break;
	}

	return possibleCombinations;
}

// export function BSGMGC(S, k, p) {
// 	let C = [];
// 	let W = new Set(S.flat());

// 	// Sort the sets by decreasing size
// 	S.sort((a, b) => b.length - a.length);

// 	while (C.length < k) {
// 		const q = Math.min(p, k - C.length);
// 		let maxIntersectionSize = 0;
// 		let maxIntersectionSet = null;

// 		// Find the set with the maximum intersection size
// 		for (let i = 0; i < S.length; i++) {
// 			if (!C.includes(S[i])) {
// 				const intersection = new Set([...W].filter(x => S[i].includes(x)));
// 				if (intersection.size > maxIntersectionSize) {
// 					maxIntersectionSize = intersection.size;
// 					maxIntersectionSet = S[i];
// 				}
// 			}
// 		}
// 		console.log(`Selected set: ${maxIntersectionSet}, Intersection size: ${maxIntersectionSize}`);

// 		// Remove the elements in the set with the maximum intersection
// 		W = new Set([...W].filter(x => !maxIntersectionSet.includes(x)));

// 		// Add the selected set to C
// 		C.push(maxIntersectionSet);
// 	}

// 	return C;
// }

// export function BSGMGC(collection, k, p) {
// 	let C = [];
// 	let W = new Set(collection.flat());

// 	while (C.length < k) {
// 		let q = Math.min(p, k - C.length);
// 		let maxIntersection = -Infinity;
// 		let maxSet = null;

// 		// Find the set that maximizes the intersection with W
// 		for (let i = 0; i < collection.length; i++) {
// 			if (C.includes(collection[i])) {
// 				continue;
// 			}

// 			let intersection = new Set(collection[i]);
// 			for (let j = 1; j < q; j++) {
// 				let idx = (i + j * p) % collection.length;
// 				intersection = new Set([...intersection].filter(x => collection[idx].includes(x)));
// 			}

// 			if (intersection.size > maxIntersection) {
// 				maxIntersection = intersection.size;
// 				maxSet = collection[i];
// 			}
// 		}

// 		// Remove the selected elements from W and add the selected set to C
// 		W = new Set([...W].filter(x => !maxSet.includes(x)));
// 		C.push(maxSet);
// 	}

// 	return C;
// }
