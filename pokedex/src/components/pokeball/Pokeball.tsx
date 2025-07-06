export interface PokeballProps {
  /**
   * Whether the Pokeball is shown as "caught" or not.
   * If true, the Pokeball appears black.
   * If false or undefined, the Pokeball appears red.
   * @default false
   */
  isCaught?: boolean;
}

export const Pokeball = ({ isCaught = false }: PokeballProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <defs>
        <path
          id="hugeiconsPokeball0"
          d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
        ></path>
      </defs>
      <g
        fill={isCaught ? 'red' : 'black'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        color="white"
      >
        <use href="#hugeiconsPokeball0"></use>
        <use href="#hugeiconsPokeball0"></use>
        <path d="M15 13a3 3 0 1 1-6 0a3 3 0 0 1 6 0M2 11c2.596 1.004 4.853 1.668 6.998 1.993M22 11.003c-2.593 1.01-4.848 1.675-6.998 1.997"></path>
      </g>
    </svg>
  );
};
