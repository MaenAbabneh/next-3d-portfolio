"use client";

import Link from "next/link";
import {
  PiMailboxFill,
  PiGithubLogoFill,
  PiInstagramLogoFill,
  PiLinkedinLogoFill,
} from "react-icons/pi";

export default function ContactSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-8 md:mb-12 text-base-brwan leading-relaxed">
        If you like engineering, music, <br />
        {"games, and food, let's connect!"}
      </h2>

      <div className="flex flex-wrap gap-6 sm:gap-10 md:gap-16 items-center justify-center text-base-blue dark:text-base-blue-dark">
        {/* Email */}
        <Link
          href="mailto:hi@maenababneh.dev"
          className="group inline-flex items-center justify-center hover:text-base-yellow transition-colors duration-300"
        >
          <PiMailboxFill className="contact-logo group-hover:-rotate-12 transition-transform duration-300" />
        </Link>

        {/* GitHub */}
        <Link
          href="https://github.com/MaenAbabneh"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center hover:text-base-yellow transition-colors duration-300"
        >
          <PiGithubLogoFill className="contact-logo group-hover:rotate-12 transition-transform duration-300" />
        </Link>

        {/* LinkedIn */}
        <Link
          href="https://www.linkedin.com/in/maenababneh/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center hover:text-base-yellow transition-colors duration-300"
        >
          <PiLinkedinLogoFill className="contact-logo group-hover:-rotate-12 transition-transform duration-300" />
        </Link>

        {/* Instagram */}
        <Link
          href="https://www.instagram.com/maenababneh/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center hover:text-base-yellow transition-colors duration-300"
        >
          <PiInstagramLogoFill className="contact-logo group-hover:rotate-12 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
