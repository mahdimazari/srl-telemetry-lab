import React, { useEffect, useRef, useState } from 'react';
import { PanelProps} from '@grafana/data';
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


  
  const [transformedLink, setTransformedLink] =  useState([]);

  const links = dataYml.topology.links.map(link => ({
    source: link.endpoints[0].split(":")[0],
    sourcePort: link.endpoints[0].split(":")[1],
    target: link.endpoints[1].split(":")[0],
    targetPort: link.endpoints[1].split(":")[1]
  }));


    const fetchAndEnrichData = async () => {
    fetchPrometheusData("gnmic_srl_if_traffic_rate_out_bps").then(data => {
      const transformedIn = transformPrometheusData(data);
    console.log('transformed OUT ', transformedIn, links);

   setTransformedLink(links.map(link => {
    // console.log('testOut', transformedIn, links)
    // Find the matching entry in the database where both source and interface match
    const match = transformedIn.links.find(
      entry=>  entry.source === link.source && entry.interface === link.sourcePort)
    // If a match is found, add the value to the link object
    return match
      ? { ...link, valueOut: match.value }
      : link; 
    }));
  });


  fetchPrometheusData("gnmic_srl_if_traffic_rate_in_bps").then(data => {
    const transformedOut = transformPrometheusData(data);
    console.log('transformed IN', transformedOut, links);
    setTransformedLink(links.map(link => {
    //   console.log('test', transformed, link )
      // Find the matching entry in the database where both source and interface match
      const match = transformedOut.links.find(
        entry=>  entry.source === link.source && entry.interface === link.sourcePort)
      // // If a match is found, add the value to the link object
      return match
        ? { ...link, valueIn: match.value }
        : link; 
      }));
    });


}

