import { auth, signIn, signOut } from "@senka/auth";
import { Button } from "@senka/ui/button";

export async function AuthShowcase() {
  const session = await auth();

  if (!session) {
    return (
      <form className="flex flex-row gap-4">
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signIn("discord");
          }}
        >
          Sign in with Discord
        </Button>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signIn("github");
          }}
        >
          Sign in with GitHub
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {session.user.name}</span>
      </p>

      <form>
        <Button
          size="lg"
          formAction={async () => {
            "use server";
            await signOut();
          }}
        >
          Sign out
        </Button>
      </form>
    </div>
  );
}
