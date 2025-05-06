import React from 'react'
import HeroCard from '../../components/HeroCard/HeroCard'

import "./index.css"

const HeroSelect = () => {
  return (
    <div className='card-container'>
      <HeroCard props={{name: "Nick", img: "Placeholder", desc: "Placeholder", skills: "None"}}/>
      <HeroCard props={{name: "Matthew" , img: "Placeholder", desc: "Placeholder", skills: "Rubiks cube"}}/>
      <HeroCard props={{name: "Celestin", img: "Placeholder", desc: "Placeholder", skills: "French"}}/>
      <HeroCard props={{name: "Primo", img: "Placeholder", desc: "Placeholder", skills: "Design"}}/>
    </div>
  )
}

export default HeroSelect
