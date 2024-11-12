
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