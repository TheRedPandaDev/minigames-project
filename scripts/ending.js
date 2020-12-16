var downloadForm = document.getElementById('download-form');
var nameHere = document.getElementById('name-here');
var resultsElem = document.getElementById('results');
var tryAgain = document.getElementById('try-again');

var playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
var nameNode = document.createTextNode(playerInfo.name);
nameHere.appendChild(nameNode);
var br = document.createElement('br');
resultsElem.innerText = 'The Trapezoid Game - Количество ходов: ' + playerInfo.level1;
resultsElem.appendChild(br);
resultsElem.innerText += 'The Shape-Cutting Game - Ваше время: ' + playerInfo.level2 + 'с';
resultsElem.appendChild(br);
resultsElem.innerText += 'The Shape-Cutting Game II - Ваш размах: ' + playerInfo.level3;

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});

    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

let dateObj = new Date();

downloadForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = `Поздравляем, ${playerInfo.name}!` + '\r\n\r\n' +
        'The Trapezoid Game - Количество ходов: ' + playerInfo.level1 + '\r\n' +
        'The Shape-Cutting Game - Ваше время: ' + playerInfo.level2 + 'с' + '\r\n' +
        'The Shape-Cutting Game II - Ваш размах: ' + playerInfo.level3 + '\r\n\r\n' +
        'Shapes Extravaganza by Thomas Miles - http://shapesgame.thomasmiles.ml/'
    downloadToFile(text, `shapes-extravaganza-results--${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}--${dateObj.getDay()}-${dateObj.getMonth()}-${dateObj.getFullYear()}`, 'text/plain');
})

tryAgain.addEventListener('click', e => {
    var resetInfo = {
        name: playerInfo.name,
        level1: 0,
        level2: 0,
        level3: 0
    }
    localStorage.setItem('playerInfo', JSON.stringify(resetInfo));
    window.location.href = '../index.html';
})
