var boundaryX1 = 0;
var boundaryX2 = 800;
var boundaryY1 = 0;
var boundaryY2 = 600;

function handleClick(e) {
    e.preventDefault();
    const elem = e.target;
    var transforms = elem.transform.baseVal;
    var transform = transforms.getItem(0);
    var posX = transform.matrix.e;
    var posY = transform.matrix.f;
    var bbox = elem.getBBox();
    var angle = transforms.getItem(1).angle || 0;
    if (transforms.length > 1) {
        transforms.removeItem(1);
    }
    var translate = document.getElementById("svg-dragging-area").createSVGTransform();
    translate.setRotate((angle + 90) % 360, bbox.width / 2, bbox.height / 2);
    transforms.insertItemBefore(translate, 1);
    var currX = bbox.x;
    var currY = bbox.y;
    var currWidth = bbox.width;
    var currHeight = bbox.height;
    if ((angle + 90) % 360 === 90 || (angle + 90) % 360 === 270) {
        currWidth = bbox.height;
        currHeight = bbox.width;
        currX -= (bbox.height - bbox.width) / 2;
        currY += (bbox.height - bbox.width) / 2;
    }
    var minX = boundaryX1 - currX;
    var maxX = boundaryX2 - currX - currWidth;
    var minY = boundaryY1 - currY;
    var maxY = boundaryY2 - currY - currHeight;
    if (posX < minX) {
        transform.matrix.e = minX;
    } else if (posX > maxX) {
        transform.matrix.e = maxX;
    }
    if (posY < minY) {
        transform.matrix.f = minY;
    } else if (posY > maxY) {
        transform.matrix.f = maxY;
    }
}

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

var polygons = [
    {
        points: [75, 0, 0, 150, 135, 150, 135, 0],
        color: "red"
    },
    {
        points: [0, 0, 0, 150, 190, 150, 40, 0],
        color: "orange"
    },
    {
        points: [0, 0, 0, 300, 200, 300, 50, 0],
        color: "yellow"
    },
    {
        points: [75, 0, 0, 150, 125, 150, 125, 0],
        color: "green"
    },
    {
        points: [0, 0, 0, 150, 225, 150, 75, 0],
        color: "blue"
    },
    {
        points: [0, 0, 0, 150, 130, 150, 70, 0],
        color: "navy"
    },
    {
        points: [0, 0, 0, 150, 130, 150, 70, 0],
        color: "purple"
    },
]

var polygonElems = new Map();

function createAndAppendPolygon(polygons) {
    for (var i = 0, l = polygons.length; i < l; i++) {
        var polygon = new Polygon();
        polygon.points(polygons[i].points); // set everything
        polygon.attribute('style', `fill:${polygons[i].color}`);
        polygon.node.classList.add('draggable');
        polygon.node.id = `dragging-object-${i + 1}`;
        polygon.node.addEventListener('contextmenu', handleClick);
        polygonElems.set(polygons[i].color, polygon.node);
        var svg = document.getElementById("svg-dragging-area");
        var translate = svg.createSVGTransform();
        translate.setTranslate(0, 0);
        polygon.node.transform.baseVal.insertItemBefore(translate, 0);
        var rotate = svg.createSVGTransform();
        bbox = polygon.node.getBBox();
        rotate.setRotate(0, bbox.width / 2, bbox.height / 2);
        polygon.node.transform.baseVal.insertItemBefore(translate, 1);
        var polygonWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        polygonWrapper.id = `dragging-object-${i + 1}-wrapper`;
        polygonWrapper.appendChild(polygon.node);
        svg.appendChild(polygonWrapper);
        polygon.node.transform.baseVal.getItem(0).setTranslate(Math.random() * 800, Math.random() * 600);
        const elem = polygon.node;
        var transforms = elem.transform.baseVal;
        var transform = transforms.getItem(0);
        var posX = transform.matrix.e;
        var posY = transform.matrix.f;
        var bbox = elem.getBBox();
        var angle = transforms.getItem(1).angle || 0;
        if (transforms.length > 1) {
            transforms.removeItem(1);
        }
        translate = document.getElementById("svg-dragging-area").createSVGTransform();
        translate.setRotate((angle + (90 * Math.floor(Math.random() * 5))) % 360, bbox.width / 2, bbox.height / 2);
        transforms.insertItemBefore(translate, 1);
        var currX = bbox.x;
        var currY = bbox.y;
        var currWidth = bbox.width;
        var currHeight = bbox.height;
        if ((angle + 90) % 360 === 90 || (angle + 90) % 360 === 270) {
            currWidth = bbox.height;
            currHeight = bbox.width;
            currX -= (bbox.height - bbox.width) / 2;
            currY += (bbox.height - bbox.width) / 2;
        }
        var minX = boundaryX1 - currX;
        var maxX = boundaryX2 - currX - currWidth;
        var minY = boundaryY1 - currY;
        var maxY = boundaryY2 - currY - currHeight;
        if (posX < minX) {
            transform.matrix.e = minX;
        } else if (posX > maxX) {
            transform.matrix.e = maxX;
        }
        if (posY < minY) {
            transform.matrix.f = minY;
        } else if (posY > maxY) {
            transform.matrix.f = maxY;
        }
    }
}

