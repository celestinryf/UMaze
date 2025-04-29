import React from 'react'

import "./index.css"
const HeroCard = (props) => {
  return (
    <div class="card">
        <div class="card-info">
            <p class="title">{props.props.name}</p>
            <div>
                <p>{props.props.img}</p>
            </div>
            <p>Description: {props.props.desc}</p>
            <p>Skills: {props.props.skills}</p>
        </div>
    </div>
  )
}

export default HeroCard
