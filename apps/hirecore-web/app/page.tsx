"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/button";
import { Plus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { FEATURES, SERVICES } from "apps/hirecore-web/utils/Constants";
import { Card, CardContent } from "apps/hirecore-web/components/ui/card";
import { InfiniteScroller } from "apps/hirecore-web/components/ui/infinite-scroller";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-6 leading-tight">
              <span className="gradient-text">HireCore</span>
              <br />
              <span className="text-white">Web3 Task Platform</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with skilled workers using{" "}
              <span className="core-token">CØRE</span>.  
              Find electricians, plumbers, cooks, and more with GPS precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/find-tasks">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 crypto-glow text-lg px-8 py-3 rounded-none">
                    <Search className="w-5 h-5 mr-2" />
                    Find Tasks
                  </Button>
                </Link>

                <Link href="/post-task">
                  <Button variant="outline" className="w-full sm:w-auto neon-border text-lg px-8 py-3 bg-transparent hover:bg-white/10 ">
                    <Plus className="w-5 h-5 mr-2" />
                    Post a Task
                  </Button>
                </Link>
              </div>
          </motion.div>

          {/* Floating background bubbles */}
          <div className="absolute inset-0 -z-10">
            <motion.div
              className="absolute top-10 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full floating-animation"
            />
            <motion.div
              className="absolute top-20 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full floating-animation"
            />
            <motion.div
              className="absolute top-40 left-1/2 w-12 h-12 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full floating-animation"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold gradient-text mb-4">
              Available Services
            </h2>
            <p className="text-gray-300 text-lg">
              Connect with skilled professionals across various industries
            </p>
          </motion.div>

          {/* Mobile grid */}
          <div className="grid grid-cols-2 gap-4 sm:hidden">
            {SERVICES.slice(0, 4).map((service, index) => (
              <Card
                key={index}
                className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center`}
                  >
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-medium text-white text-sm">
                    {service.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Infinite scroller for larger screens */}
          <div className="hidden sm:block">
            <InfiniteScroller speed="slow">
              {SERVICES.map((service, index) => (
                <motion.div
                  key={`${service.name}-${index}`}
                  whileHover={{ y: -5 }}
                  className="group w-[180px] flex-shrink-0"
                >
                  <Card className="glass-effect border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer h-full rounded-none">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <service.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {service.name}
                      </h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </InfiniteScroller>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold gradient-text mb-4">
              Platform Features
            </h2>
            <p className="text-gray-300 text-lg">
              Experience the future of task management with Web3 technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="glass-effect border-white/20 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-zinc-900/40 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold gradient-text mb-4">
            How HireCore Works
          </h2>
          <p className="text-gray-300 text-lg mb-12">
            Getting started is simple — just three steps.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                desc: "Sign in securely with your crypto wallet.",
              },
              {
                step: "2",
                title: "Find or Post Tasks",
                desc: "Browse skilled workers or post jobs instantly.",
              },
              {
                step: "3",
                title: "Pay with CØRE",
                desc: "Secure escrow payments released when work is done.",
              },
            ].map(({ step, title, desc }) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-800/50 backdrop-blur-lg rounded-xl p-6 border border-white/10 shadow-lg"
              >
                <div className="text-4xl font-bold text-indigo-400 mb-4">
                  {step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-300">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 text-center w-full">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <h3 className="text-3xl font-bold text-white">5k+</h3>
            <p className="text-gray-400">Jobs Completed</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">2k+</h3>
            <p className="text-gray-400">Verified Workers</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">100%</h3>
            <p className="text-gray-400">Crypto Powered</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">24/7</h3>
            <p className="text-gray-400">Global Access</p>
          </div>
        </div>
      </section>
    </div>
  );
}