createAndAppendPolygon(polygons);

function makeDraggable(evt) {
    var svg = evt.target;
    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('contextmenu', function(e) { e.preventDefault(); });

    var selectedElement = false;
    var canPlay = true;

    function startDrag(evt) {
        if (evt.target.classList.contains('draggable')) {
            evt.target.classList.add('mouseDown');
            selectedElement = evt.target;
            offset = getMousePosition(evt);
            // Get all the transforms currently on this element
            var transforms = selectedElement.transform.baseVal;
            // Get initial translation amount
            transform = transforms.getItem(0);
            rotate = transforms.getItem(1);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
            bbox = selectedElement.getBBox();
            currX = bbox.x;
            currY = bbox.y;
            currWidth = bbox.width;
            currHeigth = bbox.height;
            if (rotate.angle === 90 || rotate.angle === 270) {
                currWidth = bbox.height;
                currHeigth = bbox.width;
                currX -= (bbox.height - bbox.width) / 2;
                currY += (bbox.height - bbox.width) / 2;
            }
            minX = boundaryX1 - currX;
            maxX = boundaryX2 - currX - currWidth;
            minY = boundaryY1 - currY;
            maxY = boundaryY2 - currY - currHeigth;
        }
    }
    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();
            var coord = getMousePosition(evt);
            var dx = coord.x - offset.x;
            var dy = coord.y - offset.y;
            if (dx < minX) { dx = minX; }
            else if (dx > maxX) { dx = maxX; }
            if (dy < minY) { dy = minY; }
            else if (dy > maxY) { dy = maxY; }
            transform.setTranslate(dx, dy);
        }
    }
    function endDrag(evt) {
        evt.target.classList.remove('mouseDown');
        selectedElement = null;
        if (canPlay && checkPos()) {
            alert('You win!');
            canPlay = false;
            setTimeout(function() { canPlay = true; }, 3000)
        }
    }

    function getMousePosition(evt) {
        var CTM = svg.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    }
}

