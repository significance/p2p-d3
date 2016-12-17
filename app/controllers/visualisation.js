import Ember from 'ember';
import VisualisationMixin from '../mixins/visualisation';

export default Ember.Controller.extend(VisualisationMixin, {
    init() {
        this._super();
        Ember.run.schedule("afterRender",this,function() {
        this.send("initializeVisualisation");
        });
    },
    actions: {
        initializeVisualisation(){
            var self = this;
            self.svg = d3.select("svg");
            self.width = self.svg.attr("width");
            self.height = +self.svg.attr("height");

            self.color = d3.scaleOrdinal(d3.schemeCategory20);

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function(d) { return d.id; }))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(self.width / 2, self.height / 2));

            d3.json("example.json", function(error, graph) {
                if (error) {throw error;}

                var graphNodes = $(graph.add)
                    .filter(function(i,e){return e.group === 'nodes'})
                    .map(function(i,e){ return {id: e.data.id, group: 1}; })
                    .toArray();

                var graphLinks = $(graph.add)
                    .filter(function(i,e){return e.group === 'edges'})
                    .map(function(i,e){ 
                        return {
                            source: e.data.source, 
                            target: e.data.target, 
                            group: 1,
                            value: i
                        };
                    })
                    .toArray();


                var link = self.svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(graphLinks)
                    .enter().append("line")
                    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

                var node = self.svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(graphNodes)
                    .enter().append("circle")
                    .attr("r", 5)
                    .attr("fill", function(d) { return self.color(d.group); })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                node.append("title")
                    .text(function(d) { return d.id; });

                simulation
                    .nodes(graphNodes)
                    .on("tick", ticked);

                simulation.force("link")
                    .links(graphLinks)
                    .distance(function(l,i){return (22-l.value)*22;});

                node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });       


                function ticked() {
                    link
                        .attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    node
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                  }


                function dragstarted(d) {
                  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                  d.fx = d.x;
                  d.fy = d.y;
                }

                function dragged(d) {
                  d.fx = d3.event.x;
                  d.fy = d3.event.y;
                }

                function dragended(d) {
                  if (!d3.event.active) simulation.alphaTarget(0);
                  d.fx = null;
                  d.fy = null;
                } 

            }); 
        }
    }
});
