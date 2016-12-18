import Ember from 'ember';


class P2Pd3 {

  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  initializeVisualisation(svg,nodes,links) {
    return generateUID();
  }

  updateVisualisation(nodes,links) {

  }

  generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
  }
}

window.visualisation = new P2Pd3(300,200);




function generateUID() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}

export default Ember.Controller.extend({
    init() {
        this._super();
        Ember.run.schedule("afterRender",this,function() {
        this.send("initializeVisualisation");
        });
    },
    actions: {
        initializeVisualisation(){
            var self = this;
            window.context = self;


            self.svg = d3.select("svg");
            self.width = self.svg.attr("width");
            self.height = +self.svg.attr("height");

            self.color = d3.scaleOrdinal(d3.schemeCategory20);


            var simulation = self.simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function(d) { return d.id; }))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(self.width / 2, self.height / 2));


            d3.json("example.json", function(error, graph) {
                if (error) {throw error;}


                // parse go netsim output
                self.graphNodes = $(graph.add)
                    .filter(function(i,e){return e.group === 'nodes'})
                    .map(function(i,e){ return {id: e.data.id, group: 1}; })
                    .toArray();

                self.graphLinks = $(graph.add)
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



                self.link = self.svg.append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(self.graphLinks)
                    .enter().append("line")
                    .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


                self.node = self.svg.append("g")
                    .attr("class", "nodes")
                    .selectAll("circle")
                    .data(self.graphNodes)
                    .enter().append("circle")
                    .attr("r", 5)
                    .attr("fill", function(d) { return self.color(d.group); })
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                // self.node.append("title")
                //     .text(function(d) { return d.id; });

                simulation
                    .nodes(self.graphNodes)
                    .on("tick", ticked);

                simulation.force("link")
                    .links(self.graphLinks)
                    // .distance(function(l,i){return (22-l.value)*22;});

                self.node
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });       


                function ticked() {
                    self.link
                        .attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    self.node
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                  }


                function dragstarted(d) {
                    console.log(d.id)
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
        },
        restartVisualisation(){

            var randID = generateUID();
            console.log(randID)

            var newNode = {id: randID, group: 2, x: 500, y: 500 }

            this.graphNodes.push(newNode);

            this.node = this.node.data(this.graphNodes, function(d) { return d.id;});
            // this.node.exit().remove();
            this.node = this.node
                            .enter()
                            .append("circle")
                            .attr("fill", function(d) { return d3.scaleOrdinal(d3.schemeCategory20)(d.group) })
                            .attr("r", 5)
                            .attr("x",500)
                            .merge(this.node);
  

            // this.graphNodes.pop();




            // remove old links
            // this.graphLinks.pop();
            // this.link.exit().remove();



            var randNode1 = this.graphNodes[parseInt(Math.random(0,this.graphNodes.length)*10)];
            var randNode2 = this.graphNodes[parseInt(Math.random(0,this.graphNodes.length)*10)];
            var randNode3 = this.graphNodes[parseInt(Math.random(0,this.graphNodes.length)*10)];

            this.graphLinks.push({source: newNode, target: randNode2, group: 1, value: 1 }); // Add a-b.
            this.graphLinks.push({source: newNode, target: randNode2, group: 1, value: 1 }); // Add a-b.
            this.graphLinks.push({source: newNode, target: randNode3, group: 1, value: 1 }); // Add a-b.

            // Apply the general update pattern to the links.
            this.link = this.link.data(this.graphLinks);

            // add new links
            this.link = this.link.enter().append("line").merge(this.link);

            // Apply the general update pattern to the links.
            this.link = this.link.data(this.graphLinks);

            this.svg = d3.select("svg");
            this.width = this.svg.attr("width");
            this.height = +this.svg.attr("height");

            // Update and restart the simulation.
            this.simulation.nodes(this.graphNodes);            
            this.simulation.force("link").links(this.graphLinks)
            
            // this.simulation.force("center", d3.forceCenter(300, 200));

            this.simulation.alpha(1).restart();
        }
    }
});
