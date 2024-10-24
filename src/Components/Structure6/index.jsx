import React from 'react'
import './style.css'
import Heading from '../../Common/Heading'
import Body from '../../Common/Body'

const Structure6 = ({ activeOption, setActiveOption, question }) => {
   return (
      <>
         <Heading>
            {question.questionText}
         </Heading>
         <Body>
            <div>
               <img className='quesImage' src={question.questionImage} alt="" />
            </div>
            <div className="s2OptionImage">
               <img src={question.answerImage} alt="" />
               <div className="options">
                  <img className='egg' src={activeOption === 1 ? question.option.active : question.option.inactive} alt="" onClick={() => setActiveOption(1)} />
                  <img className='egg' src={activeOption === 2 ? question.option.active : question.option.inactive} alt="" onClick={() => setActiveOption(2)} />
                  <img className='egg' src={activeOption === 3 ? question.option.active : question.option.inactive} alt="" onClick={() => setActiveOption(3)} />
                  <img className='egg' src={activeOption === 4 ? question.option.active : question.option.inactive} alt="" onClick={() => setActiveOption(4)} />
               </div>
            </div>
         </Body>
      </>
   )
}

export default Structure6