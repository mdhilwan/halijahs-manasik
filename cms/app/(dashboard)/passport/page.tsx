import { PassportIcon } from "../../../../assets/icons";

export default function PassportPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-6">
          <PassportIcon className="mx-auto h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Passport</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  )
}
