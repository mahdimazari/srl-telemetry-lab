import React, { useEffect, useRef, useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import data from './data.json';
import * as d3 from 'd3';
import switchImg from '../../img/Switch1.png';
import mac from '../../img/Macbook-icon.png';


interface Props extends PanelProps<SimpleOptions> { }

export const SimplePanel: React.FC<Props> = ({ options, width, height }) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: width, height: height });

    // State for bandwidth links
    const [linkData, setLinkData] = useState([
      {
        "source": 1,
        "target": 3,
         "bandwidth": "100 Mbps"
      },
      {
        "source": 3,
        "target": 1,
         "bandwidth": "80 Mbps"
      },
      {
        "source": 2,
        "target": 3,
         "bandwidth": "90 Mbps"
      },
      {
        "source": 3,
        "target": 2,
         "bandwidth": "90 Mbps"
      },
      {
        "source": 2,
        "target": 4,
         "bandwidth": "100 Mbps"
      },
      {
        "source": 1,
        "target": 4,
         "bandwidth": "50 Mbps"
      },
      {
        "source": 1,
        "target": 5 
        
      },
      {
        "source": 2,
        "target": 5
      
      },
      {
        "source":3 ,
        "target": 6,
         "bandwidth": "200 Mbps"
      },
       {
        "source": 4,
        "target": 7,
         "bandwidth": "100 Mbps"
      },
      {
        "source": 7,
        "target": 4,
         "bandwidth": "200 Mbps"
      },
      {
        "source": 5,
        "target": 8,
        "bandwidth": "100 Mbps"
      }
    ]);
