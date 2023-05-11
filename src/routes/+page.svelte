<script>
	import { generateMatrix, generateColumns, BSGMGC } from '../lib/functions/helperFunctions';

	let slidersArray = [
		{ name: 'Board Size', 		min: 10, max: 20, value: 10, id: 'map-size' }, //prettier-ignore
		{ name: 'Sets To Generate', min: 2, max: 10, value: 2, id: 'total-sets' }, //prettier-ignore
		{ name: 'Sets To Select', 	min: 2, max: 10, value: 2, id: 'select-sets' }, //prettier-ignore
		{ name: 'Step Size', 		min: 2, max: 4, value: 2, id: 'step-size' }, //prettier-ignore
		{ name: 'Min Neighbor', 	min: 0, max: 8, value: 0, id: 'min-neighbors' }, //prettier-ignore
		{ name: 'Max Neighbors', 	min: 0, max: 8, value: 0, id: 'max-neighbors' }, //prettier-ignore
		{ name: 'Transition Time', 	min: 1, max: 3, value: 1, id: 'transition-time' } //prettier-ignore
	];

	let matrixSize = parseInt(slidersArray[0].value) ** 2;
	let totalSets = parseInt(slidersArray[1].value);
	let totalSetsSelected = parseInt(slidersArray[2].value);
	let stepSize = parseInt(slidersArray[3].value);
	let neighborAreaMin = parseInt(slidersArray[4].value);
	let neighborAreaMax = parseInt(slidersArray[5].value);

	let matrix = generateMatrix(matrixSize);
	console.log('Initial Matrix');
	console.log(matrix);
	let gridStyle = generateColumns(matrixSize);

	let statusMessage = 'Board is set';

	function buildNewMatrix() {
		console.log('Building a new Board...');
		statusMessage = 'New Board Set';
		console.log();
		matrix.length = 0;
		matrixSize = parseInt(slidersArray[0].value) ** 2;
		matrix = generateMatrix(matrixSize);
		gridStyle = generateColumns(matrixSize);
		console.log(matrix);
	}

	function runAlgorithm() {
		statusMessage = 'Executing: Big Step Greedy Maximum Ground Coverage';
		BSGMGC(matrix, totalSets, totalSetsSelected, stepSize, neighborAreaMin, neighborAreaMax);
	}

	function handleSliderChange(event) {
		switch (event.target.id) {
			case 'map-size':
				slidersArray[0].value = parseInt(event.target.value);
				matrixSize = parseInt(event.target.value) ** 2;
				statusMessage = `New board size: ${Math.sqrt(matrixSize)} x ${Math.sqrt(matrixSize)} = ${matrixSize}\n`; //prettier-ignore
				statusMessage += `Press "Create new board" to set up a new board`;
				break;

			case 'total-sets':
				slidersArray[1].value = parseInt(event.target.value);
				totalSets = parseInt(event.target.value);

				if (parseInt(totalSets) < parseInt(totalSetsSelected)) {
					slidersArray[1].value = totalSets;
					slidersArray[2].value = totalSets;
					totalSetsSelected = totalSets;
				}

				let possibleCells = parseInt(totalSets) * parseInt(neighborAreaMax) + parseInt(totalSets);

				statusMessage = `Total sets to generate: ${totalSets}\n`;
				statusMessage += 'Random starting point.\n';
				statusMessage += `They will produce: (${totalSets} + ${totalSets} x ${neighborAreaMax}) = ${possibleCells} cells at most`;
				break;

			case 'select-sets':
				slidersArray[2].value = parseInt(event.target.value);
				totalSetsSelected = parseInt(event.target.value);
				slidersArray[2].value = totalSetsSelected;

				if (parseInt(totalSetsSelected) > parseInt(totalSets)) {
					slidersArray[1].value = totalSetsSelected;
					slidersArray[2].value = totalSetsSelected;
					totalSets = totalSetsSelected;
				}

				statusMessage = `Total sets to select from a pile: ${totalSetsSelected} / ${totalSets}`;
				break;

			case 'step-size':
				slidersArray[3].value = parseInt(event.target.value);
				stepSize = parseInt(event.target.value);
				statusMessage = `Step size is: ${stepSize}\n`;
				statusMessage += 'This means sets to the power of step size combinations\n';
				break;

			case 'min-neighbors':
				slidersArray[4].value = parseInt(event.target.value);
				neighborAreaMin = parseInt(event.target.value);
				statusMessage = `Neighbors between: ${neighborAreaMin} and ${neighborAreaMax}`;

				if (parseInt(neighborAreaMin) > parseInt(neighborAreaMax)) {
					slidersArray[5].value = neighborAreaMin;
					slidersArray[4].value = neighborAreaMin;
					neighborAreaMax = slidersArray[5].value;
					statusMessage = `Neighbors between: ${neighborAreaMin} and ${neighborAreaMax}`;
					// console.log('Max, min', slidersArray[4].value, slidersArray[5].value);
				}
				break;

			case 'max-neighbors':
				slidersArray[5].value = parseInt(event.target.value);
				neighborAreaMax = parseInt(event.target.value);
				statusMessage = `Neighbors between: ${neighborAreaMin} and ${neighborAreaMax}`;

				if (parseInt(neighborAreaMax) < parseInt(neighborAreaMin)) {
					slidersArray[4].value = neighborAreaMax;
					slidersArray[5].value = neighborAreaMax;
					neighborAreaMin = neighborAreaMax;
					statusMessage = `Neighbors between: ${neighborAreaMin} and ${neighborAreaMax}`;
					// console.log('Max, min', slidersArray[4].value, slidersArray[5].value);
				}
				break;

			default:
				break;
		}
	}
