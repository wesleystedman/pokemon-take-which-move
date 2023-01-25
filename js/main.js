import getTypeEffectiveness from "./type-effectiveness.js";
import POKEMON_DATA from "./pokemon-data.js";
import { POKEMON_RANGES, VERSION_TO_TYPE_CHART, TYPE_TO_NUM, NUM_TO_TYPE } from "./constants.js";


// cached element refs
const versionSelectElem = document.getElementById('version-select');
const optionsSteel = document.querySelectorAll('option[value="8"]');
const optionsDark = document.querySelectorAll('option[value="16"]');
const optionsFairy = document.querySelectorAll('option[value="17"]');

// attach event handlers
versionSelectElem.addEventListener('change', handleVersionChange);



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
