"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASection() {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto">
                <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 rounded-3xl p-12 md:p-16 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556 15.858 12.14 28 0zm0 3.657l10.485 10.485-1.414 1.414L32 6.485 22.929 15.556l-1.414-1.414L32 3.657z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                        }} />
                    </div>

                    {/* Content */}
                    <div className="relative text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Free for Hackathon Participants</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Build the Future?
                        </h2>

                        <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                            Join the Backend Reloaded Hackathon and build production-ready backends in minutes, not days.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/studio">
                                <Button size="lg" className="bg-white text-primary-700 hover:bg-slate-100 text-lg px-8">
                                    Start Building Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                                View Documentation
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-primary-100">
                            <div className="flex items-center gap-2">
                                <div className="text-3xl font-bold text-white">90s</div>
                                <div className="text-sm">Average<br />Deploy Time</div>
                            </div>
                            <div className="hidden sm:block w-px h-12 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="text-3xl font-bold text-white">100%</div>
                                <div className="text-sm">Production<br />Ready Code</div>
                            </div>
                            <div className="hidden sm:block w-px h-12 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <div className="text-3xl font-bold text-white">5+</div>
                                <div className="text-sm">Ready-to-Use<br />Templates</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
