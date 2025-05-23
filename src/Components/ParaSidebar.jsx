import React, { useEffect, useMemo, useState } from 'react'
import Pen from '../data/images/pen.png'
import ParameterImg from '../data/images/parameter.png'
import CrossImg from '../data/images/cross.png'
import ArrowDown from '../data/images/down-arrow.png'
import ArrowUp from '../data/images/up-arrow.png'
import { Link } from 'react-router-dom'

const ParaSidebar = ({ isDragging, setIsDragging, selectedGraph, graphName, setGraphName, Xaxis, setXAxis, Yaxis, setYAxis, Xlabel, setXlabel, Ylabel, setYlabel, filters, setFilters, showFilters, setShowFilters }) => {

  const [checkedFilters, setCheckedFilters] = useState({}); // Stores checkbox states
  const [filterToggle, setFilterToggle] = useState(false);

  const parameters = useMemo(() => ([
    { name: "State", type: "Categorical" },
    { name: "District", type: "Categorical" },
    { name: "Centre Code", type: "Categorical" },
    { name: "Block", type: "Categorical" },
    { name: "School Type", type: "Categorical" },
    { name: "Age Group", type: "Numerical" },
    { name: "Gender", type: "Categorical" },
  ]), []);

  // Handle drag start (store the parameter being dragged)
  const handleDragStart = (e, paramName) => {
    e.dataTransfer.setData("parameter", paramName);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {

    setCheckedFilters((prevCheckedFilters) => {
      const newCheckedFilters = {};
      let hasChanged = false;

      parameters.forEach(param => {
        const isChecked = filters.includes(param.name);
        newCheckedFilters[param.name] = isChecked;

        if (prevCheckedFilters[param.name] !== isChecked) {
          hasChanged = true;
        }
      });

      return hasChanged ? newCheckedFilters : prevCheckedFilters;
    });
  }, [showFilters, filters, parameters]);

  const removeXAxis = () => {
    setXAxis(null);
    setShowFilters(false);
    setFilters([]);
  }

  const removeYAxis = () => {
    setYAxis(null);
    setShowFilters(false);
    setFilters([]);
  }

  //eslint-disable-next-line
  const handleFilterSelect = (paramName) => {
    if (!filters.includes(paramName)) {
      setFilters([...filters, paramName]); // Add filter
    } else {
      setFilters(filters.filter(item => item !== paramName)); // Remove filter
    }
  };

  return (
    <>
      <div className='md:w-[450px] w-[350px] h-full bg-white rounded-2xl flex flex-col items-center justify-between font-medium'>

        <div className='w-full h-full flex flex-col items-center overflow-y-scroll scrollbar-hidden font-medium'>

          {/* Heading */}
          <div className='rounded-t-2xl h-16 p-6 w-full flex items-center justify-center text-gray'>
            Now set your graph
          </div>

          {/* Enter Name */}
          <div className='flex flex-col justify-start h-32 border-t-2 border-[#e2e8f0] w-full text-gray p-6'>
            <div className='my-auto'>
              <h1 className='text-gray text-sm mb-2'> Graph name </h1>
              <div className='text-primary border-2 border-[#e2e8f0] flex items-center p-2 rounded-md'>
                <input type="text" placeholder='Graph-1' required className='w-full outline-none'
                  value={graphName} onChange={(e) => setGraphName(e.target.value)} />
                <img src={Pen} alt="pen-icon" />
              </div>
            </div>
          </div>

          {/* Parameters */}
          <div className='flex flex-col justify-start w-full text-gray p-6 border-t-2 border-[#e2e8f0]'>
            <div>
              <h1 className='text-gray text-sm mb-2'> Parameters </h1>

              {parameters
                .filter(param => param.name !== Xaxis && param.name !== Yaxis)
                .map((param, index) => (
                  <div
                    key={index}
                    className="text-primary border-2 border-[#e2e8f0] flex items-center gap-4 p-2 rounded-md mb-3 hover:border-[#6C5DD3] hover:cursor-pointer"
                    draggable
                    onDragStart={(e) => handleDragStart(e, param.name)}
                    onDragEnd={handleDragEnd}
                  >
                    <img src={ParameterImg} alt="parameter-icon" />
                    <p>{param.name}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* The outer <div> will only render if either Xaxis or Yaxis is not null. */}
          {(Xaxis || Yaxis) && (
            <div className='flex flex-col justify-start h-52 border-t-2 border-[#e2e8f0] w-full text-gray p-6'>

              {/* Show X-axis div only when Xaxis is not null */}
              {Xaxis && (
                <div className='mb-4'>
                  <h1 className='text-gray text-sm mb-2'> X-axis Label </h1>
                  <div className='text-primary border-2 border-[#e2e8f0] flex items-center p-2 rounded-md'>
                    <input type='text' value={Xlabel} onChange={(e) => setXlabel(e.target.value)} className='w-full outline-none text-primary' />
                    <img src={CrossImg} alt="pen-icon" className='w-8 hover:cursor-pointer' onClick={removeXAxis} />
                  </div>
                </div>
              )}

              {/* Show Y-axis div only when Yaxis is not null */}
              {Yaxis && (
                <div>
                  <h1 className='text-gray text-sm mb-2'> Y-axis Label </h1>
                  <div className='text-primary border-2 border-[#e2e8f0] flex items-center p-2 rounded-md'>
                    <input type='text' value={Ylabel} onChange={(e) => setYlabel(e.target.value)} className='w-full outline-none text-primary' />
                    <img src={CrossImg} alt="pen-icon" className='w-8 hover:cursor-pointer' onClick={removeYAxis} />
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Element will only render if Xaxis and Yaxis are not null */}
          {(Xaxis && Yaxis) && (
            <div className='flex flex-col justify-start h-52 border-t-2 border-[#e2e8f0] w-full text-gray p-6'>

              {/* Advance Filters */}
              <div className='flex items-center justify-between gap-2 text-base p-2 hover:cursor-pointer' onClick={() => { setFilterToggle(prev => !prev); setShowFilters(prev => !prev); }}>
                <div> Advance Filters </div>
                {!filterToggle && (<img src={ArrowDown} alt="icon" />)}
                {filterToggle && (<img src={ArrowUp} alt="icon" />)}
              </div>

              {showFilters && (
                <>
                  {filterToggle && (
                    <div className='p-2 pb-4 '>
                      {parameters
                        .filter(param => param.name !== Xaxis && param.name !== Yaxis)
                        .map((param, index) => (
                          <div key={index} className='flex items-center gap-2 p-2'>
                            <input
                              type="checkbox"
                              className='hover:cursor-pointer'
                              checked={checkedFilters[param.name] || false} // Ensure it remains checked if in filters
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFilters(prevFilters => [...prevFilters, param.name]); // Add to filters
                                } else {
                                  setFilters(prevFilters => prevFilters.filter(item => item !== param.name)); // Remove from filters
                                }
                              }}
                            />
                            {param.name}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </>
              )}


            </div>
          )}


        </div>

        {(Xaxis && Yaxis) && (
          <button className="flex gap-3 justify-center items-center bg-[#6C5DD3] text-white w-[80%] h-14 mb-6 rounded-lg font-semibold hover:cursor-pointer">
            <Link to="/create-graph" className='w-full h-full flex items-center justify-center'
              state={{ selectedGraph, graphName, Xaxis, Yaxis, Xlabel, Ylabel, filters }}
            >
              <div className=''> Create Graph </div>
            </Link>
          </button>
        )}
      </div>
    </>
  )
}

export default ParaSidebar