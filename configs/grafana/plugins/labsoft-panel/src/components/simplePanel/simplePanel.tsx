import React, { useEffect, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
// // import data from './data.json';
import * as d3 from 'd3';
import switchImg from '../../img/Switch1.png';
import mac from '../../img/Macbook-icon.png';
// // import yaml from 'js-yaml';
import dataYml from '../../../../../../../st.clab.yml';
// // import YAML from 'yaml';
import {  fetchPrometheusData, transformPrometheusData } from 'components/converters/dataConverters';

interface Props extends PanelProps<SimpleOptions> { }

export const SimplePanel: React.FC<Props> = ({ options, width, height }) => {
  const svgRef = useRef();
  // const containerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: width, height: height });
  // const [inbound, setInbound] = useState([]);


  
  const [transformedLink, setTransformedLink] =  useState([]);

  const links = dataYml.topology.links.map(link => ({
    source: link.endpoints[0].split(":")[0],
    sourcePort: link.endpoints[0].split(":")[1],
    target: link.endpoints[1].split(":")[0],
    targetPort: link.endpoints[1].split(":")[1]
  }));

  // useEffect(() => {
    // Fetch data and update transformedData state

    const fetchAndEnrichData = async () => {
    fetchPrometheusData("gnmic_srl_if_traffic_rate_out_bps").then(data => {
      const transformed = transformPrometheusData(data);
   setTransformedLink(links.map(link => {
    // Find the matching entry in the database where both source and interface match
    const match = transformed.links.find(
      entry=>  entry.source === link.source.name && entry.interface === link.sourcePort)
    // If a match is found, add the value to the link object
    return match
      ? { ...link, value: match.value }
      : link; 
    }));
  });
}






   // Use useEffect to set an interval for updating the bandwidth
   useEffect(() => {
    const interval = setInterval(fetchAndEnrichData, 10000); // Update bandwidth every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
 
 // Observe size of the container element
  useEffect(() => {

    const observer = new ResizeObserver(entries => {
      if (!entries || !entries.length) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current); 
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current); 
      }
    };
  }, []);

    const nodeSet = new Set<string>();
    // Loop over links to add each unique node name to the set
      links.forEach(link => {
        nodeSet.add(link.source);
        nodeSet.add(link.target);
      });

  // Convert the set of unique node names into an array of node objects
  const nodes = Array.from(nodeSet).map((name, index) => {
    let type = "";
    if (name.startsWith("spine")) type = "spine";
    else if (name.startsWith("leaf")) type = "leaf";
    else if (name.startsWith("client")) type = "client";
    let id = index;

    return { name, type, id };
  });
     

      useEffect(() => {

        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        const { width, height } = dimensions;
    
        
        svg.attr("width", width).attr("height", height);
        
        
        const groupYPositions = {
            spine: height * 0.2,  
            leaf: height * 0.5,   
            client: height * 0.8  
        };
    
        // Create the force simulation with custom forces
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.name).distance(120))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            // .force("x", d3.forceX().strength(1))
            .force("y", d3.forceY((d: any) => {
                return groupYPositions[d.type] || height / 2; // Apply custom Y position by group
            }).strength(1));
            
    
        // Create link lines
        const link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .style("stroke", "#ccc")
            .style("stroke-width", "2px")
            .attr("marker-end", "url(#arrowhead)");
          

             // Create circles for the source and target ports
              const portCircles = svg.selectAll(".port-circle")
              .data(links)
              .enter()
              .append("circle")
              .attr("class", "port-circle")
              .attr("r", 5) // Small circles for ports
              .style("fill", "#ff5722"); // Orange color for port circles

            // Add labels for the ports at the source and target circles
            const portLabels = svg.selectAll(".port-label")
              .data(links)
              .enter()
              .append("text")
              .attr("class", "port-label")
              .style("font-size", "8px")
              .style("fill", "#fff");

              

        // // Create node circles
            // const node = svg.selectAll(".node")
            //     .data(nodes)
            //     .enter()
            //     .append("circle")
            //     .attr("class", "node")
            //     .attr("r", 20)
            //     .style("fill", "#1f77b4")
            //     .style("stroke", "#fff")
            //     .style("stroke-width", "1.5px");
    console.log('version 2.8');

    const node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("image")
    .attr("class", "node")
    .attr("xlink:href", (d) => {
        // Return the image URL based on the node type
        if (d.type === "spine" ||d.type === 'leaf') {
         
            return switchImg; // Replace with your actual image path
        // } else if (d.type === "leaf") {
        //     return "path/to/leaf-image.png"; // Replace with your actual image path
        // } else if (d.type === "client") {
        //     return "path/to/client-image.png"; // Replace with your actual image path
        } else {
            return mac; // Fallback for other node types
        }
    })
    .attr("width", 40) // Adjust the width of the images
    .attr("height", 40); // Adjust the height of the images
    // .attr("x", -20) // Offset the image to center it on the node position
    // .attr("y", -20); // Offset the image to center it on the node position
  
     

            // const node = svg.selectAll(".node")
            // .data(nodes)
            // .enter()
            // .attr("class", "node");   

            // node.each(function(d) {
            //   console.log('port', d.name, d.type);
            // if (d.type === "spine") {
            // d3.select(this)
            // .append("image")
            // .attr("href", switchImg) 
            // .attr("width", 50)
            // .attr("height", 50)
            // .attr("x", -25)  
            // .attr("y", -25);          
            //   } else {
            // d3.select(this)
            // .append("image")
            // .attr("href", mac) 
            // .attr("width", 50)
            // .attr("height", 50)
            // .attr("x", -25)  
            // .attr("y", -25);
            //    }
            // });
            
        // Add labels for each node
        const nodeLabel = svg.selectAll(".text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("class", "text")
            .attr("dx", -5)
            .attr("dy", 30)
            .text(d => d.name)
            .style("font-size", "12px")
            .style("fill", "#ffff");

  
          simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);
    
            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);
    
            nodeLabel
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y);

                portCircles
                .filter(d => d.source) 
                .attr("cx", d => {
                  return d.source.x + (d.target.x - d.source.x) * 0.2;
                })
                .attr("cy", d => {
                 
                  return d.source.y + (d.target.y - d.source.y) * 0.2;
                })
                .style("fill", "#ff5722"); // Source port circle color       

              // Position target port circle at 80% along the link (target port)
              portCircles
                .filter(d => d.target) // Ensure we are positioning the target port circle
                .attr("cx", d => {
                  // Calculate position at 80% (target port)
                  return d.source.x + (d.target.x - d.source.x) * 0.8;
                })
                .attr("cy", d => {
                  // Calculate position at 80% (target port)
                  return d.source.y + (d.target.y - d.source.y) * 0.8;
                })
                .style("fill", "#4caf50"); // Target port circle color

            
              portLabels
                .filter((d, i) => d.source)
                .attr("x", d => {
                 
                  return d.source.x + (d.target.x - d.source.x) * 0.15 ;
                })
                .attr("y", d => {
                  return d.source.y + (d.target.y - d.source.y) * 0.15 - 10;
                })
                .text(d => d.sourcePort);

              
              portLabels
                .filter((d, i) => d.target)
                .attr("x", d => {
               
                  return d.source.x + (d.target.x - d.source.x) * 0.8;
                })
                .attr("y", d => {
                  return d.source.y + (d.target.y - d.source.y) * 0.8 - 10;
                })
                .text(d => d.targetPort);

        });
        
    }, [dimensions]);

    useEffect(() => {
      if (!svgRef.current) return;
      const svg = d3.select(svgRef.current);
      svg.selectAll('.link-text').remove();
      console.log('removed 102');
      svg
      .selectAll('.link-text')
      .data(transformedLink)
      .enter() 
      .append('text')
      .attr('class', 'link-text')
      .text(d => d.value) 
      .attr('x', d => (d.source.x + d.target.x) / 2) 
      .attr('y', d => (d.source.y + d.target.y) / 2)
      .style('font-size', '10px')
      .style('fill', '#fff'); 


      console.log('linkLabel');
      
    }, [transformedLink, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}> 
      <svg ref={svgRef} id="co3"> </svg>
    </div>
    // <div>Hello World</div>
  );
};
