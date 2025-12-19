import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Rocket, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TemplatesSection } from "@/components/landing/templates-section";
import { CTASection } from "@/components/landing/cta-section";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Navigation */}
            <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Motia Studio Pro</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="#features" className="text-slate-300 hover:text-white transition-colors">
                            Features
                        </Link>
                        <Link href="#templates" className="text-slate-300 hover:text-white transition-colors">
                            Templates
                        </Link>
                        <Link href="/docs" className="text-slate-300 hover:text-white transition-colors">
                            Docs
                        </Link>
                        <Link href="/studio">
                            <Button className="bg-primary-600 hover:bg-primary-700">
                                Get Started <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <FeaturesSection />

            {/* Templates Section */}
            <TemplatesSection />

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-slate-400">Motia Studio Pro</span>
                        </div>

                        <div className="text-sm text-slate-400">
                            Built for Backend Reloaded Hackathon by{" "}
                            <a href="https://github.com/h30s" className="text-primary-400 hover:text-primary-300" target="_blank" rel="noopener noreferrer">
                                Himanshu Soni
                            </a>
                        </div>

                        <div className="flex gap-4 text-sm text-slate-400">
                            <a href="https://github.com/h30s" className="hover:text-white transition-colors">GitHub</a>
                            <a href="https://x.com/SoniH30s" className="hover:text-white transition-colors">Twitter</a>
                            <a href="https://wemakedevs.org" className="hover:text-white transition-colors">WeMakeDevs</a>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
