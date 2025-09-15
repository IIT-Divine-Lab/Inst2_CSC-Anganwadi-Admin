import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto'; // automatically registers Chart.js components
import "./Dashboard.css"
import LandingImage from '../data/images/landing-page.png';
import Arrow from '../data/images/get-started-arrow.png';
import axios from 'axios';
import adminApiUrl from '../adminApiUrl';
import GraphListCard from '../Components/GraphCard';

const Dashboard = ({ loggedIn, setHidden }) => {
  const navigate = useNavigate();
  const [isDataAvailable, setIsDataAvailable] = useState(false);
  const [data, setData] = useState([]);

  const fetchGraphData = useCallback(() => {
    axios.get(adminApiUrl + "dashboard/getAllGraphs")
      .then(({ data }) => {
        console.log(data)
        setIsDataAvailable(true);
        setData(data.graphData)
      })
      .catch((error) => {
        console.error(error);
        setIsDataAvailable(false);
      })
  }, [])

  console.log(data)
  const sampleCardData = data?.length > 0 ? data?.map(item => {
    console.log(item)
    if (!item) return null;

    return {
      id: item._id,
      title: item.name,
      description: item.desc,
      chartType: item.type,
      chartImagePath: item.type.split(" ")[0] + "-" + item.type.split(" ")[1] + ".png",
      // Store the original item for navigation
      originalItem: item
    };
  }) : [];

  useEffect(() => {
    if (data.length === 0) {
      fetchGraphData()
    }
  }, [fetchGraphData, data])

  useEffect(() => {
    if (!loggedIn)
      navigate("/");
  }, [loggedIn, navigate])

  return (
    <div className="banner">
      {
        !isDataAvailable ?
          <div className='w-full min-h-[90vh] flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center text-center text-gray font-semibold mb-8'>
              <img src={LandingImage} alt="" className='mb-6' />
              <p> Dashboards are now flexible! </p>
              <p> Create graphs tailored for your specific role </p>
            </div>

            <button
              onClick={() => {
                setHidden(true);
                navigate("/graph-builder")
              }}
              className="flex gap-3 justify-center items-center bg-[#6C5DD3] text-white w-48 h-12 rounded-lg font-semibold hover:cursor-pointer">
              Get Started
              <img src={Arrow} alt="" />
            </button>
          </div>
          :
          <div className='w-full min-h-[90vh] flex flex-col items-center justify-between'>
            <div className="text-center h-[10vh]">
              <h1 className="text-2xl block font-medium">
                Welcome, <span className="text-[#6c5ce7] m-0 p-0">Akash!</span>
              </h1>
              <p className="text-gray-600 mt-2">What do you want to analyse today?</p>
            </div>

            <div className="h-[65vh]">
              <div className="grid overflow-y-auto p-5 h-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {sampleCardData.map((card, index) => (
                  <div
                    key={index}
                    className="h-64 cursor-pointer"
                    onClick={() => { navigate("/create-graph", { state: { id: card?.id } }) }}
                  >
                    <GraphListCard
                      title={card?.title.length > 20 ? card?.title.slice(0, 20) + "..." : card?.title}
                      description={card?.description}
                      chartType={card?.chartType}
                      chartData={card?.chartData}
                      chartImagePath={card?.chartImagePath}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='flex h-[10vh] flex-col'>
              {/* Help Text */}
              <div className="text-center">
                <p className="text-[#6c5ce7]">Need something else?</p>
              </div>

              {/* Create New Graph Button */}
              <div className="flex justify-center mt-4">
                <button onClick={() => navigate('/graph-builder')} className="bg-[#6c5ce7] hover:bg-purple-600 text-white px-6 py-2 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create New Graph
                </button>
              </div>

            </div>
          </div>
      }
    </div>
  )
}

export default Dashboard