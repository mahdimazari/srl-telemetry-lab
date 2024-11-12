// import React, { useEffect, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import React from 'react';
import { SimpleOptions } from 'types';
// // import data from './data.json';
// import * as d3 from 'd3';
// // import switchImg from '../../img/Switch1.png';
// // import mac from '../../img/Macbook-icon.png';
// // import yaml from 'js-yaml';
// import dataYml from '../../../../../../../st.clab.yml';
// // import YAML from 'yaml';
// import {  fetchPrometheusData, transformPrometheusData } from 'components/converters/dataConverters';



interface Props extends PanelProps<SimpleOptions> { }

export const SimplePanel: React.FC<Props> = ({ options, width, height }) => {

  console.log('option', options, height);
//   const svgRef = useRef();
//   // const containerRef = useRef<HTMLDivElement | null>(null);
//   const containerRef = useRef();

//   // const [containerWidth, setContainerWidth] = useState<number>(width);
//   // const [containerHeight, setContainerHeight] = useState<number>(height);
//   const [dimensions, setDimensions] = useState({ width: width, height: height });
//   // const [inbound, setInbound] = useState([]);


  
//   const [transformedLink, setTransformedLink] =  useState([]);

//   const links = dataYml.topology.links.map(link => ({
//     source: link.endpoints[0].split(":")[0],
//     sourcePort: link.endpoints[0].split(":")[1],
//     target: link.endpoints[1].split(":")[0],
//     targetPort: link.endpoints[1].split(":")[1]
//   }));

//   // useEffect(() => {
//     // Fetch data and update transformedData state

//     const fetchAndEnrichData = async () => {
//     fetchPrometheusData("gnmic_srl_if_traffic_rate_out_bps").then(data => {
//       const transformed = transformPrometheusData(data);
//       // setTransformedLink(transformed); // Set the transformed data in state

//       console.log(links, transformed);

//         // Add value to each link if there's a match in the database
//    setTransformedLink(links.map(link => {
//     // Find the matching entry in the database where both source and interface match
//     const match = transformed.links.find(
//       entry=>  entry.source === link.source.name && entry.interface === link.sourcePort)
    
//     console.log('value',match);
//     // If a match is found, add the value to the link object
//     return match
//       ? { ...link, value: match.value }
//       : link; // If no match, return link as is)
//     }));

//   });
// }






//    // Use useEffect to set an interval for updating the bandwidth
//    useEffect(() => {
//     const interval = setInterval(fetchAndEnrichData, 10000); // Update bandwidth every 3 seconds

//     return () => clearInterval(interval); // Cleanup the interval on unmount
//   }, []);
 



//   // // Observe size of the container element
//   // useEffect(() => {

//   // // console.log('enrichedLinks', transformedLink);

//   //   const observer = new ResizeObserver(entries => {
//   //     if (!entries || !entries.length) return;
//   //     const { width, height } = entries[0].contentRect;
//   //     setDimensions({ width, height });
//   //   });

//   //   if (containerRef.current) {
//   //     observer.observe(containerRef.current); // Start observing the container's size
//   //   }

//   //   return () => {
//   //     if (containerRef.current) {
//   //       observer.unobserve(containerRef.current); // Cleanup observer on unmount
//   //     }
//   //   };
//   // }, []);



//     // console.log('links only', links);
//     const nodeSet = new Set<string>();
//     // Loop over links to add each unique node name to the set
//       links.forEach(link => {
//         nodeSet.add(link.source);
//         nodeSet.add(link.target);
//       });

//   // Convert the set of unique node names into an array of node objects
//   const nodes = Array.from(nodeSet).map((name, index) => {
//     // Define type based on node naming conventions
//     let type = "";
//     if (name.startsWith("spine")) type = "spine";
//     else if (name.startsWith("leaf")) type = "leaf";
//     else if (name.startsWith("client")) type = "client";
//     let id = index;

//     return { name, type, id };
//   });

//   console.log('nodes', nodes, transformedLink);
        
//     // const nodes = Object.values(nodeMap);
//       // console.log('links and nodes', links, nodes);

//       useEffect(() => {
//         const { width, height } = dimensions;
    
//         if (!svgRef.current) return;
    
//         const svg = d3.select(svgRef.current);
//         svg.attr("width", width).attr("height", height);
    
//         // Clear previous elements from SVG
//         svg.selectAll("*").remove();
        
//         // Define groups for vertical positioning
//         const groupYPositions = {
//             spine: height * 0.2,  // Spine nodes on the top
//             leaf: height * 0.5,   // Leaf nodes in the middle
//             client: height * 0.8  // Client nodes on the bottom
//         };
    

//         console.log('ee', links, transformedLink, nodes);

//         // Create the force simulation with custom forces
//         const simulation = d3.forceSimulation(nodes)
//             .force("link", d3.forceLink(links).id((d: any) => d.name).distance(120))
//             .force("charge", d3.forceManyBody().strength(-400))
//             .force("center", d3.forceCenter(width / 2, height / 2))
//             .force("x", d3.forceX().strength(0.01))
//             .force("y", d3.forceY((d: any) => {
//                 return groupYPositions[d.type] || height / 2; // Apply custom Y position by group
//             }).strength(1));
            
    
//         // Create link lines
//         const link = svg.selectAll(".link")
//             .data(links)
//             .enter()
//             .append("line")
//             .attr("class", "link")
//             .style("stroke", "#ccc")
//             .style("stroke-width", "2px")
//             .attr("marker-end", "url(#arrowhead)");

            
//             const linkText = svg
//             .selectAll('.link-text')
//             .data(transformedLink)
//             .enter() // Enter selection to create new text elements
//             .append('text')
//             // .attr('class', 'link-text')
//             // .text(d => d.value) // Set the text to display the value
//             // .attr('x', d => (d.source.x + d.target.x) / 2) // Position text at the midpoint of the link
//             // .attr('y', d => (d.source.y + d.target.y) / 2)
//             .style('font-size', '10px')
//             .style('fill', '#fff'); 


          

//              // Create circles for the source and target ports
//               const portCircles = svg.selectAll(".port-circle")
//               .data(links)
//               .enter()
//               .append("circle")
//               .attr("class", "port-circle")
//               .attr("r", 5) // Small circles for ports
//               .style("fill", "#ff5722"); // Orange color for port circles

//             // Add labels for the ports at the source and target circles
//             const portLabels = svg.selectAll(".port-label")
//               .data(links)
//               .enter()
//               .append("text")
//               .attr("class", "port-label")
//               .style("font-size", "8px")
//               .style("fill", "#fff");

//               // Create an arrow marker for the middle of each bidirectional link
//               svg.append("defs")
//               .append("marker")
//               .attr("id", "mid-arrowhead")
//               .attr("viewBox", "-0 -5 10 10")
//               .attr("refX", 5)
//               .attr("refY", 0)
//               .attr("orient", "auto")
//               .attr("markerWidth", 6)
//               .attr("markerHeight", 6)
//               .attr("xoverflow", "visible")
//               .append("svg:path")
//               .attr("d", "M 0,-5 L 10 ,0 L 0,5")
//               .attr("fill", "#00f")
//               .style("stroke", "none");



//         // Calculate midpoint arrowhead for bidirectional links
//         const midpointArrow = svg.selectAll(".mid-arrow")
//         .data(links)
//         .enter()
//         .append("line")
//         .attr("class", "mid-arrow")
//         .attr("marker-mid", "url(#mid-arrowhead)")
//         .style("stroke", "none") // Only shows the marker in the middle, no visible line

//         // Create node circles
//             const node = svg.selectAll(".node")
//                 .data(nodes)
//                 .enter()
//                 .append("circle")
//                 .attr("class", "node")
//                 .attr("r", 20)
//                 .style("fill", "#1f77b4")
//                 .style("stroke", "#fff")
//                 .style("stroke-width", "1.5px");
  
//             // const g = svg.append("g")

//             // const node = g.append("g")
//             // .selectAll("g.node")
//             // .data(nodes)
//             // .enter().append("g")
//             // .attr("class", "node");
              

//             //         node.each(function(d) {
//             //           if (d.type === "switch" ) {
                  
//             //             d3.select(this)
//             //             .append("image")
//             //             .attr("href", switchImg) // Use the imported image
//             //             .attr("width", 50)
//             //             .attr("height", 50)
//             //             .attr("x", -25)  // Center the image horizontally
//             //             .attr("y", -25);          
//             //           } else {
//             //             d3.select(this)
//             //             .append("image")
//             //             .attr("href", mac) // Use the imported image
//             //             .attr("width", 50)
//             //             .attr("height", 50)
//             //             .attr("x", -25)  // Center the image horizontally
//             //             .attr("y", -25);
//             //           }
//             //         });
            
//         // Add labels for each node
//         const text = svg.selectAll(".text")
//             .data(nodes)
//             .enter()
//             .append("text")
//             .attr("class", "text")
//             .attr("dx", -5)
//             .attr("dy", 30)
//             .text(d => d.name)
//             .style("font-size", "12px")
//             .style("fill", "#ffff");

    
//     //     // Update node and link positions on each simulation tick
//     //     // simulation.on("tick", () => {
//     //     //     link
//     //     //         .attr("x1", (d: any) => d.source.x)
//     //     //         .attr("y1", (d: any) => d.source.y)
//     //     //         .attr("x2", (d: any) => d.target.x)
//     //     //         .attr("y2", (d: any) => d.target.y);
    
//     //     //     node
//     //     //         .attr("cx", (d: any) => d.x)
//     //     //         .attr("cy", (d: any) => d.y);
    
//     //     //     text
//     //     //         .attr("x", (d: any) => d.x)
//     //     //         .attr("y", (d: any) => d.y);

//     //     //         // Position arrowhead at the midpoint of each bidirectional link
//     //     //     midpointArrow
//     //     //     .attr("x1", (d: any) => (d.source.x + d.target.x) / 2)
//     //     //     .attr("y1", (d: any) => (d.source.y + d.target.y) / 2)
//     //     //     .attr("x2", (d: any) => (d.source.x + d.target.x) / 2)
//     //     //     .attr("y2", (d: any) => (d.source.y + d.target.y) / 2);

//     //     //                  // Position source port circle at 20% along the link (source port)
//     //     //         portCircles
//     //     //         .filter(d => d.source) 
//     //     //         .attr("cx", d => {
//     //     //           return d.source.x + (d.target.x - d.source.x) * 0.2;
//     //     //         })
//     //     //         .attr("cy", d => {
//     //     //           // Calculate position at 20% (source port)
//     //     //           return d.source.y + (d.target.y - d.source.y) * 0.2;
//     //     //         })
//     //     //         .style("fill", "#ff5722"); // Source port circle color

//     //     //       // Position target port circle at 80% along the link (target port)
//     //     //       portCircles
//     //     //         .filter(d => d.target) // Ensure we are positioning the target port circle
//     //     //         .attr("cx", d => {
//     //     //           // Calculate position at 80% (target port)
//     //     //           return d.source.x + (d.target.x - d.source.x) * 0.8;
//     //     //         })
//     //     //         .attr("cy", d => {
//     //     //           // Calculate position at 80% (target port)
//     //     //           return d.source.y + (d.target.y - d.source.y) * 0.8;
//     //     //         })
//     //     //         .style("fill", "#4caf50"); // Target port circle color

//     //     //       // Position source port label near the 20% port circle
//     //     //       portLabels
//     //     //         .filter((d, i) => d.source)
//     //     //         .attr("x", d => {
//     //     //           // Offset label position near 20% port
//     //     //           return d.source.x + (d.target.x - d.source.x) * 0.15 ;
//     //     //         })
//     //     //         .attr("y", d => {
//     //     //           return d.source.y + (d.target.y - d.source.y) * 0.15 - 10;
//     //     //         })
//     //     //         .text(d => d.sourcePort);

//     //     //       // Position target port label near the 80% port circle
//     //     //       portLabels
//     //     //         .filter((d, i) => d.target)
//     //     //         .attr("x", d => {
//     //     //           // Offset label position near 80% port
//     //     //           return d.source.x + (d.target.x - d.source.x) * 0.8;
//     //     //         })
//     //     //         .attr("y", d => {
//     //     //           return d.source.y + (d.target.y - d.source.y) * 0.8 - 10;
//     //     //         })
//     //     //         .text(d => d.targetPort);

//     //     //       linkText
//     //     //         .filter((d, i) => d.source)
//     //     //         .attr('x', d => (d.source.x + d.target.x) / 2)
//     //     //         .attr('y', d => (d.source.y + d.target.y) / 2)
//     //     //         .text(d => d.value);
//     //     // });
        
//     }, [dimensions, links]);
//      //style={{ width: '100%', height: '100%' }}

  return (
    // <div ref={containerRef} > 
    //   <svg ref={svgRef}></svg>
    // </div>
    <div>Hello World</div>
  );
};