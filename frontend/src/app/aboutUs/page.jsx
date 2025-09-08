"use client"

import React from 'react'
import Navbar from '../components/navBar/page'
import Footer from '../components/footer/page'
import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
}

function page() {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center px-4 md:px-0">
        {/* Hero Section */}
        <motion.section
          className="w-full bg-gradient-to-r from-blue-100 to-purple-100 py-16 flex flex-col items-center text-center mb-10 shadow-sm"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            About <span className="text-[#822BE2]">BestWishes</span>
          </motion.h1>
          <motion.p
            className="max-w-2xl text-lg md:text-2xl text-gray-600 mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Making every occasion special with thoughtful, unique, and customizable gifts for everyone you care about.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            custom={3}
          >
            <motion.span className="bg-white border border-purple-200 text-purple-700 px-4 py-2 rounded-full font-semibold shadow" variants={fadeInUp} custom={1}>Curated Gifts</motion.span>
            <motion.span className="bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-full font-semibold shadow" variants={fadeInUp} custom={2}>Personalized Service</motion.span>
            <motion.span className="bg-white border border-pink-200 text-pink-700 px-4 py-2 rounded-full font-semibold shadow" variants={fadeInUp} custom={3}>Memorable Moments</motion.span>
          </motion.div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8 mb-12 flex flex-col md:flex-row items-center gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <motion.img src="/images/giftbox.jpg" alt="Gift Box" className="w-32 h-32 object-contain hidden md:block" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.7 }} />
          <div>
            <motion.h2 className="text-3xl font-bold text-gray-800 mb-3" variants={fadeInUp} custom={1}>Our Mission</motion.h2>
            <motion.p className="text-lg text-gray-600" variants={fadeInUp} custom={2}>
              To spread joy and strengthen relationships by making gifting easy, meaningful, and memorable. Every gift tells a story, and we help you create those unforgettable moments.
            </motion.p>
          </div>
        </motion.section>

        {/* Values Section */}
        <section className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[{
            icon: '/images/care.jpg',
            title: 'Care & Thoughtfulness',
            color: 'text-[#822BE2]',
            desc: 'We handpick every product to ensure it brings a smile to your loved ones.'
          }, {
            icon: '/images/innovation.jpg',
            title: 'Innovation',
            color: 'text-blue-700',
            desc: 'We constantly update our collection to offer the latest and most unique gifts.'
          }, {
            icon: '/images/community.jpg',
            title: 'Community',
            color: 'text-pink-700',
            desc: 'We believe in building connections and celebrating togetherness.'
          }].map((val, i) => (
            <motion.div
              key={val.title}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              custom={i + 1}
            >
              <img src={val.icon} alt={val.title} className="w-14 h-14 mb-3" />
              <h3 className={`font-semibold text-xl ${val.color} mb-2`}>{val.title}</h3>
              <p className="text-gray-500">{val.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Team Section */}
        <section className="max-w-5xl w-full mb-20">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-800 mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            custom={1}
          >
            Meet Our Team
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-10">
            {[{
              name: 'Alex Johnson',
              role: 'Founder & CEO',
              tag: 'Visionary Leader',
              color: 'text-purple-600',
              border: 'border-purple-100'
            }, {
              name: 'Maria Lee',
              role: 'Head of Operations',
              tag: 'Operations Expert',
              color: 'text-blue-600',
              border: 'border-blue-100'
            }, {
              name: 'Samuel Green',
              role: 'Lead Developer',
              tag: 'Tech Enthusiast',
              color: 'text-pink-600',
              border: 'border-pink-100'
            }].map((member, i) => (
              <motion.div
                key={member.name}
                className="flex flex-col items-center w-56 p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                custom={i + 1}
              >
                <img src="/images/profile-avatar.png" alt={member.name} className={`w-24 h-24 rounded-full mb-4 object-cover border-4 ${member.border}`} />
                <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                <span className={`text-xs ${member.color} font-semibold`}>{member.tag}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default page
