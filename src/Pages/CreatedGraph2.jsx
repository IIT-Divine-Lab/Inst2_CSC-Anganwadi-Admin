import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
// eslint-disable-next-line
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, } from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

import ActionSidebar from "../Components/ActionSiderbar";
import SaveGraphModal from "./SaveGraphModal";
import jsPDF from "jspdf";
import DeleteGraphModal from "./DeleteGraphModal";

import Arrow from '../data/images/go-back-arrow.png'
import axios from 'axios';
import adminApiUrl from '../adminApiUrl';
import data from "../data/AnganwadiCentreData.json"

ChartJS.register(CategoryScale, ArcElement, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const CreatedGraph2 = ({ selectedGraph, setSelectedGraph, graphName, setGraphName, Xaxis, setXAxis, setYAxis, Yaxis, Xlabel, setXlabel, setYlabel, savedDescription = "", setSavedDescription, Ylabel, filters, isDuplicating, setIsDuplicating, isEditing: isGraphEditing, setIsEditing, setFilters }) => {
  // Parameter mapping from ParaSidebar to data fields
  const parameterMapping = useMemo(() => ({
    "State": "state",
    "District": "district",
    "Centre Code": "center",
    "Block": "block",
    "School Type": "type",
    "Age Group": "age",
    "Gender": "gender"
  }), []);

  const filterValues = {
    "State": [...new Set(data.map(item => item.state))],
    "District": [...new Set(data.map(item => item.district))],
    "Centre Code": [...new Set(data.map(item => item.awcentre.split(" - ")[0]))],
    "Block": [...new Set(data.map(item => item.awcentre.split(" - ")[1]))],
    "School Type": [...new Set(data.map(item => item.awcentre.split(" - ")[2]))],
    "Age Group": ["3-4", "4-5", "5-6"],
    "Gender": ["male", "female"]
  }

  const location = useLocation();
  const id = location.state?.id;

  const navigate = useNavigate();

  const chartRef = useRef(null);

  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [mode, setMode] = useState("add");
  const [savedGraphDetails, setSavedGraphDetails] = useState();
  const [showSaveModal, setShowSaveModal] = useState(false);
  // eslint-disable-next-line
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // eslint-disable-next-line
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [graphType, setGraphType] = useState(null);
  const [graphSaved, setGraphSaved] = useState(false);
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (selectedGraph) {
      setGraphType(selectedGraph);
    }
  }, [selectedGraph]);

  const handleGoBack = () => {
    console.log("handleGoBack")
    // Check if there are unsaved changes or important parameters selected
    console.log("Graph Name: ", graphName)
    console.log("X Axis: ", Xaxis)
    console.log("Y Axis: ", Yaxis)
    console.log("Filters: ", filters.length)
    // console.log("Filters: ",)
    if ((graphName || Xaxis || Yaxis || filters.length > 0) && !graphSaved) {
      const confirmNavigation = window.confirm(
        "Are you sure you want to go back? Any unsaved progress will be lost. Please save your graph first if you want to keep it."
      );
      if (confirmNavigation) {
        setSelectedGraph("Line Graph")
        setXAxis(null)
        setYAxis(null)
        setXlabel(null)
        setYlabel(null)
        setActiveFilters([]);
        navigate('/'); // Navigate to graph list or appropriate page
      }
    } else {
      setSelectedGraph("Line Graph")
      setXAxis(null)
      setYAxis(null)
      setXlabel(null)
      setYlabel(null)
      navigate('/'); // No changes to save, just go back
    }
  };

  const handleDeleteClick = () => {
    console.log("handleDeleteClick")
    setShowDeleteModal(true);
  };

  const handleExport = (format) => {
    console.log("handleExport")
    if (chartRef.current) {
      try {
        // Get the chart instance
        const chartInstance = chartRef.current;

        if (format === 'png') {
          // Convert the chart to a base64 image
          const imageData = chartInstance.toBase64Image('image/png', 1.0);

          // Create a temporary link element
          const downloadLink = document.createElement('a');
          downloadLink.href = imageData;
          downloadLink.download = `${graphName || 'graph'}.png`;

          // Trigger the download
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          console.log('PNG export completed');
        } else if (format === 'pdf') {
          // Create a new PDF document
          const pdf = new jsPDF('landscape', 'mm', 'a4');

          // Add title to PDF
          const title = graphName || `Distribution of ${Xaxis}`;
          pdf.setFontSize(16);
          pdf.text(title, 20, 20);

          // Convert the chart to a base64 image
          const imageData = chartInstance.toBase64Image('image/png', 1.0);

          // Add the image to the PDF
          pdf.addImage(imageData, 'PNG', 20, 30, 250, 150);

          // Add metadata
          pdf.setFontSize(10);
          pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 190);
          pdf.text(`Showing ${graphData.labels.length} unique ${Xaxis} values`, 20, 195);

          // Save the PDF
          pdf.save(`${graphName || 'graph'}.pdf`);
          console.log('PDF export completed');
        }
      } catch (error) {
        console.error('Error exporting chart:', error);
        alert('Failed to export chart. Please try again.');
      }
    } else {
      console.error('Chart reference is not available');
      alert('Chart reference is not available. Please try again.');
    }
  };

  const handleSaveClick = () => {
    console.log("handleSaveClick")
    setShowSaveModal(true);
  };

  const updateGraphData = async (filtersToPass) => {
    try {
      let url = `dashboard/getUnsavedGraph/${parameterMapping[Xlabel]}?`

      if (Yaxis) {
        url += `yAxis=${parameterMapping[Ylabel]}&`
      }
      console.log(selectedGraph)
      console.log(filtersToPass)

      if (Object.keys(filtersToPass).length !== 0) {
        url += `filters=${JSON.stringify(filtersToPass)}`
      }
      console.log("filter to pass", filtersToPass)
      console.log(url)

      axios.get(adminApiUrl + url)
        .then(({ data }) => {
          const rawData = data.data;
          const backgroundColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

          if (Object.keys(filtersToPass).length !== 0) {

            // console.log(filtersToPass)
            // console.log(filters)
            // console.log(activeFilters)

            // setActiveFilters(filters)
          }

          if ((!selectedGraph.includes("Pie") && !selectedGraph.includes("Donut"))) {

            // 1. Unique districts (yAxis) become labels
            const states = [...new Set(rawData.map(item => item.xAxis))];

            const districts = [...new Set(rawData.map(item => item.yAxis))];

            // 3. Prepare datasets grouped by state
            const datasets = districts.map((district, index) => {
              return {
                label: district,
                data: states.map(state => {
                  const entry = rawData.find(d => d.xAxis === state && d.yAxis === district);
                  return entry ? entry.value : 0;
                }),
                backgroundColor: backgroundColors[index % backgroundColors.length]
              };
            });
            setGraphData({ labels: states, datasets })
          }
          else {
            const valueMap = {};

            rawData.forEach(({ xAxis, value }) => {
              if (!valueMap[xAxis]) {
                valueMap[xAxis] = 0;
              }
              valueMap[xAxis] += value;
            });

            // 2. Extract labels and values
            const labels = Object.keys(valueMap);
            const values = Object.values(valueMap);

            // 3. Optional: Dynamic colors
            const dynamicBackgroundColors = labels.map(
              (_, i) => backgroundColors[i % backgroundColors.length]
            );
            setGraphData({
              labels, datasets: [
                {
                  label: '',
                  data: values,
                  backgroundColors: dynamicBackgroundColors
                }
              ]
            })
          }
          console.log(rawData);
        })
        .catch((error) => {
          console.error(error)
        })
    }
    catch (error) {
      console.error(error);
    }
  }

  const initialDataCall = useCallback(async () => {
    try {
      let url = `dashboard/getUnsavedGraph/${parameterMapping[Xlabel]}?`

      if (Ylabel) {
        url += `yAxis=${parameterMapping[Ylabel]}`
      }

      axios.get(adminApiUrl + url)
        .then(({ data }) => {
          const rawData = data.data;
          const backgroundColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

          // if (Object.keys(filtersToPass).length !== 0) {
          setActiveFilters(filters)
          // }

          if ((!selectedGraph.includes("Pie") && !selectedGraph.includes("Donut"))) {

            // 1. Unique districts (yAxis) become labels
            const states = [...new Set(rawData.map(item => item.xAxis))];

            const districts = [...new Set(rawData.map(item => item.yAxis))];

            // 3. Prepare datasets grouped by state
            const datasets = districts.map((district, index) => {
              return {
                label: district,
                data: states.map(state => {
                  const entry = rawData.find(d => d.xAxis === state && d.yAxis === district);
                  return entry ? entry.value : 0;
                }),
                backgroundColor: backgroundColors[index % backgroundColors.length]
              };
            });
            setGraphData({ labels: states, datasets })
          }
          else {
            const valueMap = {};

            rawData.forEach(({ xAxis, value }) => {
              if (!valueMap[xAxis]) {
                valueMap[xAxis] = 0;
              }
              valueMap[xAxis] += value;
            });

            // 2. Extract labels and values
            const labels = Object.keys(valueMap);
            const values = Object.values(valueMap);

            // 3. Optional: Dynamic colors
            const dynamicBackgroundColors = labels.map(
              (_, i) => backgroundColors[i % backgroundColors.length]
            );
            setGraphData({
              labels, datasets: [
                {
                  label: '',
                  data: values,
                  backgroundColors: dynamicBackgroundColors
                }
              ]
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    catch (error) {
      console.error(error);
    }
  }, [Xaxis, Yaxis, filters, parameterMapping, selectedGraph])

  useEffect(() => {
    // console.log(!graphData?.labels?.length, !graphData?.datasets?.length)
    if (!id && (!graphData?.labels?.length || !graphData?.datasets?.length)) {
      initialDataCall()
    }
  }, [graphData, initialDataCall, id])

  const handleSaveGraph = ({ graphName, description }) => {
    const dataToSave = {
      type: selectedGraph,
      name: graphName,
      desc: description,
      details: {
        Xaxis: parameterMapping[Xaxis],
        Xlabel,
        filters
      }
    }
    if ((!selectedGraph.includes("Pie") && !selectedGraph.includes("Donut"))) {
      dataToSave.details = {
        ...dataToSave.details,
        Yaxis: parameterMapping[Yaxis],
        Ylabel
      }
    }

    axios.post(adminApiUrl + `dashboard/`, dataToSave)
      .then(({ data }) => {
        console.log(data)
        setGraphSaved(true)
        setIsDuplicating(false);
        setSavedGraphDetails(data?.graph)
        setSavedDescription(description)
      })
      .catch((error) => {
        console.error(error);
      })
  }

  const fetchGraphDataById = useCallback(async () => {
    axios.get(adminApiUrl + `dashboard/graph/${id}`)
      .then(({ data }) => {
        const rawData = data.data;
        const graphDetails = data.graphData._doc
        const backgroundColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57'];

        // if (Object.keys(filtersToPass).length !== 0) {
        setActiveFilters(graphDetails?.details.filters)
        // }

        // setFilters(graphDetails?.details.filters);
        setGraphName(graphDetails?.name);
        setGraphSaved(true);
        setSavedDescription(graphDetails.desc);
        setSelectedGraph(graphDetails.type)
        setXlabel(graphDetails.details.Xlabel);
        setYlabel(graphDetails.details.Ylabel);
        setXAxis(graphDetails.details.Xaxis);
        setYAxis(graphDetails.details.Yaxis);

        if ((!selectedGraph.includes("Pie") && !selectedGraph.includes("Donut"))) {

          // 1. Unique districts (yAxis) become labels
          const states = [...new Set(rawData.map(item => item.xAxis))];

          const districts = [...new Set(rawData.map(item => item.yAxis))];

          // 3. Prepare datasets grouped by state
          const datasets = districts.map((district, index) => {
            return {
              label: district,
              data: states.map(state => {
                const entry = rawData.find(d => d.xAxis === state && d.yAxis === district);
                return entry ? entry.value : 0;
              }),
              backgroundColor: backgroundColors[index % backgroundColors.length]
            };
          });
          console.log({ labels: states, datasets })
          setGraphData({ labels: states, datasets })
        }
        else {
          const valueMap = {};

          rawData.forEach(({ xAxis, value }) => {
            if (!valueMap[xAxis]) {
              valueMap[xAxis] = 0;
            }
            valueMap[xAxis] += value;
          });

          // 2. Extract labels and values
          const labels = Object.keys(valueMap);
          const values = Object.values(valueMap);

          // 3. Optional: Dynamic colors
          const dynamicBackgroundColors = labels.map(
            (_, i) => backgroundColors[i % backgroundColors.length]
          );
          setGraphData({
            labels, datasets: [
              {
                label: '',
                data: values,
                backgroundColors: dynamicBackgroundColors
              }
            ]
          })
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }, [filters, id, selectedGraph, setSavedDescription, setGraphName, setSelectedGraph, setXAxis, setYAxis, setXlabel, setYlabel])

  useEffect(() => {
    if (id) {
      setMode("edit");
      fetchGraphDataById()
    }
  }, [id, fetchGraphDataById])

  const chartData2d = {
    labels: graphData.labels,
    datasets: graphData.datasets,
  };

  const chartOptions2d = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 20,
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Count: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: Xlabel || Xaxis
        },
        grid: {
          display: false
        }
      },
      y: {
        title: { display: true, text: Ylabel },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
    },
  };

  const chartData1d = {
    labels: graphData.labels,
    datasets: graphData.datasets
  };

  const chartOptions1d = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // Ensure legend is displayed
        position: "right", // Positions the legend (top, bottom, left, right)
        labels: {
          font: {
            size: 14, // Adjust font size
          },
          color: "#333", // Legend text color
          padding: 20, // Space between legend items
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  async function handleDeleteConfirm(e) {
    const isEditing = mode === "edit";

    const idToDelete = isEditing ? id : savedGraphDetails?._id

    try {
      const response = await axios.delete(adminApiUrl + `dashboard/graph/${idToDelete}`)

      const { data } = response;

      if (response.status === 200) {
        navigate("/");
      }

      console.log(data);

    } catch (error) {
      return alert("Error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <button className="w-fit text-gray-600 font-semibold hover:cursor-pointer">
            <div
              className="flex items-center gap-2"
              onClick={handleGoBack}
            >
              <img src={Arrow} alt="Back Arrow" /> Go Back
            </div>
          </button>
        </div>


        <div className="text-center mb-8">
          <h1 className="text-xl text-indigo-600 font-medium">
            {graphName || `Distribution of ${Xaxis}`}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
              </div>
              <div className="flex gap-2 flex-wrap">
                {
                  activeFilters.map((filter, index) => (
                    <select
                      onChange={(e) => e.currentTarget.value !== "all" ? updateGraphData({
                        [parameterMapping[filter]]: [e.currentTarget.value]
                      }) : updateGraphData({})}
                      key={index}
                      className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-sm text-indigo-600"
                    >
                      <option value={"all"}>All</option>
                      {
                        filterValues[filter].map((val, index) => (
                          <option value={val}>{val}</option>
                        ))
                      }
                    </select>
                  ))
                }
              </div>
            </div>

            <div className="h-[400px]">
              {graphType === "Line Graph" && <Line ref={chartRef} options={chartOptions2d} data={chartData2d} />}
              {graphType === "Bar Graph" && <Bar ref={chartRef} options={chartOptions2d} data={chartData2d} />}
              {graphType === "Pie Graph" && <Pie ref={chartRef} data={chartData1d} options={chartOptions1d} />}
              {graphType === "Doughnut Graph" && <Doughnut ref={chartRef} data={chartData1d} options={chartOptions1d} />}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {`Showing ${graphData?.labels?.length} unique ${Xaxis} values`}
            </div>
          </div>

          <ActionSidebar
            onExport={handleExport}
            onSave={handleSaveClick}
            // onEdit={handleEditClick}
            onDuplicate={() => {
              setIsDuplicating(true)
              setSelectedGraph(selectedGraph)
              setXAxis(Xaxis)
              setXlabel(Xlabel)
              console.log(savedGraphDetails);
              setGraphName(mode === "edit" ? graphName : savedGraphDetails?.name);
              setYAxis(Yaxis)
              setYlabel(Ylabel)
              setFilters(activeFilters)
              navigate("/select-parameter")
            }}
            onEdit={() => {
              setIsEditing(true)
              setSelectedGraph(selectedGraph)
              setXAxis(Xaxis)
              setXlabel(Xlabel)
              console.log(savedGraphDetails);
              setGraphName(mode === "edit" ? graphName : savedGraphDetails?.name);
              setYAxis(Yaxis)
              setYlabel(Ylabel)
              setFilters(activeFilters)
              navigate("/select-parameter", { state: { id: mode === "edit" ? id : savedGraphDetails?._id } })
            }}
            onDelete={handleDeleteClick}
            savedDescription={savedDescription}
            graphSaved={graphSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>
      </div>

      {/* Save Graph Modal */}
      <SaveGraphModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setIsDuplicating(false); // Reset duplicating flag if modal is closed
        }}
        onSave={handleSaveGraph}
        graphTitle={isDuplicating ? `${graphName}` : graphName || `Distribution of ${Xaxis}`}
        graphType={graphType || selectedGraph || "Bar Graph"}
        xAxis={Xaxis}
        yAxis={Yaxis}
        filterCount={filters.length}
        description={isDuplicating ? "" : savedDescription} // Don't show description if duplicating
      />
      <DeleteGraphModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteConfirm}
        graphTitle={graphName || `Distribution of ${Xaxis}`}
      />
    </div >
  )
}

export default CreatedGraph2