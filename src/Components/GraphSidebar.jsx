import React from "react";
// import { useNavigate } from "react-router-dom";
import LineGraphImg from "../data/images/line-graph.png";
import BarGraphImg from "../data/images/bar-graph.png";
import PieGraphImg from "../data/images/pie-graph.png";
import DoughnutGraphImg from "../data/images/donut-graph.png";

// Graph Types along with Image (used for mapping)
const graphs = [
  { name: "Line Graph", img: LineGraphImg },
  { name: "Bar Graph", img: BarGraphImg },
  { name: "Pie Graph", img: PieGraphImg },
  { name: "Doughnut Graph", img: DoughnutGraphImg }
];

const GraphSidebar = ({ isDragging, setIsDragging, setSelectedGraph }) => {

  // const navigate = useNavigate();

  const handleDragStart = (e, graphName) => {
    e.dataTransfer.setData("graphType", graphName);
    setSelectedGraph(graphName);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="max-h-[93vh] lg:w-96 md:w-[320px] w-72 flex flex-col items-center lg:p-6 py-6 px-2 overflow-y-auto scrollbar-hidden">

      {/* Heading */}
      <div className="mb-6 w-full text-center">
        <h1 className="mb-2 font-medium text-gray">Pick the graph you want to add</h1>
        <p className="text-primary font-medium">(drag and drop)</p>
        <div className="w-full h-[2px] mt-8"
          style={{ backgroundImage: "repeating-linear-gradient(to right, #737373 0 6px, #e2e8f0 4px 8px)" }} >
        </div>
      </div>

      <div className="w-full h-fit">
        {/* Graph Options */}
        {graphs.map((graph, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, graph.name)}
            onDragEnd={handleDragEnd}  // Call handleDragEnd when dragging ends
            className="w-full lg:h-28 md:h-24 h-20 bg-white rounded-2xl shadow-lg flex items-center text-sm mb-4 hover:border hover:border-[#6C5DD3] hover:cursor-pointer"
          >
            <div className="lg:w-1/3 w-[30%] h-full border-r-3 border-[#e2e8f0] flex items-center justify-center">
              <img src={graph.img} alt={graph.name} />
            </div>
            <div className="lg:w-2/3 w-[70%] h-full">
              <h1 className="h-2/5 mb-0 bg-white font-bold rounded-tr-2xl flex items-end px-2 text-primary text-lg">
                {graph.name}
              </h1>
              <p className="h-3/5 flex items-center md:px-2 px-2 text-[13px]">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphSidebar;