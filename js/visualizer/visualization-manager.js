var VisualizationManager = function () {};

VisualizationManager.prototype.createSolarSystem = function (paper) {
    var viz = new Visualizer();
    viz.setClientInput(40, 25);
    viz.renderSolarSystem(paper);
    $('#search-box').keypress(function (e) {
        if (e.which === 13) {
            viz.searchPlanet($('#search-box')[0].value.toString());
            return false;
        }
    });

}
VisualizationManager.prototype.enablePanAndZoom = function (paper) {
    var panZoom = paper.panzoom({
        initialZoom: 2,
        initialPosition: {
            x: 0,
            y: 0
        }
    });
    panZoom.enable();
}