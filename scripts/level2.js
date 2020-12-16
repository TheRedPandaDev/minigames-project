var cutsAmount = 2;
var cutsCounter = 0;
var goalAmount = 4;
var piecesCounter = 1;
var canPlay = true;
var svg = document.getElementById('svg-cutting-area');
var cutsAmountElem = document.getElementById('cutsAmount');
var cutsCounterElem = document.getElementById('cutsCounter');
var piecesCounterElem = document.getElementById('piecesCounter');
var goalAmountElem = document.getElementById('goalAmount');
var content = document.getElementsByClassName('content')[0];
var stopwatchStart;
var timeResult;

function Polygon() {
    var pointList = [];

    this.node = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');

    function build(arg) {
        var res = [];
        for (var i = 0, l = arg.length; i < l; i++) {
            res.push(arg[i].join(','));
        }
        return res.join(' ');
    }

    this.attribute = function (key, val) {
        if (val === undefined) return this.node.getAttribute(key);
        this.node.setAttribute(key, val);
    };

    this.getPoint = function (i) {
        return pointList[i]
    };

    this.setPoint = function (i, x, y) {
        pointList[i] = [x, y];
        this.attribute('points', build(pointList));
    };

    this.points = function (arguments) {
        for (var i = 0, l = arguments.length; i < l; i += 2) {
            pointList.push([arguments[i], arguments[i + 1]]);
        }
        this.attribute('points', build(pointList));
    };
}

// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {

    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return {x, y}
}

var colorIterator = 0;
var colors = ["red", "orange", "yellow", "green", "blue", "purple"];
shuffleColors();

function getColor() {
    if (colorIterator === colors.length) {
        colorIterator = 0;
        return colors[colorIterator++];
    } else {
        return colors[colorIterator++];
    }
}

function shuffleColors() {
    for (var i = colors.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }
}

var easyLevel = {
    polygon: [250, 150, 250, 450, 550, 450, 550, 150, 250, 150],
    cutsAmount: 3,
    goalAmount: 5
}
var mediumLevel = {
    polygon: [250, 150, 250, 450, 350, 450, 350, 250, 450, 250, 450, 450, 550, 450, 550, 150, 250, 150],
    cutsAmount: 3,
    goalAmount: 5
}
var hardLevel = {
    polygon: [250, 450, 550, 450, 550, 300, 500, 300, 500, 350, 425, 350, 425, 175, 450, 175, 450, 150, 350, 150, 350, 175, 375, 175, 375, 350, 300, 350, 300, 300, 250, 300, 250, 450],
    cutsAmount: 4,
    goalAmount: 12
}
cutsAmount = easyLevel.cutsAmount;
goalAmount = easyLevel.goalAmount;
cutsAmountElem.innerText = cutsAmount.toString();
goalAmountElem.innerText = goalAmount.toString();

var polygonElems = new Map();
var globalPolId = 1;
polygonElems.set(`cuttable-polygon-${globalPolId++}`, easyLevel.polygon);

function createAndAppendPolygon(polygonElems) {
    for (let [key, polygonElem] of polygonElems) {
        var polygon = new Polygon();
        polygon.points(polygonElem); // set everything
        polygon.attribute('fill', `${getColor()}`);
        polygon.attribute('stroke', `black`);
        polygon.attribute('stroke-width', `2`);
        polygon.node.classList.add('cuttable');
        polygon.node.id = key;
        polygon.node.addEventListener('mouseover', handleMouseOver);
        svg.insertBefore(polygon.node, svg.childNodes[1]);
    }
}

createAndAppendPolygon(polygonElems);

var cutStarted = false;
var mouseOverIds = [];
var locked = new Map();

function handleMouseOver(evt) {
    if (cutStarted && !locked.get(evt.target.id)) {
        mouseOverIds.push(evt.target.id);
        locked.set(evt.target.id, true);
    }
}

function makeCuttable(evt) {
    svg = evt.target;
    var path = document.getElementById('path');
    var pathStart;
    var pathEnd;
    svg.addEventListener('mousedown', startCut);
    svg.addEventListener('mousemove', cut);
    svg.addEventListener('mouseup', endCut);
    svg.addEventListener('mouseleave', endCut);
    svg.addEventListener('contextmenu', function(e) { e.preventDefault(); });

    stopwatchStart = Date.now();

    function startCut(evt) {
        evt.preventDefault();
        if (!canPlay) return;
        cutStarted = true;
        pathStart = getMousePosition(evt);
        path.setAttribute('d', 'M'+pathStart.x+','+pathStart.y+'L'+pathStart.x+','+pathStart.y+'Z');
    }

    function cut(evt) {
        evt.preventDefault();
        if (!canPlay || !cutStarted) return;
        evt.preventDefault();
        pathEnd = getMousePosition(evt);
        path.setAttribute('d', 'M'+pathStart.x+','+pathStart.y+'L'+pathEnd.x+','+pathEnd.y+'Z');
    }

    function endCut(evt) {
        evt.preventDefault();
        if (!canPlay || !cutStarted) return;
        path.setAttribute('d', '');
        checkCuts(pathStart, pathEnd);
        cutStarted = false;
        mouseOverIds = [];
        locked = new Map();
        cutsCounterElem.innerText = cutsCounter.toString();
        piecesCounter = svg.childNodes.length - 3;
        piecesCounterElem.innerText = piecesCounter.toString();
        checkGame();
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }


}

