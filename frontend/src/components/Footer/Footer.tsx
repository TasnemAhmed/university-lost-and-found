import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Cloud, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5 text-gold-400" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                UniLost<span className="text-gold-400">&</span>Found
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A dedicated digital community hub helping students and faculty report lost belongings,
              publish found items, and quickly reconnect owners with what matters across campus.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-navy-900/80 border border-slate-800 rounded-lg p-2.5 max-w-sm">
              <Cloud className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Prepared for deployment on AWS (VPC, EC2, RDS, S3).</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/items" className="hover:text-gold-400 transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-gold-400 transition-colors">
                  Report Lost or Found Item
                </Link>
              </li>
              <li>
                <Link to="/items?type=LOST" className="hover:text-gold-400 transition-colors">
                  Lost Belongings
                </Link>
              </li>
              <li>
                <Link to="/items?type=FOUND" className="hover:text-gold-400 transition-colors">
                  Found Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Project Info */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Academic Context
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="font-medium text-slate-200">
                Software Engineering for Cloud Applications
              </p>
              <p className="text-xs text-slate-400">
                Arab Academy for Science, Technology and Maritime Transport (AASTMT)
              </p>
              <p className="text-xs text-slate-500 pt-2">
                Demonstrating full-stack clean architecture, REST APIs with FastAPI, PostgreSQL persistence, and S3 asset storage.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} University Lost & Found. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Built with care for campus communities <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
