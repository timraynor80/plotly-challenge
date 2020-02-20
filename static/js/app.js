function buildCharts(sample) {
    // Make an API call to gather all data and then reduce to matching the sample selected
    //TODO: 
    d3.json("samples.json").then((data) => {
      var filteredSamples = data.samples.filter(s => s.id.toString() === sample)[0];
      console.log(filteredSamples);

      var otuIds = filteredSamples.otu_ids.slice(0,10).reverse();
      console.log(otuIds);

      var sampleValues = filteredSamples.sample_values.slice(0,10).reverse();
      console.log(sampleValues);

      var otuLabels = filteredSamples.otu_labels.slice(0,10).reverse();
      console.log(otuLabels);

      var labels = otuIds.map(d => "OTU " + d)
      console.log(labels)

      var washingFiltered = data.metadata.filter(m => m.id.toString() === sample)[0];
      var washing = washingFiltered.wfreq
      console.log (`washing: ${washing}`)

      var trace = {
        x: sampleValues,
        y: labels,
        text: otuLabels,
        type:"bar",
        orientation: "h"
      };

      var data = [trace]

      var layout = {
        title: "Top 10 OTU",
        // yaxis:{
        //   tickmode:"linear",
        // }
      };

      Plotly.newPlot("bar", data, layout);
    // };


    // The bubble chart
      var trace1 = {
        x: filteredSamples.otu_ids,
        y: filteredSamples.sample_values,
        mode: "markers",
        marker: {
          size: filteredSamples.sample_values,
          color: filteredSamples.otu_ids
        },
        text: filteredSamples.otu_labels
      };
             // set the layout for the bubble plot
      var layout_b = {
        xaxis:{title: "OTU ID"},
        height: 600,
        width: 1000
      };
    
      // creating data variable 
      var data1 = [trace1];
    
      // create the bubble plot
      Plotly.newPlot("bubble", data1, layout_b);

      var degrees = 180 - (washing * 20),
      radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
      var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
      // Path: may have to change to create a better triangle
      var mainPath = path1,
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
      var path = mainPath.concat(pathX,space,pathY,pathEnd);

      var data_g = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 14, color:'850000'},
      showlegend: false,
      name: 'Washings',
      text: washing,
      hoverinfo: 'text+name'},
      { values: [1,1,1,1,1,1,1,1,1,9],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:[  'rgba(45, 87, 0, .5)', 'rgba(61, 110, 9, .5)', 'rgba(85, 140, 27, .5)', 'rgba(139, 207, 105 , .5)',
                         'rgba(175, 240, 105, .5)', 'rgba(208, 245, 166, .5)', 'rgba(225 ,245,166, .5)', 'rgba(245, 239, 166, .5)',
                         'rgba(247, 244, 203, .5)', 'rgba(255, 255, 255, 0.5)']},
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
      }];

      var layout_g = {
      shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
      }],
      title: "Belly Button Washing Frequency",
      // height: 400,
      // width: 400,
      xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
      };

      Plotly.newPlot("gauge", data_g, layout_g);

    })
};

function buildMetadata(sample) {
    // Make an API call to gather all data and then reduce to matching the sample selected
    //TODO: 
    d3.json("samples.json").then((data) => {
      var filteredData = data.metadata.filter(meta => meta.id.toString() === sample)[0];
      // console.log(filteredData);
 
      var chart = d3.select("#sample-metadata")
      chart.html("")
     
      Object.entries(filteredData).forEach(([key, value]) => {
        // console.log(value)
        chart.append("p").text(`${key} : ${value}`);
      });
    });

};

function init() {
    
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);

      // Loop through sampleNames to add "option" elements to the selector
      //TODO: 
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
        });

    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();