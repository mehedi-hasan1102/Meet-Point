import Link from "next/link";

const NotFoundScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">দুঃখিত! পেজটি পাওয়া যায়নি</p>
        <Link href="/" className="text-primary underline hover:text-primary/90">
          হোমে ফিরে যান
        </Link>
      </div>
    </div>
  );
};

export default NotFoundScreen;
