import { Button } from "@fiap-tech-challenge/design-system/components/button/button";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">This is using design system button</h1>
        <Button variant="secondary">Button</Button>
      </div>
    </div>
  )
}
