'use client'

import { motion } from 'framer-motion'
import { IconMicrophone, IconBrain, IconRobot, IconMessageCircle } from '@tabler/icons-react'
import Sidebar from '@/components/sidebar/page'

const features = [
  {
    title: 'Voice Recognition',
    description: 'Advanced speech-to-text capabilities powered by cutting-edge AI models',
    icon: <IconMicrophone size={32} />,
  },
  {
    title: 'Natural Text-to-Speech',
    description: 'Human-like voice synthesis for seamless audio interactions',
    icon: <IconMessageCircle size={32} />,
  },
  {
    title: 'Intelligent Chatbot',
    description: 'Context-aware conversations with natural language understanding',
    icon: <IconRobot size={32} />,
  },
  {
    title: 'Advanced AI Logic',
    description: 'Smart decision making and personalized responses',
    icon: <IconBrain size={32} />,
  },
]

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Sidebar />
      <div className="pt-12"> {/* Add padding top to account for sidebar */}
        <div className="max-w-7xl mx-auto py-20 px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">
              Powerful AI Features
            </h1>
            <p className="text-gray-400 text-lg">
              Transform your business with cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
