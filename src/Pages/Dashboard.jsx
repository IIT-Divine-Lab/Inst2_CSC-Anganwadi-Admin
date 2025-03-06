// eslint-disable-next-line
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import data from "../AnganwadiCentreData.json";
import axios from 'axios';
// eslint-disable-next-line
import { Bar, Radar } from 'react-chartjs-2';
import 'chart.js/auto'; // automatically registers Chart.js components
import "./Dashboard.css"
import adminApiUrl from '../adminApiUrl';
// eslint-disable-next-line
import { scales } from 'chart.js/auto';

const Dashboard = ({ loggedIn }) => {
   const navigate = useNavigate();
   const [filters, setFilters] = useState({
      state: "",
      district: "",
      anganwadi: "",
      ageGroup: "",
      schoolType: ""
   })

   const states = [...new Set(data.map((item) => item.state))];
   // eslint-disable-next-line
   const districts = filters.state
      ? [...new Set(data.filter((item) => item.state === filters.state).map((item) => item.district))]
      : [];
   // eslint-disable-next-line
   const centres = filters.state
      ? [...new Set(data.filter((item) => item.district === filters.district).map((item) => item.awcentre))]
      : [];

   // const [kpis, setKpis] = useState(null);
   // const [domains, setDomains] = useState([]);
   // const [schoolComparison, setSchoolComparison] = useState([]);
   // const [ageGroupComparison, setAgeGroupComparison] = useState([]);

   // const availableFilters = useCallback(() => {
   //    let availableFilters = {};
   //    if (filters.state !== "") availableFilters = { state: filters.state }
   //    if (filters.district !== "") availableFilters = { ...availableFilters, district: filters.district }
   //    if (filters.anganwadi !== "") availableFilters = { ...availableFilters, anganwadi: filters.anganwadi }
   //    if (filters.ageGroup !== "") availableFilters = { ...availableFilters, ageGroup: filters.ageGroup }

   //    return availableFilters;
   // }, [filters])

   // Fetch KPIs when filters change
   // useEffect(() => {
   //    axios
   //       .get(adminApiUrl + 'dashboard/kpis/', { params: availableFilters() })
   //       .then((res) => setKpis(res.data.data))
   //       .catch((err) => console.error(err));
   // }, [availableFilters]);

   // Fetch domain-wise performance
   // useEffect(() => {
   //    axios
   //       .get(adminApiUrl + 'dashboard/domains/', { params: availableFilters() })
   //       .then((res) => setDomains(res.data.data))
   //       .catch((err) => console.error(err));
   // }, [availableFilters]);

   // Fetch school type comparison data
   // useEffect(() => {
   //    axios
   //       .get(adminApiUrl + 'dashboard/school-comparison/', { params: availableFilters() })
   //       .then((res) => setSchoolComparison(res.data.data))
   //       .catch((err) => console.error(err));
   // }, [availableFilters]);

   // Fetch age group comparison data
   // useEffect(() => {
   //    axios
   //       .get(adminApiUrl + 'dashboard/age-group/', { params: availableFilters() })
   //       .then((res) => setAgeGroupComparison(res.data.data))
   //       .catch((err) => console.error(err));
   // }, [availableFilters]);

   // Update filter state on input change
   // eslint-disable-next-line
   const handleFilterChange = (e) => {
      const { name, value } = e.target;
      switch (name) {
         case "state": setFilters((prev) => ({ ...prev, state: value, district: "", anganwadi: "", schoolType: "" }))
            break;
         case "district": setFilters((prev) => ({ ...prev, district: value, anganwadi: "", schoolType: "" }))
            break;
         case "anganwadi": setFilters((prev) => ({ ...prev, [name]: value, schoolType: value.split(" - ")[value.split(" - ").length - 1] }))
            break;
         case "ageGroup": setFilters((prev) => ({ ...prev, [name]: value }))
            break;
         default:
            break;
      }
   };

   // Prepare data for the Radar Chart (Domain Accuracy)
   // const radarData = {
   //    labels: domains?.map((item) => item.domain),
   //    datasets: [
   //       {
   //          label: 'Domain Accuracy (%)',
   //          data: domains?.map((item) => item.accuracy),
   //          backgroundColor: 'rgba(34, 202, 236, 0.2)',
   //          borderColor: 'rgba(34, 202, 236, 1)',
   //          borderWidth: 1,
   //       },
   //    ],
   // };

   // // Prepare data for the Bar Chart (School Type Comparison)
   // const schoolComparisonData = {
   //    labels: Object.keys(schoolComparison),
   //    datasets: [
   //       {
   //          label: 'Accuracy (%)',
   //          data: Object.values(schoolComparison).map((item) => item.accuracy),
   //          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
   //          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
   //          borderWidth: 1,
   //       },
   //    ],
   // };

   // // Prepare data for the Bar Chart (Age Group Comparison)
   // const ageGroupLabels = ageGroupComparison.map((item) => item.ageGroup);
   // const ageGroupData = ageGroupComparison.map((item) => item.accuracy);
   // const ageGroupChartData = {
   //    labels: ageGroupLabels,
   //    datasets: [
   //       {
   //          label: 'Accuracy (%)',
   //          data: ageGroupData,
   //          backgroundColor: 'rgba(75, 192, 192, 0.2)',
   //          borderColor: 'rgba(75, 192, 192, 1)',
   //          borderWidth: 1,
   //       },
   //    ],
   // };

   const [selectedState, setSelectedState] = useState("All");

   const [chartData, setChartData] = useState(null);


   // Fetch age group comparison data
   useEffect(() => {
      axios
         .get(adminApiUrl + 'dashboard/gendercount/', { params: { state: selectedState } })
         .then((res) => {
            setChartData(res.data.datasets.length === 0 ? undefined : res.data)
         })
         .catch((err) => console.error(err));
   }, [selectedState]);

   // const resetToAll = () => {
   //    setFilters({
   //       state: "",
   //       district: "",
   //       anganwadi: "",
   //       ageGroup: "",
   //       schoolType: ""
   //    })
   // }

   useEffect(() => {
      if (!loggedIn)
         navigate("/");
   }, [loggedIn, navigate])

   // console.log(kpis)

   return (
      <div className="banner">
         <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>Assessment Performance Dashboard</h1>

            {/* Filter Section */}
            {/* <div className="filter-section">
               <div>
                  <label>
                     State:
                  </label>
                  <select name="state" id="state" className='form-field' value={filters.state} onChange={handleFilterChange}>
                     <option value="none">Select state</option>
                     {
                        states.map((age) => {
                           return <option key={age} value={age}>{age}</option>
                        })
                     }
                  </select>
               </div>
               <div>
                  <label>
                     District:
                  </label>
                  <select name="district" id="district" className='form-field' value={filters.district} onChange={handleFilterChange}>
                     <option value="none">Select district</option>
                     {
                        districts.map((age) => {
                           return <option key={age} value={age}>{age}</option>
                        })
                     }
                  </select>
               </div>
               <div>
                  <label>
                     Anganwadi:
                  </label>
                  <select name="anganwadi" id="anganwadi" className='form-field' value={filters.anganwadi} onChange={handleFilterChange}>
                     <option value="none">Select anganwadi</option>
                     {
                        centres.map((age) => {
                           return <option key={age} value={age}>{age}</option>
                        })
                     }
                  </select>
               </div>
               <div>
                  <label>
                     Age Group:
                  </label>
                  <select name="ageGroup" id="ageGroup" className='form-field' value={filters.ageGroup} onChange={handleFilterChange}>
                     <option value="none">Select age group</option>
                     {
                        ["3-4", "4-5", "5-6", "For All Groups"].map((age) => {
                           if (age === "For All Groups") return <option key={age} value="common">{age}</option>
                           return <option key={age} value={age}>{age}</option>
                        })
                     }
                  </select>
               </div>
               <div>
                  <button onClick={resetToAll}>
                     Reset
                  </button>
               </div>
            </div> */}
         </header>

         {/* KPI Section */}
         {/* <div className="kpi-section">
            {
               kpis ? (
                  <>
                     <div className="kpi-card">
                        <h3 className='cardHeading'>Total Attempted Questions : </h3>
                        <p className='cardValue'>{kpis?.totalQuestions || 0}</p>
                     </div>
                     <div className="kpi-card">
                        <h3 className='cardHeading'>Total Correct Answers : </h3>
                        <p className='cardValue'>{kpis?.totalScore || 0}</p>
                     </div>
                     <div className="kpi-card">
                        <h3 className='cardHeading'>Overall Accuracy : </h3>
                        <p className='cardValue'>{kpis?.accuracy?.toFixed(2) || Number("0").toFixed(2)}%</p>
                     </div>
                  </>
               ) : (
                  <p>Loading KPIs...</p>
               )}
         </div> */}

         {/* Charts Section */}
         <div className='chartSection'>
            <div className='chartContainer'>
               {
                  chartData ?
                     <>
                        <div className="chartHeaderContainer">
                           <div className="chartHeading">
                              <p>Comparative Analysis</p>
                              <p>Demographics</p>
                           </div>
                           <div className="chartFilters">
                              <select className='standardFilter' value={selectedState} onChange={(e) => setSelectedState(e.target.value)} name="" id="">
                                 <option value={undefined}>All</option>
                                 {
                                    states.map((state) => {
                                       return <option key={state} value={state}>{state}</option>
                                    })
                                 }
                              </select>
                           </div>
                        </div>
                        <div className='chartDetailContainer'>
                           <Bar
                              options={{
                                 scales: {
                                    x: {
                                    },
                                    y: {
                                       beginAtZero: true,
                                       suggestedMax: 3,
                                       ticks: {
                                          stepSize: 1
                                       },
                                    }
                                 }
                              }}
                              data={chartData}
                           />
                        </div>
                     </>
                     :
                     <>
                        No Valid Data
                     </>
               }
            </div>
            <div className='chartContainer'>

            </div>
            <div className='chartContainer'>

            </div>
            <div className='chartContainer'>

            </div>
            <div className='chartContainer'>

            </div>
            <div className='chartContainer'>

            </div>
         </div>
      </div>
      // <div className='banner'>
      //    <h1>
      //       Welcome 👋
      //    </h1>
      // </div>
   )
}

export default Dashboard