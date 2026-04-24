# Tasks

## Task List

- [x] 1. Scaffold the Vite + React + TypeScript project
  - [x] 1.1 Run `npm create vite@latest login-ui -- --template react-ts` to generate the project
  - [x] 1.2 Install dependencies: `npm install`
  - [x] 1.3 Install dev dependencies: `npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event @testing-library/jest-dom fast-check jsdom`
  - [x] 1.4 Configure Vitest in `vite.config.ts` (test environment: jsdom, globals: true, setupFiles pointing to a test setup file)
  - [x] 1.5 Create `src/setupTests.ts` that imports `@testing-library/jest-dom`
  - [x] 1.6 Remove boilerplate files (App.css, assets/react.svg, etc.) and clear `App.tsx` to a minimal shell

- [x] 2. Define shared TypeScript types
  - [x] 2.1 Create `src/types/login.ts` with `FieldErrors` and `ValidationResult` interfaces as specified in the design

- [x] 3. Implement the pure validation utility
  - [x] 3.1 Create `src/utils/validation.ts` with a `validate(username: string, password: string): ValidationResult` function
  - [x] 3.2 Implement empty-field checks (priority over length checks) for both fields
  - [x] 3.3 Implement minimum-length checks (username ≥ 3, password ≥ 6) for both fields

- [x] 4. Write unit and property-based tests for validation
  - [x] 4.1 Create `src/utils/validation.test.ts`
  - [x] 4.2 Write example-based unit tests: empty username, empty password, both empty, short username, short password, valid inputs
  - [x] 4.3 Write property test for Property 1 (empty username always errors) using fast-check — min 100 iterations
  - [x] 4.4 Write property test for Property 2 (empty password always errors) using fast-check — min 100 iterations
  - [x] 4.5 Write property test for Property 3 (short username always errors) using fast-check — min 100 iterations
  - [x] 4.6 Write property test for Property 4 (short password always errors) using fast-check — min 100 iterations
  - [x] 4.7 Write property test for Property 5 (valid inputs always pass) using fast-check — min 100 iterations
  - [x] 4.8 Run `npx vitest --run` and confirm all tests pass

- [x] 5. Build the `FormField` component
  - [x] 5.1 Create `src/components/LoginForm/FormField.tsx` with props: `id`, `label`, `type`, `value`, `onChange`, `error?`
  - [x] 5.2 Render `<label htmlFor={id}>` linked to `<input id={id}>`
  - [x] 5.3 When `error` is truthy, render `<span id={`${id}-error`} role="alert">{error}</span>` and set `aria-describedby` on the input
  - [x] 5.4 Create `src/components/LoginForm/FormField.module.css` with basic layout styles
  - [x] 5.5 Write tests for `FormField`: aria-describedby present when error prop is set, absent when undefined
  - [x] 5.6 Write property test for Property 7 (aria-describedby set for any non-empty error string) — min 100 iterations

- [x] 6. Build the `SuccessMessage` component
  - [x] 6.1 Create `src/components/LoginForm/SuccessMessage.tsx` — renders a `<p>` or `<div>` with the message prop
  - [x] 6.2 Create `src/components/LoginForm/SuccessMessage.module.css` with basic styles

- [x] 7. Build the `LoginForm` component
  - [x] 7.1 Create `src/components/LoginForm/LoginForm.tsx` with state: `username`, `password`, `errors`, `submitted`
  - [x] 7.2 Wire up `FormField` for username (type="text") and password (type="password")
  - [x] 7.3 Implement `handleChange` for each field: update value and clear that field's error if one exists
  - [x] 7.4 Implement `handleSubmit`: call `validate`, set errors or set `submitted = true`
  - [x] 7.5 Render `<SuccessMessage message="Login successful!" />` when `submitted === true`
  - [x] 7.6 Render `<button type="submit">Login</button>` as a native submit button
  - [x] 7.7 Create `src/components/LoginForm/LoginForm.module.css` with layout and form styles

- [x] 8. Write component-level tests for `LoginForm`
  - [x] 8.1 Create `src/components/LoginForm/LoginForm.test.tsx`
  - [x] 8.2 Render test: username input, password input, and Login button all present on mount
  - [x] 8.3 Submit with both fields empty: both error messages appear simultaneously
  - [x] 8.4 Submit with valid fields: "Login successful!" message appears and form remains visible
  - [x] 8.5 Submit with invalid fields, then edit username: username error clears, password error unchanged
  - [x] 8.6 Submit with invalid fields, then edit password: password error clears, username error unchanged
  - [x] 8.7 Write property test for Property 6 (editing a field with an error clears only that field's error) — min 100 iterations
  - [x] 8.8 Accessibility: Login button has type="submit"; labels linked via htmlFor/id
  - [x] 8.9 Run `npx vitest --run` and confirm all tests pass

- [x] 9. Wire up `App.tsx` and verify the full page
  - [x] 9.1 Update `App.tsx` to render only `<LoginForm />`
  - [x] 9.2 Update `src/main.tsx` to mount `<App />` into `#root`
  - [x] 9.3 Run `npx vitest --run` to confirm full test suite passes
  - [x] 9.4 Start dev server (`npm run dev`) manually and verify the form renders and behaves correctly in the browser

- [x] 10. Add "Created by Kiro" page header
  - [x] 10.1 Update `App.tsx` to render a `<header>` with `<h1>Created by Kiro</h1>` above `<LoginForm />`
  - [x] 10.2 Create `src/App.module.css` with styles for the header banner and page wrapper
