"use client";

import React from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../components/ui/button";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { FEATURES, SERVICES } from "@verse/hirex/utils/Constants";
import { Card, CardContent } from "@verse/hirex/components/ui/card";
import { InfiniteScroller } from "@verse/hirex/components/ui/infinite-scroller";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 ">
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-6">
              <span className="gradient-text">HireCore</span>
              <br />
              <span className="text-white">Web3 Task Platform</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with skilled workers using{" "}
              <span className="core-token">CØRE</span> cryptocurrency. Find
              electricians, plumbers, cooks, and more with GPS precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/tasks">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 crypto-glow text-lg px-8 py-3">
                  <Search className="w-5 h-5 mr-2" />
                  Find Tasks
                </Button>
              </Link>

              <Link href="/post-task">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto neon-border text-lg px-8 py-3 bg-transparent hover:bg-white/10"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Post a Task
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="relative mt-16">
            <motion.div
              className="absolute top-0 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full floating-animation"
              style={{ animationDelay: "0s" }}
            />
            <motion.div
              className="absolute top-10 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full floating-animation"
              style={{ animationDelay: "2s" }}
            />
            <motion.div
              className="absolute top-20 left-1/2 w-12 h-12 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-full floating-animation"
              style={{ animationDelay: "4s" }}
            />
          </div>
        </div>
      </section>
      <section className="py-16">
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
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:pulse-glow transition-all duration-300">
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
    </div>
  );
}
