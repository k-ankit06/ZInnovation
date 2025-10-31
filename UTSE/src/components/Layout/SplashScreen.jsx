import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield } from 'lucide-react'

const SplashScreen = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem('splashShown', 'true')
      navigate('/login')
    }, 4500)

    return () => clearTimeout(timer)
  }, [navigate])

  if (sessionStorage.getItem('splashShown')) {
    navigate('/login')
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white"
      >
        {/* 🔥 Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />

        {/* ✨ Light rays behind logo */}
        <motion.div
          className="absolute w-[500px] h-[500px] bg-primary-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
          }}
        />

        {/* 🛡️ Shield logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
          }}
          className="relative mb-8"
        >
          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-white/30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="h-32 w-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary-400/30 to-primary-700/20"
              animate={{
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <Shield className="h-16 w-16 text-primary-600 z-10" />
          </div>
        </motion.div>

        {/* 🌟 Animated Text Reveal */}
        <motion.h1
          className="text-5xl font-extrabold mb-3 text-center tracking-wide"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
        >
          {'Tourist Safety System'.split('').map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-primary-100 text-lg"
        >
          Your Safety Companion in India 🇮🇳
        </motion.p>

        {/* 💫 Orbiting dots */}
        <motion.div
          className="relative mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 120, 240].map((angle, idx) => (
            <motion.div
              key={idx}
              className="absolute h-3 w-3 bg-white rounded-full shadow-lg"
              style={{
                top: 0,
                left: 0,
                transformOrigin: '40px 40px',
              }}
              animate={{
                rotate: [angle, angle + 360],
              }}
              transition={{
                duration: 2.5 + idx * 0.3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SplashScreen