function formatBits(bits) {
 
  const kb = bits / 1000;       
  const mb = kb / 1000;        

  if (mb >= 1) {
      return `${mb.toFixed(1)} Mb/s`;
  } else {
      return `${kb.toFixed(1)} kb/s`; 
  }
}



   
   useEffect(() => {
    const interval = setInterval(fetchAndEnrichData, 10000); // Update bandwidth every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
 
 
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
  
    // Define grid dimensions
    const grid = {
      spine: { x: width / 2, y: height * 0.2 },
      leaf: { x: width / 2, y: height * 0.5 },
      client: { x: width / 2, y: height * 0.8 },
    };
  
    // Assign positions to nodes based on type and order
    const nodeSpacing = 200; // Space between nodes in the same row
    const structuredNodes = nodes.map((node, index) => {
      const typeNodes = nodes.filter((n) => n.type === node.type);
      const typeIndex = typeNodes.indexOf(node);
      const totalNodes = typeNodes.length;
  
      // Calculate x positions for even spacing
      const x =
        grid[node.type].x - ((totalNodes - 1) * nodeSpacing) / 2 +
        typeIndex * nodeSpacing;
  
      // Y positions are predefined based on type
      const y = grid[node.type].y;
  
      return { ...node, x, y };
    });

    // console.log('links', links);
  
    // Link nodes with the structured layout
    const structuredLinks = links.map((link) => {
      const sourceNode = structuredNodes.find((n) => n.name === link.source);
      const targetNode = structuredNodes.find((n) => n.name === link.target);
        
      const valueOut = transformedLink.find((n) => n.target === link.target || n.source === link.source);
      const valueIn = transformedLink.find((n) => n.target === link.target || n.source === link.source);
      // console.log('value,', value?.value);
      
        return {
          ...link,
          source: sourceNode,
          target: targetNode,
          valueOut:  valueOut?.valueOut || '0.0',
          valueIn: valueIn?.valueIn ||'0.0'
        };
      
    
    });

    console.log('links', links, structuredLinks, transformedLink);

  
    // Draw links
    const link = svg.selectAll(".link")
      .data(structuredLinks)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", "#ccc")
      .style("stroke-width", 2)
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);
  
    // Draw nodes as images
    const node = svg.selectAll(".node")
      .data(structuredNodes)
      .enter()
      .append("image")
      .attr("class", "node")
      .attr("xlink:href", (d) =>
        d.type === "spine" || d.type === "leaf" ? switchImg : mac
      )
      .attr("width", 60)
      .attr("height", 60)
      .attr("x", (d) => d.x - 25) 
      .attr("y", (d) => d.y - 20);
  
    // Add node labels
    const nodeLabel = svg.selectAll(".text")
      .data(structuredNodes)
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("x", (d) => d.x + 35)
      .attr("y", (d) => d.y + 10)
      .text((d) => d.name)
      .style("font-size", "12px")
      .style("fill", "#ffff");


      const portCircles = svg
      .selectAll('.port-circle')
      .data(structuredLinks)
      .enter()
      .append('circle')
      .attr('class', 'port-circle')
      .attr('r', 7);
      // .style('fill', '#ff5722');

      const portCirclesIn = svg
      .selectAll('.port-circle-in')
      .data(structuredLinks)
      .enter()
      .append('circle')
      .attr('class', 'port-circle')
      .attr('r', 7);
      // .style('fill', '#ff5722');

    const portLabels = svg
      .selectAll('.port-label')
      .data(structuredLinks)
      .enter()
      .append('text')
      .attr('class', 'port-label')
      .style('font-size', '8px')
      .style('fill', '#fff');

      const portLabelsIn = svg
      .selectAll('.port-label-in')
      .data(structuredLinks)
      .enter()
      .append('text')
      .attr('class', 'port-label')
      .style('font-size', '8px')
      .style('fill', '#fff');




  
    // Add link bandwidth labels
    svg.selectAll(".linkOut-text")
    .data(structuredLinks)
    .join(
      enter => enter.append("text")
                    .attr("class", "linkOut-text")
                    .style("font-size", "8px")
                    .style("fill", "#fff"),
      update => update,
      exit => exit.remove()
    )
    .text(d => formatBits(d.valueOut))
    .attr("x", d => d.source.x + (d.target.x - d.source.x) * 0.25 - 10)
    .attr("y", d => d.source.y + (d.target.y - d.source.y) * 0.25);


     // Add link bandwidth labels
     svg.selectAll(".linkIn-text")
     .data(structuredLinks)
     .join(
       enter => enter.append("text")
                     .attr("class", "linkIn-text")
                     .style("font-size", "8px")
                     .style("fill", "#fff"),
       update => update,
       exit => exit.remove()
     )
     .text(d => formatBits(d.valueIn))
     .attr("x", d => d.source.x + (d.target.x - d.source.x) * 0.7 - 10)
     .attr("y", d => d.source.y + (d.target.y - d.source.y) * 0.7);



      // simulation.on("tick", () => {

      portCirclesIn
      .filter(d => d.source)
      .attr("cx", d => {
        return d.source.x + (d.target.x - d.source.x) * 0.12;
      })
      .attr("cy", d => {
        return d.source.y + (d.target.y - d.source.y) * 0.12;
      })
      .style("fill", "#4caf50"); // Source port circle color


      portCircles
      .filter(d => d.target) 
      .attr("cx", d => {
      
        return d.source.x + (d.target.x - d.source.x) * 0.9;
      })
      .attr("cy", d => {
        return d.source.y + (d.target.y - d.source.y) * 0.9;
      })
      .style("fill", "#4caf50"); 
      portLabelsIn
      .filter((d, i) => d.source)
      .attr("x", d => {
        return d.source.x + (d.target.x - d.source.x) * 0.12 - 5 ;
      })
      .attr("y", d => {
        return d.source.y + (d.target.y - d.source.y) * 0.12 + 5 ;
      })
      .text(d => d.sourcePort.includes('-') ? d.sourcePort.split('-')[1] : d.sourcePort);

      portLabels
        .filter((d, i) => d.target)
        .attr("x", d => {
          return d.source.x + (d.target.x - d.source.x) * 0.9 - 5;
        })
        .attr("y", d => {
          return d.source.y + (d.target.y - d.source.y) * 0.9 + 5;
        })
        .text(d => d.targetPort.includes('-') ? d.targetPort.split('-')[1] : d.targetPort);


  }, [dimensions, transformedLink]);


  

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}> 
      <svg ref={svgRef} id="co3"> </svg>
    </div>
  );
};
