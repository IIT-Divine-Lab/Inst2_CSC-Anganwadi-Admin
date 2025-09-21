import { useCallback, useEffect, useRef } from 'react'
import Heading from '../Common/Heading';
import ParentContainer from '../Common/ParentContainer';
import Button from '../Common/Button';

const Structure7 = ({ questionText, optionType = { left: "both", right: "both" }, leftColumn = [], rightColumn = [], matches, setMatches }) => {

   const colors = [
      {
         color: "#4a94c3",
         bgCol: "#a2d5f2"
      },
      {
         color: "#5ea785",
         bgCol: "#b2e7c8"
      },
      {
         color: "#e08d60",
         bgCol: "#ffd7ba"
      },
      {
         color: "#a97bc3",
         bgCol: "#e7cffd"
      },
      {
         color: "#c4a945",
         bgCol: "#fff4b8"
      },
   ]

   const leftRefs = useRef([]);
   const rightRefs = useRef([]);
   const containerRef = useRef();

   const haveCommonNonEmptyValue = useCallback((arr1 = leftColumn, arr2 = rightColumn) => {

      const commmonIndex = [];

      for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
         if ((arr1[i]?.text !== "" || arr1[i]?.image !== null) && (arr2[i]?.text !== "" || arr2[i]?.image !== null)) {
            commmonIndex.push(i); // both have values at the same index
         }
      }
      if (commmonIndex.length === 0)
         return [-1]; // no common index with values
      return commmonIndex;
   }, [leftColumn, rightColumn])

   const checkMatches = useCallback(() => {
      const commonIndex = haveCommonNonEmptyValue();
      if (commonIndex[0] !== -1) {
         const matchArray = Array.from({ length: commonIndex.length });
         for (let i = 0; i < commonIndex.length; i++) {
            const leftRect = leftRefs.current[commonIndex[i]]?.getBoundingClientRect();
            const rightRect = rightRefs.current[commonIndex[i]]?.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();
            const leftCenter = {
               x: leftRect.right - containerRect.left, // Adjusted relative to container
               y: leftRect.top + leftRect.height / 2 - containerRect.top,
            };
            const rightCenter = {
               x: rightRect.left - containerRect.left, // Adjusted relative to container
               y: rightRect.top + rightRect.height / 2 - containerRect.top,
            };
            matchArray[commonIndex[i]] = { leftCenter, rightCenter };
         }
         console.log("Match Array: ", matchArray);
         setMatches(matchArray);
      }
   }, [haveCommonNonEmptyValue, setMatches])

   useEffect(() => {
      checkMatches();
   }, [leftColumn, rightColumn, checkMatches])

   return (
      <ParentContainer>
         <Heading>
            {questionText !== "" ? questionText : "Your question text will appear."}
         </Heading>
         <div style={{ display: 'flex', flexDirection: "column", padding: '20px' }}>
            <div style={{ display: "flex" }}>
               <div style={{
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column"
               }}>
                  {leftColumn.map((item, index) => {
                     return <div
                        key={index}
                        ref={(el) => (leftRefs.current[index] = el)}
                        className='flex justify-between items-center mt-5 first:mt-0 font-semibold text-wrap px-2.5 rounded-xl text-center cursor-pointer min-w-44 min-h-32 max-w-52 max-h-36'
                        style={{
                           backgroundColor: haveCommonNonEmptyValue().includes(index) ? colors[index].bgCol : "transparent",
                           border: haveCommonNonEmptyValue().includes(index) ? '3px solid ' + colors[index].color : '3px solid black',
                        }}
                     >
                        {(optionType.left === "both" || optionType.left === "image") && <img alt={"phot" + index} className={`${item?.orientation === "landscape" ? "w-3/5 h-auto" : "w-auto max-h-32 h-full"}`} src={item?.image !== undefined && item?.image !== null ? item?.previewUrl : ""} />}
                        {(optionType.left === "both" || optionType.left === "text") && <span className='max-w-[50%]'>
                           {item?.text}
                        </span>}
                     </div>
                  })}
               </div>

               <div style={{ position: "relative", width: '100px' }} ref={containerRef}>
                  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100px', height: '100%' }}>
                     {
                        matches.map((match, index) => {
                           return <line
                              key={index}
                              x1={match.leftCenter.x}
                              y1={match.leftCenter.y}
                              x2={match.rightCenter.x}
                              y2={match.rightCenter.y}
                              stroke={colors[index]?.color}
                              strokeWidth="2"
                           />

                        })}
                  </svg>
               </div>

               <div style={{
                  backgroundColor: "transparent",
                  display: "flex",
                  flexDirection: "column"
               }}>
                  {rightColumn.map((item, index) => {
                     return <div
                        key={index}
                        ref={(el) => (rightRefs.current[index] = el)}
                        className='flex justify-between items-center mb-5 first:mt-0 font-semibold text-wrap px-2.5 rounded-xl text-center cursor-pointer min-w-44 min-h-32 max-w-52 max-h-36'
                        style={{
                           backgroundColor: haveCommonNonEmptyValue().includes(index) ? colors[index].bgCol : "transparent",
                           border: haveCommonNonEmptyValue().includes(index) ? '3px solid ' + colors[index].color : '3px solid black',
                        }}
                     >
                        {(optionType.right === "both" || optionType.right === "image") && <img className={`${item?.orientation === "landscape" ? "w-3/5 h-auto" : "w-auto max-h-32 h-full"}`} src={item?.image !== undefined && item?.image !== null ? item?.previewUrl : ""} alt={item?.text} />}
                        {(optionType.right === "both" || optionType.right === "text") && <span>
                           {item?.text}
                        </span>}
                     </div>
                  })}
               </div>
            </div>
         </div>
         <Button>Next</Button>
      </ParentContainer>
   )
}

export default Structure7