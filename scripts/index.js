var inputForm = document.getElementById('input-form');
var inputName = document.getElementById('name');

inputForm.addEventListener('submit', e => {
    e.preventDefault();
    var name = inputName.value.trim();
    if (!name) return;
    var playerInfo = {
        name: name,
        level1: 0,
        level2: 0,
        level3: 0
    }
    localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
    window.location.href = '/Project/pages/level1.html';
})