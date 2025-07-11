# BloqitFeChallenge

# Running the Applications and Tests

## Prerequisites

- **Node.js** (v20 recommended)
- **npm** (comes with Node.js)
- All dependencies installed:  
  ```sh
  npm install
  ```

---

## 1. Running the Pokedex Application

The main frontend app is in the `pokedex` directory and uses Vite.

**Start the development server:**
```sh
npx vite --config pokedex/vite.config.ts
```
- The app will be available at [http://localhost:4200](http://localhost:4200).

**Build for production:**
```sh
npx vite build --config pokedex/vite.config.ts
```

**Preview the production build:**
```sh
npx vite preview --config pokedex/vite.config.ts
```

---

## 2. Running Unit Tests

Unit tests are written with Jest and are located in the `pokedex` project.

**Run all unit tests:**
```sh
npx jest --config pokedex/jest.config.ts
```

You can also use Nx (if working) to run:
```sh
npx nx run pokedex:test
```

---

## 3. Running End-to-End (E2E) Tests

E2E tests are in the `pokedex-e2e` directory and use Playwright.

**Run E2E tests:**
```sh
npx playwright test --config pokedex-e2e/playwright.config.ts
```

- This will automatically start the Pokedex app in preview mode at [http://localhost:4200](http://localhost:4200) before running the tests.
- You can pass Playwright CLI options as needed (e.g., `--headed` for non-headless).

---

## 4. Running Storybook (UI Components)

Storybook is set up in the `pokedex` directory for developing and previewing UI components in isolation.

**Start Storybook locally:**
```sh
cd pokedex
npx storybook dev -p 6006
```
- Storybook will be available at [http://localhost:6006](http://localhost:6006).

---

## 4. Useful Nx Commands (if Nx is working)

- **Run the app:**  
  `npx nx run pokedex:serve`
- **Run unit tests:**  
  `npx nx run pokedex:test`
- **Run E2E tests:**  
  `npx nx run pokedex-e2e:e2e`
- **Run Storybook:**  
  `npx nx run pokedex:storybook`


---

## Troubleshooting

- If you see errors related to missing native bindings or Nx plugins, try deleting `node_modules` and reinstalling:
  ```sh
  rm -rf node_modules package-lock.json
  npm install
  ```
- Make sure you are using the correct Node.js version.

---