console.log('test', width, height);

  // Function to simulate changing bandwidth
  const updateBandwidth = () => {
    const newLinkData = linkData.map(link => {
      // Randomly change the bandwidth for simulation
      const newBandwidth = Math.floor(Math.random() * 200) + 10; 
      return { ...link, bandwidth: `${newBandwidth} Mbps` };
    });
    setLinkData(newLinkData); // Update state
  };

  // Use useEffect to set an interval for updating the bandwidth
  useEffect(() => {
    const interval = setInterval(updateBandwidth, 3000); // Update bandwidth every 3 seconds

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
      observer.observe(containerRef.current); // Start observing the container's size
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current); // Cleanup observer on unmount
      }
    };
  }, []);


  useEffect(() => {
    // const margin = { top: 10, right: 10, bottom: 10, left: 10};

    const { width, height } = dimensions;
    // Créer un élément SVG
    const svg = d3.select(svgRef.current)
    .attr("width", width + 200)
    .attr("height", height);


      svg.selectAll("*").remove();

      const scaleX = 1;  // Adjust this to scale width (1 = no scaling, > 1 = increase, < 1 = decrease)
      const scaleY = 1; 
      const g = svg.append("g")
      .attr("class", "graph-container")
      .attr("transform", `scale(${scaleX}, ${scaleY})`);

        // Définir la simulation de force
        const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(linkData).id(d => d.id).distance(120))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX().strength(0.1).x(width / 2))  // Keep nodes centered horizontally
        .force("y", d3.forceY().strength(0.8).y(d => {
          if (d.id <= 2) return height / 6;    // First level (Switches 1 and 2)
          if (d.id <= 5) return height / 2;    // Second level (Switches 3, 4, 5)
          return 5 * height / 6;               // Third level (Hosts 6, 7, 8)
        }));    

    // Charger les données
    // d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then(data => {

        // Define the zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3]) // Set zoom scale limits (min and max zoom)
      .on('zoom', function(event) {
        // Apply the zoom and pan by transforming the group element
        g.attr('transform', event.transform);
        console.log('test');
      });

    // // Apply zoom behavior to the SVG
    svg.call(zoom);


      // Helper function to check for bidirectional links
  const isBidirectional = (link, links) => {
    console.log('test', link.source, link.target, links.some(l => l.source === link.target && l.target === link.source));
    return links.some(l => l.source === link.target && l.target === link.source);
  };

  // Create circles for bidirectional links
  const bidirectionalLinks = linkData.filter(link => isBidirectional(link, linkData));


  
 


 
        // Create a function to split the links into two parts for bidirectional links
        // const splitBidirectionalLinks = linkData.flatMap(link => {
        //   const reverseLink = linkData.find(l => l.source === link.target && l.target === link.source);
        //   if (reverseLink) {
        //     // If the link is bidirectional, return two separate links for each direction
        //     const midpoint = {
        //       x: (link.source.x + link.target.x) / 2,
        //       y: (link.source.y + link.target.y) / 2
        //     };
        //     return [
        //       { source: link.source, target: midpoint, bandwidth: link.bandwidth, direction: 'forward' },
        //       { source: midpoint, target: link.target, bandwidth: reverseLink.bandwidth, direction: 'reverse' }
        //     ];
        //   } else {
        //     // If not bidirectional, return the original link
        //     return [link];
        //   }
        // });

        // // Create the split links
        // const link = g.append("g")
        //   .selectAll("line")
        //   .data(splitBidirectionalLinks)
        //   .enter()
        //   .append("line")
        //   .style("stroke-width", 2)
        //   .style("stroke", d => {
        //     const bandwidth = parseInt(d.bandwidth, 10);
        //     return bandwidth > 150 ? '#FF284B' : 'grey';
        //   });

        

    // const link = g.append("g")
    //   .selectAll("line")
    //   .data(linkData)
    //   .enter()
    //   .append("line")
    //   // .style("stroke", "#996666")
    //   .style("stroke-width", 2)
    //   .style("stroke", d => {
    //     const bandwidth = parseInt(d.bandwidth, 10);
    //     return bandwidth > 150 ? '#FF284B' : 'grey';
    //   });

    const linkGroup = g.append("g").attr("class", "links");


  // Create the links
      linkGroup.selectAll("line")
      .data(linkData)
      .enter()
      .each(function (d) {
          const reverseLink = linkData.find(l => l.source === d.target && l.target === d.source);
          const midpointX = (d.source.x + d.target.x) / 2;
          const midpointY = (d.source.y + d.target.y) / 2;

          if (reverseLink) {
              // If bidirectional, draw two lines

              // First half: from source to midpoint
              d3.select(this)
                  .append("line")
                  .attr("class", "forward-link") // Class for styling later if needed
                  .attr("x1", d.source.x)
                  .attr("y1", d.source.y)
                  .attr("x2", midpointX)
                  .attr("y2", midpointY)
                  .style("stroke", () => {
                      const forwardBandwidth = parseInt(d.bandwidth || 0, 10);
                      return forwardBandwidth > 150 ? '#FF284B' : '#00A5E3';  // Color for source → target direction
                  })
                  .style("stroke-width", 2);

              // Second half: from midpoint to target
              d3.select(this)
                  .append("line")
                  .attr("class", "reverse-link") // Class for styling later if needed
                  .attr("x1", midpointX)
                  .attr("y1", midpointY)
                  .attr("x2", d.target.x)
                  .attr("y2", d.target.y)
                  .style("stroke", () => {
                      const reverseBandwidth = parseInt(reverseLink.bandwidth || 0, 10);
                      return reverseBandwidth > 150 ? '#FF284B' : '#00A5E3';  // Color for target → source direction
                  })
                  .style("stroke-width", 2);
          } else {
              // If unidirectional, draw a single line
              d3.select(this)
                  .append("line")
                  .attr("class", "single-link") // Class for styling later if needed
                  .attr("x1", d.source.x)
                  .attr("y1", d.source.y)
                  .attr("x2", d.target.x)
                  .attr("y2", d.target.y)
                  .style("stroke", () => {
                      const bandwidth = parseInt(d.bandwidth || 0, 10);
                      return bandwidth > 150 ? '#FF284B' : '#00A5E3';  // Color for unidirectional link
                  })
                  .style("stroke-width", 2);
          }
      })
   //   // Initialiser les nœuds
   const node = g.append("g")
   .selectAll("g.node")
   .data(data.nodes)
   .enter().append("g")
   .attr("class", "node");


       // Ajouter des cercles ou rectangles selon le type de port
   node.each(function(d) {
    if (d.type === "switch" ) {

      d3.select(this)
      .append("image")
      .attr("href", switchImg) // Use the imported image
      .attr("width", 50)
      .attr("height", 50)
      .attr("x", -25)  // Center the image horizontally
      .attr("y", -25);          
    } else {
      d3.select(this)
      .append("image")
      .attr("href", mac) // Use the imported image
      .attr("width", 50)
      .attr("height", 50)
      .attr("x", -25)  // Center the image horizontally
      .attr("y", -25);
 
    }
  });


      // Ajouter du texte sur les nœuds
      node.append("text")
      // .style("text-anchor", "middle")
      .attr("y", 15)
      .attr("x", -15)
      .text(function (d) {return d.port})
      .attr("font-size", "6px")
      .attr("fill", "white")
      .style("font-weight", "bold")
      .style("font-size", "7px");

         // Ajouter les flèches
         const arrows = g.append("g")
         .attr("class", "arrows");
 
       arrows.selectAll("path")
         .data(linkData)
         .enter()
         .append("path")
         .attr("class", "arrow")
         .attr("d", "M 0,0 L -5,2.5 L -5,-2.5 Z") // Forme de la flèche
         .style("fill", "grey");
 
         // Ajouter du texte sur les liens
        //  const linkTextGroup = g.append("g").attr("class", "link-texts");
         
         // Create a selection for the link texts
        //  const linkTexts = linkTextGroup.selectAll("text")
        //    .data(linkData)
        //    .enter().append("text")
        //    .text(d => `${d.bandwidth || 'N/A'}`) // Replace with your JSON data
        //    .attr("font-size", "6px")
        //    .attr("fill", "white")
        //    .attr("text-anchor", "start");

           // Ajouter du texte sur les nœuds
      const linkTexts  = g.append("g")
        .selectAll("text")
        .data(linkData)
        .enter()
        .append("text")
        .text(d => `${d.bandwidth || 'N/A'}`)  // Add the bandwidth as text
        .attr("font-size", "6px")
        .attr("fill", "white")
        .attr("text-anchor", "start");  // Align text to the start of the line


            // Draw circles at the midpoint of bidirectional links
          const midpointCircles = g.append("g")
            .selectAll("circle")
            .data(bidirectionalLinks)
            .enter()
            .append("circle")
            .attr("r", 2) // Radius of the circle
            .attr("fill", "grey");

      function ticked() {
        // link
        //   .attr("x1", d => d.source.x)
        //   .attr("y1", d => d.source.y)
        //   .attr("x2", d => d.target.x)
        //   .attr("y2", d => d.target.y);

        // Update positions of unidirectional links
    linkGroup.selectAll(".single-link")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

// Update positions of bidirectional links
linkGroup.selectAll(".forward-link")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => (d.source.x + d.target.x) / 2)
    .attr("y2", d => (d.source.y + d.target.y) / 2);

