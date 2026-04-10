import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-mono text-secondary mb-3">// 404</p>
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          style={{ borderRadius: "14px 5px 14px 5px" }}
        >
          Back to homepage
        </Link>
      </div>
    </main>
  )
}
