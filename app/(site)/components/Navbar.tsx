"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const collectionActive = pathname.startsWith("/shop");
  const storyActive = pathname.startsWith("/about");

  useEffect(() => {
    if (!accessOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setAccessOpen(false);
    }

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [accessOpen]);

  function openAccess() {
    setMenuOpen(false);
    setRequestSent(false);
    setAccessOpen(true);
  }

  function submitAccessRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestSent(true);
  }

  const activeLink =
    "relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-current";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 grid h-[83px] grid-cols-[1fr_auto_1fr] items-center border-b border-black/[0.17] bg-[#f2efe8]/[0.93] px-[39px] text-[#0b0b0b] backdrop-blur-[18px] [font-family:Arial,Helvetica,sans-serif] max-[900px]:grid-cols-[1fr_auto] max-[900px]:px-5">
        <nav
          aria-label="Primary"
          className="flex items-center gap-[26px] text-[11px] uppercase tracking-[0.15em] max-[900px]:hidden"
        >
          <Link
            href="/shop"
            aria-current={collectionActive ? "page" : undefined}
            className={collectionActive ? activeLink : "hover:opacity-50"}
          >
            Collection
          </Link>
          <Link
            href="/about"
            aria-current={storyActive ? "page" : undefined}
            className={storyActive ? activeLink : "hover:opacity-50"}
          >
            Story
          </Link>
        </nav>

        <Link
          href="/"
          aria-label="Paradise Angels home"
          className="whitespace-nowrap [font-family:Times_New_Roman,Times,serif] text-[18.5px] uppercase tracking-[0.28em] max-[900px]:col-start-1 max-[900px]:row-start-1 max-[560px]:text-sm max-[560px]:tracking-[0.21em]"
        >
          Paradise Angels
        </Link>

        <nav
          aria-label="Secondary"
          className="flex items-center gap-[26px] text-[11px] uppercase tracking-[0.15em] max-[900px]:hidden"
        >
          <Link href="/shop" className="hover:opacity-50">
            The First Wing
          </Link>
          <button
            type="button"
            onClick={openAccess}
            className="bg-transparent uppercase tracking-[0.15em] hover:opacity-50"
          >
            Private access
          </button>
        </nav>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((current) => !current)}
          className="hidden bg-transparent py-3 text-[10px] uppercase tracking-[0.14em] max-[900px]:col-start-2 max-[900px]:row-start-1 max-[900px]:block"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        {menuOpen && (
          <nav className="fixed inset-x-0 top-[83px] flex flex-col items-start gap-[22px] border-t border-black/[0.17] bg-[#f2efe8] px-5 py-[30px] text-[10px] uppercase tracking-[0.15em]">
            <Link href="/shop" onClick={() => setMenuOpen(false)}>
              Collection / The First Wing
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              Story
            </Link>
            <button
              type="button"
              onClick={openAccess}
              className="bg-transparent uppercase tracking-[0.15em]"
            >
              Private access
            </button>
          </nav>
        )}
      </header>

      {accessOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="navbar-access-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setAccessOpen(false);
          }}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-5 [font-family:Arial,Helvetica,sans-serif]"
        >
          <div className="w-full max-w-[590px] bg-[#f2efe8] p-[42px] text-[#0b0b0b] max-[560px]:px-[22px] max-[560px]:py-7">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="m-0 text-[10px] uppercase tracking-[0.2em]">
                  Private release · 2027
                </p>
                <h2
                  id="navbar-access-title"
                  className="mb-[15px] mt-0 [font-family:Times_New_Roman,Times,serif] text-5xl font-normal leading-[0.9] max-[560px]:text-[39px]"
                >
                  Request access
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setAccessOpen(false)}
                className="bg-transparent text-[25px] leading-none"
              >
                ×
              </button>
            </div>

            {!requestSent ? (
              <>
                <p className="text-xs text-[#69655f]">
                  Leave your details to be considered for early access to The
                  First Wing.
                </p>
                <form onSubmit={submitAccessRequest} className="mt-7 grid gap-3">
                  <label className="grid gap-[7px] text-[9px] uppercase tracking-[0.13em]">
                    Name
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      className="min-h-[45px] rounded-none border-0 border-b border-black/[0.17] bg-transparent outline-none focus:border-black"
                    />
                  </label>
                  <label className="grid gap-[7px] text-[9px] uppercase tracking-[0.13em]">
                    Email
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="min-h-[45px] rounded-none border-0 border-b border-black/[0.17] bg-transparent outline-none focus:border-black"
                    />
                  </label>
                  <button
                    type="submit"
                    className="mt-4 flex min-h-[52px] items-center justify-between border border-black bg-black px-6 text-[9px] uppercase tracking-[0.16em] text-[#f2efe8]"
                  >
                    <span>Submit request</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <p className="text-[9px] text-[#69655f]">
                    Prototype preview: no details are transmitted or stored yet.
                  </p>
                </form>
              </>
            ) : (
              <div className="grid min-h-[285px] place-items-center text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#69655f]">
                    Request noted
                  </p>
                  <h2 className="[font-family:Times_New_Roman,Times,serif] text-5xl font-normal leading-[0.9]">
                    Until the door opens.
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
