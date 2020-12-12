var downloadForm = document.getElementById('download-form');
var nameHere = document.getElementById('name-here');
var resultsElem = document.getElementById('results');
var tryAgain = document.getElementById('try-again');

var playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
var nameNode = document.createTextNode(playerInfo.name);
nameHere.appendChild(nameNode);
var br = document.createElement('br');
resultsElem.innerText = 'The Trapezoid Game - Number of moves: ' + playerInfo.level1;
resultsElem.appendChild(br);
resultsElem.innerText += 'The Shape-Cutting Game - Your time: ' + playerInfo.level2;
resultsElem.appendChild(br);
resultsElem.innerText += 'The Shape-Cutting Game II - Your range: ' + playerInfo.level3;

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

downloadForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = `Results for ${playerInfo.name}` + '\r\n\r\n' +
        'The Trapezoid Game - Number of moves: ' + playerInfo.level1 + '\r\n' +
        'The Shape-Cutting Game - Your time: ' + playerInfo.level2 + 's' + '\r\n' +
        'The Shape-Cutting Game II - Your range: ' + playerInfo.level3 + '\r\n\r\n' +
        'Shapes Extravaganza by Thomas Miles - http://shapesgame.thomasmiles.ml/'
    downloadToFile(text, `shapes-game-results-${Date.now()}`, 'text/plain');
})

tryAgain.addEventListener('click', e => {
    var resetInfo = {
        name: playerInfo.name,
        level1: 0,
        level2: 0,
        level3: 0
    }
    localStorage.setItem('playerInfo', JSON.stringify(resetInfo));
    window.location.href = '/Project/index.html';
})
