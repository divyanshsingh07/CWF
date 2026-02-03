import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[40rem] sm:h-[45rem] md:h-[50rem] lg:h-[55rem] flex items-center justify-center relative p-1 sm:p-2 md:p-3 lg:p-4"
      ref={containerRef}
    >
      <div
        className="py-1 sm:py-2 md:py-3 lg:py-4 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} isMobile={isMobile}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center px-4"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
  isMobile = false,
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-8 sm:-mt-10 md:-mt-12 mx-auto h-[28rem] sm:h-[32rem] md:h-[36rem] lg:h-[40rem] w-full border-2 sm:border-4 border-gray-300 dark:border-gray-600 p-2 sm:p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-[24px] md:rounded-[30px] shadow-2xl"
    >
      <div className="h-full w-full overflow-y-auto overflow-x-hidden rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-zinc-900 p-2 sm:p-3 md:p-4 scrollbar-thin">
        {children}
      </div>
    </motion.div>
  );
};

