import { motion } from 'framer-motion'
import React from 'react'

const Logo = () => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1,
      }}
      style={{
        ...box,
        borderRadius: "50%",
        background: "#cbcbcf",
      }}
    />
  )
}

export default Logo



const box = {
  width: 22,
  height: 22,
  backgroundColor: "#cbcbcf",
  borderRadius: 5,
}