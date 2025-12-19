"use client";

import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-8 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    Built for Backend Reloaded Hackathon
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up bg-gradient-to-r from-white via-primary-200 to-secondary-200 bg-clip-text text-transparent">
                    Build Production Backends
                    <br />
                    in 90 Seconds
                </h1>

                {/* Subheadline */}
                <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    Describe your backend in plain English. AI generates production-ready Motia code. Deploy with one click.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    <Link href="/studio">
                        <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-6">
                            Start Building Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                        <Play className="mr-2 w-5 h-5" />
                        Watch Demo
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">90s</div>
                        <div className="text-sm text-slate-400">Avg Deploy Time</div>
                    </div>
                    <div className="text-center border-l border-r border-slate-800">
                        <div className="text-3xl font-bold text-white mb-2">100%</div>
                        <div className="text-sm text-slate-400">Production Ready</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-2">5+</div>
                        <div className="text-sm text-slate-400">Templates</div>
                    </div>
                </div>

                {/* Demo Preview */}
                <div className="mt-20 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl animate-slide-up" style={{ animationDelay: "0.4s" }}>
                    <div className="bg-slate-800/50 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-4 text-sm text-slate-400">motia-studio-pro</span>
                    </div>
                    <div className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                        <div className="aspect-video rounded-lg bg-slate-950/50 border border-slate-700 flex items-center justify-center">
                            <div className="text-center">
                                <Play className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                                <p className="text-slate-400">Demo Video Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
