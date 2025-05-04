import React from 'react'

import "./index.css"


const GameCard = (props) => {
  return (
    <div>
        <div className='card-load'>
            <div className='card-image'>
                <p>{props.props.img}</p>
            </div>
            <div className='card-info-load'>
                <p>Last Save: {props.props.lastSave}</p>
                <p>Hero: {props.props.hero}</p>
                <p>Created On: {props.props.createdOn}</p>
            </div>
        </div>
    </div>
  )
}

export default GameCard
