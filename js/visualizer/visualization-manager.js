var VisualizationManager = function () {};

VisualizationManager.prototype.createSolarSystem = function(paper){
    var viz = new Visualizer();
    viz.setClientInput(40, 5);
    viz.renderSolarSystem(paper);
}