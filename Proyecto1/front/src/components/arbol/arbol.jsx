import React from "react";
import Graph from "react-vis-network-graph";

const Arbol = (props) => {
	
	const graph = {
		nodes: props.nodes,
		edges: props.edges,
	};
	
	const options = {
		layout: {
		  hierarchical: true
		},
		edges: {
		  color: "#fff"
		}
	};
	  
	const events = {
    select: function(event) {
      var { nodes, edges } = event;
    }
  };

	return <Graph
      graph={graph}
      options={options}
      events={events}
      getNetwork={network => {
        //  if you want access to vis.js network api you can set the state in a parent component using this property
      }}
    />;
};

export default Arbol;
