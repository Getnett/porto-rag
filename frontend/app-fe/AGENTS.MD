## Project Overview

This `AGENTS.md` applies specifically to the frontend project located at:

```txt
frontend/app-fe
```

This project is the frontend web app for the admin side of a RAG application. It is built with React, TypeScript, and Vite.

The app provides an admin-facing interface for uploading files, managing ingestion workflows, and handling other document-related tasks required to prepare content for retrieval and answer generation in the RAG system.

The UI is built with Tailwind CSS and shadcn/ui, which serve as the primary foundation for styling, layout, and reusable components.

Unless a task explicitly says otherwise, make frontend changes only inside `frontend/app-fe`.

Do not modify backend code or root-level monorepo configuration from this file’s instructions.

---

## Build and Test Commands

Run all frontend commands from:

```bash
cd frontend/app-fe
```

### Install dependencies

```bash
pnpm add
```

Do not switch package managers unless explicitly requested.

### Start development server

```bash
pnpm run dev
```

### Build for production

```bash
pnpm run build
```

### Preview production build locally

```bash
pnpm run preview
```

### Run linting

```bash
pnpm run lint
```

### Run tests

```bash
pnpm run test
```

### Run tests in watch mode

```bash
pnpm run test:watch
```

### Run tests with coverage

```bash
pnpm run test:coverage
```

Before completing frontend work, run the relevant checks when possible:

```bash
pnpm run lint
pnpm run test
pnpm run build
```

If the project does not define one of these scripts, do not invent it. Use the scripts available in `package.json`.

---

## Code Style Guidelines

### General

- Use TypeScript for all new code.
- Prefer functional React components.
- Keep components small, focused, and easy to test.
- Avoid components that mix UI, API calls, business logic, and complex state management.
- Extract reusable logic into custom hooks.
- Extract shared types into a dedicated `types` area when they are used in multiple places.
- Use clear, descriptive names for variables, functions, components, and files.
- Follow the existing folder structure and naming conventions.

Good:

```ts
const isUploadDisabled = selectedFiles.length === 0 || isUploading;
```

Avoid:

```ts
const flag = files.length === 0 || loading;
```

### React Guidelines

- Use PascalCase for component names.
- Use camelCase for variables, functions, and hooks.
- Custom hooks must start with `use`.
- Keep JSX readable.
- Extract complex conditional rendering into named variables or smaller components.
- Avoid unnecessary re-renders where the fix is simple and clear.
- Do not prematurely optimize with `useMemo` or `useCallback`; use them when there is a real reason.

Example:

```tsx
const shouldShowEmptyState = !isLoading && documents.length === 0;

return (
  <>
    {shouldShowEmptyState && <EmptyState />}
  </>
);
```

### TypeScript Guidelines

- Avoid `any` unless absolutely necessary.
- Use `unknown` instead of `any` when the value type is truly unknown.
- Prefer explicit types for API responses, component props, and important function parameters.
- Avoid unnecessary type assertions.
- Do not ignore TypeScript errors unless there is a strong reason and the reason is documented.

Example:

```ts
type IngestionStatus = "pending" | "processing" | "completed" | "failed";

type DocumentItem = {
  id: string;
  filename: string;
  status: IngestionStatus;
  createdAt: string;
};
```

### shadcn/ui and Tailwind CSS Guidelines

- Use shadcn/ui components as the default base for common UI elements such as buttons, inputs, dialogs, dropdowns, tables, forms, cards, and alerts.
- Use Tailwind CSS utility classes for layout, spacing, typography, and responsive design.
- Follow existing shadcn/ui component patterns in the project.
- Do not create custom UI primitives when an existing shadcn/ui component fits the use case.
- Keep styling consistent with the existing design system.
- Prefer reusable composition over duplicated markup.
- Keep class names readable and avoid overly long, hard-to-maintain class strings when a component abstraction would be clearer.

Example:

```tsx
import { Button } from "@/components/ui/button";

export function UploadButton() {
  return (
    <Button type="submit">
      Upload files
    </Button>
  );
}
```

### Forms

- Use the existing form approach in the project.
- Prefer accessible labels and validation messages.
- Keep form validation close to the form schema or form logic.
- Show clear loading and error states during submission.
- Disable submit actions when submission is already in progress.

### API Calls

- Keep API request logic inside a dedicated API or services layer.
- Do not duplicate fetch logic across many components.
- Type API request and response data.
- Handle loading, success, empty, and error states clearly.
- Keep frontend error messages user-friendly.

Example:

```ts
export async function getDocuments(): Promise<DocumentItem[]> {
  const response = await fetch("/api/documents");

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}
```

### State Management

- Use local component state for simple UI state.
- Use custom hooks for reusable stateful logic.
- Use server-state libraries only if the project already uses them or the task explicitly requires them.
- Avoid storing derived values in state if they can be computed from existing data.

Preferred:

```ts
const completedDocuments = documents.filter(
  (document) => document.status === "completed"
);
```

Avoid:

```ts
const [completedDocuments, setCompletedDocuments] = useState([]);
```

### Accessibility

- Use semantic HTML where possible.
- Prefer accessible shadcn/ui components.
- Ensure form inputs have labels.
- Ensure buttons have meaningful text.
- Do not rely only on color to communicate status.
- Keep keyboard navigation in mind for dialogs, dropdowns, and forms.

---

## Testing Instructions

This frontend should be tested using the existing project test setup. Common tools for this stack include:

- Vitest
- React Testing Library
- jsdom
- Testing Library user-event

Use the tools already configured in the project.

### What to Test

Add or update tests when changing:

- Reusable components
- Forms and validation logic
- File upload behavior
- Custom hooks
- Utility functions
- API integration behavior
- Conditional rendering
- Empty states
- Loading states
- Error states
- User interactions

### Testing Guidelines

- Test behavior from the user’s perspective.
- Prefer queries such as `getByRole`, `getByLabelText`, and `getByText`.
- Avoid testing internal implementation details.
- Avoid relying on CSS class names or DOM structure unless necessary.
- Mock API calls where appropriate.
- Keep tests readable, focused, and deterministic.

Good:

```tsx
expect(
  screen.getByRole("button", { name: /upload files/i })
).toBeInTheDocument();
```

Avoid:

```tsx
expect(container.querySelector(".upload-btn")).toBeInTheDocument();
```

### Example Component Test

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadForm } from "./UploadForm";

describe("UploadForm", () => {
  it("shows a validation message when submitting without files", async () => {
    const user = userEvent.setup();

    render(<UploadForm />);

    await user.click(screen.getByRole("button", { name: /upload/i }));

    expect(screen.getByText(/please select at least one file/i)).toBeInTheDocument();
  });
});
```

### Test File Naming

Use one of the following patterns:

```txt
ComponentName.test.tsx
ComponentName.spec.tsx
useCustomHook.test.ts
utils.test.ts
```

Place tests near the code they test unless the project already uses a dedicated test directory.

Example:

```txt
src/components/upload/UploadForm.tsx
src/components/upload/UploadForm.test.tsx
```

### Before Finishing a Frontend Task

Run the relevant checks:

```bash
npm run lint
npm run test
npm run build
```

A frontend task should be considered complete only when:

- The code compiles successfully.
- Tests pass.
- Linting passes.
- Existing behavior is not broken.
- New or changed behavior is covered by tests where appropriate.
- UI changes follow the existing Tailwind CSS and shadcn/ui patterns.