function checkCuts(pathStart, pathEnd) {
    var newPols = [];
    var killSwitch = false;
    for (let i = 0; i < mouseOverIds.length; i++) {
        var currPols = [[]];
        var polNum = 0;
        var currPol = 0;
        var polygonElemPoints = polygonElems.get(mouseOverIds[i]);
        var intersectionCounter = 0;
        var intersectionPoint = 0;
        for (let j = 0; j < polygonElemPoints.length - 3; j += 2) {
            intersectionPoint = intersect(pathStart.x, pathStart.y, pathEnd.x, pathEnd.y,
                polygonElemPoints[j], polygonElemPoints[j + 1], polygonElemPoints[j + 2], polygonElemPoints[j + 3]);
            if (intersectionPoint) {
                if (++intersectionCounter % 2 === 1) {
                    polNum++;
                    currPols[currPol].push(polygonElemPoints[j], polygonElemPoints[j + 1], intersectionPoint.x, intersectionPoint.y);
                    currPol = polNum;
                    currPols.push([intersectionPoint.x, intersectionPoint.y]);
                } else {
                    currPols[currPol].push(polygonElemPoints[j], polygonElemPoints[j + 1], intersectionPoint.x, intersectionPoint.y);
                    currPol = 0;
                    currPols[currPol].push(intersectionPoint.x, intersectionPoint.y)
                }
                // currPols[currPol].push(polygonElemPoints[j], polygonElemPoints[j + 1], intersectionPoint.x, intersectionPoint.y);
                // currPol = currPol ^ 1;
                // currPols[currPol].push(intersectionPoint.x, intersectionPoint.y);
            } else {
                currPols[currPol].push(polygonElemPoints[j], polygonElemPoints[j + 1]);
            }
        }
        for (let i = 0; i <= polNum; i++) {
            currPols[i].push(currPols[i][0], currPols[i][1]);
        }
        if (intersectionCounter === 0 || intersectionCounter % 2 === 1) {
            mouseOverIds[i] = null;
            killSwitch = true;
            break;
        } else {
            for (let i = 0; i <= polNum; i++) {
                newPols.push(currPols[i]);
            }

        }
    }
    if (killSwitch) return;
    for (let i = 0; i < mouseOverIds.length; i++) {
        polygonElems.delete(mouseOverIds[i]);
    }
    resetPolygons(newPols);
}

function resetPolygons(newPols) {
    var polygonsToDraw = new Map();
    newPols.forEach(newPol => {
        globalPolId++;
        polygonsToDraw.set(`cuttable-polygon-${globalPolId}`, newPol);
        polygonElems.set(`cuttable-polygon-${globalPolId}`, newPol);
    })
    var removalFlag = false;
    for (let i = 0; i < mouseOverIds.length; i++) {
        if (mouseOverIds[i]) {
            removalFlag = true;
            svg.removeChild(document.getElementById(mouseOverIds[i]));
        }
    }
    if (removalFlag) cutsCounter++;
    createAndAppendPolygon(polygonsToDraw);
}

function checkGame() {
    if (cutsCounter === cutsAmount) {
        timeResult = Math.round(((Date.now() - stopwatchStart) / 1000 + Number.EPSILON) * 10) / 10;
        canPlay = false;
        if (piecesCounter === goalAmount) {
            setTimeout(endGame, 2000, 'Победа!')
        } else {
            setTimeout(endGame, 2000, 'Поражение')
        }
    }
}

function endGame(msg) {
    var endScreen = document.createElement('div');
    endScreen.classList.add('endScreen');
    var msgElem = document.createElement('h1');
    var msgText = document.createTextNode(msg);
    var resultElem = document.createElement('p');
    var resultText = document.createTextNode('Ваше время: ' + timeResult + 'с');
    var restartBtn = document.createElement('button');
    restartBtn.innerText = 'Попробовать ещё раз';
    restartBtn.classList.add('try-again-button');
    restartBtn.addEventListener('click', evt => {
        window.location.href = './level2.html';
    })
    msgElem.appendChild(msgText);
    resultElem.appendChild(resultText);
    endScreen.appendChild(msgElem);
    if (msg === 'Победа!') endScreen.appendChild(resultElem);
    endScreen.appendChild(restartBtn);
    if (msg === 'Победа!') {
        var nextBtn = document.createElement('button');
        nextBtn.innerText = 'Следующая игра';
        nextBtn.classList.add('next-button');
        nextBtn.addEventListener('click', evt => {
            var playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
            playerInfo.level2 = timeResult;
            localStorage.setItem('playerInfo', JSON.stringify(playerInfo));
            window.location.href = './level3.html';
        });
        endScreen.appendChild(nextBtn);
    }
    content.removeChild(svg);
    content.appendChild(endScreen);
}