function checkPos() {
    var pivotElem = polygonElems.get('red');
    var transforms = pivotElem.transform.baseVal;
    var transform = transforms.getItem(0);
    var bbox = pivotElem.getBBox();
    var pivot = {
        posX: transform.matrix.e,
        posY: transform.matrix.f,
        width: bbox.width,
        height: bbox.height,
        angle: transforms.getItem(1).angle
    }
    if (pivot.angle === 90 || pivot.angle === 270) {
        pivot.posX -= (bbox.height - bbox.width) / 2;
        pivot.posY += (bbox.height - bbox.width) / 2;
    }
    var polygonPivots = new Map;
    for (let [key, value] of polygonElems.entries()) {
        var polygonTransforms = value.transform.baseVal;
        var polygonBbox = value.getBBox();
        var polygonObj = {
            posX: polygonTransforms.getItem(0).matrix.e,
            posY: polygonTransforms.getItem(0).matrix.f,
            width: polygonBbox.width,
            height: polygonBbox.height,
            angle: polygonTransforms.getItem(1).angle
        };
        if (polygonObj.angle === 90 || polygonObj.angle === 270) {
            polygonObj.posX -= (polygonBbox.height - polygonBbox.width) / 2;
            polygonObj.posY += (polygonBbox.height - polygonBbox.width) / 2;
        }
        polygonPivots.set(key, polygonObj);
    }
    switch (pivot.angle) {
        case 0:
            if (pivot.posX > 205) return false;
            switch (polygonPivots.get('orange').angle) {
                case 0:
                    if (Math.abs(pivot.posX + pivot.width - polygonPivots.get('orange').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('orange').posY) > 5) return false;
                    if (Math.abs(pivot.posX + pivot.width + 40 - polygonPivots.get('blue').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('blue').posY) > 5 || polygonPivots.get('blue').angle !== 180) return false;
                    break;
                case 180:
                    if (Math.abs(pivot.posX + pivot.width + 75 - polygonPivots.get('orange').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('orange').posY) > 5) return false;
                    if (Math.abs(pivot.posX + pivot.width - polygonPivots.get('blue').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('blue').posY) > 5 || polygonPivots.get('blue').angle !== 0) return false;
                    break;
                default:
                    return false;
            }
            if (Math.abs(pivot.posX + pivot.width + 40 + polygonPivots.get('blue').width - polygonPivots.get('yellow').posX) > 5 || Math.abs(pivot.posY + pivot.height - polygonPivots.get('yellow').posY - polygonPivots.get('yellow').height) > 5 || polygonPivots.get('yellow').angle !== 0) return false;
            if (Math.abs(pivot.posX + 75 - polygonPivots.get('green').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('green').posY - polygonPivots.get('green').height) > 5 || polygonPivots.get('green').angle !== 0) return false;
            switch (polygonPivots.get('navy').angle) {
                case 0:
                    if (Math.abs(pivot.posX + 75 + polygonPivots.get('green').width - polygonPivots.get('navy').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('navy').posY - polygonPivots.get('navy').height) > 5 || polygonPivots.get('navy').angle !== 0) return false;
                    if (Math.abs(pivot.posX + 75 + polygonPivots.get('green').width + 70 - polygonPivots.get('purple').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('purple').posY - polygonPivots.get('purple').height) > 5 || polygonPivots.get('purple').angle !== 180) return false;
                    break;
                case 180:
                    if (Math.abs(pivot.posX + 75 + polygonPivots.get('green').width + 70 - polygonPivots.get('navy').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('navy').posY - polygonPivots.get('navy').height) > 5) return false;
                    if (Math.abs(pivot.posX + 75 + polygonPivots.get('green').width - polygonPivots.get('purple').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('purple').posY - polygonPivots.get('purple').height) > 5 || polygonPivots.get('purple').angle !== 0) return false;
                    break;
                default:
                    return false;
            }
            break;
        case 90:
            if (pivot.posY > 5) return false;
            switch (polygonPivots.get('orange').angle) {
                case 90:
                    if (Math.abs(pivot.posY + pivot.width - polygonPivots.get('orange').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('orange').posX) > 5) return false;
                    if (Math.abs(pivot.posY + pivot.width + 40 - polygonPivots.get('blue').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('blue').posX) > 5 || polygonPivots.get('blue').angle !== 270) return false;
                    break;
                case 270:
                    if (Math.abs(pivot.posY + pivot.width + 75 - polygonPivots.get('orange').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('orange').posX) > 5) return false;
                    if (Math.abs(pivot.posY + pivot.width - polygonPivots.get('blue').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('blue').posX) > 5 || polygonPivots.get('blue').angle !== 90) return false;
                    break;
                default:
                    return false;
            }
            if (Math.abs(pivot.posY + pivot.width + 40 + polygonPivots.get('blue').width - polygonPivots.get('yellow').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('yellow').posX) > 5 || polygonPivots.get('yellow').angle !== 90) return false;
            if (Math.abs(pivot.posY + 75 - polygonPivots.get('green').posY) > 5 || Math.abs(pivot.posX + pivot.height - polygonPivots.get('green').posX) > 5 || polygonPivots.get('green').angle !== 90) return false;
            switch (polygonPivots.get('navy').angle) {
                case 90:
                    if (Math.abs(pivot.posY + 75 + polygonPivots.get('green').width - polygonPivots.get('navy').posY) > 5 || Math.abs(pivot.posX + pivot.height - polygonPivots.get('navy').posX) > 5) return false;
                    if (Math.abs(pivot.posY + 75 + polygonPivots.get('green').width + 70 - polygonPivots.get('purple').posY) > 5 || Math.abs(pivot.posX + pivot.height - polygonPivots.get('purple').posX) > 5 || polygonPivots.get('purple').angle !== 270) return false;
                    break;
                case 270:
                    if (Math.abs(pivot.posY + 75 + polygonPivots.get('green').width + 70 - polygonPivots.get('navy').posY) > 5 || Math.abs(pivot.posX + pivot.height - polygonPivots.get('navy').posX) > 5) return false;
                    if (Math.abs(pivot.posY + 75 + polygonPivots.get('green').width - polygonPivots.get('purple').posY) > 5 || Math.abs(pivot.posX + pivot.height - polygonPivots.get('purple').posX) > 5 || polygonPivots.get('purple').angle !== 90) return false;
                    break;
                default:
                    return false;
            }
            break;
        case 180:
            if (pivot.posX + pivot.width < 595) return false;
            switch (polygonPivots.get('orange').angle) {
                case 180:
                    if (Math.abs(pivot.posX - polygonPivots.get('orange').width - polygonPivots.get('orange').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('orange').posY) > 5) return false;
                    if (Math.abs(pivot.posX - 40 - polygonPivots.get('blue').width - polygonPivots.get('blue').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('blue').posY) > 5 || polygonPivots.get('blue').angle !== 0) return false;
                    break;
                case 0:
                    if (Math.abs(pivot.posX - 75 - polygonPivots.get('orange').width - polygonPivots.get('orange').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('orange').posY) > 5) return false;
                    if (Math.abs(pivot.posX - polygonPivots.get('blue').width - polygonPivots.get('blue').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('blue').posY) > 5 || polygonPivots.get('blue').angle !== 180) return false;
                    break;
                default:
                    return false;
            }
            if (Math.abs(pivot.posX - 40 - polygonPivots.get('blue').width - polygonPivots.get('yellow').width - polygonPivots.get('yellow').posX) > 5 || Math.abs(pivot.posY - polygonPivots.get('yellow').posY) > 5 || polygonPivots.get('yellow').angle !== 180) return false;
            if (Math.abs(pivot.posX - 65 - polygonPivots.get('green').posX) > 5 || Math.abs(pivot.posY + pivot.height - polygonPivots.get('green').posY) > 5 || polygonPivots.get('green').angle !== 180) return false;
            switch (polygonPivots.get('navy').angle) {
                case 180:
                    if (Math.abs(pivot.posX - 65 - polygonPivots.get('navy').width - polygonPivots.get('navy').posX) > 5 || Math.abs(pivot.posY + pivot.height - polygonPivots.get('navy').posY) > 5) return false;
                    if (Math.abs(pivot.posX - 65 - 70 - polygonPivots.get('purple').width - polygonPivots.get('purple').posX) > 5 || Math.abs(pivot.posY + pivot.height - polygonPivots.get('purple').posY) > 5 || polygonPivots.get('purple').angle !== 0) return false;
                    break;
                case 0:
                    if (Math.abs(pivot.posX - 65 - 70 - polygonPivots.get('navy').width - polygonPivots.get('navy').posX) > 5 || Math.abs(pivot.posY + pivot.height - polygonPivots.get('navy').posY) > 5) return false;
                    if (Math.abs(pivot.posX - 65 - polygonPivots.get('purple').width - polygonPivots.get('purple').posX) > 5 || Math.abs(pivot.posY + pivot.height - polygonPivots.get('purple').posY) > 5 || polygonPivots.get('purple').angle !== 180) return false;
                    break;
                default:
                    return false;
            }
            break;
        case 270:
            if (pivot.posY + pivot.width < 595) return false;
            switch (polygonPivots.get('orange').angle) {
                case 270:
                    if (Math.abs(pivot.posY - polygonPivots.get('orange').width - polygonPivots.get('orange').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('orange').posX) > 5) return false;
                    if (Math.abs(pivot.posY - 40 - polygonPivots.get('blue').width - polygonPivots.get('blue').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('blue').posX) > 5 || polygonPivots.get('blue').angle !== 90) return false;
                    break;
                case 90:
                    if (Math.abs(pivot.posY - 75 - polygonPivots.get('orange').width - polygonPivots.get('orange').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('orange').posX) > 5) return false;
                    if (Math.abs(pivot.posY - polygonPivots.get('blue').width - polygonPivots.get('blue').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('blue').posX) > 5 || polygonPivots.get('blue').angle !== 270) return false;
                    break;
                default:
                    return false;
            }
            if (Math.abs(pivot.posY - 40 - polygonPivots.get('blue').width - polygonPivots.get('yellow').width - polygonPivots.get('yellow').posY) > 5 || Math.abs(pivot.posX + pivot.height - polygonPivots.get('yellow').posX - polygonPivots.get('yellow').height) > 5 || polygonPivots.get('yellow').angle !== 270) return false;
            if (Math.abs(pivot.posY - 65 - polygonPivots.get('green').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('green').height - polygonPivots.get('green').posX) > 5 || polygonPivots.get('green').angle !== 270) return false;
            switch (polygonPivots.get('navy').angle) {
                case 270:
                    if (Math.abs(pivot.posY - 65 - polygonPivots.get('green').width - polygonPivots.get('navy').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('navy').height - polygonPivots.get('navy').posX) > 5) return false;
                    if (Math.abs(pivot.posY - 135 - polygonPivots.get('purple').width - polygonPivots.get('purple').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('purple').height - polygonPivots.get('purple').posX) > 5 || polygonPivots.get('purple').angle !== 90) return false;
                    break;
                case 90:
                    if (Math.abs(pivot.posY - 135 - polygonPivots.get('navy').width - polygonPivots.get('navy').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('navy').height - polygonPivots.get('navy').posX) > 5) return false;
                    if (Math.abs(pivot.posY - 65 - polygonPivots.get('green').width - polygonPivots.get('purple').posY) > 5 || Math.abs(pivot.posX - polygonPivots.get('purple').height - polygonPivots.get('purple').posX) > 5 || polygonPivots.get('purple').angle !== 270) return false;
                    break;
                default:
                    return false;
            }
            break;
        default:
            return false;
    }
    return true;
}

