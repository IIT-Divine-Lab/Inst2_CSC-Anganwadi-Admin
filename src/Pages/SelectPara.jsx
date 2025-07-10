import React, { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
import Arrow from '../data/images/go-back-arrow.png'
import Cross from '../data/images/cross.png'
import YaxisImg from '../data/images/y-axis.png'
import XaxisImg from '../data/images/x-axis.png'
import ParaSidebar from '../Components/ParaSidebar'
import Dropdown from '../Components/Dropdown'
import EmptyGraph from '../Components/EmptyGraph'
import PreventRefresh from '../Components/PreventRefresh';
import ParaSidebar2 from '../Components/ParaSidebar2';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import adminApiUrl from '../adminApiUrl'

const SelectPara = ({ selectedGraph, setSelectedGraph, graphName, setGraphName, Xaxis, setXAxis, Yaxis, setYAxis, Xlabel, setXlabel, Ylabel, setYlabel, Zaxis, setZAxis, Zlabel, isEditing = false, setIsEditing, description, setEditing, setZlabel, filters, setFilters, isDuplicating = false }) => {

  const location = useLocation()
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [editableId, setEditableId] = useState(location.state?.id)

  const parameterMapping = useMemo(() => ({
    "State": "state",
    "District": "district",
    "Centre Code": "center",
    "Block": "block",
    "School Type": "type",
    "Age Group": "age",
    "Gender": "gender"
  }), []);

  useEffect(() => {
    setFilters((prevFilters) => prevFilters); // Trigger re-render without modifying state
  }, [selectedGraph, filters, setFilters]);  // Re-run when either changes    


  const goBackFunction = () => {
    // navigate("/select-graph")
    setGraphName("");
    setXAxis(null);
    setYAxis(null);
    setIsEditing(false);
    setZAxis(null);
    setFilters([]);
    window.history.back()
  }

  // Handle drop event for X-axis
  const handleDropXaxis = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedParam = e.dataTransfer.getData("parameter");
    console.log(droppedParam)
    setXlabel(droppedParam)
    setXAxis(parameterMapping[droppedParam]);
    setFilters((prevFilters) => prevFilters.filter((item) => item !== droppedParam)); // Remove from filters
  };

  const handleDropYaxis = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedParam = e.dataTransfer.getData("parameter");
    console.log(droppedParam)
    setYlabel(droppedParam)
    setYAxis(parameterMapping[droppedParam]);
    setFilters((prevFilters) => prevFilters.filter((item) => item !== droppedParam)); // Remove from filters
  }

  const handleDropZaxis = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedParam = e.dataTransfer.getData("parameter");
    console.log(droppedParam)
    setXlabel(droppedParam)
    setXAxis(parameterMapping[droppedParam]);
  }

  useEffect(() => {
    if (isDuplicating) {
      console.log(Xaxis)
      console.log(Yaxis)
      console.log(filters)
      console.log(selectedGraph);
      console.log("Triggered Duplicating");
    }
  }, [isDuplicating])

  useEffect(() => {
    if (isEditing) {
      console.log(editableId);
      console.log(Xaxis)
      console.log(Xlabel)
      console.log(Yaxis)
      console.log(Ylabel)
      console.log(filters)
      console.log(selectedGraph);
      console.log("Triggered Editing");
    }
  }, [isEditing])

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  async function handleGraphEdit() {
    try {
      if (isEditing) {
        const dataToSave = {
          type: selectedGraph,
          name: graphName,
          desc: description,
          details: {
            Xaxis: parameterMapping[Xlabel],
            Xlabel,
            filters
          }
        }
        if ((!selectedGraph.includes("Pie") && !selectedGraph.includes("Donut"))) {
          dataToSave.details = {
            ...dataToSave.details,
            Yaxis: parameterMapping[Ylabel],
            Ylabel
          }
        }

        const id = editableId;

        console.log(dataToSave)

        axios.put(adminApiUrl + `dashboard/graph/${id}`, dataToSave)
          .then(({ data }) => {
            console.log(data)
            setIsEditing(false);
            setEditableId(null);
            navigate("/create-graph", { state: { id } })
          })
          .catch((error) => {
            console.error(error);
          })
      }
      else
        throw new Error("Not Call")
    }
    catch (error) {
      return alert(error?.message || error || "Error")
    }
  }

  return (
    <>
      <PreventRefresh />

      <div className='w-full h-[95vh] flex items-center justify-center gap-4'>

        {/* Graph Section */}
        <div className='w-full bg-white h-full rounded-2xl flex flex-col items-center text-gray'>


          {/* Title */}
          <div className='w-full h-fit rounded-t-2xl flex flex-col p-4 border-b-2 border-[#e2e8f0]'>
            {/* Go Back Button */}
            <button className="w-fit text-gray font-semibold hover:cursor-pointer">
              <div
                className='flex items-center gap-2'
                onClick={() => {
                  if (Xaxis || Yaxis || Zaxis) {
                    const confirmNavigation = window.confirm("Are you sure you want to go back? Your selections will be lost.");
                    if (confirmNavigation) {
                      goBackFunction();
                    }
                  }
                  else {
                    window.history.back()
                  }
                }}
              >
                <img src={Arrow} alt="" /> Go Back
              </div>

            </button>
            {/* Heading */}
            <h1 className='text-xl text-black mt-4 font-medium'> {isEditing ? "Editing graph" : "Creating new graph"} </h1>
          </div>

          {/* Graph-Type, Filters Options */}
          <div className='w-full h-32 p-4'>
            {/* Graph-Type */}
            <div className='flex items-center justify-between mb-3'>
              <h1 className='text-lg font-semibold'> {graphName} </h1>
              <Dropdown selectedGraph={selectedGraph} setSelectedGraph={setSelectedGraph} />
            </div>
            {/* Filter Options */}
            {selectedGraph !== "Pie Graph" && selectedGraph !== "Doughnut Graph" && (
              <div className='flex gap-4 text-primary text-sm font-medium min-h-12'>
                {filters.map((filter, index) => (
                  <div key={index} className='flex items-center bg-[#edeaff] p-2 pr-4 rounded-lg'>
                    <img
                      src={Cross}
                      alt="cross-icon"
                      className='w-8 hover:cursor-pointer'
                      onClick={() => setFilters(filters.filter(item => item !== filter))} // Remove filter on click
                    />
                    {filter}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drag and Drop Section */}

          {selectedGraph !== "Pie Graph" && selectedGraph !== "Doughnut Graph" && (
            <div className='h-full w-full flex items-center justify-center px-5'>

              {/* Drop Zone for Y-axis */}
              <div className='h-full md:w-24 w-14 flex justify-center items-center text-sm'
                onDragOver={handleDragOver}
                onDrop={handleDropYaxis}
              >
                <div className='border-4 border-dashed border-[#6C5DD3] rounded w-fit inline-block -rotate-90'>
                  <div className={`${isDragging ? "bg-[#eef1ff]" : "bg-white"} w-max h-[50px] flex items-center gap-2 outline-3 ${isDragging ? "outline-[#eef1ff]" : "outline-white"} rounded-xs p-2`}>
                    <img src={YaxisImg} alt="" />
                    {Yaxis ? `${Ylabel}` : "Drag and Drop you 'Y' parameter here"}
                  </div>
                </div>
              </div>

              <div className='h-full flex flex-col flex-grow'>
                {/* Graph image */}
                <div className='h-full w-full mt-2.5'>
                  <EmptyGraph />
                </div>
                {/* Drop Zone for X-axis */}
                <div className='h-[60px] w-full flex items-center justify-center text-sm mb-4'
                  onDragOver={handleDragOver}
                  onDrop={handleDropXaxis}
                >
                  <div className='h-[55px] border-4 border-dashed border-[#6C5DD3] rounded'>
                    <div className={`${isDragging ? "bg-[#eef1ff]" : "bg-white"} w-full flex items-center outline-3 ${isDragging ? "outline-[#eef1ff]" : "outline-white"} rounded-xs p-2`}>
                      <img src={XaxisImg} alt="" />
                      {Xaxis ? `${Xlabel}` : "Drag and Drop your 'X' parameter here"}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {(selectedGraph === "Pie Graph" || selectedGraph === "Doughnut Graph") && (
            <div className='h-[460px] w-full flex items-center justify-center px-5'>

              <div className='xl:w-1/2 lg:w-2/3 w-full h-2/3 flex items-center justify-center text-sm'
                onDragOver={handleDragOver}
                onDrop={handleDropZaxis}
              >
                <div className='w-full h-full border-4 border-dashed border-[#6C5DD3] rounded'>
                  <div className={`${isDragging ? "bg-[#eef1ff]" : "bg-white"} w-full h-full flex flex-col items-center justify-center outline-3 ${isDragging ? "outline-[#eef1ff]" : "outline-white"} rounded-xs p-2`}>
                    <h1 className='text-xl font-semibold text-gray'> Your {selectedGraph} will appear here </h1>
                    <br />
                    <span className='text-primary text-base'> {Xaxis ? `${Xlabel}` : "Drag and Drop your parameter here"} </span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ------------------------------------------------------------------------------------------ */}

        {/* Right Sidebar */}
        {selectedGraph !== "Pie Graph" && selectedGraph !== "Doughnut Graph" && (
          <ParaSidebar handleEdit={handleGraphEdit} isEditing={isEditing} setIsDragging={setIsDragging} selectedGraph={selectedGraph} graphName={graphName} setGraphName={setGraphName} Xaxis={Xaxis} setXAxis={setXAxis} Yaxis={Yaxis} setYAxis={setYAxis} Xlabel={Xlabel} setXlabel={setXlabel} Ylabel={Ylabel} setYlabel={setYlabel} filters={filters} setFilters={setFilters} showFilters={showFilters} setShowFilters={setShowFilters} />
        )}

        {(selectedGraph === "Pie Graph" || selectedGraph === "Doughnut Graph") && (
          <ParaSidebar2 isEditing={isEditing} handleEdit={handleGraphEdit} setIsDragging={setIsDragging} selectedGraph={selectedGraph} graphName={graphName} setGraphName={setGraphName} Xaxis={Xaxis} setXAxis={setXAxis} setXlabel={setXlabel} Xlabel={Xlabel} Zaxis={Zaxis} setZAxis={setZAxis} Zlabel={Zlabel} setZlabel={setZlabel} filters={filters} setFilters={setFilters} />
        )}

      </div>
    </>
  )
}

export default SelectPara