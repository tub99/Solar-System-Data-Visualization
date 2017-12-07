function Visualizer() {
    var paperInstance,
        equidistantFactor = 60,
        clientInput = {
            channelsNo: 0,
            planetsNo: 0
        },
        graphInputs = {
            canvasX: 400,
            canvasY: 300,
            planetRadius: 0,
            sunRadius:0,
            channel: ''
        },
        planetsData = [],
        channelsData = [],

        generatePlanetInfo = function (radius, theta) {
            return {
                X: graphInputs.canvasX + (radius * Math.cos(theta)),
                Y: graphInputs.canvasY + (radius * Math.sin(theta)),
                label: '',
            };

        }
    computeSystemPosition = function () {
            var separationangle = 360 / clientInput.channelsNo;
            // parametric position RCosTheta, RSinTheta
            var totalRad = graphInputs.totalRadius = equidistantFactor * clientInput.planetsNo;
            for (var i = 1; i <= clientInput.planetsNo; i++) {
                for (var j = 1; j <=clientInput.channelsNo; j++) {
                    var rad = equidistantFactor * (i),
                        theta = (separationangle * (j))*(Math.PI/180),
                        planetInfo = generatePlanetInfo(rad, theta);
                    planetsData.push(planetInfo);
                    if (i === clientInput.planetsNo) channelsData.push(planetInfo);

                }
            }
            console.log(planetsData);


        },
        renderPlanets = function () {
            for (let plannet of planetsData) {
                var circle = paperInstance.circle(plannet.X, plannet.Y, 2);
                // Sets the fill attribute of the circle to red (#f00)
                circle.attr({
                    "fill": 'blue'
                });
            }
        },
        renderChannels = function () {
            for (let channel of channelsData) {
                // ['M',pX,pY,'L',X,Y]
                var line = paperInstance.path(['M', graphInputs.canvasX, graphInputs.canvasY, 'L', channel.X, channel.Y]);
                // Sets the fill attribute of the circle to red (#f00)
                line.attr({
                    "stroke": 'blue'
                });

            }
        },
        drawSun = function () {
            var circle = paperInstance.circle(graphInputs.canvasX, graphInputs.canvasY, 30);
            // Sets the fill attribute of the circle to red (#f00)
            circle.attr({
                "fill": 'white',
                'stroke-width': 5,
                'stroke': 'blue'
            });
        }
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

        renderChannels();
        drawSun();
        renderPlanets();
    }
}