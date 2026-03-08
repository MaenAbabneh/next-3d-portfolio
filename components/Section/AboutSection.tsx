import Image from "next/image";

export default function AboutSection() {
  return (
    <div className=" text-base-brwan">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-90 h-80 rounded-xl overflow-hidden border-4 border-base-blue dark:border-base-blue-dark">
          <Image
            src="https://res.cloudinary.com/dsgajdqm0/image/upload/q_auto,f_auto/v1772971236/Profile_lfmhs0.png"
            alt="Profile"
            sizes="(max-width: 768px) 100vw, 33vw"
            fill
            className="object-cover object-[center_20%] "
          />
        </div>
        <h2 className="text-xl font-bold text-left text-base-blue dark:text-base-blue-dark mb-3">
          I center divs and pray they stay there 🙏
        </h2>
      </div>

      <div className="text-lg leading-relaxed mb-5">
        <p>
          Hello! I’m a Software Engineer who <br />
          loves blending technical logic with creative arts...
        </p>
      </div>

      <div>
        <h3 className="text-xl font-bold border-b-2 border-base-blue text-base-blue dark:text-base-blue-dark dark:border-base-blue-dark  w-fit mb-4 pb-1">
          {"What I'm Up To:"}
        </h3>
        <ul className="list-disc list-inside space-y-2 opacity-90">
          <li>Learning Three.js and GSAP deeply.</li>
          <li>Bulding nice design websites.</li>
          <li>Building cool sass & e-commerce sites.</li>
        </ul>
      </div>
    </div>
  );
}
