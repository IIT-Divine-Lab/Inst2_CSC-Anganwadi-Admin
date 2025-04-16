const CreateGraph = () => {
  // useEffect(() => {
  //   console.log("useEffect 179")
  //   if (urlGraphId && !location.state) {
  //     // If we have a graphId in the URL but no state, we need to load from localStorage
  //     const existingData = localStorage.getItem('GraphData');
  //     if (existingData) {
  //       try {
  //         const parsedData = JSON.parse(existingData);
  //         const graphData = Array.isArray(parsedData)
  //           ? parsedData.find(graph => graph.id === urlGraphId)
  //           : parsedData.id === urlGraphId ? parsedData : null;

  //         if (graphData) {
  //           // Navigate to the same URL but with state this time
  //           navigate(`/edit-graph/${urlGraphId}`, {
  //             state: {
  //               selectedGraph: graphData.selectedGraph,
  //               graphName: graphData.nameOfGraph,
  //               Xaxis: graphData.xAxis,
  //               Yaxis: graphData.yAxis,
  //               Xlabel: graphData.xLabel,
  //               Ylabel: graphData.yLabel,
  //               Zaxis: graphData.zAxis,
  //               Zlabel: graphData.zLabel,
  //               filters: graphData.filters,
  //               graphId: graphData.id,
  //               description: graphData.description
  //             },
  //             replace: true // Replace the current entry in the history stack
  //           });
  //         }
  //       } catch (error) {
  //         console.error('Error parsing graph data from localStorage:', error);
  //       }
  //     }
  //   }
  // }, [urlGraphId, location, navigate]);

  // useEffect(() => {
  //   console.log("useEffect 224")
  //   if (graphSaved) {
  //     const currentState = {
  //       selectedGraph,
  //       graphName,
  //       Xaxis,
  //       Yaxis,
  //       Xlabel,
  //       Ylabel,
  //       Zaxis,
  //       Zlabel,
  //       filters,
  //       description: savedDescription,
  //     };

  //     // Check if any property is different
  //     const hasChanges = Object.keys(initialState).some(key => {
  //       if (key === 'filters') {
  //         // Special handling for array comparison
  //         return JSON.stringify(initialState[key]) !== JSON.stringify(currentState[key]);
  //       }
  //       return initialState[key] !== currentState[key];
  //     });

  //     setHasUnsavedChanges(hasChanges);
  //   }
  // }, [selectedGraph, graphName, Xaxis, Yaxis, Xlabel, Ylabel, Zaxis, Zlabel, filters, savedDescription, graphSaved, initialState]);

  // // Add the delete handler
  // const handleDeleteClick = () => {
  //   console.log("handleDeleteClick")
  //   setShowDeleteModal(true);
  // };

  // const handleDeleteConfirm = () => {
  //   console.log("handleDeleteConfirm")
  //   if (!graphId) return;

  //   try {
  //     // Get existing graphs from localStorage
  //     const existingData = localStorage.getItem('GraphData');

  //     if (existingData) {
  //       // Parse the stored data
  //       const parsedData = JSON.parse(existingData);

  //       // Handle both array and object formats
  //       if (Array.isArray(parsedData)) {
  //         // Filter out the graph to delete
  //         const updatedGraphs = parsedData.filter(graph => graph.id !== graphId);

  //         // Save the updated array back to localStorage
  //         localStorage.setItem('GraphData', JSON.stringify(updatedGraphs));
  //       } else if (parsedData.id === graphId) {
  //         // If the only graph is being deleted, remove the item completely
  //         localStorage.removeItem('GraphData');
  //       }

  //       // Navigate back to the graph list
  //       navigate('/graph-list');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting graph:', error);
  //   } finally {
  //     setShowDeleteModal(false);
  //   }
  // };

  // // Parameter mapping from ParaSidebar to data fields
  // const parameterMapping = {
  //   "State": "state",
  //   "District": "district",
  //   "Centre Code": "center",
  //   "Block": "block",
  //   "School Type": "type",
  //   "Age Group": "age",
  //   "Gender": "gender"
  // };

  // // Get the correct field name for the X-axis
  // const xAxisField = parameterMapping[Xaxis] || "state";

  // useEffect(() => {
  //   console.log("useEffect 307")
  //   // If we have an existing graphId, load saved description
  //   if (initialGraphId && !isDuplicating) {
  //     const existingData = localStorage.getItem('GraphData');
  //     if (existingData) {
  //       const parsedData = JSON.parse(existingData);
  //       const existingGraph = Array.isArray(parsedData)
  //         ? parsedData.find(graph => graph.id === initialGraphId)
  //         : parsedData.id === initialGraphId ? parsedData : null;

  //       if (existingGraph) {
  //         setSavedDescription(existingGraph.description || "");
  //       }
  //     }
  //   } else if (initialDescription) {
  //     // If we have a description passed directly in state
  //     setSavedDescription(initialDescription);
  //   }
  // }, [initialGraphId, initialDescription, isDuplicating]);

  // const updateGraphData = useCallback((data) => {
  //   console.log("updateGraphData")
  //   if (!data.length) return;

  //   // Apply filters if any
  //   let filteredData = data;
  //   if (filters.length > 0) {
  //     filteredData = data.filter((student) =>
  //       filters.every((filter) =>
  //         Object.values(student).some((value) =>
  //           String(value).toLowerCase().includes(filter.toLowerCase())
  //         )
  //       )
  //     );
  //   }

  //   // Count unique occurrences of the selected parameter
  //   const uniqueValues = {};
  //   filteredData.forEach(student => {
  //     const value = student[xAxisField] || "Unknown";
  //     uniqueValues[value] = (uniqueValues[value] || 0) + 1;
  //   });

  //   // Sort data by count (descending)
  //   const sortedEntries = Object.entries(uniqueValues).sort((a, b) => b[1] - a[1]);
  //   const sortedLabels = sortedEntries.map(entry => entry[0]);
  //   const sortedValues = sortedEntries.map(entry => entry[1]);

  //   setGraphData({
  //     labels: sortedLabels,
  //     values: sortedValues
  //   });
  // }, [filters, xAxisField]);

  // useEffect(() => {
  //   console.log("useeffect 362")

  //   const fetchStudentData = async () => {
  //     try {
  //       const response = await fetch("/studentData.json");
  //       if (!response.ok) throw new Error("Failed to fetch student data");

  //       const data = await response.json();

  //       // Process the awcentre field into separate components
  //       const processedData = data.map((student) => {
  //         const [state, district, code, block, type] = (student.awcentre || "").split(" - ");
  //         return {
  //           ...student,
  //           state: state || "Unknown",
  //           district: district || "Unknown",
  //           center: code || "Unknown",
  //           block: block || "Unknown",
  //           type: type || "Unknown",
  //           age: student.age || "Unknown",
  //           gender: student.gender || "Unknown",
  //           rollno: student.rollno || 0,
  //         };
  //       });

  //       setStudentData(processedData);
  //       updateGraphData(processedData);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStudentData();
  // }, [xAxisField, updateGraphData]);

  // // console.log(graphType)

  // useEffect(() => {
  //   console.log("useeffect 402")
  //   if (studentData.length > 0) {
  //     updateGraphData(studentData);
  //   }
  // }, [filters, studentData, xAxisField, updateGraphData]);

  // const handleRemoveFilter = (filterToRemove) => {
  //   console.log("handleRemoveFilter")
  //   const updatedFilters = filters.filter(filter => filter !== filterToRemove);
  //   setFilters(updatedFilters);
  // };

  // const handleExport = (format) => {
  //   console.log("handleExport")
  //   if (chartRef.current) {
  //     try {
  //       // Get the chart instance
  //       const chartInstance = chartRef.current;

  //       if (format === 'png') {
  //         // Convert the chart to a base64 image
  //         const imageData = chartInstance.toBase64Image('image/png', 1.0);

  //         // Create a temporary link element
  //         const downloadLink = document.createElement('a');
  //         downloadLink.href = imageData;
  //         downloadLink.download = `${graphName || 'graph'}.png`;

  //         // Trigger the download
  //         document.body.appendChild(downloadLink);
  //         downloadLink.click();
  //         document.body.removeChild(downloadLink);
  //         console.log('PNG export completed');
  //       } else if (format === 'pdf') {
  //         // Create a new PDF document
  //         const pdf = new jsPDF('landscape', 'mm', 'a4');

  //         // Add title to PDF
  //         const title = graphName || `Distribution of ${Xaxis}`;
  //         pdf.setFontSize(16);
  //         pdf.text(title, 20, 20);

  //         // Convert the chart to a base64 image
  //         const imageData = chartInstance.toBase64Image('image/png', 1.0);

  //         // Add the image to the PDF
  //         pdf.addImage(imageData, 'PNG', 20, 30, 250, 150);

  //         // Add metadata
  //         pdf.setFontSize(10);
  //         pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 190);
  //         pdf.text(`Showing ${graphData.labels.length} unique ${Xaxis} values`, 20, 195);

  //         // Save the PDF
  //         pdf.save(`${graphName || 'graph'}.pdf`);
  //         console.log('PDF export completed');
  //       }
  //     } catch (error) {
  //       console.error('Error exporting chart:', error);
  //       alert('Failed to export chart. Please try again.');
  //     }
  //   } else {
  //     console.error('Chart reference is not available');
  //     alert('Chart reference is not available. Please try again.');
  //   }
  // };

  // const handleSaveClick = () => {
  //   console.log("handleSaveClick")
  //   setShowSaveModal(true);
  // };

  // const handleEditClick = () => {
  //   console.log("handleEditClick")
  //   // Navigate back to the select-parameter page with all the current parameters
  //   navigate('/select-parameter', {
  //     state: {
  //       selectedGraph,
  //       graphName,
  //       Xaxis,
  //       Yaxis,
  //       Xlabel,
  //       Ylabel,
  //       Zaxis,
  //       Zlabel,
  //       filters,
  //       graphId, // Pass the existing graphId for updating
  //       savedDescription, // Pass the saved description
  //     }
  //   });
  // };

  // const handleSaveGraph = ({ graphName, description }) => {
  //   console.log("handleSaveGraph")
  //   // Create a new ID if it's a new graph or being duplicated
  //   const newId = graphId && !isDuplicating ? graphId : uuidv4();

  //   // Update state with the new values
  //   const displayName = isDuplicating ? `${graphName} (COPY)` : graphName;
  //   const savedName = graphName;

  //   setGraphName(displayName);
  //   setSavedDescription(description);
  //   setGraphSaved(true);
  //   setGraphId(newId);

  //   // Create the graph object to save
  //   const graphToSave = {
  //     id: newId,
  //     nameOfGraph: savedName,
  //     description: description,
  //     selectedGraph: graphType || selectedGraph || "Bar Graph",
  //     xAxis: Xaxis,
  //     yAxis: Yaxis,
  //     xLabel: Xlabel,
  //     yLabel: Ylabel,
  //     zAxis: Zaxis,
  //     zLabel: Zlabel,
  //     filters: filters,
  //     createdAt: new Date().toISOString(),
  //     lastModified: new Date().toISOString(),
  //   };

  //   // Get existing graphs from localStorage
  //   const existingData = localStorage.getItem('GraphData');
  //   let graphsArray = [];

  //   if (existingData) {
  //     graphsArray = JSON.parse(existingData);

  //     // If updating an existing graph (not duplicating)
  //     if (graphId && !isDuplicating) {
  //       // Find and update the existing graph
  //       const index = graphsArray.findIndex(graph => graph.id === graphId);
  //       if (index !== -1) {
  //         graphsArray[index] = graphToSave;
  //       } else {
  //         // If not found, add as new
  //         graphsArray.push(graphToSave);
  //       }
  //     } else {
  //       // Add as a new graph
  //       graphsArray.push(graphToSave);
  //     }
  //   } else {
  //     // First graph being saved
  //     graphsArray = [graphToSave];
  //   }

  //   // Save to localStorage
  //   localStorage.setItem('GraphData', JSON.stringify(graphsArray));

  //   // Reset duplicating flag
  //   setIsDuplicating(false);

  //   // If we were duplicating, navigate to the parameter page with the new graph data
  //   if (isDuplicating) {
  //     navigate('/select-parameter', {
  //       state: {
  //         selectedGraph,
  //         graphName: savedName,
  //         Xaxis,
  //         Yaxis,
  //         Xlabel,
  //         Ylabel,
  //         Zaxis,
  //         Zlabel,
  //         filters,
  //         graphId: newId,
  //         savedDescription: description,
  //       }
  //     });
  //   } else if (!graphId) {
  //     // If it was a new graph (not duplicating and no previous ID), update the URL
  //     navigate(`/edit-graph/${newId}`, {
  //       state: location.state,
  //       replace: true
  //     });
  //   }
  // };

  // const handleDuplicateClick = () => {
  //   console.log("handleDuplicateClick")
  //   // Set duplicating flag to create a new graph
  //   setIsDuplicating(true);

  //   // Clear graphId to make it a new graph
  //   setGraphId(null);
  //   setGraphSaved(false);

  //   // Immediately update the graph name to show (COPY) in the UI
  //   const duplicatedName = `${graphName || `Distribution of ${Xaxis}`} (COPY)`;
  //   setGraphName(duplicatedName);

  //   // Clear the description for the new copy
  //   setSavedDescription("");

  //   // Show save modal to confirm
  //   setShowSaveModal(true);
  // };

  // // Then modify the SaveGraphModal component to pre-populate with the original name (without COPY)
  // // Update the graphTitle prop in the SaveGraphModal component call
  // <SaveGraphModal
  //   isOpen={showSaveModal}
  //   onClose={() => {
  //     setShowSaveModal(false);

  //     // Reset the title if the user cancels the duplicate operation
  //     if (isDuplicating) {
  //       // If user cancels, revert to the original title
  //       const originalTitle = graphName.replace(" (COPY)", "");
  //       setGraphName(originalTitle);
  //       setIsDuplicating(false);
  //     }
  //   }}
  //   onSave={handleSaveGraph}
  //   // Remove the (COPY) part when showing in the save modal
  //   graphTitle={isDuplicating ? graphName.replace(" (COPY)", "") : graphName || `Distribution of ${Xaxis}`}
  //   graphType={graphType || selectedGraph || "Bar Graph"}
  //   xAxis={Xaxis}
  //   yAxis={Yaxis}
  //   filterCount={filters.length}
  //   description={isDuplicating ? "" : savedDescription} // Don't show description if duplicating
  // />

  // const handleGoBack = () => {
  //   console.log("handleGoBack")
  //   // Check if there are unsaved changes or important parameters selected
  //   if (graphName || Xaxis || Yaxis || Zaxis || filters.length > 0) {
  //     const confirmNavigation = window.confirm(
  //       "Are you sure you want to go back? Any unsaved progress will be lost. Please save your graph first if you want to keep it."
  //     );
  //     if (confirmNavigation) {
  //       navigate('/graph-list'); // Navigate to graph list or appropriate page
  //     }
  //   } else {
  //     navigate('/graph-list'); // No changes to save, just go back
  //   }
  // };




  // const backgroundColors = [
  //   "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
  //   "#FF9F40", "#FFCD56", "#C9CBCF", "#4D5360", "#F7464A",
  //   "#8BC34A", "#D32F2F", "#1976D2", "#FBC02D", "#7B1FA2",
  //   "#388E3C", "#FFA000", "#E64A19", "#0288D1", "#C2185B",
  //   "#009688", "#673AB7"
  // ];

  // // Ensure the colors array matches the number of data points dynamically
  // const dynamicBackgroundColors = graphData.labels.map((_, index) =>
  //   backgroundColors[index % backgroundColors.length]
  // );

  // const chartData2d = {
  //   labels: graphData.labels,
  //   datasets: [
  //     {
  //       label: `${Xlabel || Xaxis}`,
  //       data: graphData.values,
  //       borderColor: "rgb(99, 102, 241)",
  //       backgroundColor: dynamicBackgroundColors,
  //       borderWidth: graphType === "line" ? 2 : 1,
  //       tension: 0.1,
  //     },
  //   ],
  // };

  // const chartOptions2d = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //       labels: {
  //         boxWidth: 20,
  //         usePointStyle: true,
  //         padding: 20
  //       }
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: (context) => {
  //           return `Count: ${context.parsed.y}`;
  //         }
  //       }
  //     }
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: Xlabel || Xaxis
  //       },
  //       grid: {
  //         display: false
  //       }
  //     },
  //     y: {
  //       title: { display: true, text: Ylabel },
  //       beginAtZero: true,
  //       ticks: {
  //         precision: 0
  //       }
  //     },
  //   },
  // };

  // const chartData1d = {
  //   labels: graphData.labels,
  //   datasets: [
  //     {
  //       label: `${Xaxis}`,
  //       data: graphData.values,
  //       backgroundColor: dynamicBackgroundColors,
  //     },
  //   ],
  // };

  // const chartOptions1d = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: true, // Ensure legend is displayed
  //       position: "right", // Positions the legend (top, bottom, left, right)
  //       labels: {
  //         font: {
  //           size: 14, // Adjust font size
  //         },
  //         color: "#333", // Legend text color
  //         padding: 20, // Space between legend items
  //       },
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: (context) => {
  //           return `${context.label}: ${context.raw}`;
  //         },
  //       },
  //     },
  //   },
  // };



  // if (loading) return <div className="min-h-screen flex items-center justify-center">
  //   <p className="text-gray-600">Loading student data...</p>
  // </div>;

  // if (error) return <div className="min-h-screen flex items-center justify-center">
  //   <p className="text-red-500">Error: {error}</p>
  // </div>;

  // if (!graphData.labels.length) return <div className="min-h-screen flex items-center justify-center">
  //   <p className="text-gray-600">No data available for the selected parameters.</p>
  // </div>;

  return (
    <>
    </>
  );
};

export default CreateGraph;