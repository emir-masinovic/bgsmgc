export function generateColumns(matrixSize) {
	const columns = Array.from({ length: Math.sqrt(matrixSize) }, () => '1fr');
	return `grid-template-columns: repeat(${Object.keys(columns).length}, 1fr);`;
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

		let cellsToUpdate = [startIndex, ...selectedNeighbors];
		sets.push(cellsToUpdate);
		console.log(`Set: ${i}) 
		Starting Index = ${startIndex} | Total Neighbors = ${numNeighbors}
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

	//This will hold some overlapping elements, but we will try to find as many non-overlapping elements as possible
	let finalSet = [];

	//Generate Total sets, sort them, and pop the biggest one
	let totalSetsArray = generateSets(matrix, totalSets, neighborAreaMin, neighborAreaMax);
	totalSetsArray.sort((a, b) => a.length - b.length);

	console.log("Total Sets: ")
	console.table(totalSetsArray)
	console.log(totalSetsArray)


	finalSet.push(totalSetsArray.pop())
	totalSetsSelected--


	//Set tracker keeps track of how many non-overlapping elements there are in total
	let setTracker = new Set()
	finalSet.forEach((set) => { set.forEach(cell => setTracker.add(cell))})

	//Keep adding sets until we reach user selected limit
	while (totalSetsSelected !== 0){

		//This keeps track of how many key, pair values there are
		//But we will need to sort the array, so we can get the index of it
		let nonOverlapArray = []
		let setCounter = 0

		totalSetsArray.forEach((set) =>{
			let nonOverlapCounter = 0;
			set.forEach((cell) => {if (!setTracker.has(cell)){nonOverlapCounter++}})
			console.log("Set# ", setCounter, set, "Non-overlap: ", nonOverlapCounter)
			nonOverlapArray.push([setCounter, nonOverlapCounter])
			setCounter++
		})

		console.log("nonOverlapArray")
		console.table(nonOverlapArray)

		nonOverlapArray.sort((a, b) => a[1] - b[1]);

		console.log("nonOverlapArray 2")
		console.table(nonOverlapArray)
		let popFromTotalSetsArrayIndex = nonOverlapArray[nonOverlapArray.length-1][0]
		console.log("Checking")
		finalSet.push(totalSetsArray[popFromTotalSetsArrayIndex])
		totalSetsArray.splice(popFromTotalSetsArrayIndex, 1)
		console.log('totalSetsArray')
		console.table(totalSetsArray)
		finalSet.forEach((cell) =>{setTracker.add(cell)})

		totalSetsSelected--
	}


	console.log("Final set  ", finalSet)
	console.log('--------------------');
	return finalSet;
}







// export function BSGMGC(
// 	matrix,
// 	totalSets,
// 	totalSetsSelected,
// 	stepSize,
// 	neighborAreaMin,
// 	neighborAreaMax
// ) {
// 	console.log('--------------------');
// 	console.log('Running Algorithm');
//
// 	let pickTurn = 1;
//
// 	let totalSetsArray = generateSets(matrix, totalSets, neighborAreaMin, neighborAreaMax);
// 	totalSetsArray.sort((a, b) => b.length - a.length);
//
// 	let finalSet = new Set();
//
// 	totalSetsArray[0].forEach((cell)=>{finalSet.add(cell)})
// 	totalSetsArray = totalSetsArray.slice(1);
//
// 	console.log("Final set  ", finalSet)
//
// 	while (finalSet.size < totalSetsSelected) {
// 		if (totalSetsSelected - finalSet.size === 1) {
// 			console.log('Step size 1');
// 			finalSet.add(finalSet.size + 1);
// 			console.log("finalSet: ", finalSet)
// 			console.log('Finished');
// 		} else {
// 			console.log('Picking turn: ', pickTurn);
// 			stepSize = (totalSetsSelected - finalSet.size) < stepSize ? (totalSetsSelected - finalSet.size) : stepSize;
// 			let possibleCombinations = generateCombinations(totalSetsArray, stepSize);
// 			possibleCombinations.sort((a, b) => b.length - a.length);
// 			let tableData = possibleCombinations.map((comb) => ({ combination: comb.join(' ||| ') }));
// 			console.table(tableData);
//
// 			//
// 			// let combinationsMap = [];
// 			// let i = 0
// 			// possibleCombinations.forEach((combination) => {
// 			// 	// console.log("Combination: ", combination)
// 			// 	let groupTracker = 0
// 			// 	combination.forEach((group) => {
// 			// 		// console.log("Group: ", group)
// 			// 		group.forEach((cell) => {
// 			// 			// console.log("Cell: ", cell)
// 			// 			// console.log(matrix[cell])
// 			// 			if (!finalSet.has(cell)){
// 			// 				groupTracker++
// 			// 			}
// 			// 		})
// 			// 	})
// 			// 	combinationsMap.push([i, groupTracker])
// 			// 	i++
// 			// })
// 			//
// 			// combinationsMap.sort((a, b) => b[1] - a[1]);
// 			//
// 			// console.log("combinationsMap")
// 			// console.table(combinationsMap)
//
// 			for (let i = 0; i < stepSize; i++) {
// 				finalSet.add(finalSet.size + 1)
// 			}
// 			pickTurn++;
// 			console.log("finalSet: ", finalSet)
// 		}
// 	}
// 	// console.log(finalSet)
// 	console.log('--------------------');
// 	return finalSet;
// }










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

// 		finalSet = finalSet.concat(selectedSets);
// 	}

// 	console.table("End result");
// 	console.table(finalSet);

// 	return finalSet;
// }

// export function BSGMGC(S, k, p) {
// 	let finalSet = [];
// 	let W = new Set(S.flat());

// 	p = parseInt(p)

// 	console.log("Step size: ", p)

// 	while (finalSet.length < k) {
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

// 		finalSet.push(selectedCombination);
// 		console.table("Update table");
// 		console.table(finalSet);
// 	}
// 	console.table("End result");
// 	console.table(finalSet);
// 	return finalSet;
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
// 		finalSet.push(maxIntersectionSet);
// 	}

// 	return finalSet;
// }

// export function BSGMGC(collection, k, p) {
// 	let finalSet = [];
// 	let W = new Set(collection.flat());

// 	while (finalSet.length < k) {
// 		let q = Math.min(p, k - finalSet.length);
// 		let maxIntersection = -Infinity;
// 		let maxSet = null;

// 		// Find the set that maximizes the intersection with W
// 		for (let i = 0; i < collection.length; i++) {
// 			if (finalSet.includes(collection[i])) {
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

// 		// Remove the selected elements from W and add the selected set to finalSet
// 		W = new Set([...W].filter(x => !maxSet.includes(x)));
// 		finalSet.push(maxSet);
// 	}

// 	return finalSet;
// }
