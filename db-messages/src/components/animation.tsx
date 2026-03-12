"use client"

import { MotionProps, motion } from "framer-motion"

export const Animation = ({ children, ...props }: MotionProps) => {
	return <motion.div {...props}>{children}</motion.div>
}
