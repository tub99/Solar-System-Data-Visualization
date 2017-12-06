function Visualizer() {
    var paperInstance,
        equidistantFactor = 30,
        clientInput = {
            channelsNo: 0,
            planetsNo: 0
        },
        graphInputs = {
            canvasX: 400,
            canvasY: 300
        },
        planetsData = [],

        generatePlanetInfo = function (radius, theta) {
            return {
                X: graphInputs.canvasX + radius * Math.cos(theta),
                Y: graphInputs.canvasY - radius * Math.sin(theta),
                label: '',
            }

        }
    computeSystemPosition = function () {
        var separationangle = 360 / clientInput.channelsNo;
        // parametric position RCosTheta, RSinTheta
        var totalRad = graphInputs.totalRadius = equidistantFactor * clientInput.planetsNo;
        for (var i = 0; i < clientInput.planetsNo; i++) {
            for (var j = 0; j < clientInput.channelsNo; j++) {
                var rad = equidistantFactor * (i + 1),
                    theta = separationangle * (j + 1),
                    planetInfo = generatePlanetInfo(rad, theta);
                var circle = paperInstance.circle(planetInfo.X, planetInfo.Y, 1.5);
                // Sets the fill attribute of the circle to red (#f00)
                circle.attr({
                    "fill": 'blue',
                    'opacity': 0.3
                });
            }
        }
        console.log(planetsData);


    };
    this.setClientInput = function (channels, planets) {
        clientInput.channelsNo = channels || 40;
        clientInput.planetsNo = planets || 25;
    };
    this.getClientInput = function () {
        return clientInput;
    }
    this.renderSolarSystem = function (paper) {
        paperInstance = paper;
        computeSystemPosition();
    }
}