</script>

<div class="container">
	<div class="matrix-container">
		<div class="matrix-message-status">{statusMessage}</div>
		<div class="matrix-board" style={gridStyle}>
			{#each matrix as cell, index}
				<div class="matrix-board-cell" style="background-color: {cell.color}">
					<div class="matrix-board-cell-value">
						{index}
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="settings">
		<div class="settings-buttons">
			<button on:pointerdown={buildNewMatrix}>Create New Board </button>
			<button on:pointerdown={runAlgorithm}>Run Algorithm </button>
		</div>
		<div class="settings-inputs">
			<div class="settings-inputs-labels">
				{#each slidersArray as label}
					<div>{label.name}</div>
				{/each}
			</div>
			<div class="settings-inputs-sliders">
				{#each slidersArray as slider}
					<div class="wrapper">
						<input
							type="range"
							class="slider"
							step="1"
							min={slider.min}
							max={slider.max}
							value={slider.value}
							id={slider.id}
							on:change={handleSliderChange}
						/>
					</div>
				{/each}
			</div>
			<div class="settings-inputs-values">
				{#each slidersArray as slider}
					<div>{slider.value}</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-color: rgb(59, 100, 113);
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.matrix-message-status {
		text-align: center;
		padding: 20px;
		background-color: gray;
		margin-top: 20px;
		border-radius: 3px;
		box-shadow: 4px 8px 8px hsl(0deg 0% 0% / 0.38);
		white-space: pre-wrap;
	}
	.matrix-board {
		display: grid;
		padding: 20px;
		gap: 12px;
		width: fit-content;
		height: fit-content;
	}
	.matrix-board-cell {
		text-align: center;
		width: 35px;
		height: 35px;
		border-radius: 3px;
		box-shadow: 4px 8px 8px hsl(0deg 0% 0% / 0.38);
	}
	.matrix-board-cell-value {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
	}
	.settings {
		position: absolute;
		right: 0;
		top: 0;
		margin: 20px;
		padding: 10px;
		background-color: gray;
		border-radius: 3px;
		box-shadow: 4px 8px 8px hsl(0deg 0% 0% / 0.38);
		width: fit-content;
		height: fit-content;
	}
	.settings-buttons {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
	}
	.settings-buttons button {
		padding: 3px;
		border-radius: 2px;
		border: 1px solid #434343;
		background-color: rgb(80, 137, 155);
	}
	.settings-buttons button:hover {
		background-color: #9a905d;
		transition: 0.3s;
	}
	.settings-inputs {
		display: grid;
		grid-template-columns: auto auto 30px;
		grid-template-rows: repeat(20px);
		padding: 5px;
		gap: 10px;
	}
	.settings-inputs-labels {
		display: grid;
		grid-template-rows: repeat(20px);
	}
	input[type='range'] {
		overflow: hidden;
		width: 80px;
		-webkit-appearance: none;
		background-color: #9a905d;
		border: 1px solid black;
	}
	input[type='range']::-webkit-slider-runnable-track {
		height: 10px;
		-webkit-appearance: none;
		color: #13bba4;
		margin-top: -1px;
	}

	input[type='range']::-webkit-slider-thumb {
		width: 10px;
		-webkit-appearance: none;
		height: 10px;
		cursor: ew-resize;
		background: #434343;
		box-shadow: -80px 0 0 80px rgb(80, 137, 155);
	}

	@media (max-width: 700px) {
		.settings {
			position: static;
			order: -1;
			/* width: 90%; */
			margin: 0;
		}
		.container {
			flex-direction: column;
			padding: 20px;
		}

		.matrix-board {
			/* padding: 20px 0; */
			/* gap: 10px; */
		}
	}
</style>
