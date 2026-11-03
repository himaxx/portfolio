import React from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import TiltCard from "./fx/TiltCard";

// Generated cover for projects without a screenshot.
const Cover = ({ name }) => (
  <div className='relative w-full h-full rounded-2xl overflow-hidden bg-[#0d0a24]'>
    <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(145,94,255,0.55),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(0,206,168,0.35),transparent_50%)]' />
    <div className='absolute inset-0 cover-grid opacity-40' />
    <div className='absolute inset-0 flex items-center justify-center px-6'>
      <span className='text-white/90 font-black text-[34px] leading-tight tracking-tight text-center'>{name}</span>
    </div>
  </div>
);

const ProjectCard = ({ index, name, description, tags, image, source_code_link, organization, role }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75)} className='sm:w-[360px] w-full'>
    <TiltCard max={8} className='group bg-tertiary p-5 rounded-2xl h-full border border-white/[0.05]'>
      <div className='relative w-full h-[230px] overflow-hidden rounded-2xl'>
        {image ? (
          <img
            src={image}
            alt={`${name} screenshot`}
            loading='lazy'
            className='w-full h-full object-cover object-top rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.06]'
          />
        ) : (
          <Cover name={name} />
        )}
        <div className='absolute inset-0 flex justify-end m-3'>
          <a
            href={source_code_link}
            target='_blank'
            rel='noreferrer'
            aria-label={`${name} source code on GitHub`}
            data-cursor='Code'
            className='black-gradient w-10 h-10 rounded-full flex justify-center items-center'
          >
            <img src={github} alt='' className='w-1/2 h-1/2 object-contain' />
          </a>
        </div>
      </div>

      <div className='mt-5'>
        <h3 className='text-white font-bold text-[24px]'>{name}</h3>
        {(role || organization) && (
          <p className='mt-1 text-[12px] font-mono uppercase tracking-wider text-[#915EFF]'>
            {[role, organization].filter(Boolean).join(" · ")}
          </p>
        )}
        <p className='mt-2 text-secondary text-[14px] leading-relaxed'>{description}</p>
      </div>

      <div className='mt-4 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <p key={`${name}-${tag.name}`} className={`text-[14px] ${tag.color}`}>
            #{tag.name}
          </p>
        ))}
      </div>
    </TiltCard>
  </motion.div>
);

const Works = () => (
  <>
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>My work</p>
      <h2 className={styles.sectionHeadText}>Projects.</h2>
    </motion.div>

    <div className='w-full flex'>
      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
      >
        A selection of things I&apos;ve built, from hackathon-winning AI platforms to
        computer-vision systems. Each card links to its source code.
      </motion.p>
    </div>

    <div className='mt-20 flex flex-wrap gap-7'>
      {projects.map((project, index) => (
        <ProjectCard key={`project-${index}`} index={index} {...project} />
      ))}
    </div>
  </>
);

export default SectionWrapper(Works, "projects");
