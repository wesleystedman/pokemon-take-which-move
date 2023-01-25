import getTypeEffectiveness from "./type-effectiveness.js";
import POKEMON_DATA from "./pokemon-data.js";
import { POKEMON_RANGES, VERSION_TO_TYPE_CHART, TYPE_TO_NUM, NUM_TO_TYPE } from "./constants.js";


// cached element refs
const versionSelectElem = document.getElementById('version-select');
const type1Elem = document.getElementById('type1');
const type2Elem = document.getElementById('type2');
const type3Elem = document.getElementById('type3');
const type4Elem = document.getElementById('type4');
const type5Elem = document.getElementById('type5');
const fullyEvolvedElem = document.getElementById('fully-evolved');
const resultsDivElem = document.getElementById('results-go-here');
const optionsSteel = document.querySelectorAll('option[value="8"]');
const optionsDark = document.querySelectorAll('option[value="16"]');
const optionsFairy = document.querySelectorAll('option[value="17"]');


// attach event handlers
document.getElementById('calculate-button').addEventListener('click', handleCalculateButtonClick);
versionSelectElem.addEventListener('change', handleVersionChange);


function handleCalculateButtonClick(event) {
    // get input
    const version = versionSelectElem.value;
    const forceEvo = fullyEvolvedElem.checked;
    let types = [
        type1Elem.value,
        type2Elem.value,
        type3Elem.value,
        type4Elem.value,
        type5Elem.value
    ];

    // calculate for each combination
    let results = [];
    types.forEach((removedType, removedIndex) => {
        let typesToCheck = types.filter((type, typeIndex) => typeIndex !== removedIndex);
        typesToCheck = typesToCheck.filter(type => type !== 'status').map(type => parseInt(type));
        results.push(calculate(typesToCheck, version, forceEvo));
    });

    // TODO: determine "best" result

    // display results
    let outputStr = '';
    results.forEach((result, index) => {
        outputStr += `Remove move ${index}: `;
        outputStr += result['0'] + ' ';
        outputStr += result['0.25'] + ' ';
        outputStr += result['0.5'] + ' ';
        outputStr += result['1'] + ' ';
        outputStr += result['2'] + ' ';
        outputStr += result['4'] + '<br/>';
    });
    resultsDivElem.innerHTML = outputStr;
}

function handleVersionChange(event) {
    // enable/disable dark/steel/fairy types
    if (VERSION_TO_TYPE_CHART[event.target.value] === 'gen1') {
        optionsSteel.forEach(option => { option.disabled = true; option.selected = false });
        optionsDark.forEach(option => { option.disabled = true; option.selected = false });
        optionsFairy.forEach(option => { option.disabled = true; option.selected = false });
    }
    else if (VERSION_TO_TYPE_CHART[event.target.value] === 'gen2') {
        optionsSteel.forEach(option => option.disabled = false);
        optionsDark.forEach(option => option.disabled = false);
        optionsFairy.forEach(option => { option.disabled = true; option.selected = false });
    }
    else if (VERSION_TO_TYPE_CHART[event.target.value] === 'gen6') {
        optionsSteel.forEach(option => option.disabled = false);
        optionsDark.forEach(option => option.disabled = false);
        optionsFairy.forEach(option => option.disabled = false);
    }
}

function calculate(moveTypes, version, forceEvo) {
    let results = {
        '0': 0,
        '0.25': 0,
        '0.5': 0,
        '1': 0,
        '2': 0,
        '4': 0,
    }
    POKEMON_RANGES[version].forEach(index => {
        let pokemon = POKEMON_DATA[index];
        if (forceEvo && pokemon.canEvolve[version]) return;
        let bestEffectiveness = moveTypes.reduce(
            (acc, moveType) => Math.max(getTypeEffectiveness(VERSION_TO_TYPE_CHART[version], moveType, pokemon.types[version]), acc),
            getTypeEffectiveness(VERSION_TO_TYPE_CHART[version], moveTypes[0], pokemon.types[version])
        )
        // Shedinja/Wonder Guard handling
        if (pokemon.name === 'shedinja' && bestEffectiveness < 2) {
            bestEffectiveness = 0;
        }
        results[bestEffectiveness.toString()]++;
    });
    return results;
}