linkGroup.selectAll(".reverse-link")
    .attr("x1", d => (d.source.x + d.target.x) / 2)
    .attr("y1", d => (d.source.y + d.target.y) / 2)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

        node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    
            // Mettre à jour la position des flèches
            svg.selectAll(".arrow")
            .attr("transform", (d) => {
              const x1 = d.source.x;
              const y1 = d.source.y;
              const x2 = d.target.x;
              const y2 = d.target.y;
  
              const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  
              const arrowLength = 10; // Longueur de la flèche
              const arrowOffset = 58; // Décalage pour positionner la flèche
  
              // Calculer la position de la flèche
              const xArrow = x2 - arrowOffset * Math.cos(angle * Math.PI / 180);
              const yArrow = y2 - arrowOffset * Math.sin(angle * Math.PI / 180);
  
              return `translate(${xArrow}, ${yArrow}) rotate(${angle})`;

              
            });

             // Update position of the midpoint circles
    midpointCircles
    .attr("cx", d => (d.source.x + d.target.x) / 2)
    .attr("cy", d => (d.source.y + d.target.y) / 2);

    linkTexts
    .attr("x", d => {
      const percentage = isBidirectional(d, linkData) ? 0.25 : 0.5;  // 25% for bidirectional, 50% for unidirectional
      return d.source.x + percentage * (d.target.x - d.source.x) + 5;
    })
    .attr("y", d => {
      const percentage = isBidirectional(d, linkData) ? 0.25 : 0.5;  // 25% for bidirectional, 50% for unidirectional
      return d.source.y + percentage * (d.target.y - d.source.y) + 5;
    });

    
      }
    

 

simulation.on("tick", () => {
  ticked();
});

  }, [dimensions, linkData]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};