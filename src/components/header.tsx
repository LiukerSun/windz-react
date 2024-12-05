"use client";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icons } from "./icons";
import { useRouter } from "next/navigation";
import { clearAuth, getUser } from "@/lib/auth";

const styles = {
  main: "min-h-screen w-full",
  header: "sticky top-0 z-50 px-10 py-7 xl:px-0",
  nav: {
    container: "relative mx-auto flex items-center justify-between max-w-2xl",
    logo: "h-10 w-10",
    list: "sticky left-4 right-4 top-4 z-[60] hidden items-center justify-center gap-x-5 md:flex",
    menu: {
      container: "flex h-12 w-auto items-center justify-center overflow-hidden rounded-full px-6 py-2.5 transition-all bg-background md:p-1.5 md:py-2",
      nav: "relative h-full items-center justify-between gap-x-3.5 md:flex",
      list: "flex h-full flex-col justify-center gap-6 md:flex-row md:justify-start md:gap-0 lg:gap-1",
      item: "flex items-center justify-center px-[0.75rem] py-[0.375rem]",
      getStarted: {
        container: "!hidden overflow-hidden rounded-full md:!block",
        list: "shrink-0 whitespace-nowrap",
        button: "relative inline-flex w-fit items-center justify-center gap-x-1.5 overflow-hidden rounded-full bg-primary px-3 py-1.5 text-primary-foreground outline-none"
      }
    },
    actions: "z-[999] hidden items-center gap-x-5 md:flex",
    mobileMenu: {
      button: "relative flex h-8 w-8 items-center justify-center rounded-md md:hidden",
      line: "absolute h-0.5 w-5 bg-black dark:bg-white"
    }
  },
  content: {
    wrapper: "w-full pt-0",
    container: "mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-y-5 pt-0",
    logo: "h-20 w-20",
    title: "text-balance text-center text-4xl font-bold",
    description: "text-balance text-center"
  }
} as const;

export function useScrollY(containerRef: React.RefObject<HTMLElement>) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef]);

  return scrollY;
}

export function StickyHeader({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement>;
}) {
  const scrollY = useScrollY(containerRef);
  const stickyNavRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await getUser();
      setIsLoggedIn(!!user);
    };
    checkLoginStatus();
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await clearAuth();
    setIsLoggedIn(false);
    router.push('/');
  };

  const navLinks = useMemo(
    () => [
      { id: 1, label: "Home", link: "#" },
      { id: 2, label: "About", link: "#about" },
      { id: 3, label: "Services", link: "#services" },
      { id: 4, label: "Contact", link: "#contact" },
    ],
    [],
  );

  return (
    <header ref={stickyNavRef} className={styles.header}>
      <nav className={styles.nav.container}>
        <motion.img
          className={styles.nav.logo}
          src="/favicon.ico"
          alt="MagicUI Logo"
          animate={{
            y: scrollY >= 120 ? -50 : 0,
            opacity: scrollY >= 120 ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        />

        <ul className={styles.nav.list}>
          <motion.div
            initial={{ x: 0 }}
            animate={{
              boxShadow:
                scrollY >= 120
                  ? theme === "dark"
                    ? "0 0 0 1px rgba(255,255,255,.08), 0 1px 2px -1px rgba(255,255,255,.08), 0 2px 4px rgba(255,255,255,.04)"
                    : "0 0 0 1px rgba(17,24,28,.08), 0 1px 2px -1px rgba(17,24,28,.08), 0 2px 4px rgba(17,24,28,.04)"
                  : "none",
            }}
            transition={{
              ease: "linear",
              duration: 0.05,
              delay: 0.05,
            }}
            className={styles.nav.menu.container}
          >
            <nav className={styles.nav.menu.nav}>
              <ul className={styles.nav.menu.list}>
                {navLinks.map((navItem) => (
                  <li
                    key={navItem.id}
                    className={styles.nav.menu.item}
                  >
                    <a href={navItem.link}>{navItem.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: scrollY >= 120 ? "auto" : 0,
              }}
              transition={{
                ease: "linear",
                duration: 0.25,
                delay: 0.05,
              }}
              className={styles.nav.menu.getStarted.container}
            >
              <AnimatePresence>
                {scrollY >= 120 && (
                  <motion.ul
                    initial={{ x: "125%" }}
                    animate={{ x: "0" }}
                    exit={{
                      x: "125%",
                      transition: { ease: "linear", duration: 1 },
                    }}
                    transition={{ ease: "linear", duration: 0.3 }}
                    className={styles.nav.menu.getStarted.list}
                  >
                    <li>
                      <a
                        href="#"
                        className={styles.nav.menu.getStarted.button}
                      >
                        Get Started
                      </a>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </ul>

        <motion.div
          className={styles.nav.actions}
          animate={{
            y: scrollY >= 120 ? -50 : 0,
            opacity: scrollY >= 120 ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
        >
          <button>Get Started</button>
        </motion.div>
        <MotionConfig transition={{ duration: 0.3, ease: "easeInOut" }}>
          <motion.button
            onClick={() => setActive((prev) => !prev)}
            animate={active ? "open" : "close"}
            className={styles.nav.mobileMenu.button}
          >
            <motion.span
              style={{ left: "50%", top: "35%", x: "-50%", y: "-50%" }}
              className={styles.nav.mobileMenu.line}
              variants={{
                open: {
                  rotate: ["0deg", "0deg", "45deg"],
                  top: ["35%", "50%", "50%"],
                },
                close: {
                  rotate: ["45deg", "0deg", "0deg"],
                  top: ["50%", "50%", "35%"],
                },
              }}
              transition={{ duration: 0.3 }}
            ></motion.span>
            <motion.span
              style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
              className={styles.nav.mobileMenu.line}
              variants={{
                open: {
                  opacity: 0,
                },
                close: {
                  opacity: 1,
                },
              }}
            ></motion.span>
            <motion.span
              style={{ left: "50%", bottom: "30%", x: "-50%", y: "-50%" }}
              className={styles.nav.mobileMenu.line}
              variants={{
                open: {
                  rotate: ["0deg", "0deg", "-45deg"],
                  top: ["65%", "50%", "50%"],
                },
                close: {
                  rotate: ["-45deg", "0deg", "0deg"],
                  top: ["50%", "50%", "65%"],
                },
              }}
              transition={{ duration: 0.3 }}
            ></motion.span>
          </motion.button>
          <motion.button
            onClick={isLoggedIn ? handleLogout : handleLogin}
            className="ml-4 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {isLoggedIn ? (
              <>
                <Icons.logout className="h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <Icons.login className="h-4 w-4" />
                Login
              </>
            )}
          </motion.button>
        </MotionConfig>
      </nav>
    </header>
  );
}

export function Header() {
  const containerRef = useRef(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    setUsername(user?.username || null);
  }, []);
  
  return (
    <main
      ref={containerRef}
      className={styles.main}
    >
      <StickyHeader containerRef={containerRef} />
      <div className={styles.content.wrapper}>
        <div className={styles.content.container}>
          <Icons.logo className={styles.content.logo} />

          <h1 className={styles.content.title}>
            UI library for Design Engineers
          </h1>
          <p className={styles.content.description}>
            50+ open-source animated components built with React, Typescript,
            Tailwind CSS, and Framer Motion. Save thousands of hours, create a
            beautiful landing page, and convert your visitors into customers.
          </p>
        </div>
      </div>
    </main>
  );
}
