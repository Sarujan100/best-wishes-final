"use client";

import React from "react";
import Navbar from "../components/navBar/page";
import Footer from "../components/footer/page";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaGift, FaBell, FaUsers, FaMagic } from "react-icons/fa";

const services = [
  {
    icon: <FaGift className="text-purple-600 w-8 h-8" />,
    title: "Customizable Gift",
    description:
      "Design gifts your way — choose packaging, add notes, select colors or themes. Every gift becomes a reflection of your style and emotion.",
    image: "/customize.jpg",
    link: "/user/customizegifts",
  },
  {
    icon: <FaBell className="text-pink-500 w-8 h-8" />,
    title: "Reminder Gift Notify",
    description:
      "Never miss special moments. Set reminders for birthdays, anniversaries, and holidays to ensure your loved ones feel remembered.",
    image: "/motherday.jpg",
    link: "#", // Add actual link if available
  },
  {
    icon: <FaUsers className="text-blue-500 w-8 h-8" />,
    title: "Collaborative Gift",
    description:
      "Invite your friends and family to join in on a special gift. Split the cost, share the joy, and create memorable surprises — together.",
    image: "/Collaborative.jpg",
    link: "#", // Add actual link if available
  },
  {
    icon: <FaMagic className="text-yellow-500 w-8 h-8" />,
    title: "Surprise Gift Delivery",
    description:
      "Schedule a surprise delivery for your loved ones at just the right moment. We'll handle the magic while you enjoy the reactions.",
    image: "/mug.jpg",
    link: "/surprisegift",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: "easeOut",
    },
  }),
};

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-white to-purple-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center px-4 md:px-0">
        <motion.section
          className="w-full max-w-6xl mx-auto py-12 md:py-20 flex flex-col items-center text-center mb-10"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Our <span className="text-[#822BE2]">Services</span>
          </motion.h1>
          <motion.p
            className="max-w-2xl text-lg md:text-2xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Discover our unique, thoughtful, and customizable services designed to make every occasion special.
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
              >
                <Card className="h-full flex flex-col justify-between border-2 border-purple-100 hover:border-purple-400 transition-colors shadow-md bg-white">
                  <CardContent className="flex flex-col items-center p-6 gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 mb-2">
                      {service.icon}
                    </div>
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover mb-2 shadow"
                    />
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 text-center">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-center mb-4">
                      {service.description}
                    </p>
                    <Button
                      variant="outline"
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                      asChild
                    >
                      <a href={service.link}>Explore</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Trending Decoration Services Section */}
        <motion.section
          className="w-full max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Trending Decoration Services
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* All Decoration Items */}
            <Card className="flex flex-col items-center p-6 border-2 border-purple-100 hover:border-purple-400 transition-colors shadow bg-white">
              <CardContent className="flex flex-col items-center gap-4">
                <Image
                  src="/decoration4.jpg"
                  alt="All Decoration Items"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover mb-2 shadow"
                />
                <h3 className="font-semibold text-lg text-gray-900 mb-1 text-center">All Decoration Items</h3>
                <p className="text-gray-600 text-sm text-center mb-2">Explore a wide range of beautiful decorations for every occasion, from balloons to banners and more.</p>
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50" asChild>
                  <a href="#">Explore</a>
                </Button>
              </CardContent>
            </Card>
            {/* Party Table */}
            <Card className="flex flex-col items-center p-6 border-2 border-purple-100 hover:border-purple-400 transition-colors shadow bg-white">
              <CardContent className="flex flex-col items-center gap-4">
                <Image
                  src="/decoration1.jpg"
                  alt="Party Table"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover mb-2 shadow"
                />
                <h3 className="font-semibold text-lg text-gray-900 mb-1 text-center">Party Table</h3>
                <p className="text-gray-600 text-sm text-center mb-2">Set the perfect party table with themed decor, tableware, and centerpieces for memorable celebrations.</p>
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50" asChild>
                  <a href="#">Explore</a>
                </Button>
              </CardContent>
            </Card>
            {/* Other Elegant Items */}
            <Card className="flex flex-col items-center p-6 border-2 border-purple-100 hover:border-purple-400 transition-colors shadow bg-white">
              <CardContent className="flex flex-col items-center gap-4">
                <Image
                  src="/decoration2.jpg"
                  alt="Other Elegant Items"
                  width={120}
                  height={120}
                  className="rounded-lg object-cover mb-2 shadow"
                />
                <h3 className="font-semibold text-lg text-gray-900 mb-1 text-center">Other Elegant Items</h3>
                <p className="text-gray-600 text-sm text-center mb-2">Discover unique and elegant items to elevate your event, from lighting to special accessories.</p>
                <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50" asChild>
                  <a href="#">Explore</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
}
