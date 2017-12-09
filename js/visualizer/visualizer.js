function Visualizer() {
    var paperInstance,
        equidistantFactor = 10,
        clientInput = {
            channelsNo: 0,
            planetsNo: 0
        },
        graphInputs = {
            canvasX: 850 / 3 + 50,
            canvasY: 850 / 3,
            planet: {
                planetRadius: 1,
                color: '#4AA8D6'
            },
            sunRadius: 5,
            channel: {
                color: ''
            },
            satellite: {
                satteliteDistance: 5,
                color: 'white'
            }

        },
        planetsData = [],
        channelsData = [],
        satellitesData = [],
        prevSearchedPlanet,

        generatePlanetInfo = function (radius, theta, planetName, lev) {

            var color = graphInputs.planet.color,
                stroke = 'black';
            return {
                X: graphInputs.canvasX + (radius * Math.cos(theta)),
                Y: graphInputs.canvasY + (radius * Math.sin(theta)),
                label: 'planet_' + planetName + '-' + lev,
                level: lev,
                color: color,
                stroke: stroke,
                satelliteLabel: 'satellite_' + planetName + '-' + lev
            };

        },
        attatchHoverEvent = function (planetNode) {
            var satteliteAxis,
                textElem;
            planetNode.hover(function () {
                var satId = 'satellite_' + planetNode.id.split('_')[1];
                textElem = paperInstance.getById('text_' + planetNode.id);
                textElem.show();
                for (var satElem of satellitesData) {
                    if (satElem.id === satId) {
                        satteliteAxis = satElem;
                        satElem.show();
                    }
                }
            }, function () {
                satteliteAxis.hide();
                textElem.hide();
            });

        }
    computeSatelliteAxisPosition = function () {
            var rad = graphInputs.satellite.satteliteDistance + graphInputs.planet.planetRadius,
                cnt = 0;
            for (var satellite of planetsData) {
                cnt++;
                var x = satellite.X,
                    y = satellite.Y,
                    theta = 45 * (Math.PI / 180),
                    factor = 90 * (Math.PI / 180);
                // 4 sattelitse at 90 degree separate from each other
                // 1st one at 45 , 2nd = 45+90 , 3rd = 45+90+90, 4th= 45+270
                satellite.axis = {
                    first: {
                        X: x + rad * Math.cos(theta),
                        Y: y + rad * Math.sin(theta)
                    },
                    second: {
                        X: x + rad * Math.cos(theta + factor),
                        Y: y + rad * Math.sin(theta + factor)
                    },
                    third: {
                        X: x + rad * Math.cos(theta + 2 * factor),
                        Y: y + rad * Math.sin(theta + 2 * factor)
                    },
                    fourth: {
                        X: x + rad * Math.cos(theta + 3 * factor),
                        Y: y + rad * Math.sin(theta + 3 * factor)
                    }
                };

            }

        },
        computeSystemPosition = function () {
            var separationangle = 360 / clientInput.channelsNo;
            // parametric position RCosTheta, RSinTheta
            var totalRad = graphInputs.totalRadius = equidistantFactor * clientInput.planetsNo;
            for (var i = 1; i <= clientInput.planetsNo; i++) {
                var cnt = clientInput.planetsNo;
                for (var j = 1; j <= clientInput.channelsNo; j++) {
                    cnt--;
                    var rad = equidistantFactor * (i),
                        theta = (separationangle * (j)) * (Math.PI / 180),
                        planetName = String.fromCharCode(64 + i),
                        planetInfo = generatePlanetInfo(rad, theta, planetName, j);
                    planetsData.push(planetInfo);
                    // All satellite data
                    if (i === clientInput.planetsNo) {
                        // set count for satellite
                        cnt = 0;
                        //set the channels extremeties
                        channelsData.push(planetInfo);
                        // set the satellites
                        //satellitesData.push(planetInfo);
                    }

                }
            }
            computeSatelliteAxisPosition();
        },
        renderPlanets = function () {
            for (let planet of planetsData) {
                var circle = paperInstance.circle(planet.X, planet.Y, graphInputs.planet.planetRadius);
                circle.attr({
                    "fill": planet.color,
                    "stroke": planet.stroke
                });
                circle.id = planet.label;
                // Setting to DOM element
                circle.node.setAttribute('id', planet.label);
                // planet text
                var text = paperInstance.text(planet.X, planet.Y, planet.label.split('_')[1])
                    .attr({
                        fill: 'maroon'
                    })
                    .translate(-15, 0);
                text.id = 'text_' + planet.label;

                text.hide();
                attatchHoverEvent(circle);
            }
        },
        renderChannels = function () {
            for (let channel of channelsData) {
                // ['M',pX,pY,'L',X,Y]
                var line = paperInstance.path(['M', graphInputs.canvasX, graphInputs.canvasY, 'L', channel.X, channel.Y]);
                // Sets the fill attribute of the circle to red (#f00)
                line.attr({
                    "stroke": graphInputs.planet.color
                });

            }
        },
        drawSun = function () {
            var circle = paperInstance.circle(graphInputs.canvasX, graphInputs.canvasY, graphInputs.planet.planetRadius * 5);
            // Sets the fill attribute of the circle to red (#f00)
            circle.attr({
                "fill": 'white',
                'stroke-width': 3,
                'stroke': '#111539'
            });
        },
        drawSattelites = function () {
            for (var satellite of planetsData) {
                var st = paperInstance.set();
                for (var p in satellite.axis) {
                    var elem = satellite.axis[p];
                    //draw axis lines
                    var line = paperInstance.path(['M', satellite.X, satellite.Y, 'L', elem.X, elem.Y]);
                    // Sets the fill attribute of the circle to red (#f00)
                    line.attr({
                        "stroke": 'blue'
                    });
                    var circle = paperInstance.circle(elem.X, elem.Y, graphInputs.planet.planetRadius / 2);
                    circle.attr({
                        "fill": 'black'
                    });
                    // add satellites to set
                    st.push(line, circle);
                }
                st.id = satellite.satelliteLabel;
                st.hide();
                satellitesData.push(st);
                //st.node.setAttribute('id', elem.label);

            }
        }
    this.setClientInput = function (channels, planets) {
        clientInput.channelsNo = channels || 40;
        clientInput.planetsNo = planets || 25;
    };
    this.getClientInput = function () {
        return clientInput;
    }
    this.searchPlanet = function (planetId) {

        if (prevSearchedPlanet) prevSearchedPlanet.remove();
        var planet = paperInstance.getById(planetId);
        if (!planet) alert('Planet Not Found');
        //highlight and zoom the searched planet
        prevSearchedPlanet = planet.glow({
            width: 10,
            color: 'red'
        });
    }
    this.renderSolarSystem = function (paper) {
        paperInstance = paper;
        computeSystemPosition();
        renderChannels();
        drawSun();
        drawSattelites();
        renderPlanets();
    }
}