import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, MonitorSmartphone, Cloud, Shield, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SmoothScroll from '../components/Landing/SmoothScroll';
import AsciiWave from '../components/Landing/AsciiWave';

export default function Landing() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);
  const y = useTransform(scrollY, [0, 200], [0, -50]);

  return (
    <SmoothScroll>
      <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-white/20 selection:text-white">
        
        {/* Navigation */}
        <header className="fixed top-0 inset-x-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-white" />
              <span className="font-semibold tracking-tight text-lg">Sentinel</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
              <a href="#platform" className="hover:text-white transition-colors">Platform</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#stats" className="hover:text-white transition-colors">Stats</a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sign In</button>
              <button onClick={() => navigate('/login')} className="chamfered-button bg-white text-black px-5 py-2 text-sm font-semibold hover:bg-white/90 transition-colors">Get Started</button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
          <AsciiWave />
          
          <motion.div 
            style={{ opacity, y }}
            className="relative z-10 text-center max-w-4xl px-6"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight mb-6">
              Secure your Enterprise Stack <br />
              <span className="font-sans font-semibold">at AI Speed</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Sentinel gives security teams the building blocks for a unified platform that meets complex compliance needs and adapts as fast as threats evolve.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => navigate('/login')} className="chamfered-button bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="chamfered-border bg-transparent text-white px-6 py-3 text-sm font-medium hover:bg-white/5 transition-colors">
                Talk to Us
              </button>
            </div>
          </motion.div>
        </section>

        {/* Trusted By */}
        <section className="border-y border-white/10 relative">
          <div className="corner-plus corner-plus-tl"></div>
          <div className="corner-plus corner-plus-tr"></div>
          <div className="corner-plus corner-plus-bl"></div>
          <div className="corner-plus corner-plus-br"></div>
          
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 p-6 md:border-r border-white/10 text-xs font-medium text-white/40 uppercase tracking-widest text-center md:text-left">
              Protecting Industry Leaders
            </div>
            <div className="flex-1 p-6 flex flex-wrap justify-center md:justify-around gap-8 opacity-50">
              {/* Dummy logos for Trusted By */}
              <div className="text-xl font-bold tracking-tighter">STRIPE</div>
              <div className="text-xl font-bold tracking-tighter">DROPBOX</div>
              <div className="text-xl font-bold tracking-tighter">VERCEL</div>
              <div className="text-xl font-bold tracking-tighter">SPOTIFY</div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section (Simplified WebGL replacement for now) */}
        <section id="platform" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
                Total <span className="font-sans font-semibold">visibility</span> across <br/> your entire infrastructure
              </h2>
            </div>
            
            <div className="relative rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm overflow-hidden chamfered-button">
              {/* Mockup UI */}
              <div className="rounded-lg bg-[#0f0f0f] border border-white/10 h-[600px] flex shadow-2xl">
                {/* Sidebar */}
                <div className="w-64 border-r border-white/10 p-4 hidden md:block">
                  <div className="flex items-center gap-2 text-white/40 mb-8">
                    <ShieldCheck className="w-5 h-5" /> Sentinel
                  </div>
                  <div className="space-y-2">
                    {['Overview', 'Threats', 'Endpoints', 'Cloud', 'Compliance'].map((item, i) => (
                      <div key={i} className={`text-sm px-3 py-2 rounded-md ${i === 0 ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer'}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 p-8">
                  <h3 className="text-xl font-medium mb-8">Security Overview</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: 'Threats Blocked', val: '12,847', icon: ShieldCheck },
                      { label: 'Active Endpoints', val: '3,204', icon: MonitorSmartphone },
                      { label: 'Compliance Score', val: '98.6%', icon: CheckCircle },
                      { label: 'Avg. Response', val: '1.2s', icon: Zap },
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-white/40">{stat.label}</span>
                          <stat.icon className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="text-2xl font-semibold tracking-tight">{stat.val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Graph Placeholder */}
                  <div className="h-64 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    <span className="text-white/20 font-medium">Activity Chart Stream</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-32 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-8">
              Ready to secure your stack?
            </h2>
            <button onClick={() => navigate('/login')} className="chamfered-button bg-white text-black px-8 py-4 text-base font-semibold hover:bg-white/90 transition-colors">
              Start Free Trial
            </button>
          </div>
        </section>
        
      </div>
    </SmoothScroll>
  );
}
